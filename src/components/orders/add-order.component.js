import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from "../../services/cartekApiService";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DatePicker, { registerLocale } from "react-datepicker";
import StateRadioButtonGroup from "../radiobuttongroup";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ClientForm from './add-client.component'
import AddressForm from './add-address.component'
import MaterialForm from './add-material.component'
import Divider from '@mui/material/Divider';

import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

function OrderForm() {
    const [order, setOrder] = useState({});
    const [clients, setClients] = useState([]);
    const [client, setClient] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [addressA, setAddressA] = useState({});
    const [addressB, setAddressB] = useState({});
    const [orderName, setOrderName] = useState("");
    const [materialsList, setMaterialsList] = useState([]);
    const [material, setMaterial] = useState({});
    const [volume, setVolume] = useState(0);
    const [loadUnit, setLoadUnit] = useState("");
    const [unloadUnit, setUnloadUnit] = useState({});
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [note, setNote] = useState("");
    const [carCount, setCarCount] = useState(1);
    const [serviceType, setServiceType] = useState("");
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
    const [isOrderCreated, setIsOrderCreated] = useState(false);
    const [orderId, setOrderId] = useState(0);

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
                console.log(data);
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

    //useEffect(() => {
    //    setLoading(true);

    //    if (carPlate) {
    //        ApiService.getOrderById(orderId)
    //            .then(({ data }) => {
    //                setOrder(data);
    //            }).
    //            catch((error) => {
    //                if (error.response.data.message) {
    //                    setMessage(error.response.data.message);
    //                }
    //            });
    //    }
    //    setLoading(false);
    //}, []);

    //function deleteOrder(event) {
    //    event.preventDefault();
    //    if (!notificationShown) {
    //        setMessage("Удаление атвомобиля приведет к удалению всех связанных с ним осмотров! Чтобы продолжить нажмите \"Удалить\" еще раз");
    //        setNotificationShown(true);
    //    } else {
    //        ApiService.deleteCar(car.id)
    //            .then(({ data }) => {
    //                setLoading(false);
    //                alert("Тягач удален");
    //                navigate("/admin/cars/");
    //            })
    //            .catch((error) => {
    //                setMessage(error.response.data);
    //                setLoading(false);
    //            })
    //    }
    //}

    function handleCreateDriverTasks(event) {
        event.preventDefault();
        setMessage("");

        console.log(tasksToCreate);

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
            addressAId: addressA.id,
            addressBId: addressB.id,
            carCount: carCount,
            note: note,
            service: serviceType,
            mileage: mileage,
            price: price
        };

        ApiService.createOrder(newOrder)
            .then(({ data }) => {
                alert(`Заявка создана, номер: ${data.message}`);
                let array = [];
                for (let i = 0; i < carCount; i++) {
                    array.push({ car: {}, driver: {}, taskDate: new Date(), shift: false });
                }
                console.log(array);
                setOrderId(data.message);
                setTasksToCreate(array);
            }).
            catch((error) => {
                if (error.response.data.message) {
                    setMessage(error.response.data.message);
                }
            });

        //if (carPlate) {
        //    ApiService.updateCar()
        //        .then(({ data }) => {
        //            alert("Тягач обновлен");
        //        }).
        //        catch((error) => {
        //            if (error.response.data.message) {
        //                setMessage(error.response.data.message);
        //            }
        //        });
        //} else {
        //    ApiService.createCar(newCar)
        //        .then(({ data }) => {
        //            alert("Тягач создан");
        //            navigate("/admin/cars/");
        //        }).
        //        catch((error) => {
        //            if (error.response.data.message) {
        //                setMessage(error.response.data.message);
        //            }
        //        });
        //}
    }

    if (loading) {
        return <div><h1>ЗАГРУЗКА...</h1></div>
    }

    return (
        <>
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
                        <label>Выберите клиента</label>
                        <Autocomplete
                            options={clients}
                            disablePortal
                            onChange={(e, newvalue) => { setClient(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.clientName}`}
                            renderInput={(params) => <TextField {...params} label="Список клиентов" />} />

                        <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleClickOpen(e) }}>
                            Добавить клиента
                        </button>
                    </div>

                    <div className="form-row">
                        <label>Тип груза</label>
                        <Autocomplete
                            options={materialsList}
                            disablePortal
                            onChange={(e, newvalue) => { setMaterial(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.name}`}
                            renderInput={(params) => <TextField {...params} label="Список материалов" />} />

                        <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleMaterialOpen(e) }}>
                            Добавить материал
                        </button>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Объем</label>
                        <input
                            type="text"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setVolume(e.target.value)}
                            value={volume}
                        />
                    </div>

                    <div className="form-group col-md-6">
                        <label>Единица измерения погрузки</label>
                        <select defaultValue={'none'} className="form-select" value={loadUnit} aria-label="Единица измерения" onChange={(e) => setLoadUnit(e.target.value)}>
                            <option value="none">Единица измерения</option>
                            <option value="0">М3</option>
                            <option value="1">шт.</option>
                            <option value="2">тонны</option>
                        </select>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Пункт А</label>

                        <Autocomplete
                            options={addresses}
                            disablePortal
                            onChange={(e, newvalue) => { setAddressA(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.name}`}
                            renderInput={(params) => <TextField {...params} label="Список адресов" />} />

                        <label>{addressA && addressA.textAddress}</label>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Пункт Б</label>

                        <Autocomplete
                            options={addresses}
                            disablePortal
                            onChange={(e, newvalue) => { setAddressB(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.name}`}
                            renderInput={(params) => <TextField {...params} label="Список адресов" />} />

                        <label>{addressB && addressB.textAddress}</label>

                        <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleAddressOpen(e) }}>
                            Добавить адрес
                        </button>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Услуга</label>
                        <select defaultValue={'none'} className="form-select" value={serviceType} aria-label="Услуга" onChange={(e) => setServiceType(e.target.value)}>
                            <option value="none">Услуга</option>
                            <option value="0">Перевозка</option>
                            <option value="1">Поставка</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="input-group mb-3 col-md-6 pl-1">
                        <label>Дата начала</label>
                        <DatePicker locale="ru" selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>

                    <div className="input-group mb-3 col-md-6 pl-1">
                        <label>Срок выполнения</label>
                        <DatePicker locale="ru" selected={endDate} onChange={(date) => setEndDate(date)} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Комментарий</label>
                        <input
                            type="text"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setNote(e.target.value)}
                            value={note}/>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Километраж</label>
                        <input
                            type="number"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setMileage(e.target.value)}
                            value={mileage}/>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Стоимость рейса</label>
                        <input
                            type="text"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}/>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Количество машин</label>
                        <input
                            type="number"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setCarCount(e.target.value)}
                            value={carCount}/>
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
                            {order &&
                                <div className="col-md-2">
                                    <button className="btn btn-danger" >
                                        Удалить
                                    </button>
                                </div>}
                            <div className="col-md-2">
                                <Link to="/admin/cars" className="btn btn-warning mr-1">
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

                <div className="row mt-5">
                    {
                        tasksToCreate.map((task, index) => {
                            return (<div className = "form-row">
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

                                    <div key={"shift" + index} className="form-group col-md-6">
                                        <StateRadioButtonGroup id={"shift" + index} type={"Смена"} isActive={task.shift} option1="Дневная" option2="Ночная" onChange={(event) => {
                                            task.shift = event.target.value === 'true' ? true : false; setReload(reload + 1); }} />
                                    </div>
                                </div>

                                <div key={"task" + index} className="form-row">
                                    <div className="input-group mb-3 col-md-6 pl-1">
                                        <label>Дата начала</label>
                                        <DatePicker locale="ru" selected={task.taskDate} onChange={(date) => {
                                            task.taskDate = date; setReload(reload + 1);} } />
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
                            {orderId &&
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
                    <Toolbar>
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
                    <Toolbar>
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
                    <Toolbar>
                        <Button autoFocus color="inherit" onClick={handleMaterialClose}>
                            Закрыть
                        </Button>
                    </Toolbar>
                </AppBar>
                <MaterialForm handleClose={handleMaterialClose}></MaterialForm>
            </Dialog>
        </>);
};

export default OrderForm;