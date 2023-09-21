import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from "../../services/cartekApiService";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DatePicker, { registerLocale } from "react-datepicker";
import ShiftRadioButtonGroup from "../shiftradiobuttongroup";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ClientForm from './add-client.component'
import AddressForm from './add-address.component'
import MaterialForm from './add-material.component'
import Divider from '@mui/material/Divider';
import "./orders.css";
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

function OrderForm({ handleCloseOrderForm }) {
    const [clients, setClients] = useState([]);
    const [client, setClient] = useState({});
    const [gp, setGp] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [addressA, setAddressA] = useState({});
    const [addressB, setAddressB] = useState({});
    const [orderName, setOrderName] = useState("");
    const [materialsList, setMaterialsList] = useState([]);
    const [material, setMaterial] = useState({});
    const [volume, setVolume] = useState(0);
    const [loadUnit, setLoadUnit] = useState("none");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [note, setNote] = useState("");
    const [carCount, setCarCount] = useState(0);
    const [serviceType, setServiceType] = useState("none");
    const [reload, setReload] = useState(0);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [price, setPrice] = useState("");
    const [mileage, setMileage] = useState("");
    const [open, setOpen] = useState(false);
    const [openAddress, setOpenAddress] = useState(false);
    const [openMaterial, setOpenMaterial] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tasksToCreate, setTasksToCreate] = useState([]);
    const [cars, setCars] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [orderId, setOrderId] = useState(0);
    const [isValid, setIsValid] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isOrderCreated, setIsOrderCreated] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setReload(reload + 1);
    };

    const handleAddressOpen = () => {
        setOpenAddress(true);
    };

    const handleMaterialOpen = () => {
        setOpenMaterial(true);
    };

    const handleAddressClose = () => {
        setOpenAddress(false);
        setReload(reload + 1);
    };

    const handleMaterialClose = () => {
        setOpenMaterial(false);
        setReload(reload + 1);
    };

    const validate = () => {
        setValidated(true);
        let valid = true;

        if (serviceType === "none"){
            valid = false;
        }   

        if (Object.keys(client).length === 0){
            valid = false;
        }

        if (Object.keys(gp).length === 0){
            valid = false;
        }

        if (Object.keys(addressA).length === 0) {
            valid = false;
        }

        if (Object.keys(addressB).length === 0) {
            valid = false;
        }

        if (Object.keys(material).length === 0) {
            valid = false;
        }

        if (carCount === 0) {
            valid = false;
        }
        if (!valid) {
            setMessage("Не все обязательные поля заполнены")
        }

        setIsValid(valid);
        return valid;
    }

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
    }, [reload]);

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

    function handleCreateDriverTasks(event) {
        event.preventDefault();
        setMessage("");
        var formattedTasks = [];
        for (var i = 0; i < tasksToCreate.length; i++) {
            formattedTasks.push(
                {
                    driverId: tasksToCreate[i].driver.id,
                    orderId: orderId,
                    carId: tasksToCreate[i].car.id,
                    shift: tasksToCreate[i].shift,
                    taskDate: tasksToCreate[i].taskDate,
                    comment: tasksToCreate[i].comment,
                    forceChange: true
                });
        }

        const data = {
            orderId: orderId,
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

    function handleSubmit(event) {
        event.preventDefault();
        setMessage("");        

        const newOrder = {
            name: orderName,
            clientName: serviceType === "0" ? client.clientName : gp.clientName,
            gpId: gp.id,
            clientId: client.id,
            materialId: material.id,
            volume: volume,
            loadUnit: loadUnit === "none" ? 3 : loadUnit,
            isComplete: false,
            dueDate: endDate,
            startDate: startDate,
            addressAId: addressA.id,
            addressBId: addressB.id,
            carCount: carCount,
            note: note,
            service: serviceType,
            mileage: mileage,
            price: price
        };

        if (validate()) {
            ApiService.createOrder(newOrder)
                .then(({ data }) => {
                    alert(`Заявка создана, номер: ${data.message}`);
                    let array = [];
                    for (let i = 0; i < carCount; i++) {
                        array.push({ car: {}, driver: {}, taskDate: new Date(), shift: 0 });
                    }
                    setOrderId(data.message);
                    setIsOrderCreated(true);
                    setTasksToCreate(array);
                }).
                catch((error) => {
                    if (error.response.data.message) {
                        setMessage(error.response.data.message);
                    }
                });
        }
    }

    if (loading) {
        return <div><h1>ЗАГРУЗКА...</h1></div>
    }

    return (
        <div className="m-5">
            <div>
                <div className="row justify-content-md-center">
                    <div className="col-md-auto">
                        {error}
                    </div>
                </div>

                <h1>Создание заявки</h1>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Название заявки</label>
                        <input
                            type="text"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setOrderName(e.target.value)}
                            value={orderName}
                        />
                    </div>

                    <div className="form-group col-md-6">
                        <label>Услуга</label>
                        <select
                            className={validated && serviceType === "none" ? "form-select not-valid-input-border" : "form-select"}
                            value={serviceType} aria-label="Услуга" onChange={(e) => setServiceType(e.target.value)}>
                            <option value="none">Услуга</option>
                            <option value="0">Перевозка</option>
                            <option value="1">Поставка</option>
                        </select>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Грузоотправитель (1)</label>
                        <Autocomplete
                            className={validated && Object.keys(client).length === 0 ? "not-valid-input-border" : ""}
                            options={clients}
                            disablePortal
                            onChange={(e, newvalue) => { setClient(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.clientName}`}
                            isOptionEqualToValue={(o,v) => o === v.clientName} 
                            renderInput={(params) => <TextField {...params} label="Список юр.лиц" />} />
                    </div>

                    <div className="form-group col-md-6">
                        <label>Грузополучатель (2)</label>
                        <Autocomplete
                            className={validated && Object.keys(gp).length === 0 ? "not-valid-input-border" : ""}
                            options={clients}
                            disablePortal
                            onChange={(e, newvalue) => { setGp(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.clientName}`}
                            renderInput={(params) => <TextField {...params} label="Список юр.лиц" />} />
                    </div>

                    <div className="form-group col-md-6">
                        <button className="btn btn-success mt-2" onClick={(e) => { handleClickOpen(e) }}>
                            Добавить юр.лицо
                        </button>
                    </div>

                    <div className="form-row">
                        <label>Тип груза (3)</label>
                        <Autocomplete
                            className={validated && Object.keys(material).length === 0 ? "not-valid-input-border" : ""}
                            options={materialsList}
                            disablePortal
                            onChange={(e, newvalue) => { setMaterial(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.name}`}
                            renderInput={(params) => <TextField {...params} label="Список материалов" />} />

                        <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleMaterialOpen(e) }}>
                            Добавить тип груза
                        </button>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Объем (общий)</label>
                        <input
                            type="text"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setVolume(e.target.value)}
                            value={volume}
                        />
                    </div>

                    <div className="form-group col-md-6">
                        <label>Единица измерения</label>
                        <select className="form-select" value={loadUnit} aria-label="Единица измерения" onChange={(e) => setLoadUnit(e.target.value)}>
                            <option value="none">Единица измерения</option>
                            <option value="0">М3</option>
                            <option value="1">шт.</option>
                            <option value="2">тонны</option>
                        </select>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Прием груза (8)</label>
                        <Autocomplete
                            className={validated && Object.keys(addressA).length === 0 ? "not-valid-input-border" : ""}
                            options={addresses}
                            disablePortal
                            onChange={(e, newvalue) => { setAddressA(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.textAddress}`}
                            renderInput={(params) => <TextField {...params} label="Список адресов" />} />
                        <label>{addressA && addressA.textAddress}</label>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Выдача груза (10)</label>

                        <Autocomplete
                            className={validated && Object.keys(addressB).length === 0 ? "not-valid-input-border" : ""}
                            options={addresses}
                            disablePortal
                            onChange={(e, newvalue) => { setAddressB(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.textAddress}`}
                            renderInput={(params) => <TextField {...params} label="Список адресов" />} />

                        <label>{addressB && addressB.textAddress}</label>

                        <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleAddressOpen(e) }}>
                            Добавить адрес
                        </button>
                    </div>
                </div>

                <div className="form-row">
                    <div className="input-group mb-3 col-md-6 pl-1">
                        <label>Дата начала</label>
                        <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={startDate} onChange={(date) => { setStartDate(date); let date2 = new Date(date); date2.setDate(date.getDate() + 1); setEndDate(date2) }} />
                    </div>

                    <div className="input-group mb-3 col-md-6 pl-1">
                        <label>Срок выполнения</label>
                        <DatePicker disabled locale="ru" dateFormat="dd.MM.yyyy" selected={endDate} onChange={(date) => setEndDate(date)} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Комментарий по заявке (общий)</label>
                        <input
                            type="text"
                            className="form-control"
                            onChange={(e) => setNote(e.target.value)}
                            value={note} />
                    </div>

                    <div className="form-group col-md-6">
                        <label>Километраж</label>
                        <input
                            type="number"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setMileage(e.target.value)}
                            value={mileage} />
                    </div>

                    <div className="form-group col-md-6">
                        <label>Стоимость рейса</label>
                        <input
                            type="text"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price} />
                    </div>

                    <div className="form-group col-md-6">
                        <label>Количество машин</label>
                        <input
                            className={validated && carCount === 0 ? "form-control not-valid-input-border" : "form-control"}
                            type="number"
                            form="profile-form"
                            onChange={(e) => setCarCount(e.target.value)}
                            value={carCount} />
                    </div>
                </div>

                {message && (
                    <div className="form-group">
                        <div className="alert alert-danger mt-2" role="alert">
                            {message}
                        </div>
                    </div>
                )}

                {!isOrderCreated &&
                    <div className="row mt-5">
                        <div className="col-md-3"></div>
                        <div className="col-md-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <button onClick={() => handleCloseOrderForm()} className="btn btn-warning mr-1">
                                        Отмена
                                    </button>
                                </div>
                                <div className="col-md-6">
                                    <button type="submit" form="profile-form" className="btn btn-success" onClick={(e) => { handleSubmit(e) }}>
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>}

                <div className="row mt-5">
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
                                        <input
                                            type="text"
                                            className="form-control"
                                            onChange={(e) => task.comment = e.target.value}
                                            value={task.comment} />
                                    </div>

                                    <div key={"shift" + index} className="col-md-6">
                                        <ShiftRadioButtonGroup value={task.shift} onChange={(event) => {task.shift = event.target.value; setReload(reload + 1);
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
                        })
                    }
                </div>

                <div className="row mt-5">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <div className="row">
                            {orderId != 0 &&
                                <div className="col-md-2">
                                    <button type="submit" form="profile-form" className="btn btn-success" onClick={(e) => { handleCreateDriverTasks(e) }}>
                                        Создать задачи
                                    </button>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}>
                <AppBar sx={{ bgcolor: "#F6CC3" }}>
                    <Toolbar variant="dense">
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            Закрыть
                        </Button>
                    </Toolbar>
                </AppBar>
                <ClientForm handleClose={handleClose}></ClientForm>
            </Dialog>

            <Dialog
                fullScreen
                open={openAddress}
                onClose={handleAddressClose}>
                <AppBar sx={{ bgcolor: "#F6CC3" }}>
                    <Toolbar variant="dense">
                        <Button autoFocus color="inherit" onClick={handleAddressClose}>
                            Закрыть
                        </Button>
                    </Toolbar>
                </AppBar>
                <AddressForm handleClose={handleAddressClose}></AddressForm>
            </Dialog>

            <Dialog
                fullScreen
                open={openMaterial}
                onClose={handleMaterialClose}>
                <AppBar sx={{ bgcolor: "#F6CC3" }}>
                    <Toolbar variant="dense">
                        <Button autoFocus color="inherit" onClick={handleMaterialClose}>
                            Закрыть
                        </Button>
                    </Toolbar>
                </AppBar>
                <MaterialForm handleClose={handleMaterialClose}></MaterialForm>
            </Dialog>
        </div>);
};

export default OrderForm;