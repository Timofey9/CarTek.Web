import React, { useEffect, useState } from 'react';
import ApiService from "../../services/cartekApiService";

function ClientForm({client, handleClose }) {
    const [name, setName] = useState(""); 
    const [inn, setInn] = useState("");
    const [address, setAddress] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (client !== undefined) {
            setAddress(client.clientAddress);
            setInn(client.inn);
            setName(client.clientName);
            setIsClient(true);
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

        const newClient = {
            clientName: name,
            inn: inn,
            clientAddress: address
        };

        if (isClient) {
            newClient.id = client.id;

            ApiService.updateClient(newClient)
                .then(({ data }) => {
                    alert(data.message);
                    handleClose();
                }).
                catch((error) => {
                    setMessage(error.response.data.message);
                });
        } else {
            if (validate()) {
                ApiService.createClient(newClient)
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

        ApiService.deleteClient(client.id)
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

            <h1 className="mt-3">Добавить юр.лицо</h1>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Название юр.лица</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>ИНН</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setInn(e.target.value)}
                        value={inn}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Юридический адрес</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
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
                        {isClient &&
                            <div className="col-md-2 m-3">
                                <button type="submit" form="profile-form" className="btn btn-danger" onClick={(e) => { handleDelete(e) }}>
                                    Удалить
                                </button>
                            </div>}
                        <div className="col-md-2 m-3">
                            <button type="submit" form="profile-form" className="btn btn-success" onClick={(e) => { handleSubmit(e) }}>
                                {isClient ? "Обновить" : "Сохранить"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

export default ClientForm;
