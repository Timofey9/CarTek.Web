import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from "../../services/cartekApiService";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DatePicker, { registerLocale } from "react-datepicker";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ClientForm from './add-client.component'
import AddressForm from './add-address.component'
import MaterialForm from './add-material.component'
import Divider from '@mui/material/Divider';
import "react-datepicker/dist/react-datepicker.css";
import "./orders.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

function EditOrderForm({ orderId, handleCloseOrderForm }) {
    const [clients, setClients] = useState([]);
    const [client, setClient] = useState({});
    const [order, setOrder] = useState({});
    const [gp, setGp] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [addressA, setAddressA] = useState({});
    const [addressB, setAddressB] = useState({});
    const [orderName, setOrderName] = useState("");
    const [materialsList, setMaterialsList] = useState([]);
    const [material, setMaterial] = useState({});
    const [volume, setVolume] = useState(0);
    const [loadUnit, setLoadUnit] = useState("none");
    const [unloadUnit, setUnloadUnit] = useState({});
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [note, setNote] = useState("");
    const [carCount, setCarCount] = useState(1);
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
    const [isEdit, setIsEdit] = useState(false);
    const [drivers, setDrivers] = useState([]);

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

    useEffect(() => {
        setLoading(true);
        ApiService.getOrderById(orderId)
            .then(({ data }) => {
                setOrderName(data.name);
                setServiceType(data.service);
                setClient(data.client);
                setMaterial(data.material);
                setVolume(data.volume);
                setLoadUnit(data.loadUnit);
                setAddressA(data.locationA);
                setAddressB(data.locationB);
                setStartDate(new Date(data.startDate));
                setEndDate(new Date(data.dueDate));
                setNote(data.note);
                setPrice(data.price);
                setCarCount(data.carCount);
                setMileage(data.mileage);
                console.log(data);
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

    function deleteOrder() {
        ApiService.deleteOrder(orderId)
            .then(({ data }) => {
                alert("Заявка удалена");
                handleCloseOrderForm();
            }).
            catch((error) => {
                if (error.response.data.message) {
                    setMessage(error.response.data.message);
                }
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
                    orderId: orderId,
                    carId: tasksToCreate[i].car.id,
                    shift: tasksToCreate[i].shift,
                    taskDate: tasksToCreate[i].taskDate,
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
            clientName: client.clientName,
            clientId: client.id,
            materialId: material.id,
            volume: volume,
            loadUnit: loadUnit,
            unloadUnit: loadUnit,
            isComplete: false,
            dueDate: endDate,
            startDate: startDate,
            locationAId: addressA.id,
            locationBId: addressB.id,
            carCount: carCount,
            note: note,
            service: serviceType,
            mileage: mileage,
            price: price
        };

        ApiService.updateOrder(orderId, newOrder)
            .then(({ data }) => {
                alert(`Заявка обновлена`);
            }).
            catch((error) => {
                if (error.response.data.message) {
                    setMessage(error.response.data.message);
                }
            });
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

                <h1>Заявка от {new Date(startDate).toLocaleDateString('ru-Ru', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                })} {orderName}</h1>

                <div className="row">
                    <div className="col-md-8"></div>
                    <div className="col-md-4">
                        <button onClick={() => deleteOrder()} className="btn btn-danger mr-10">Удалить</button>
                        {!isEdit && <button onClick={(e) => setIsEdit(true)} className="btn btn-warning">Редактировать</button>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label className="bold-label">Услуга</label>
                        <select disabled={!isEdit} className="form-select" value={serviceType} aria-label="Услуга" onChange={(e) => setServiceType(e.target.value)}>
                            <option value="none">Услуга</option>
                            <option value={0} label="Перевозка"></option>
                            <option value={1} label="Поставка"></option>
                        </select>
                    </div>

                    <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                    <div className="form-group col-md-6">
                        <label className="bold-label">Грузоотправитель (1)</label>
                        {isEdit && <Autocomplete
                            options={clients}
                            disablePortal
                            onChange={(e, newvalue) => { setClient(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.clientName}`}
                            renderInput={(params) => <TextField {...params} label="Список юр.лиц" />} />}
                        <label>{client.clientName}</label>

                    </div>

                    <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                    <div className="form-group col-md-6">
                        <label className="bold-label">Грузополучатель (2)</label>
                        {isEdit && <Autocomplete
                            options={clients}
                            disablePortal
                            onChange={(e, newvalue) => { setGp(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.clientName}`}
                            renderInput={(params) => <TextField {...params} label="Список юр.лиц" />} />}
                        <label>{gp.clientName}</label>
                    </div>

                    <div className="form-group col-md-6">
                        {isEdit && <button className="btn btn-success mt-2" onClick={(e) => { handleClickOpen(e) }}>
                            Добавить юр.лицо
                        </button>}
                    </div>

                    <div className="form-row">
                        <label className="bold-label">Груз (3)</label>
                        <label>{material.name}</label>
                        {isEdit &&
                            <><Autocomplete
                                options={materialsList}
                                disablePortal
                                onChange={(e, newvalue) => { setMaterial(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.name}`}
                                renderInput={(params) => <TextField {...params} label="Список материалов" />} />

                                <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleMaterialOpen(e) }}>
                                    Добавить тип груза
                                </button></>}

                    </div>

                    <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                    <div className="form-group col-md-6">
                        <label className="bold-label">Объем (общий)</label>
                        <input
                            disabled={!isEdit}
                            type="text"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setVolume(e.target.value)}
                            value={volume}
                        />
                    </div>

                    <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                    <div className="form-group col-md-6">
                        <label className="bold-label">Единица измерения</label>
                        <select disabled={!isEdit} className="form-select" value={loadUnit} aria-label="Единица измерения" onChange={(e) => setLoadUnit(e.target.value)}>
                            <option value="none">Единица измерения</option>
                            <option value="0">М3</option>
                            <option value="1">шт.</option>
                            <option value="2">тонны</option>
                        </select>
                    </div>

                    <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                    <div className="form-group col-md-6">
                        <label className="bold-label">Прием груза (8)</label>
                        {isEdit && <Autocomplete
                            options={addresses}
                            disablePortal
                            onChange={(e, newvalue) => { setAddressA(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.name}`}
                            renderInput={(params) => <TextField {...params} label="Список адресов" />} />}

                        <label>{addressA && addressA.name}: {addressA && addressA.textAddress}</label>
                    </div>

                    <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                    <div className="form-group col-md-6">
                        <label className="bold-label">Выдача груза (10)</label>
                        {isEdit && <Autocomplete
                            options={addresses}
                            disablePortal
                            onChange={(e, newvalue) => { setAddressB(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.name}`}
                            renderInput={(params) => <TextField {...params} label="Список адресов" />} />}

                        <label>{addressB && addressB.name}: {addressB && addressB.textAddress}</label>

                        {isEdit && <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleAddressOpen(e) }}>
                            Добавить адрес
                        </button>}
                    </div>
                </div>

                <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                <div className="form-row">
                    <div className="input-group mb-3 col-md-6 pl-1">
                        <label className="bold-label">Дата начала</label>
                        <DatePicker disabled={!isEdit} dateFormat="dd.MM.yyyy" locale="ru" selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>

                    <div className="input-group mb-3 col-md-6 pl-1">
                        <label className="bold-label">Срок выполнения</label>
                        <DatePicker disabled={!isEdit} dateFormat="dd.MM.yyyy" locale="ru" selected={endDate} onChange={(date) => setEndDate(date)} />
                    </div>
                </div>

                <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label className="bold-label">Комментарий по заявке (общий)</label>
                        <input
                            disabled={!isEdit}
                            type="text"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setNote(e.target.value)}
                            value={note} />
                    </div>

                    <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                    <div className="form-group col-md-6">
                        <label className="bold-label">Километраж</label>
                        <input
                            disabled={!isEdit}
                            type="number"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setMileage(e.target.value)}
                            value={mileage} />
                    </div>

                    <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                    <div className="form-group col-md-6">
                        <label className="bold-label">Стоимость рейса</label>
                        <input
                            disabled={!isEdit}
                            type="text"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price} />
                    </div>

                    <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                    <div className="form-group col-md-6">
                        <label className="bold-label">Количество машин</label>
                        <input
                            disabled={!isEdit}
                            type="number"
                            className="form-control"
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

                <div className="row mt-5">
                    <div className="col-md-3"></div>
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-md-6">
                                <button onClick={() => handleCloseOrderForm()} className="btn btn-warning pull-right mr-1">
                                    Отмена
                                </button>
                            </div>
                            <div className="col-md-6">
                                <button type="submit" form="profile-form" className="btn btn-success pull-right" onClick={(e) => { handleSubmit(e) }}>
                                    Сохранить
                                </button>
                            </div>
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

export default EditOrderForm;