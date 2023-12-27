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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import "./drivers.css";
import ClientForm from '../orders/add-client.component'
import AddressForm from '../orders/add-address.component'
import MaterialForm from '../orders/add-material.component'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDebouncedCallback } from 'use-debounce';
import EditTn from '../orders/edit-tn.component'

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
    const [unit, setUnit] = useState(0);
    const [unit2, setUnit2] = useState(1);
    const [materialsList, setMaterialsList] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [clients, setClients] = useState([]);
    const [material, setMaterial] = useState({});
    const [addressA, setAddressA] = useState({});
    const [addressB, setAddressB] = useState({});
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
    const [pickupArrivalTime, setPickupArrivalTime] = useState("");
    const [pickupDepartureDate, setPickupDepartureDate] = useState(new Date());
    const [pickupDepartureTime, setPickupDepartureTime] = useState("");
    const [continueWork, setContinueWork] = useState(false);
    const [rerender, setrerender] = useState(0);
    const [validated, setValidated] = useState(true);
    const [transporter, setTransporter] = useState("ООО \"КарТэк\"");
    const [customer, setCustomer] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAddress, setOpenAddress] = useState(false);
    const [openMaterial, setOpenMaterial] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [openEditTn, setOpenEditTn] = useState(false);
    const [density, setDensity] = useState(0);
    const constStatuses = ['Назначена', 'Принята', 'На линии', 'Прибыл на склад загрузки', 'Погрузка', 'Выписка ТН (первая часть)', 'Прибыл на объект выгрузки', 'Выгрузка', 'Выписка документов', 'Завершить'];
    const frequentlyUsed = ['ООО "КарТэк"', 'ЛСР Базовые'];
    let { driverTaskId } = useParams();

    const navigate = useNavigate();

    const clearFileInput = (ctrl) => {
        try {
            ctrl.value = null;
            formData.delete("Files");
        } catch (ex) { }
        if (ctrl.value) {
            ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
        }
        setContinueWork(true);
    }

    const clearFileInputById = (id) => {
        var ctrl = document.getElementById(id);
        try {
            ctrl.value = null;
            formData.delete("Files");
        } catch (ex) { }
        if (ctrl.value) {
            ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
        }
        setContinueWork(true);
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

    const handleConfirmationOpen = () => {
        setConfirmationOpen(true);
    };

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


    const setDataFromOrder = (data) => {
        var order = data.order
        setGo(order.client);
        setGp(order.gp);
        setAddressA(data.locationA);
        setAddressB(data.locationB);
        setMaterial(order.material)
    }

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
            driverTaskId: driverTaskId
        }

        ApiService.createSubTask(data)
            .then(({ data }) => {
                alert("Подзадача добавлена");
                navigate(`/driver-dashboard/subtask/${data.message}`);
                setReload(reload + 1);
            })
            .catch((error) => {
                if (error.response.data) {
                    setError(error.response.data);
                    setShowSpinner(false);
                }
            });
    }, 1000);

    const getBack = useDebouncedCallback((event) => {
        setShowSpinner(true);
        ApiService.TaskGetBack({ driverTaskId: driverTaskId })
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


    const cancelTask = useDebouncedCallback((event) => {
        setShowSpinner(true);
        ApiService.CancelTask({ driverTaskId: driverTaskId })
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
        ApiService.RestoreTask({ driverTaskId: driverTaskId })
            .then(({ data }) => {
                alert("Статус обновлен");
                setReload(reload + 1);
            })
            .catch((error) => {
                setError(error.response.data.message);
            });

    }, 500);

    const handleSubmitNote = useDebouncedCallback((event) => {
        event.preventDefault();
        setShowSpinner(true);

        for (var key of formData.keys()) {
            if (key !== "Files")
                formData.delete(key)
        };

        formData.append("DriverTaskId", driverTask.id);
        formData.append("UpdatedStatus", status);
        formData.append("Note", note);

        ApiService.SubmitNoteAsync(formData)
            .then(({ data }) => {
                alert("Статус обновлен");
                setFormData(new FormData());
                clearFileInput(document.getElementById("imageFileInput"));
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

        formData.append("DriverTaskId", driverTask.id);
        formData.append("UpdatedStatus", status + 1);
        formData.append("Note", note);
        formData.append("Transporter", transporter);

        if (status === 4 && validate()) {

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

            ApiService.startTn(formData)
                .then(({ data }) => {
                    alert("Статус обновлен");
                    setReload(reload + 1);
                    setFormData(new FormData());
                    setLoadVolume("");
                    setNote("");
                    clearFileInput(document.getElementById("imageFileInput"));
                    setShowSpinner(false);
                })
                .catch((error) => {
                    if (error.response.data) {
                        setError(error.response.data);

                        setShowSpinner(false);
                    }
                });
            return;
        }

        if (status === 7 && validate()) {
            formData.append("UnloadVolume", unloadVolume && unloadVolume.replace(',','.'));
            formData.append("UnloadVolume2", unloadVolume2 && unloadVolume2.replace(',', '.'));
            formData.append("UnloadUnit", unloadUnit);
            formData.append("UnloadUnit2", unloadUnit2);
            formData.append("LocationBId", addressB.id);
            formData.append("DropOffArrivalDate", pickupArrivalDate.toUTCString());
            formData.append("DropOffDepartureDate", pickupDepartureDate.toUTCString());

            ApiService.finalizeTn(formData)
                .then(({ data }) => {
                    alert("Статус обновлен");
                    setFormData(new FormData());
                    setTnNumber("");
                    setNote("");
                    setReload(reload + 1);
                    setShowSpinner(false);
                    clearFileInput(document.getElementById("imageFileInputTN"));
                    clearFileInput(document.getElementById("imageFileInputTN2"));

                })
                .catch((error) => {
                    if (error.response.data) {
                        setError(error.response.data);

                        setShowSpinner(false);
                    }
                });

            return;
        }

            if (validate()) {
                ApiService.EditDriverTaskAsync(formData)
                    .then(({ data }) => {
                        alert("Статус обновлен");
                        setFormData(new FormData());
                        setTnNumber("");
                        setNote("");
                        setReload(reload + 1);
                        setShowSpinner(false);
                    })
                    .catch((error) => {
                        if (error.response.data) {
                            setError(error.response.data);
                            setShowSpinner(false);
                        }
                    });
            }
        
        setShowSpinner(false);
    }, 500);

    const validate = () => {
        setValidated(true);
        var isValid = true;
        if (status === 4) {
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

            if (loadVolume.length === 0) {
                isValid = false;
            }

            if (unit === "none") {
                isValid = false;
            }

            if (Object.keys(addressA).length === 0) {
                isValid = false;
            }
        }

        if (status === 7) {
            if (Object.keys(addressB).length === 0) {
                isValid = false;
            }

            if (unloadVolume.length === 0) {
                isValid = false;
            }

            if (unloadUnit === "none") {
                isValid = false;
            }


            if (Object.keys(addressB).length === 0) {
                isValid = false;
            }
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
        if (driverTaskId) {
            ApiService.getDriverTaskById(driverTaskId)
                .then(({ data }) => {
                    setDriverTask(data);
                    setDriver(data.driver);
                    setOrder(data.order);
                    setDataFromOrder(data);
                    setStatus(data.status);
                    data.notes.unshift({ status: 0, dateCreated: new Date(data.dateCreated), text: "назначена", s3Links: [] });
                    setNotes(data.notes);
                    setCar(data.car);
                    setCustomer(data.orderCustomer);

                    if (data.status === 4 || data.status === 7) {
                        scrollToTop();
                    }

                }).
                catch((error) => {
                    setError(error.response.data);
                });
        }
        setLoading(false);
    }, [reload]);

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
                data.forEach(t => {
                    if (t.clientName.includes('ЛСР Базовые') || t.clientName.includes('ООО "КарТэк"')) {
                        t.frequentlyUsed = 'Часто используемые';
                    } else {
                        t.frequentlyUsed = 'Все';
                    }
                });

                setClients(data);
            }).
            catch((error) => {
                if (error.response.message) {
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

    const deleteImage = (imagePath, noteId) => {
        var data =
        {
            "NoteId": noteId,
            "UrlToDelete": imagePath
        }

        ApiService.DeleteS3ImageAsync(data)
            .then(({ res }) => {
                alert("Фото удалено");
                setReload(reload + 1);
            }).
            catch((error) => {
                if (error.response.data.message) {
                    setError(error.response.data.message);
                }
            });
    }

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
                        <h1>Задача по заявке {order && order.name} {driverTask.shift === 3 &&
                            <span>,рейс #1</span>}
                        </h1>
                    </div>
                    <div className="col-md-2">
                        <button disabled={status < 4} form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleEditTnOpen(e) }}>
                            ТН
                        </button>
                        {!driverTask.isCanceled ?
                            <button disabled={status >= 10} form="profile-form" className="btn btn-danger mt-2" onClick={(e) => { cancelTask(e) }}>
                                Отменить задачу
                            </button>
                            :
                            <button onClick={() => restoreTask()} className="btn btn-success mt-2">Возобновить</button>
                        }
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

                    <dt className="col-sm-3">Заказчик: </dt>
                    <dd className="col-sm-9">{customer.clientName}</dd>

                    {order.density &&
                    <>
                        <dt className="col-sm-3">Насыпной коэффициент: </dt>
                        <dd className="col-sm-9">{order.density}</dd>
                    </>}

                    <dt className="col-sm-3">Себестоимость перевозки:</dt>
                    <dd className="col-sm-9">{driverTask.price}</dd>

                    <dt className="col-sm-3">Транспорт :</dt>
                    <dd className="col-sm-9">По заявке назначено {order.driverTasks && order.driverTasks.length} а.м. Гос.номера: {order.driverTasks && order.driverTasks.map((dt) => { return (<span>{dt.car.plate}, </span>)})}</dd>

                    <dt className="col-sm-3">Комментарий по заявке:</dt>
                    <dd className="col-sm-9">{order.note}</dd>

                    <dt className="col-sm-3">Комментарий по задаче:</dt>
                    <dd className="col-sm-9">{driverTask.adminComment}</dd>


                </dl>
                {status === 4 &&
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
                                options={clients.sort((a, b) => b.frequentlyUsed.localeCompare(a.frequentlyUsed))}
                                groupBy={(option) => option.frequentlyUsed}
                                defaultValue={go}
                                value={go}
                                disablePortal
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
                                options={clients.sort((a, b) => b.frequentlyUsed.localeCompare(a.frequentlyUsed))}
                                defaultValue={gp}
                                value={gp}
                                groupBy={(option) => option.frequentlyUsed}
                                disablePortal
                                onChange={(e, newvalue) => { setGp(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.clientName}`}
                                renderInput={(params) => <TextField {...params} label="Список юр.лиц" />} />
                            {/*    {driverTask.order.client.name}*/}
                        </div>

                        <div className="form-group col-md-6">
                            <label>Перевозчик (6)</label>
                            <input
                                className={validated && transporter.length === 0 ? "form-control not-valid-input-border" : "form-control"}
                                type="text"
                                form="profile-form"
                                onChange={(e) => setTransporter(e.target.value)}
                                value={transporter} />
                        </div>

                        <div className="form-group col-md-6">
                            <button className="btn btn-success mt-2" onClick={(e) => { handleClickOpen(e) }}>
                                Добавить юр.лицо
                            </button>
                        </div>

                        <div className="form-row">
                            <label>Тип груза (3)</label>
                            <Autocomplete
                                renderOption={(props, item) => ( <li {...props} key={item.id}>{item.name}</li>)}
                                className={checkObjectKeys(material) ? "not-valid-input-border" : ""}
                                options={materialsList}
                                defaultValue={material}
                                value={material}
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
                                defaultValue={addressA}
                                value={addressA}
                                onChange={(e, newvalue) => { setAddressA(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.textAddress}`}
                                renderInput={(params) => <TextField {...params} label="Список адресов" />} />

                            <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleAddressOpen(e) }}>
                                Добавить адрес
                            </button>
                        </div>

                        <div className="input-group mb-3 col-md-6 pl-1">
                            <label>Дата прибытия на адрес погрузки</label>
                            <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={pickupArrivalDate} onChange={(date) => { setPickupArrivalDate(date) }} />
                        </div>

                        <div className="input-group mb-3 col-md-6 pl-1">
                            <label>Дата выезда с адреса погрузки</label>
                            <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={pickupDepartureDate} onChange={(date) => { setPickupDepartureDate(date) }} />
                        </div>

                    </div>}

                {status === 7 &&
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Объем выгрузки</label>

                            <div className="row">
                                <div className="col-md-5">
                                    <label>M3</label>
                                    <input
                                        placeholder="М3"
                                        className={validated && loadVolume.length === 0 ? "form-control not-valid-input-border" : "form-control"}
                                        type="number"
                                        step="0.1"
                                        form="profile-form"
                                        onChange={(e) => updateVolume(setUnloadVolume, e.target.value)}
                                        value={unloadVolume} />
                                </div>

                                <div className="col-md-5">
                                    <label>Тонны</label>
                                    <input
                                        placeholder="Тонны"
                                        className={validated && loadVolume2.length === 0 ? "form-control not-valid-input-border" : "form-control"}
                                        type="number"
                                        step="0.1"
                                        form="profile-form"
                                        onChange={(e) => updateVolume(setUnloadVolume2, e.target.value)}
                                        value={unloadVolume2} />
                                </div>

                                <div className="col-md-2">
                                    <button className="btn btn-success">Пересчитать</button>
                                </div>
                            </div>
                        </div>

                        <div className="form-group col-md-6">
                            <label>Адрес выгрузки (10)</label>
                            <Autocomplete
                                className={checkObjectKeys(addressB) ? "not-valid-input-border" : ""}
                                options={addresses}
                                disablePortal
                                defaultValue={addressB}
                                value={addressB}
                                onChange={(e, newvalue) => { setAddressB(newvalue) }}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => `${option.textAddress}`}
                                renderInput={(params) => <TextField {...params} label="Список адресов" />} />
                        </div>

                        <div className="input-group mb-3 col-md-6 pl-1">
                            <label>Дата прибытия на адрес выгрузки</label>
                            <DatePicker locale="ru" dateFormat="dd.MM.yyyy"
                                selected={pickupArrivalDate} onChange={(date) => { setPickupArrivalDate(date) }} />
                        </div>

                        <div className="input-group mb-3 col-md-6 pl-1">
                            <label>Дата выезда с адреса выгрузки</label>
                            <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={pickupDepartureDate} onChange={(date) => { setPickupDepartureDate(date) }} />
                        </div>

                    </div>}
                <div>
                    {status === 7 &&
                        <>
                            <div className="row mt-3 mb-3">
                            <div className="col-md-9">
                                <div className="alert alert-danger" role="alert">
                                    ПРИКРЕПИТЬ ФОТО C 1 СТОРОНЫ
                                    <div className="row">
                                        <div className="col-md-12">
                                            <input type="file" id="imageFileInputTN" accept=".jpg, .png, .PNG ,.jpeg" multiple onChange={(e) => selectFile(e)}></input>
                                            {hasFiles("imageFileInputTN") && <IconButton onClick={(e) => clearFileInputById("imageFileInputTN")} aria-label="delete">
                                                <i className="fa fa-cancel" aria-hidden="true"></i>  </IconButton>}
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
                                            <input type="file" id="imageFileInputTN2" accept=".jpg, .png, .PNG ,.jpeg" multiple onChange={(e) => selectFile2(e)}></input>
                                            {hasFiles("imageFileInputTN2") &&
                                                <IconButton onClick={(e) => clearFileInputById("imageFileInputTN2")} aria-label="delete">
                                                    <i className="fa fa-xmark" aria-hidden="true"></i>  </IconButton>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </>}
                </div>
                <div className="row mt-3">
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
                                                                return (<div key={linkindex}>
                                                                    <a target="_blank" href={fullLink}>Изображение {linkindex + 1}</a>
                                                                    <IconButton onClick={(e) => deleteImage(link, note.id)} aria-label="delete">
                                                                        <i className="fa fa-trash" aria-hidden="true"></i>                                                                    </IconButton>
                                                                </div>);
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
                                        {hasFiles("imageFileInput") && 
                                            <IconButton onClick={(e) => clearFileInputById("imageFileInput")} aria-label="delete">
                                            <i className="fa fa-close" aria-hidden="true"></i>  </IconButton>}

                                        <input type="file" id="imageFileInput" accept="image/*" multiple onChange={(e) => selectFile(e)}></input>

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

                            {status > 0 &&
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="col-md-3">
                                            <button type="submit" onClick={handleConfirmationOpen} className="btn btn-danger mt-3">
                                                На шаг назад
                                            </button>
                                        </div>
                                    </div>
                                </div>}


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

                {status === 9 && driverTask.shift === 3 && driverTask.subTasksCount < 1 &&
                    <>
                    <div className="row">
                            <div className="col-md-12">
                                <button type="submit" onClick={handleConfirmationOpen} className="btn btn-danger mt-3">
                                    На шаг назад
                                </button>
                            </div>
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
            <EditTn driverTaskId={driverTaskId} handleClose={handleEditTnClose}></EditTn>
        </Dialog>
    </div>
};

export default DriverEditTask;
