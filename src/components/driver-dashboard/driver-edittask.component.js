import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from "../../services/cartekApiService";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


//редактирование со стороны водителя: 1) поменять статус; 2) добавить комментарий; 3) загрузить фото. Все выполняется одним запросом

const DriverEditTask = () => {
    const [driver, setDriver] = useState({});
    const [car, setCar] = useState({});
    const [driverTask, setDriverTask] = useState({});
    const [order, setOrder] = useState({});
    const [status, setStatus] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [note, setNote] = useState("");
    const [formData, setFormData] = useState(new FormData());
    const [notes, setNotes] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const constStatuses = ['Назначена', 'Принята', 'Выезд на линию', 'Прибыл на склад загрузки', 'Выписка документов','Погрузился','Выехал со склада','Прибыл на объект выгрузки','Выгрузка','Резерв'];

    //const constStatuses = ['Назначена', 'Принята', 'Загрузка', 'Загружен', 'В пути', 'Разгрузка', 'Разгружен', 'Документы загружены', 'Оригиналы получены', 'Завершена'];

    const navigate = useNavigate();

    let { driverTaskId } = useParams();

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

    const selectFile = (e) => {
        formData.delete("Files");

        for (let file of e.target.files) {
            formData.append("Files", file);
        }
    };

    const handleSubmit = () => {
        formData.append("DriverTaskId", driverTask.id);
        formData.append("UpdatedStatus", status);
        formData.append("Note", note);

        ApiService.EditDriverTaskAsync(formData)
            .then(({ data }) => {
                alert("Статус обновлен принята");
                navigate("/driver-dashboard");
            })
            .catch((error) => {
                if (error.response.data.message) {
                    setError(error.response.data.message);
                }
            });
    };

    const statusToButtonTxt = (status) => {
        switch (status) {
            case 0:
                return "Принять";
            case 1:
                return "Выехал на линию";
            case 2:
                return "Выписка документов";
            case 3:
                return "Погрузился";
            case 4:
                return "Выехал со склада";
            case 5:
                return "Прибыл на объект выгрузки";
            case 6:
                return "Загрузить документы";
            case 7:
                return "Выгрузка";
            case 8:
                return "Завершить";
            default:
                return "Отправить";
        }
    }

    useEffect(() => {
        setLoading(true);
        if (driverTaskId) {
            ApiService.getDriverTaskById(driverTaskId)
                .then(({ data }) => {
                    console.log(data);
                    setDriverTask(data);
                    setDriver(data.driver);
                    setOrder(data.order);
                    setActiveStep(data.status);
                    setNotes(data.notes);
                    setStatuses(constStatuses);
                    setCar(data.car);
                }).
                catch((error) => {
                    setError(error.response.data);
                });
        }
        setLoading(false);
    }, []);

    return <div className="container">
        {!loading && (
            <>
                <div className="row">
                    <h1>Задача по заявке # {order.id} для "{order.clientName}"</h1>
                </div>

                <dl className="row">
                    <dt className="col-sm-3">Заказчик: </dt>
                    <dd className="col-sm-9">{order.clientName}</dd>

                    <dt className="col-sm-3">Тягач: </dt>
                    <dd className="col-sm-9">{car.brand} {car.model}: {car.plate}</dd>

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
                    <dd className="col-sm-9"><a target="_blank" href={driverTask.locationA && `https://yandex.ru/maps/?pt=${driverTask.locationA.coordinates}&z=11&l=map`}>{driverTask.locationA && driverTask.locationA.name}</a></dd>

                    <dt className="col-sm-3">Точка Б: </dt>
                    <dd className="col-sm-9"><a target="_blank" href={driverTask.locationB && `https://yandex.ru/maps/?pt=${driverTask.locationB.coordinates}&z=11&l=map`}>{driverTask.locationB && driverTask.locationB.name}</a></dd>

                    <dt className="col-sm-3">Комментарий:</dt>
                    <dd className="col-sm-9">{order.note}</dd>
                </dl>

                <div className="row">
                    <div className="col-md-3">
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
                                                        <div key={noteindex}>
                                                            <div>{new Date(note.dateCreated).toLocaleString('ru-Ru')}</div>
                                                            <Typography>{note.text}</Typography>
                                                            {showLinks && links.map((link, linkindex) => {
                                                                const fullLink = "https://storage.yandexcloud.net/" + link;
                                                                return (<div key={linkindex}><a target="_blank" href={fullLink}>Изображение {linkindex}</a></div>);
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
                    <div className="col-md-9">
                        <div className="row">
                            <div className="col-md-12">
                                <div>
                                    <Autocomplete
                                        disablePortal
                                        onChange={(e, newvalue) => setStatus(statuses.indexOf(newvalue))}
                                        id="combo-box-demo"
                                        options={statuses}
                                        sx={{ width: 300 }}
                                        renderInput={(params) => <TextField {...params} label="Выберите статус" />} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <textarea id="acceptanceComment" onChange={(e) => setNote(e.target.value)} rows="5" cols="40"></textarea>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="files">Прикрепить фотографии</label>
                                <input type="file" id="files" accept=".jpg, .png, .jpeg" multiple onChange={(e) => selectFile(e)}></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <button type="submit" onClick={handleSubmit} className="btn btn-success">
                                    {statusToButtonTxt()}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}
    </div>
};

export default DriverEditTask;
