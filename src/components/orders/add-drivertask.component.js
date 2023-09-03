import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from "../../services/cartekApiService";
import Autocomplete from '@mui/material/Autocomplete';
import StateRadioButtonGroup from "../radiobuttongroup";
import TextField from '@mui/material/TextField';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

function DriverTaskForm({orderId, handleClose}) {
    const [order, setOrder] = useState({});
    const [cars, setCars] = useState([]);
    const [car, setCar] = useState({});
    const [shift, setShift] = useState(true);
    const [drivers, setDrivers] = useState([]);
    const [driver, setDriver] = useState({});
    const [forceChange, setForceChange] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [volume, setVolume] = useState(0);
    const [unit, setUnit] = useState(0);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [notificationShown, setNotificationShown] = useState(false);

    const navigate = useNavigate();

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
            orderId: orderId,
            shift: shift ? 0 : 1,
            driverId: driver.id,
            carId: car.id,
            taskDate: startDate,
            forceChange: forceChange,
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
                console.log(forceChange);
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
                    <label>Выберите тягач</label>
                    <Autocomplete
                        options={cars}
                        disablePortal
                        onChange={(e, newvalue) => { setCar(newvalue) }}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => `${option.plate}`}
                        renderInput={(params) => <TextField {...params} label="Список тягачей" />} />
                </div>


                <div className="form-group col-md-6">
                    <StateRadioButtonGroup type={"Смена"} id={"shift"} isActive={shift} option1="Дневная" option2="Ночная" onChange={(event) => setShift(event.target.value === 'true' ? true : false)} />
                </div>
            </div>


            <div className="form-row">
                <div className="input-group mb-3 col-md-6 pl-1">
                    <label>Дата начала</label>
                    <DatePicker locale="ru" selected={startDate} onChange={(date) => setStartDate(date)} />
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

export default DriverTaskForm;