import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from "../../services/cartekApiService";
import Autocomplete from '@mui/material/Autocomplete';
import StateRadioButtonGroup from "../radiobuttongroup";
import ShiftRadioButtonGroup from "../shiftradiobuttongroup";
import TextField from '@mui/material/TextField';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

function DriverTaskCarForm({carId, handleClose}) {
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});
    const [cars, setCars] = useState([]);
    const [car, setCar] = useState({});
    const [shift, setShift] = useState(0);
    const [drivers, setDrivers] = useState([]);
    const [driver, setDriver] = useState({});
    const [forceChange, setForceChange] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [notificationShown, setNotificationShown] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        ApiService.getDrivers()
            .then(({ data }) => {
                setDrivers(data.list);
            }).
            catch((error) => {
                if (error.response.data.message) {
                    setMessage(error.response.data.message);
                }
            });

        setLoading(false);
    }, []);

    const handleShiftChange = (event) => {
        setShift(event.target.value);
    };

    useEffect(() => {
        setLoading(true);
        let req = {
            startDate: startDate.toUTCString()
        };
        ApiService.getAllActiveOrders(req)
            .then(({ data }) => {
                setOrders(data);
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
            carId: carId,
            taskDate: startDate,
            forceChange: forceChange,
            isComplete: false,
            comment: comment
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

            <h1 className="mt-3">Создание задачи </h1>
            <div className="form-row">
                <div className="form-row">
                    <label>Выберите водителя</label>
                    <Autocomplete
                        options={drivers}
                        disablePortal
                        onChange={(e, newvalue) => { setDriver(newvalue) }}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => `${option.fullName}`}
                        renderInput={(params) => <TextField {...params} label="Список водителей" />} />
                </div>

                <div className="form-row">
                    <label>Выберите заявку</label>
                    <Autocomplete
                        options={orders}
                        disablePortal
                        onChange={(e, newvalue) => { setOrder(newvalue) }}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label="Список заявок" />} />
                </div>

                <div className="form-group col-md-6">
                    <ShiftRadioButtonGroup value={shift} onChange={handleShiftChange} />
                </div>

                <div className="col-md-6">
                    <label>Комментарий для водителя</label>
                    <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setComment(e.target.value)}
                        value={comment} />
                </div>
            </div>



            <div className="form-row">
                <div className="input-group mb-3 col-md-6 pl-1">
                    <label>Дата начала</label>
                    <DatePicker dateFormat="dd.MM.yyyy" locale="ru" selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
            </div>

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
                            <button type="submit" form="profile-form" className="btn btn-success" onClick={(e) => { handleSubmit(e) }}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};

export default DriverTaskCarForm;