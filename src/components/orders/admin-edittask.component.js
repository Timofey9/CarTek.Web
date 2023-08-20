import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from "../../services/cartekApiService";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const AdminEditTask = () => {
    const [driver, setDriver] = useState({});
    const [drivers, setDrivers] = useState([]);
    const [cars, setCars] = useState([]);
    const [car, setCar] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [driverTask, setDriverTask] = useState({});
    const [order, setOrder] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [notes, setNotes] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const constStatuses = ['Назначена', 'Принята', 'Загрузка', 'Загружен', 'В пути', 'Разгрузка', 'Разгружен', 'Документы загружены', 'Оригиналы получены', 'Завершена'];

    const navigate = useNavigate();
    let { driverTaskId } = useParams();

    useEffect(() => {
        setLoading(true);
        if (driverTaskId) {
            ApiService.getDriverTaskById(driverTaskId)
                .then(({ data }) => {
                    setDriverTask(data);
                    setDriver(data.driver);
                    setOrder(data.order);
                    setCar(data.car);
                    setActiveStep(data.status);
                    setNotes(data.notes);
                    setStatuses(constStatuses);
                }).
                catch((error) => {
                    setError(error.response.data);
                });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        if (driverTaskId) {
            ApiService.getAllDrivers()
                .then(({ data }) => {
                    setDrivers(data);
                }).
                catch((error) => {
                    setError(error.response.data);
                });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        if (driverTaskId) {
            ApiService.getAllCars()
                .then(({ data }) => {
                    setCars(data);
                }).
                catch((error) => {
                    setError(error.response.data);
                });
        }
        setLoading(false);
    }, []);

    const unitToString = (unit) => {
        switch (unit) {
            case 0:
                return "m3";
            case 1:
                return "шт.";
            case 2:
                return "т";
            default:
                return "";
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        var data = {
            "TaskId" : driverTask.id,
            "DriverId" : driver.id,
            "CarId" : car.id
        };

        ApiService.AdminEditDriverTaskAsync(data)
            .then(({ data }) => {
                alert("Задача обновлена");
                navigate(-1);
            })
            .catch((error) => {
                if (error.response.data.message) {
                    setError(error.response.data.message);
                }
            });
    };

    return <div>
        {!loading && (
            <>
                <div className="row">
                    <div className="col-md-6"> 
                        <h1>Задача по заявке # {order.id} для "{order.clientName}"</h1>
                    </div>
                    <div className="col-md-6">
                        {isEdit
                            ? <button onClick={(event) => handleSubmit(event)} className="btn btn-success">Сохранить</button>
                            : <button onClick={() => setIsEdit(true)} className="btn btn-warning">Редактировать</button>
                        }
                    </div>
                </div>

                <dl className="row">
                    <dt className="col-sm-3">Заказчик: </dt>
                    <dd className="col-sm-9">{order.clientName}</dd>

                    <dt className="col-sm-3">Водитель: </dt>
                    <dd className="col-sm-9">
                        {isEdit ?
                            <Autocomplete
                                disablePortal
                                onChange={(e, newvalue) => setDriver(newvalue)}
                                id="combo-box-demo"
                                options={drivers}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.fullName}`}
                                renderInput={(params) => <TextField {...params} label="Выберите водителя" />} />
                            :
                            <span>{driver.fullName}</span>}
                    </dd>

                    <dt className="col-sm-3">Тягач: </dt>
                    <dd className="col-sm-9">
                        {isEdit ?
                            <Autocomplete
                                disablePortal
                                onChange={(e, newvalue) => setCar(newvalue)}
                                id="combo-box-demo"
                                options={cars}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.brand}:${option.plate}`}
                                renderInput={(params) => <TextField {...params} label="Выберите тягач" />}
                            />
                            :
                            <span>{car.plate}</span>}</dd>

                    <dt className="col-sm-3">Материал: </dt>
                    <dd className="col-sm-9">{order.material && order.material.name}</dd>

                    <dt className="col-sm-3">Количество: </dt>
                    <dd className="col-sm-9">{driverTask.volume} {unitToString(driverTask.unit)}</dd>

                    <dt className="col-sm-3">Дата: </dt>
                    <dd className="col-sm-9">{new Date(driverTask.startDate).toLocaleDateString('ru-Ru', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}</dd>

                    <dt className="col-sm-3">Смена: </dt>
                    <dd className="col-sm-9">{driverTask.shift === 0 ? "Дневная" : "Ночная"}</dd>

                    <dt className="col-sm-3">Точка А: </dt>
                    <dd className="col-sm-9">{order.locationA}</dd>

                    <dt className="col-sm-3">Точка Б: </dt>
                    <dd className="col-sm-9">{order.locationB}</dd>

                    <dt className="col-sm-3">Карта</dt>
                    <dd className="col-sm-9"><a href={order.locationB && "https://yandex.ru/maps/?ll=30.310182,59.951059&z=11&text=" + encodeURIComponent(order.locationB.trim())}>{order.locationB}</a></dd>

                    <dt className="col-sm-3">Комментарий:</dt>
                    <dd className="col-sm-9">{order.note}</dd>
                </dl>

                <div className="row">
                    <div className="col-md-12">
                        <Box sx={{ width: '100%' }}>
                            <Stepper orientation="vertical" activeStep={activeStep}>
                                {constStatuses.map((label, index) => {
                                    const stepProps = {};
                                    const labelProps = {};
                                    return (
                                        <Step key={label} {...stepProps} expanded={true}>
                                            <StepLabel {...labelProps}>{label}</StepLabel>
                                            <StepContent>
                                                {notes.filter((n) => n.status === index).map((note, noteindex) => {
                                                    let showLinks = false;
                                                    let links;
                                                    if (note.s3Links.length > 0) {
                                                        links = JSON.parse(note.s3Links);
                                                        showLinks = true
                                                    }
                                                    return (
                                                        <div>
                                                            <div>{new Date(note.dateCreated).toLocaleString('ru-Ru')}</div>
                                                            <Typography>{note.text}</Typography>
                                                            {showLinks && links.map((link, linkindex) => {
                                                                const fullLink = "https://storage.yandexcloud.net/" + link;
                                                                return (<div><a target="_blank" href={fullLink}>Изображение {linkindex}</a></div>);
                                                            })}
                                                        </div>
                                                    )
                                                })}
                                            </StepContent>
                                        </Step>
                                    );
                                })}
                            </Stepper>
                        </Box>
                    </div>
                </div>
            </>
        )}
    </div>
};

export default AdminEditTask;
