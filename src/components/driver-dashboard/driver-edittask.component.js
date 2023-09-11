import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from "../../services/cartekApiService";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

const DriverEditTask = () => {
    const [driver, setDriver] = useState({});
    const [car, setCar] = useState({});
    const [driverTask, setDriverTask] = useState({});
    const [order, setOrder] = useState({});
    const [status, setStatus] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState("");
    const [formData, setFormData] = useState(new FormData());
    const [notes, setNotes] = useState([]);
    const [reload, setReload] = useState(0);
    const [unit, setUnit] = useState("none");
    const [materialsList, setMaterialsList] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [clients, setClients] = useState([]);
    const [material, setMaterial] = useState({});
    const [addressA, setAddressA] = useState({});
    const [addressB, setAddressB] = useState({});
    const [message, setMessage] = useState("");
    const [tnNumber, setTnNumber] = useState("");
    const [loadVolume, setLoadVolume] = useState(0);
    const [go, setGo] = useState({});
    const [gp, setGp] = useState({});
    const [pickupArrivalDate, setPickupArrivalDate] = useState(new Date());
    const [pickupArrivalTime, setPickupArrivalTime] = useState("");
    const [pickupDepartureDate, setPickupDepartureDate] = useState(new Date());
    const [pickupDepartureTime, setPickupDepartureTime] = useState("");
    const [dropoffArrivalDate, setDropoffArrivalDate] = useState(new Date());
    const [dropoffArrivalTime, setDropoffArrivalTime] = useState("");
    const [dropoffDepartureTime, setDropoffDepartureTime] = useState("");

    const constStatuses = ['Назначена', 'Принята', 'Выезд на линию', 'Прибыл на склад загрузки', 'Выписка документов 1', 'Погрузился', 'Выехал со склада', 'Прибыл на объект выгрузки', 'Выгрузка', 'Выписка документов', 'Завершить'];

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
        formData.append("UpdatedStatus", status + 1);
        formData.append("Note", note);

        if (status === 4) {
            formData.append("Number", tnNumber);
            formData.append("GoId", go.id);
            formData.append("GpId", gp.id);
            formData.append("LoadVolume", loadVolume);
            formData.append("Unit", unit);
            formData.append("LocationAId", addressA.id);
            formData.append("PickUpArrivalDate", pickupArrivalDate.toUTCString());
            formData.append("PickUpArrivalTime", pickupArrivalTime);
            formData.append("PickUpDepartureDate", pickupDepartureDate.toUTCString());
            formData.append("PickUpDepartureTime", pickupDepartureTime);

            ApiService.startTn(formData)
                .then(({ data }) => {
                    alert("Статус обновлен");
                })
                .catch((error) => {
                    if (error.response.data.message) {
                        setError(error.response.data.message);
                    }
                });

            return;
        }

        if (status === 9) {
            formData.append("UnloadVolume", loadVolume);
            formData.append("LocationBId", addressB.id);
            formData.append("DropOffArrivalDate", pickupArrivalDate.toUTCString());
            formData.append("DropOffArrivalTime", pickupArrivalTime);
            formData.append("DropOffDepartureDate", pickupDepartureDate.toUTCString());
            formData.append("DropOffDepartureTime", pickupDepartureTime);

            ApiService.finalizeTn(formData)
                .then(({ data }) => {
                    alert("Статус обновлен");
                })
                .catch((error) => {
                    if (error.response.data.message) {
                        setError(error.response.data.message);
                    }
                });

            return;
        }

        console.log("Не должно");

        ApiService.EditDriverTaskAsync(formData)
            .then(({ data }) => {
                alert("Статус обновлен");
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
                return "Выехать на линию";
            case 2:
                return "К выписке документов";
            case 3:
                return "Выписать документы (Погрузился)";
            case 4:
                return "Выехал со склада";
            case 5:
                return "Прибыл на объект выгрузки";
            case 6:
                return "Загрузить документы";
            case 7:
                return "Выгрузка";
            case 8:
                return "К выписке документов";
            case 9:
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
                    setDriverTask(data);
                    setDriver(data.driver);
                    setOrder(data.order);
                    setStatus(data.status);
                    setNotes(data.notes);
                    setCar(data.car);
                }).
                catch((error) => {
                    setError(error.response.data);
                });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        ApiService.getMaterials()
            .then(({ data }) => {
                setMaterialsList(data);
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
        ApiService.getClients()
            .then(({ data }) => {
                setClients(data);
            }).
            catch((error) => {
                if (error.response.data.message) {
                    setMessage(error.response.data.message);
                }
            });

        setLoading(false);
    }, [reload]);

    useEffect(() => {
        setLoading(true);
        ApiService.getAddresses()
            .then(({ data }) => {
                setAddresses(data);
            }).
            catch((error) => {
                if (error.response.data.message) {
                    setMessage(error.response.data.message);
                }
            });

        setLoading(false);
    }, [reload]);


    return <div className="container">
        {!loading && (
            <>
                <div className="row">
                    <h1>Задача по заявке на {new Date(order.startDate).toLocaleDateString('ru-Ru', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}</h1>
                </div>

                <dl className="row">
                    {/*<dt className="col-sm-3">Заказчик: </dt>*/}
                    {/*<dd className="col-sm-9">{order.clientName}</dd>*/}

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
                    <dd className="col-sm-9">{driverTask.shift === 0 ? "Дневная (08:00 - 20:00)" : "Ночная (20:00 - 08:00)"}</dd>

                    <dt className="col-sm-3">Точка А: </dt>
                    <dd className="col-sm-9"><a target="_blank" href={driverTask.locationA && `https://yandex.ru/maps/?pt=${driverTask.locationA.coordinates}&z=11&l=map`}>{driverTask.locationA && driverTask.locationA.name}</a></dd>

                    <dt className="col-sm-3">Точка Б: </dt>
                    <dd className="col-sm-9"><a target="_blank" href={driverTask.locationB && `https://yandex.ru/maps/?pt=${driverTask.locationB.coordinates}&z=11&l=map`}>{driverTask.locationB && driverTask.locationB.name}</a></dd>

                    <dt className="col-sm-3">Комментарий по заявке:</dt>
                    <dd className="col-sm-9">{order.note}</dd>

                    <dt className="col-sm-3">Комментарий по задаче:</dt>
                    <dd className="col-sm-9">{driverTask.adminComment}</dd>
                </dl>

                {status === 4 &&
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Номер ТН</label>
                            <input
                                type="text"
                                className="form-control"
                                form="profile-form"
                                onChange={(e) => setTnNumber(e.target.value)}
                                value={tnNumber} />
                        </div>

                        <div className="form-group col-md-6">
                            <label>Грузоотправитель (1)</label>
                            <Autocomplete
                                options={clients}
                                disablePortal
                                onChange={(e, newvalue) => { setGo(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.clientName}`}
                                renderInput={(params) => <TextField {...params} label="Список юр.лиц" />} />
                            {driverTask.order.clientName}
                        </div>

                        <div className="form-group col-md-6">
                            <label>Грузополучатель (2)</label>
                            <Autocomplete
                                options={clients}
                                disablePortal
                                onChange={(e, newvalue) => { setGp(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.clientName}`}
                                renderInput={(params) => <TextField {...params} label="Список юр.лиц" />} />
                            {driverTask.order.client.name}
                        </div>

                        <div className="form-row">
                            <label>Тип груза (3)</label>
                            <Autocomplete
                                options={materialsList}
                                disablePortal
                                onChange={(e, newvalue) => { setMaterial(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.name}`}
                                renderInput={(params) => <TextField {...params} label="Список материалов" />} />
                        </div>

                        <div className="form-group col-md-6">
                            <label>Объем загрузки</label>
                            <input
                                type="text"
                                className="form-control"
                                form="profile-form"
                                onChange={(e) => setLoadVolume(e.target.value)}
                                value={loadVolume} />
                        </div>

                        <div className="form-group col-md-6">
                            <label>Единица измерения</label>
                            <select className="form-select" value={unit} aria-label="Единица измерения" onChange={(e) => setUnit(e.target.value)}>
                                <option value="none">Единица измерения</option>
                                <option value="0">М3</option>
                                <option value="1">шт.</option>
                                <option value="2">тонны</option>
                            </select>
                        </div>

                        <div className="form-group col-md-6">
                            <label>Прием груза (8)</label>
                            <Autocomplete
                                options={addresses}
                                disablePortal
                                onChange={(e, newvalue) => { setAddressA(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.name}`}
                                renderInput={(params) => <TextField {...params} label="Список адресов" />} />
                        </div>

                        <div className="input-group mb-3 col-md-6 pl-1">
                            <label>Дата прибытия на склад погрузки</label>
                            <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={pickupArrivalDate} onChange={(date) => { setPickupArrivalDate(date) }} />
                        </div>

                        <div className="form-group col-md-6">
                            <label>Время прибытия на склад погрузки</label>
                            <input
                                type="text"
                                className="form-control"
                                form="profile-form"
                                onChange={(e) => setPickupArrivalTime(e.target.value)}
                                value={pickupArrivalTime} />
                        </div>

                        <div className="input-group mb-3 col-md-6 pl-1">
                            <label>Дата выезда со склада погрузки</label>
                            <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={pickupDepartureDate} onChange={(date) => { setPickupDepartureDate(date) }} />
                        </div>

                        <div className="form-group col-md-6">
                            <label>Время выезда со склада погрузки</label>
                            <input
                                type="text"
                                className="form-control"
                                form="profile-form"
                                onChange={(e) => setPickupDepartureTime(e.target.value)}
                                value={pickupDepartureTime} />
                        </div>
                    </div>}

                {status === 9 &&
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Объем выгрузки</label>
                            <input
                                type="text"
                                className="form-control"
                                form="profile-form"
                                onChange={(e) => setLoadVolume(e.target.value)}
                                value={loadVolume} />
                        </div>

                        <div className="form-group col-md-6">
                            <label>Выдача груза (8)</label>
                            <Autocomplete
                                options={addresses}
                                disablePortal
                                onChange={(e, newvalue) => { setAddressB(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.name}`}
                                renderInput={(params) => <TextField {...params} label="Список адресов" />} />
                        </div>

                        <div className="input-group mb-3 col-md-6 pl-1">
                            <label>Дата прибытия на склад выгрузки</label>
                            <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={pickupArrivalDate} onChange={(date) => { setPickupArrivalDate(date) }} />
                        </div>

                        <div className="form-group col-md-6">
                            <label>Время прибытия на склад выгрузки</label>
                            <input
                                type="text"
                                className="form-control"
                                form="profile-form"
                                onChange={(e) => setPickupArrivalTime(e.target.value)}
                                value={pickupArrivalTime} />
                        </div>

                        <div className="input-group mb-3 col-md-6 pl-1">
                            <label>Дата выезда со склада выгрузки</label>
                            <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={pickupDepartureDate} onChange={(date) => { setPickupDepartureDate(date) }} />
                        </div>

                        <div className="form-group col-md-6">
                            <label>Время выезда со склада выгрузки</label>
                            <input
                                type="text"
                                className="form-control"
                                form="profile-form"
                                onChange={(e) => setPickupDepartureTime(e.target.value)}
                                value={pickupDepartureTime} />
                        </div>
                    </div>}
                <div className="row">
                    <div className="col-md-3">
                        <Box sx={{ width: '100%' }}>
                            <Stepper orientation="vertical" activeStep={status}>
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
                                <button type="submit" onClick={handleSubmit} className="btn btn-success mt-3">
                                    {statusToButtonTxt(status)}
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
