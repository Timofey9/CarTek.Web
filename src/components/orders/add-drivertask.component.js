import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from "../../services/cartekApiService";
import Autocomplete from '@mui/material/Autocomplete';
import ShiftRadioButtonGroup from "../shiftradiobuttongroup";
import TextField from '@mui/material/TextField';
import DatePicker, { registerLocale } from "react-datepicker";
import Divider from '@mui/material/Divider';
import "./orders.css";
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

function DriverTaskForm({order, handleClose}) {
    const [cars, setCars] = useState([]);
    const [car, setCar] = useState({});
    const [shift, setShift] = useState(order.shift);
    const [drivers, setDrivers] = useState([]);
    const [driver, setDriver] = useState({});
    const [forceChange, setForceChange] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [comment, setComment] = useState("");
    const [volume, setVolume] = useState(0);
    const [unit, setUnit] = useState(0);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [tasksCount, setTasksCount] = useState(1);
    const [tasksToCreate, setTasksToCreate] = useState([]);
    const [notificationShown, setNotificationShown] = useState(false);
    const [reload, setReload] = useState(0);

    const handleShiftChange = (event) => {
        setShift(event.target.value);
    };

    useEffect(() => {
        console.log(order);
        var count = order.carCount - order.driverTasks.length;
        setLoading(true);
        setTasksCount(count);
        let array = [];
        for (let i = 0; i < count; i++) {
            array.push({ car: {}, driver: {}, taskDate: new Date(order.startDate), shift: order.shift, orderId: order.id });
        }
        setTasksToCreate(array);
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        ApiService.getAllDrivers()
            .then(({ data }) => {
                setDrivers(data);
            }).
            catch((error) => {
                if (error.response.data.message) {
                    setMessage(error.response.data.message);
                }
            });

        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        ApiService.getAllCars()
            .then(({ data }) => {
                setCars(data);
            }).
            catch((error) => {
                if (error.response.data.message) {
                    setMessage(error.response.data.message);
                }
            });

        setLoading(false);
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        setMessage("");

        const newTask = {
            orderId: order.id,
            shift: shift,
            driverId: driver.id,
            carId: car.id,
            taskDate: startDate,
            forceChange: forceChange,
            comment: comment,
            isComplete: false
        };

        ApiService.createDriverTask(newTask)
            .then(({ data }) => {
                alert(data.message);
                handleClose();
            }).
            catch((error) => {
                setMessage(error.response.data.message);
                setForceChange(true);
            });
    }

    function handleCreateDriverTasks(event) {
        event.preventDefault();
        setMessage("");
        var formattedTasks = [];
        for (var i = 0; i < tasksToCreate.length; i++) {
            formattedTasks.push(
                {
                    driverId: tasksToCreate[i].driver.id,
                    orderId: order.id,
                    carId: tasksToCreate[i].car.id,
                    shift: tasksToCreate[i].shift,
                    taskDate: tasksToCreate[i].taskDate,
                    comment: tasksToCreate[i].comment,
                    forceChange: true
                });
        }

        const data = {
            orderId: order.id,
            tasks: formattedTasks
        };

        ApiService.createDriverTasksMultiple(data)
            .then(({ data }) => {
                alert(data.message);
            }).
            catch((error) => {
                if (error.response.data.message) {
                    setMessage(error.response.data.message);
                }
            });
    }

    function serviceToText(service){

    }

    const intToShift = (shift) => {
        switch (shift) {
            case 0:
                return "Ночная (20:00 - 08:00)";
            case 1:
                return "Дневная (08:00 - 20:00)";
            case 2:
                return "Сутки";
            case 3:
                return "Сутки (неограниченно)";
        }
    } 

    if (loading) {
        return <div><h1>ЗАГРУЗКА...</h1></div>
    }

    return (
        <div className="m-5">
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    {error}
                </div>
            </div>

            <h1>{order.name}</h1>

            <div className="form-row">
                <label className="bold-label">Смена</label>

                <div className="col-md-6">
                    {intToShift(order.shift)}
                </div>

                <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                <div className="form-group col-md-6">
                    <label className="bold-label">Услуга</label>
                    {order.service === 0 ? "Перевозка" : "Поставка"}
                </div>

                <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                <div className="form-group col-md-6">
                    <label className="bold-label">Грузоотправитель (1)</label>
                    <label>{order.client && order.client.clientName}</label>
                </div>

                <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                <div className="form-group col-md-6">
                    <label className="bold-label">Грузополучатель (2)</label>
                    <label>{order.gp && order.gp.clientName}</label>
                </div>

                <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                <div className="form-row">
                    <label className="bold-label">Груз (3)</label>
                    <label>{order.material && order.material.name}</label>
                </div>

                <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                <div className="form-group col-md-6">
                    <label className="bold-label">Объем (общий)</label>
                    <input
                        disabled
                        type="text"
                        className="form-control"
                        form="profile-form"
                        value={order.volume}
                    />
                </div>

                <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                <div className="form-group col-md-6">
                    <label className="bold-label">Единица измерения</label>
                    {order.loadUnit === "0" ? "m3" : "тонны"}
                </div>

                <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                <div className="form-group col-md-6">
                    <label className="bold-label">Прием груза (8)</label>
                    <label>{order.locationA && order.locationA}</label>
                </div>

                <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                <div className="form-group col-md-6">
                    <label className="bold-label">Выдача груза (10)</label>
                    <label>{order.locationB && order.locationB}</label>
                </div>
            </div>

            <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

            {/*<div className="form-row">*/}
            {/*    <div className="input-group mb-3 col-md-6 pl-1">*/}
            {/*        <label className="bold-label">Дата начала</label>*/}
            {/*        <DatePicker disabled dateFormat="dd.MM.yyyy" locale="ru" selected={new Date(order.startDate)} />*/}
            {/*    </div>*/}

            {/*    <div className="input-group mb-3 col-md-6 pl-1">*/}
            {/*        <label className="bold-label">Срок выполнения</label>*/}
            {/*        <DatePicker disabled dateFormat="dd.MM.yyyy" locale="ru" selected={new Date(order.dueDate)} />*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>*/}

            <h1 className="mt-3">Создание задач</h1>

            {tasksToCreate.length > 0 &&
                tasksToCreate.map((task, index) => {
                    return (<div className="form-row">
                        <div className="row">
                            <div className="col-md-6">
                                <label>Выберите водителя</label>
                                <Autocomplete
                                    options={drivers}
                                    disablePortal
                                    onChange={(e, newvalue) => { task.driver = newvalue }}
                                    sx={{ width: 300 }}
                                    isOptionEqualToValue={(option, value) => option.fullName === value.fullName}
                                    getOptionLabel={(option) => `${option.fullName}`}
                                    renderInput={(params) => <TextField {...params} label="Список водителей" />} />
                            </div>

                            <div className="col-md-6">
                                <label>Выберите тягач</label>
                                <Autocomplete
                                    options={cars}
                                    disablePortal
                                    onChange={(e, newvalue) => { task.car = newvalue }}
                                    sx={{ width: 300 }}
                                    getOptionLabel={(option) => `${option.plate}`}
                                    isOptionEqualToValue={(option, value) => option.plate === value.plate}
                                    renderInput={(params) => <TextField {...params} label="Список тягачей" />} />
                            </div>

                            <div className="col-md-6">
                                <label>Комментарий для водителя</label>
                                <textarea
                                    col="40"
                                    rows="5"
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => task.comment = e.target.value}
                                    value={task.comment} />
                            </div>

                            <div key={"shift" + index} className="col-md-6">
                                <ShiftRadioButtonGroup value={task.shift} onChange={(event) => {
                                    task.shift = event.target.value; setReload(reload + 1);
                                }} />
                            </div>
                        </div>

                        <div key={"task" + index} className="form-row">
                            <div className="input-group mb-3 col-md-6 pl-1">
                                <label>Дата начала</label>
                                <DatePicker dateFormat="dd.MM.yyyy" locale="ru" selected={task.taskDate} onChange={(date) => {
                                    task.taskDate = date; setReload(reload + 1);
                                }} />
                            </div>
                        </div>

                        <Divider sx={{ borderBottomWidth: 5 }}></Divider>
                    </div>)
                })}

            {message && (
                <div className="form-group">
                    <div className="alert alert-danger mt-2" role="alert">
                        {message}
                    </div>
                </div>
            )}

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
                            <button type="submit" form="profile-form" className="btn btn-success" onClick={(e) => { handleCreateDriverTasks(e) }}>
                                Создать
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};

export default DriverTaskForm;