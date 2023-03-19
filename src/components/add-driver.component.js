import React, { useEffect, useState } from 'react';
import {Link, useParams } from 'react-router-dom';
import ApiService from "../services/cartekApiService";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function DriverForm() {
    const [driver, setDriver] = useState({});
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [carId, setCarId] = useState(0);
    const [phone, setPhone] = useState(0);
    const [selectedItem, setSelectedItem] = useState(0);
    const [error, setError] = useState("");

    let { driverId } = useParams();

    useEffect(() => {
        setLoading(true);

        ApiService.getAllCars()
            .then(({ data }) => {
                setCars(data);
            }).
            catch((error) => {
                console.log(error);
            });

        setLoading(false);
    }, []);


    useEffect(() => {
        setLoading(true);

        if (driverId) {
            ApiService.getDriver(driverId)
                .then(({ data }) => {
                    setDriver(data);
                    setFirstName(data.firstName);
                    setMiddleName(data.middleName);
                    setLastName(data.lastName);
                    setCarId(data.carId);
                    setPassword(data.password);
                    setPhone(data.phone);
                }).
                catch((error) => {
                    console.log(error);
                });
        }
        setLoading(false);
    }, []);

    function handleSubmit(event) {
        event.preventDefault();

        const newDriver = {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            password: password,
            phone: phone,
            carId: carId
        };

        if (driverId) {
            ApiService.updateDriver(driverId, newDriver)
                .then(({ data }) => {
                    alert("Водитель обновлен");
                }).
                catch((error) => {
                    console.log(error);
                });
        } else {
            ApiService.createDriver(newDriver)
                .then(({ data }) => {
                    alert("Водитель создан");
                }).
                catch((error) => {
                    console.log(error);
                });
        }
    }

    if (loading) {
        return <div><h1>ЗАГРУЗКА...</h1></div>
    }


    return (
        <div>
          <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    {error}
                </div>
            </div>
            <h1>Водитель</h1>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="firstName">Имя</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="middleName">Отчество</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setMiddleName(e.target.value)}
                        value={middleName}/>
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="firstName">Фамилия</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="login">Телефон</label>
                    <input
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone} />
                </div>

                <div className="form-group col-md-6">
                    <label htmlFor="login">Пароль</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password} />
                </div>

                {driver.car ? <div className="form-group col-md-6">
                    <label htmlFor="car">Текущий тягач: {driver.car.brand} {driver.car.model}, гос.номер {driver.car.plate}</label>
                </div> : <></>}
            </div>

            {cars && <div className="form-row">
                <label>Выберите автомобиль</label>
                <Autocomplete
                    options={cars}
                    disablePortal
                    onChange={(e, newvalue) => { setCarId(newvalue.id) }}
                    id="combo-box-demo"
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => `${option.brand} ${option.model} - ${option.plate}`}
                    renderInput={(params) => <TextField {...params} label="Список тягачей" />} />
            </div>}

            <div className="row justify-content-md-center mt-3">
                <div className="col-md-2">
                    <Link to="/admin/drivers" className="btn btn-danger mr-1">
                        Отмена
                    </Link>
                </div>

                <div className="col-md-3">
                    <button type="submit" form="profile-form" className="btn btn-success" onClick={(e) => {handleSubmit(e)}}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>);
};

export default DriverForm;