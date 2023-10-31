import React, { useEffect, useState } from 'react';
import {Link, useParams, useNavigate } from 'react-router-dom';
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
    const [phone, setPhone] = useState();
    const [login, setLogin] = useState();
    const [selectedItem, setSelectedItem] = useState(0);
    const [error, setError] = useState("");
    const [notificationShown, setNotificationShown] = useState(false);
    const [percentage, setPercentage] = useState("");
    const navigate = useNavigate();

    let { driverId } = useParams();

    useEffect(() => {
        setLoading(true);

        ApiService.getAllCars()
            .then(({ data }) => {
                setCars(data);
            }).
            catch((error) => {
                setError(error.response.data);
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
                    setLogin(data.login);
                    setPercentage(data.percentage);
                }).
                catch((error) => {
                    setError(error.response.data);
                });
        }
        setLoading(false);
    }, []);

    function handleSubmit(event) {
        event.preventDefault();

        if (validate()) {
            const newDriver = {
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                password: password,
                phone: phone,
                carId: carId,
                login: login,
                percentage: percentage ? percentage.replace(',','.') : 0
            };

            if (driverId) {
                ApiService.updateDriver(driverId, newDriver)
                    .then(({ data }) => {
                        alert("Водитель обновлен");
                    }).
                    catch((error) => {
                        setError(error.response);
                    });
            } else {
                ApiService.createDriver(newDriver)
                    .then(({ data }) => {
                        alert("Водитель создан");
                        navigate("/admin/drivers/");
                    }).
                    catch((error) => {
                        setError(error.response.data.message);
                    });
            }
        }
    }

    function deleteDriver(event) {
        event.preventDefault();

        if (!notificationShown) {
            setError("Удаление пользователя приведет к удалению всех созданных им осмотров.\nЧтобы продолжить нажмите \"Удалить\" еще раз");
            setNotificationShown(true);
        } else {
            ApiService.deleteDriver(driverId)
                .then(({ data }) => {
                    setLoading(false);
                    alert("Водитель удален");
                    navigate("/admin/drivers/");
                })
                .catch((error) => {
                    setError(error.response.data.message);
                    setLoading(false);
                })
        }
    }

    function validate(){
        if (password.trim() === '' ||
            firstName.trim() === '' ||
            lastName.trim() === '') {
            setError("Поля имя, фамилия и пароль являются обязательными");
            return false;
        }
        return true;
    }

    if (loading) {
        return <div><h1>ЗАГРУЗКА...</h1></div>
    }

    return (
        <div>
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
                    <label htmlFor="phone">Телефон</label>
                    <input
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone} />
                </div>

                <div className="form-group col-md-6">
                    <label htmlFor="login">Логин для входа в ЛК:</label>
                    <input
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setLogin(e.target.value)}
                        value={login} />
                </div>

                <div className="form-group col-md-6">
                    <label htmlFor="login">Пароль (для подтверждения осмотра и входа в ЛК)</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password} />
                </div>


                <div className="form-group col-md-6">
                    <label htmlFor="perc">Процент</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setPercentage(e.target.value)}
                        value={percentage} />
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

            {error && 
                <div className="row d-flex justify-content-center mt-3">
                    <div className="alert alert-danger mt-2" role="alert">
                        {error}
                    </div>
                </div>
            }

            <div className="row mb-2">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="row">
                        {driverId &&
                            <div className="col-md-2">
                                <button className="btn btn-danger" onClick={(e) => { deleteDriver(e) }}>
                                    Удалить
                                </button>
                            </div>}
                        <div className="col-md-2">
                            <Link to="/admin/drivers" className="btn btn-warning mr-1">
                                Отмена
                            </Link>
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
};

export default DriverForm;