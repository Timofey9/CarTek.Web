import React, { useEffect, useState } from 'react';
import ApiService from "../../services/cartekApiService";

function AddressForm({ address, handleClose }) {
    const [name, setName] = useState("");
    const [coordinates, setCoordinates] = useState("");
    const [textAddress, setTextAddress] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isAddress, setIsAddress] = useState(false);

    useEffect(() => {      
        if (address !== undefined) {
            setTextAddress(address.textAddress);
            setCoordinates(address.coordinates);
            setIsAddress(true);
        }
    }, [])

    const validate = () => {
        if (textAddress.length === 0) {
            alert("Нужно заполнить адрес!");
            return false;
        } else
            return true;
    }

    function handleSubmit(event) {
        event.preventDefault();
        setMessage("");

        const newAddress = {
            coordinates: coordinates,
            textAddress: textAddress,
        };

        if (isAddress) {
            newAddress.id = address.id;
            ApiService.updateAddress(newAddress)
                .then(({ data }) => {
                    alert(data.message);
                    handleClose();
                }).
                catch((error) => {
                    setMessage(error.response.data.message);
                });
        } else {
            if (validate()) {
                ApiService.createAddress(newAddress)
                    .then(({ data }) => {
                        alert(data.message);
                        handleClose();
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

        ApiService.deleteAddress(address.id)
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

            <h1 className="mt-3">Добавить адрес</h1>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Адрес</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setTextAddress(e.target.value)}
                        value={textAddress}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Координаты</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setCoordinates(e.target.value)}
                        value={coordinates}
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
                        {isAddress &&
                            <div className="col-md-2 m-3">
                                <button type="submit" form="profile-form" className="btn btn-danger" onClick={(e) => { handleDelete(e) }}>
                                    Удалить
                                </button>
                            </div>}
                        <div className="col-md-2 m-3">
                            <button type="submit" form="profile-form" className="btn btn-success" onClick={(e) => { handleSubmit(e) }}>
                                {isAddress ? "Обновить" : "Сохранить"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

export default AddressForm;
