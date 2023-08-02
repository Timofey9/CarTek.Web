import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from "../../services/cartekApiService";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

//редактирование со стороны водителя: 1) поменять статус; 2) добавить комментарий; 3) загрузить фото. Все выполняется одним запросом

const DriverEditTask = () => {
    const [driver, setDriver] = useState({});
    const [driverTask, setDriverTask] = useState({});
    const [order, setOrder] = useState({});
    const [status, setStatus] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [note, setNote] = useState("");
    const [formData, setFormData] = useState(new FormData());

    const statuses = ['Назначена', 'Принята', 'Загрузка', 'Загружен', 'В пути', 'Разгрузка', 'Разгружен', 'Документы загружены', 'Оригиналы получены', 'Завершена'];

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
        formData.delete("File");

        for (let file of e.target.files) {
            formData.append("File", file);
        }
    };


    const handleSubmit = () => {
        formData.append("DriverTaskId", driverTask.id);
        formData.append("UpdatedStatus", status);
        formData.append("Note", note);

        ApiService.EditDriverTaskAsync(formData)
            .then(({ data }) => {
                console.log(data);
                alert("Статус обновлен принята");
                navigate("/driver-dashboard");
            })
            .catch((error) => {
                if (error.response.data.message) {
                    setError(error.response.data.message);
                }
            });
    };

    const statusToString = (status) => {
        switch (status) {
            case 0:
                return "Назначена";
            case 1:
                return "Принята";
            case 2:
                return "Загрузка";
            case 3:
                return "Загружен";
            case 4:
                return "В пути";
            case 5:
                return "Разгрузка";
            case 6:
                return "Разгружен";
            case 7:
                return "Документы загружены";
            case 8:
                return "Оригиналы получены";
            case 9:
                return "Завершена";
            default:
                return "Неизвестный статус";
        }
    }

    const statusToButtonTxt = (status) => {
        switch (status) {
            case 0:
                return "Принять";
            case 1:
                return "На загрузку";
            case 2:
                return "Загрузка окончена";
            case 3:
                return "В путь";
            case 4:
                return "На разгрузку";
            case 5:
                return "Разгрузка окончена";
            case 6:
                return "Загрузить документы";
            case 7:
                return "Получить оригиналы";
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
                    setOrder(data.order);
                    setActiveStep(data.status)
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

                    <dt className="col-sm-3">Контакты приемщика</dt>
                    <dd className="col-sm-9">Иванов Иван: +79110109825</dd>
                </dl>

                <div className="row">
                    <div className="col-md-3">
                        <Box sx={{ width: '100%' }}>
                            <Stepper orientation="vertical" activeStep={activeStep}>
                                {statuses.map((label, index) => {
                                    const stepProps = {};
                                    const labelProps = {};
                                    return (
                                        <Step key={label} {...stepProps}>
                                            <StepLabel {...labelProps}>{label}</StepLabel>
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
                                        onChange={(e, newvalue) => statuses.indexOf(newvalue)}
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
