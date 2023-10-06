import React, { useEffect, useState } from 'react';
import ApiService from "../../services/cartekApiService";

function MaterialForm({ material, handleClose }) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [isMaterial, setIsMaterial] = useState(false);

    useEffect(() => {
        if (material !== undefined) {
            setIsMaterial(true);
            setName(material.name);
        }
    }, [])

    const validate = () => {
        if (name.length === 0) {
            alert("Нужно заполнить название!");
            return false;
        } else
            return true;
    }

    function handleSubmit(event) {
        event.preventDefault();
        setMessage("");

        const newMaterial = {
            name: name,
        };

        if (isMaterial) {
            newMaterial.id = material.id;
            ApiService.updateMaterial(newMaterial)
                .then(({ data }) => {
                    alert(data.message);
                }).
                catch((error) => {
                    setMessage(error.response.data.message);
                });

        } else {
            if (validate()) {
                ApiService.creatematerial(newMaterial)
                    .then(({ data }) => {
                        alert(data.message);
                    }).
                    catch((error) => {
                        setMessage(error.response.data.message);
                    });
            }
        }
    }

    function handleDelete(event) {
        event.preventDefault();
        setMessage("");

        ApiService.deleteMaterial(material.id)
            .then(({ data }) => {
                alert(data.message);
                handleClose();
            }).
            catch((error) => {
                setMessage(error.response.data.message);
            });
    }

    return (
        <div className="m-5">
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    {error}
                </div>
            </div>

            <h1 className="mt-3">Добавить тип груза</h1>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Название</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="row">
                        <div className="col-md-2 m-3">
                            <button onClick={() => handleClose()} className="btn btn-warning mr-1">
                                Отмена
                            </button>
                        </div>
                        {isMaterial &&
                            <div className="col-md-2 m-3">
                                <button type="submit" form="profile-form" className="btn btn-danger" onClick={(e) => { handleDelete(e) }}>
                                    Удалить
                                </button>
                            </div>}
                        <div className="col-md-2 m-3">
                            <button type="submit" form="profile-form" className="btn btn-success" onClick={(e) => { handleSubmit(e) }}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

export default MaterialForm;
