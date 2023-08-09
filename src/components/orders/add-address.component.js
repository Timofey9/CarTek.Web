import React, { useEffect, useState } from 'react';
import ApiService from "../../services/cartekApiService";

function AddressForm({ handleClose }) {
    const [name, setName] = useState("");
    const [coordinates, setCoordinates] = useState("");
    const [textAddress, setTextAddress] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    function handleSubmit(event) {
        event.preventDefault();
        setMessage("");

        const newClient = {
            name: name,
            coordinates: coordinates,
            textAddress: textAddress,
        };

        ApiService.createAddress(newClient)
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
                        <div className="col-md-2">
                            <button onClick={() => handleClose()} className="btn btn-warning mr-1">
                                Отмена
                            </button>
                        </div>
                        <div className="col-md-2">
                            <button type="submit" form="profile-form" className="btn btn-success" onClick={(e) => { handleSubmit(e) }}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

export default AddressForm;
