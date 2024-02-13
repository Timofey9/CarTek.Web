import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from "../../services/cartekApiService";
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import "./drivers.css";
import ClientForm from '../orders/add-client.component'
import AddressForm from '../orders/add-address.component'
import MaterialForm from '../orders/add-material.component'
import Backdrop from '@mui/material/Backdrop';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDebouncedCallback } from 'use-debounce';
import EditTn from '../orders/edit-tn.component'

registerLocale('ru', ru);

const DriverEditSubTask = () => {
    const [driver, setDriver] = useState({});
    const [car, setCar] = useState({});
    const [driverTask, setDriverTask] = useState({});
    const [driverTaskId, setDriverTaskId] = useState(0);
    const [order, setOrder] = useState({});
    const [status, setStatus] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState("");
    const [formData, setFormData] = useState(new FormData());
    const [notes, setNotes] = useState([]);
    const [reload, setReload] = useState(0);
    const [unit, setUnit] = useState(0);
    const [unit2, setUnit2] = useState(1);
    const [materialsList, setMaterialsList] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [clients, setClients] = useState([]);
    const [material, setMaterial] = useState({});
    const [addressA, setAddressA] = useState({});
    const [addressB, setAddressB] = useState({});
    const [addressAKey, setAddressAKey] = useState(1);
    const [addressBKey, setAddressBKey] = useState(1);
    const [message, setMessage] = useState("");
    const [tnNumber, setTnNumber] = useState("");
    const [loadVolume, setLoadVolume] = useState("");
    const [loadVolume2, setLoadVolume2] = useState("");
    const [unloadVolume, setUnloadVolume] = useState("");
    const [unloadVolume2, setUnloadVolume2] = useState("");
    const [unloadUnit, setUnloadUnit] = useState(0);
    const [unloadUnit2, setUnloadUnit2] = useState(1);
    const [go, setGo] = useState({});
    const [gp, setGp] = useState({});
    const [pickupArrivalDate, setPickupArrivalDate] = useState(new Date());
    const [pickupDepartureDate, setPickupDepartureDate] = useState(new Date());
    const [dropOffArrivalDate, setDropOffArrivalDate] = useState(new Date());
    const [dropOffDepartureDate, setDropOffDepartureDate] = useState(new Date());
    const [currentSubTask, setCurrentSubTask] = useState({});
    const [hasSubTask, setHasSubTask] = useState(true);
    const [continueWork, setContinueWork] = useState(false);
    const [validated, setValidated] = useState(true);
    const [customer, setCustomer] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAddress, setOpenAddress] = useState(false);
    const [openMaterial, setOpenMaterial] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [openEditTn, setOpenEditTn] = useState(false);
    const [rerender, setrerender] = useState(0);
    const [isExternal, setIsExternal] = useState(false);
    const [isExternalOrder, setIsExternalOrder] = useState(false);
    const [externalTransporter, setExternalTransporter] = useState({ name: "ООО \"КарТэк\"" });

    const constStatuses = ['Назначена', 'Принята', 'На линии', 'Прибыл на склад загрузки', 'Погрузка', 'Выписка ТН (первая часть)', 'Прибыл на объект выгрузки', 'Выгрузка', 'Выписка документов', 'Завершить'];

    let { subTaskId } = useParams();

    const navigate = useNavigate();

    const handleConfirmationOpen = () => {
        setConfirmationOpen(true);
    };

    const clearFileInputById = (id) => {
        var ctrl = document.getElementById(id);
        try {
            ctrl.value = null;
            formData.delete("Files");
        } catch (ex) { }
        if (ctrl.value) {
            ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
        }
        setrerender(rerender + 1);
    }

    const hasFiles = (id) => {
        var ctrl = document.getElementById(id);
        return ctrl && ctrl.files.length > 0;
    }

    const updateVolume = (setter, value) => {
        var str = value.toString();
        if (str.length > 2) {
            if (str[2] === ',' || str[2] === '.'
                || str[1] === ',' || str[1] === '.') {
                setter(value);
            } else {
                var newString = str.slice(0, 2) + '.' + str.slice(2);
                setter(newString);
            }

        } else {
            setter(value);
        }
    }

    const handleEditTnClose = () => {
        setOpenEditTn(false);
        setReload(reload + 1);
    }

    const handleEditTnOpen = () => {
        setOpenEditTn(true);
    }

    const handleConfirmationClose = () => {
        setConfirmationOpen(false);
        setReload(reload + 1);
    };

    const handleConfirmationCloseSuccess = () => {
        getBack();
        setConfirmationOpen(false);
        setReload(reload + 1);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleAddressOpen = () => {
        setOpenAddress(true);
    };

    const handleMaterialOpen = () => {
        setOpenMaterial(true);
    };

    const handleClose = () => {
        setOpen(false);
        setReload(reload + 1);
    };

    const handleAddressClose = () => {
        setOpenAddress(false);
        setReload(reload + 1);
    };

    const handleMaterialClose = () => {
        setOpenMaterial(false);
        setReload(reload + 1);
    };


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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    const selectFile = (e) => {
        try {
            formData.delete("Files");
            for (var file of e.target.files) {
                formData.append("Files", file);
            }
            setContinueWork(true);

        }
        catch (e) {
            alert("Прикрепите фото еще раз");
        }
    };

    const selectFile2 = (e) => {
        try {
            for (var file of e.target.files) {
                formData.append("Files", file);
            }
            setContinueWork(true);
        }
        catch (e) {
            alert("Прикрепите фото еще раз");
        }
    };

    const createSubTask = useDebouncedCallback((event) => {
        var data = {
            driverTaskId: driverTask.id
        }

        ApiService.createSubTask(data)
            .then(({ data }) => {
                alert("Подзадача добавлена");
                navigate(`/driver-dashboard/subtask/${data.message}`);
                setReload(reload + 1);
                setContinueWork(true);
            })
            .catch((error) => {
                if (error.response.data) {
                    setError(error.response.data);
                    setShowSpinner(false);
                }
            });
    });

    const getBack = useDebouncedCallback((event) => {
        setShowSpinner(true);
        ApiService.TaskGetBack({ driverTaskId: subTaskId, isSubTask: true })
            .then(({ data }) => {
                alert("Статус обновлен");
                setFormData(new FormData());
                setTnNumber("");
                setNote("");
                setReload(reload + 1);
            })
            .catch((error) => {
                if (error.response.data) {
                    setShowSpinner(false);
                }
            });

        setShowSpinner(false);
    }, 500);


    const handleSubmitNote = useDebouncedCallback((event) => {
        event.preventDefault();
        setShowSpinner(true);

        for (var key of formData.keys()) {
            if (key !== "Files")
                formData.delete(key)
        };

        formData.append("DriverTaskId", subTaskId);
        formData.append("UpdatedStatus", status + 1);
        formData.append("Note", note);

        ApiService.SubmitNoteAsync(formData)
            .then(({ data }) => {
                alert("Статус обновлен");
                setFormData(new FormData());
                setNote("");
                setReload(reload + 1);
                setShowSpinner(false);
            })
            .catch((error) => {
                if (error.response.data.message) {
                    setError(error.response.data);
                }

                setShowSpinner(false);
            });

        setShowSpinner(false);
    }, 500);


    const handleSubmit = useDebouncedCallback((event) => {
        setShowSpinner(true);

        for (var key of formData.keys()) {
            if (key !== "Files")
                formData.delete(key)
        };

        formData.set("DriverTaskId", driverTask.id);
        formData.set("UpdatedStatus", 9);
        formData.append("IsSubtask", true);
        formData.append("SubTaskId", subTaskId);
        formData.append("Transporter", externalTransporter.name);

        if (isExternalOrder) {
            formData.append("TransporterId", externalTransporter.id);
        }

        if (validate())
        {
            formData.append("MaterialId", material.id);
            formData.append("Number", tnNumber);
            formData.append("GoId", go.id);
            formData.append("GpId", gp.id);
            formData.append("LoadVolume", loadVolume);
            formData.append("Unit", unit);
            formData.append("LoadVolume2", loadVolume2);
            formData.append("Unit2", unit2);
            formData.append("LocationAId", addressA.id);
            formData.append("PickUpArrivalDate", pickupArrivalDate.toUTCString());
            formData.append("PickUpDepartureDate", pickupDepartureDate.toUTCString());
            formData.append("UnloadVolume", unloadVolume && unloadVolume.replace(',', '.'));
            formData.append("UnloadVolume2", unloadVolume2 && unloadVolume2.replace(',', '.'));
            formData.append("UnloadUnit", unloadUnit);
            formData.append("UnloadUnit2", unloadUnit2);
            formData.append("LocationBId", addressB.id);
            formData.append("DropOffArrivalDate", dropOffArrivalDate && dropOffArrivalDate.toUTCString());
            formData.append("DropOffDepartureDate", dropOffDepartureDate && dropOffDepartureDate.toUTCString());

            ApiService.SubmitDriverSubTaskAsync(formData)
                .then(({ data }) => {
                    alert("Статус обновлен");
                    clearForm();
                    setShowSpinner(false);
                    setReload(reload + 1);
                 })
                .catch((error) => {
                    if (error.response.data) {
                        setError(error.response.data.message);
                        setShowSpinner(false);
                    }
                });

        }
        setShowSpinner(false);
    }, 500);

    const cancelTask = useDebouncedCallback((event) => {
        setShowSpinner(true);
        ApiService.CancelSubTask({ driverTaskId: subTaskId })
            .then(({ data }) => {
                alert("Статус обновлен");
                setFormData(new FormData());
                setTnNumber("");
                setNote("");
                setReload(reload + 1);
            })
            .catch((error) => {
                if (error.response.data) {
                    setShowSpinner(false);
                }
            });

        setShowSpinner(false);
    }, 500);

    const restoreTask = useDebouncedCallback((event) => {
        ApiService.RestoreSubTask({ driverTaskId: subTaskId })
            .then(({ data }) => {
                alert("Статус обновлен");
                setReload(reload + 1);
            })
            .catch((error) => {
                setError(error.response.data.message);
            });

    }, 500);

    const clearForm = () => {
        setFormData(new FormData());
        setTnNumber("");
        setLoadVolume("");
        setUnloadVolume("");
        setLoadVolume2("");
        setUnloadVolume2("");
        setUnit("none");
        setUnit2("none");
        setUnloadUnit("none");
        setUnloadUnit2("none");
        setGp({});
        setGo({});
        setMaterial({});
        setAddressA({});
        setAddressB({});
        setValidated(false);
        setAddressAKey(addressAKey + 1);
        setAddressBKey(addressBKey + 1);
        clearFileInputById("imageFileInputTN");
        clearFileInputById("imageFileInputTN2");
        setNote("");
    }

    const validate = () => {
        setValidated(true);
        var isValid = true;
        if (tnNumber.length === 0) {
            isValid = false;
        }

        if (Object.keys(go).length === 0) {
            isValid = false;
        }

        if (Object.keys(gp).length === 0) {
            isValid = false;
        }

        if (Object.keys(material).length === 0) {
            isValid = false;
        }

        if (loadVolume.length === 0 && loadVolume2.length === 0) {
            isValid = false;
        }

        if (unit === "none") {
            isValid = false;
        }

        if (Object.keys(addressA).length === 0) {
            isValid = false;
        }


        if (Object.keys(addressB).length === 0) {
            isValid = false;
        }

        if (unloadVolume.length === 0 && unloadVolume2.length === 0) {
            isValid = false;
        }

        if (unloadUnit === "none") {
            isValid = false;
        }


        return isValid;
    }

    const statusToButtonTxt = (status) => {
        switch (status) {
            case 0:
                return "Принять";
            case 1:
                return "Выехать на линию";
            case 2:
                return "Прибыл на склад загрузки";
            case 3:
                return "Погрузка";
            case 4:
                return "Выписать (ТН-первая часть) и выехать со склада";
            case 5:
                return "Прибыл на объект выгрузки";
            case 6:
                return "Выгрузка";
            case 7:
                return "Выписать документы и завершить";
            case 8:
                return "Завершить";
            default:
                return "Отправить";
        }
    }

    useEffect(() => {
        setLoading(true);

        let user = JSON.parse(localStorage.getItem("user"));

        setIsExternal(user.isExternal);

        ApiService.getSubTask(subTaskId)
            .then(({ data }) => {
                setCurrentSubTask(data);
                setDriverTask(data.driverTask);
                setDriver(data.driverTask.driver);
                setOrder(data.driverTask.order);
                setDataFromOrder(data.driverTask);
                setStatus(data.status);
                setNotes(data.notes);
                setCar(data.driverTask.car);
                setCustomer(data.driverTask.orderCustomer);

                if (data.status === 4 || data.status === 7) {
                    scrollToTop();
                }

            }).
            catch((error) => {
                setError(error.response.data);
            });

        setLoading(false);
    }, [reload]);

    const setDataFromOrder = (data) => {
        var order = data.order;
        if (data.order.isExternal) {
            setIsExternalOrder(true);
            setExternalTransporter(data.order.externalTransporter)
        }
        setGo(order.client);
        setGp(order.gp);
        setAddressA(data.locationA);
        setAddressB(data.locationB);
        setMaterial(order.material)

    }

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

    const checkObjectKeys = (obj) => {
        if (obj !== null && obj !== undefined) {
            return validated && Object.keys(obj).length === 0;
        }

        return validated;
    }


    return <div className="container">
        {!loading && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="row">
                    <div className="col-md-10">
                        <h1>Задача по заявке {order && order.name} {hasSubTask &&
                            <span>,рейс #{currentSubTask.sequenceNumber + 1}</span>}
                        </h1>
                    </div>
                    <div className="col-md-2">
                        <button disabled={status < 4} form="profile-form" className="btn btn-success mt-2 mr-10" onClick={(e) => { handleEditTnOpen(e) }}>
                            ТН
                        </button>
                        {!isExternal && <div>
                            {!currentSubTask.isCanceled ?
                                <button disabled={status >= 10} form="profile-form" className="btn btn-danger mt-2" onClick={(e) => { cancelTask(e) }}>
                                    Отменить задачу
                                </button>
                                :
                                <button onClick={() => restoreTask()} className="btn btn-success mt-2">Возобновить</button>
                            }
                        </div>}
                    </div>
                </div>

                <dl className="row">
                    <dt className="col-sm-3">Тягач: </dt>
                    <dd className="col-sm-9">{car.brand} {car.model}: {car.plate}</dd>

                    <dt className="col-sm-3">Материал: </dt>
                    <dd className="col-sm-9">{order.material && order.material.name}</dd>

                    <dt className="col-sm-3">Дата: </dt>
                    <dd className="col-sm-9">{driverTask && new Date(driverTask.startDate).toLocaleDateString('ru-Ru', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}</dd>

                    <dt className="col-sm-3">Смена: </dt>
                    <dd className="col-sm-9">{intToShift(driverTask.shift)}</dd>

                    <dt className="col-sm-3">Место погрузки: </dt>
                    <dd className="col-sm-9"><a target="_blank" href={driverTask.locationA && `https://yandex.ru/maps/?pt=${driverTask.locationA.coordinates}&z=11&l=map`}>{driverTask.locationA && driverTask.locationA.textAddress}</a></dd>

                    <dt className="col-sm-3">Место выгрузки: </dt>
                    <dd className="col-sm-9"><a target="_blank" href={driverTask.locationB && `https://yandex.ru/maps/?pt=${driverTask.locationB.coordinates}&z=11&l=map`}>{driverTask.locationB && driverTask.locationB.textAddress}</a></dd>

                    <dt className="col-sm-3">Услуга: </dt>
                    <dd className="col-sm-9">{order.service === 0 ? "Перевозка" : "Поставка"}</dd>
                    {!isExternal && <>
                        <dt className="col-sm-3">Заказчик: </dt>
                        <dd className="col-sm-9">{customer.clientName}</dd>

                        <dt className="col-sm-3">Себестоимость перевозки:</dt>
                        <dd className="col-sm-9">{order.price}</dd>

                        <dt className="col-sm-3">Транспорт :</dt>
                        <dd className="col-sm-9">По заявке назначено {order.driverTasks && order.driverTasks.length} а.м. Гос.номера: {order.driverTasks && order.driverTasks.map((dt) => { return (<span>{dt.car.plate}, </span>) })}</dd>
                    </>}

                    <dt className="col-sm-3">Комментарий по заявке:</dt>
                    <dd className="col-sm-9">{order.note}</dd>

                    <dt className="col-sm-3">Комментарий по задаче:</dt>
                    <dd className="col-sm-9">{driverTask.adminComment}</dd>


                </dl>
                {status < 9 && <>
                    <div className="form-row">
                        <div className="form-group col-md-8">
                            <div className="alert alert-info" role="alert">
                                Данные ТН предзаполняются по информации из заявки. В случае необходимости, вы можете их изменить
                            </div>
                        </div>

                        <div className="form-group col-md-6">
                            <label>Номер ТН</label>
                            <input
                                className={validated && tnNumber.length === 0 ? "form-control not-valid-input-border" : "form-control"}
                                type="text"
                                form="profile-form"
                                onChange={(e) => setTnNumber(e.target.value)}
                                value={tnNumber} />
                        </div>

                        <div className="form-group col-md-6">
                            <label>Грузоотправитель (1)</label>
                            <Autocomplete
                                className={checkObjectKeys(go) ? "not-valid-input-border" : ""}
                                options={clients}
                                disablePortal
                                defaultValue={go}
                                value={go}
                                key={addressBKey}
                                onChange={(e, newvalue) => { setGo(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.clientName}`}
                                renderInput={(params) => <TextField {...params} label="Список юр.лиц" />} />
                        </div>

                        <div className="form-group col-md-6">
                            <label>Грузополучатель (2)</label>
                            <Autocomplete
                                className={checkObjectKeys(gp) ? "not-valid-input-border" : ""}
                                options={clients}
                                key={addressBKey}
                                disablePortal
                                defaultValue={gp}
                                value={gp}
                                onChange={(e, newvalue) => { setGp(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.clientName}`}
                                renderInput={(params) => <TextField {...params} label="Список юр.лиц" />} />
                            {/*    {driverTask.order.client.name}*/}
                        </div>
                        {!isExternal &&
                            <div className="form-group col-md-6">
                                <button className="btn btn-success mt-2" onClick={(e) => { handleClickOpen(e) }}>
                                    Добавить юр.лицо
                                </button>
                            </div>
                        }

                        <div className="form-group col-md-6">
                            <label>Перевозчик (6)</label>

                            <input
                                disabled
                                className={validated && externalTransporter.name.length === 0 ? "form-control not-valid-input-border" : "form-control"}
                                type="text"
                                form="profile-form"
                                value={externalTransporter.name} />
                        </div>

                        <div className="form-row">
                            <label>Тип груза (3)</label>
                            <Autocomplete
                                renderOption={(props, item) => (<li {...props} key={item.id}>{item.name}</li>)}
                                className={checkObjectKeys(material) ? "not-valid-input-border" : ""}
                                options={materialsList}
                                disablePortal
                                defaultValue={material}
                                value={material}
                                key={addressBKey}
                                onChange={(e, newvalue) => { setMaterial(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.name}`}
                                renderInput={(params) => <TextField {...params} label="Список материалов" />} />


                            {!isExternal &&
                                <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleMaterialOpen(e) }}>
                                    Добавить тип груза
                                </button>}
                        </div>

                        <div className="form-group col-md-6">
                            <label>Объем загрузки</label>

                            <div className="row">
                                <div className="col-md-6">
                                    <label>M3</label>
                                    <input
                                        placeholder="М3"
                                        className={validated && loadVolume.length === 0 ? "form-control not-valid-input-border" : "form-control"}
                                        type="number"
                                        step="0.1"
                                        form="profile-form"
                                        onChange={(e) => updateVolume(setLoadVolume, e.target.value)}
                                        value={loadVolume} />
                                </div>
                                <div className="col-md-6">
                                    <label>Тонны</label>
                                    <input
                                        placeholder="Тонны"
                                        className={validated && loadVolume2.length === 0 ? "form-control not-valid-input-border" : "form-control"}
                                        type="number"
                                        step="0.1"
                                        form="profile-form"
                                        onChange={(e) => updateVolume(setLoadVolume2, e.target.value)}
                                        value={loadVolume2} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group col-md-6">
                            <label>Адрес погрузки (8)</label>
                            <Autocomplete
                                className={checkObjectKeys(addressA) ? "not-valid-input-border" : ""}
                                options={addresses}
                                disablePortal
                                key={addressAKey}
                                defaultValue={addressA}
                                value={addressA}
                                onChange={(e, newvalue) => { setAddressA(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.textAddress}`}
                                renderInput={(params) => <TextField {...params} label="Список адресов" />} />

                            {!isExternal &&
                                <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleAddressOpen(e) }}>
                                    Добавить адрес
                                </button>
                            }
                        </div>

                        <div className="input-group mb-3 col-md-6 pl-1">
                            <label>Дата прибытия на адрес погрузки</label>
                            <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={pickupArrivalDate} onChange={(date) => { setPickupArrivalDate(date) }} />
                        </div>

                        <div className="input-group mb-3 col-md-6 pl-1">
                            <label>Дата выезда с адреса погрузки</label>
                            <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={pickupDepartureDate} onChange={(date) => { setPickupDepartureDate(date) }} />
                        </div>

                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Объем выгрузки</label>

                            <div className="row">
                                <div className="col-md-6">
                                    <label>M3</label>
                                    <input
                                        placeholder="М3"
                                        className={validated && unloadVolume.length === 0 ? "form-control not-valid-input-border" : "form-control"}
                                        type="number"
                                        step="0.1"
                                        form="profile-form"
                                        onChange={(e) => updateVolume(setUnloadVolume, e.target.value)}
                                        value={unloadVolume} />
                                </div>
                                <div className="col-md-6">
                                    <label>Тонны</label>
                                    <input
                                        placeholder="Тонны"
                                        className={validated && unloadVolume2.length === 0 ? "form-control not-valid-input-border" : "form-control"}
                                        type="number"
                                        step="0.1"
                                        form="profile-form"
                                        onChange={(e) => updateVolume(setUnloadVolume2, e.target.value)}
                                        value={unloadVolume2} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group col-md-6">
                            <label>Адрес выгрузки (10)</label>
                            <Autocomplete
                                className={checkObjectKeys(addressB) ? "not-valid-input-border" : ""}
                                options={addresses}
                                disablePortal
                                key={addressBKey}
                                defaultValue={addressB}
                                value={addressB}
                                onChange={(e, newvalue) => { setAddressB(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.textAddress}`}
                                renderInput={(params) => <TextField {...params} label="Список адресов" />} />
                        </div>

                        <div>

                            <div className="row mt-3 mb-3">
                                <div className="col-md-9">
                                    <div className="alert alert-danger" role="alert">
                                        ПРИКРЕПИТЬ ФОТО C 1 СТОРОНЫ
                                        <div className="row">
                                            <div className="col-md-12">
                                                {hasFiles("imageFileInputTN") && <IconButton onClick={(e) => clearFileInputById("imageFileInputTN")} aria-label="delete">
                                                    <i className="fa fa-cancel"></i>  </IconButton>}
                                                <input type="file" id="imageFileInputTN" accept=".jpg, .png, .PNG ,.jpeg" multiple onChange={(e) => selectFile(e)}></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-3 mb-3">
                                <div className="col-md-9">
                                    <div className="alert alert-danger" role="alert">
                                        ПРИКРЕПИТЬ ФОТО СО 2 СТОРОНЫ
                                        <div className="row">
                                            <div className="col-md-12">
                                                {hasFiles("imageFileInputTN2") && <IconButton onClick={(e) => clearFileInputById("imageFileInputTN2")} aria-label="delete">
                                                    <i className="fa fa-cancel" aria-hidden="true"></i>  </IconButton>}
                                                <input type="file" id="imageFileInputTN2" accept=".jpg, .png, .PNG ,.jpeg" multiple onChange={(e) => selectFile2(e)}></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="row mt-3">
                            {status <= 8 &&
                                <div className="col-md-9">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <textarea id="acceptanceComment" value={note} onChange={(e) => setNote(e.target.value)} rows="5" cols="40"></textarea>
                                        </div>
                                    </div>
                                    {status !== 7 &&
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label htmlFor="files">Прикрепить фотографии</label>
                                                <input type="file" id="files" accept="image/*" multiple onChange={(e) => selectFile(e)}></input>
                                            </div>
                                        </div>}


                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="col-md-3">
                                                <button type="submit" onClick={handleSubmitNote} className="btn btn-primary mt-3">
                                                    Отправить комментарий/фото
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-5">
                                        <div className="col-md-12">
                                            <button type="submit" onClick={handleSubmit} className="btn btn-success mt-3">
                                                {statusToButtonTxt(status)}
                                            </button>
                                        </div>
                                    </div>

                                    {error &&
                                        <div className="row d-flex justify-content-center mt-3">
                                            <div className="alert alert-danger mt-2" role="alert">
                                                {error}
                                            </div>
                                        </div>
                                    }
                                </div>}
                        </div>
                    </div></>}


                {status === 9 && driverTask.shift === 3 &&
                    <>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="alert alert-primary" role="alert">
                                    Продолжить работу?
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3 mb-3">
                            <div className="col-md-12">
                                <button type="submit" onClick={createSubTask} className="btn btn-success mt-3">
                                    Продолжить
                                </button>
                            </div>
                        </div>
                    </>
                }
            </LocalizationProvider>
        )}
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showSpinner}
        >
            <CircularProgress color="inherit" />
        </Backdrop>

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

        <Dialog
            open={confirmationOpen}
            onClose={handleConfirmationClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                {"Подтвердите действие"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Вы хотите вернуться на предыдущий шаг. Нажмите "Продолжить"
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirmationClose}>Отмена</Button>
                <Button onClick={handleConfirmationCloseSuccess} autoFocus>
                    Продолжить
                </Button>
            </DialogActions>
        </Dialog>

        <Dialog
            fullScreen
            open={openEditTn}
            onClose={handleEditTnClose}>
            <AppBar sx={{ bgcolor: "#F6CC3" }}>
                <Toolbar variant="dense">
                    <Button autoFocus color="inherit" onClick={handleEditTnClose}>
                        Закрыть
                    </Button>
                </Toolbar>
            </AppBar>
            <EditTn driverTaskId={subTaskId} isSubTask={true} handleClose={handleEditTnClose}></EditTn>
        </Dialog>
    </div>
};

export default DriverEditSubTask;
