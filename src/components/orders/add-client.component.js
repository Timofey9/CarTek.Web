import React, { useEffect, useState } from 'react';
import ApiService from "../../services/cartekApiService";

function ClientForm({ handleClose }) {
    const [name, setName] = useState(""); 
    const [inn, setInn] = useState("");
    const [ogrn, setOgrn] = useState("");
    const [kpp, setKpp] = useState("");
    const [address, setAddress] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);

    function handleSubmit(event) {
        event.preventDefault();
        setMessage("");

        const newClient = {
            clientName: name,
            inn: inn,
            ogrn: ogrn,
            kpp: kpp,
            clientAddress: address
        };

        ApiService.createClient(newClient)
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

            <h1 className="mt-3">Добавить клиента</h1>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Название клиента</label>
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
                    <label>ОГРН</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setOgrn(e.target.value)}
                        value={ogrn}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>КПП</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setKpp(e.target.value)}
                        value={kpp}
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

export default ClientForm;
