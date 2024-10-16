import React, { useEffect, useState } from 'react';
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
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import "./orders.css";
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

function OrderForm({ clonedOrder, handleCloseOrderForm }) {
    const [clients, setClients] = useState([]);
    const [client, setClient] = useState({});
    const [gp, setGp] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [addressA, setAddressA] = useState({});
    const [addressB, setAddressB] = useState({});
    const [orderName, setOrderName] = useState("");
    const [loadTime, setLoadTime] = useState("");
    const [materialsList, setMaterialsList] = useState([]);
    const [material, setMaterial] = useState({});
    const [volume, setVolume] = useState("");
    const [loadUnit, setLoadUnit] = useState("none");
    const [startDate, setStartDate] = useState(new Date());
    let datee = new Date();
    datee.setDate(datee.getDate() + 1);
    const [endDate, setEndDate] = useState(datee);
    const [note, setNote] = useState("");
    const [carCount, setCarCount] = useState("");
    const [serviceType, setServiceType] = useState("none");
    const [reload, setReload] = useState(0);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [price, setPrice] = useState("");
    const [materialPrice, setMaterialPrice] = useState("");
    const [mileage, setMileage] = useState("");
    const [open, setOpen] = useState(false);
    const [openAddress, setOpenAddress] = useState(false);
    const [openMaterial, setOpenMaterial] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tasksToCreate, setTasksToCreate] = useState([]);
    const [cars, setCars] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [orderId, setOrderId] = useState(0);
    const [validated, setValidated] = useState(false);
    const [isOrderCreated, setIsOrderCreated] = useState(false);
    const [orderShift, setOrderShift] = useState("");
    const [customer, setCustomer] = useState({});
    const [density, setDensity] = useState();
    const [unitString, setUnitString] = useState("");
    const [isExternal, setIsExternal] = useState(false);
    const [externalOrgs, setExternalOrgs] = useState([]);
    const [externalTransporter, setExternalTransporter] = useState({});
    const [transporterPrice, setTransporterPrice] = useState();
    const [discount, setDiscount] = useState(0);
    const [driverPrice, setDriverPrice] = useState();
    const [reportLoadType, setReportLoadType] = useState('1');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const updateDiscount = (price1, price2) => {
        var disc = price1 - price2;

        setDiscount(disc);
    }

    const unitToString = (unit) => {
        if (unit === undefined) {
            return "";
        }
        switch (unit.toString()) {
            case '0':
                return "m3"
            case '1':
                return "тн";
            default:
                return "";
        }

    }

    const updateUnit = (unit) => {
        setUnitString(unitToString(unit));
        setLoadUnit(unit);
    }

    const updateVolume = (setter, value) => {
        var str = value.toString();
        if (str.length > 1) {
            if (str[1] === ',' || str[1] === '.'
                || str[0] === ',' || str[0] === '.') {
                setter(value);
            } else {
                var newString = str.slice(0, 1) + '.' + str.slice(1);
                setter(newString);
            }

        } else {
            setter(value);
        }
    }

    const updateCustomer = (value) => {
        if (serviceType === "0") {
            if (value.fixedPrice) {
                setPrice(value.fixedPrice.toString());
                value.unit = "";
            }
            setCustomer(value);
        } else {
            if (value.fixedPrice) {
                setPrice(value.fixedPrice.toString());
                value.unit = "";
            }
            setCustomer(value);
        }
    }

    const shiftToShortString = (shift) => {
        switch (shift) {
            case '0':
                return "Ночь";
            case '1':
                return "День";
            case '2':
                return "Сутки";
            case '3':
                return "Сутки неограниченно";
            default:
                return shift;
        }
    }

    const updateShiftInName = (newShift) => {
        var newS = shiftToShortString(newShift);
        var oldS = shiftToShortString(orderShift);
        if (oldS !== '' && orderName.includes(oldS)) {
            var newName = orderName.replace(oldS, newS);
            setOrderName(newName);
        } else {
            var newName2 = orderName + " " + shiftToShortString(newShift);
            setOrderName(newName2)
        }
    }

    const updateAddressInName = (newAddress) => {
        if (newAddress === null) {
            var newName = orderName.replace(addressB.textAddress, "");
            setOrderName(newName);
            return;
        }

        if (addressB && orderName.includes(addressB.textAddress)) {
            var newName = orderName.replace(addressB.textAddress, newAddress.textAddress);
            setOrderName(newName);
        } else {
            var newName2 = orderName + " " + newAddress.textAddress;
            setOrderName(newName2);
        }
    }

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

        if (serviceType === "none") {
            valid = false;
        }

        if (Object.keys(client).length === 0) {
            valid = false;
        }

        if (Object.keys(gp).length === 0) {
            valid = false;
        }

        if (Object.keys(addressA).length === 0) {
            valid = false;
        }

        if (Object.keys(addressB).length === 0) {
            valid = false;
        }

        if (price.length === 0) {
            valid = false;
        }


        //if (Object.keys(material).length === 0) {
        //    valid = false;
        //}

        if (carCount === 0) {
            valid = false;
        }
        if (!valid) {
            setMessage("Не все обязательные поля заполнены")
        }

        return valid;
    }

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

    useEffect(() => {
        setLoading(true);
        ApiService.getExternalTransporters()
            .then(({ data }) => {
                setExternalOrgs(data);
            });

        setLoading(false);
    }, [reload]);

    useEffect(() => {
        if (clonedOrder !== undefined) {
            setOrderName(clonedOrder.name);
            setServiceType(clonedOrder.service);

            if (addresses.length > 0) {
                var locA = addresses.find(t => t.id == clonedOrder.locationAId);
                setAddressA(locA);

                var locB = addresses.find(t => t.id == clonedOrder.locationBId);
                setAddressB(locB);
            }

            var clonedCustomer = clonedOrder.service === '0' ? clonedOrder.client : clonedOrder.gp;

            updateCustomer(clonedCustomer);

            setClient(clonedOrder.client);
            setDensity(clonedOrder.density);
            setGp(clonedOrder.gp);
            setMaterial(clonedOrder.material);
            setCarCount(clonedOrder.carCount);
            setNote(clonedOrder.note);
            setMileage(clonedOrder.mileage ?? 0);
            setPrice(clonedOrder.price ?? 0);
            setMaterialPrice(clonedOrder.materialPrice ?? 0);
            setVolume(clonedOrder.volume ?? 0);
            setLoadUnit(clonedOrder.loadUnit);
            setUnitString(unitToString(clonedOrder.loadUnit));
            setOrderShift(clonedOrder.shift.toString() ?? '0');
            setExternalTransporter(clonedOrder.externalTransporter);
            setTransporterPrice(clonedOrder.transporterPrice);
            setIsExternal(clonedOrder.isExternal);
            setDriverPrice(clonedOrder.driverPrice);
            setLoadTime(clonedOrder.loadTime);
            setReportLoadType(clonedOrder.reportLoadType);
        }
    }, [addresses]);

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
            shift: orderShift,
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
            price: price,
            materialPrice: materialPrice,
            density: density,
            reportLoadType: reportLoadType,
            loadTime: loadTime
        };

        if (isExternal) {
            newOrder.isExternal = isExternal;
            newOrder.externalPrice = transporterPrice;
            newOrder.externalTransporterId = externalTransporter.id;
            newOrder.discount = discount;
        }
        else {
            newOrder.driverPrice = driverPrice;
            newOrder.discount = price - driverPrice;
        }

        if (validate()) {
            ApiService.createOrder(newOrder)
                .then(({ data }) => {
                    alert(`Заявка создана`);
                    let array = [];
                    for (let i = 0; i < carCount; i++) {
                        array.push({ car: {}, driver: {}, taskDate: startDate, shift: orderShift });
                    }
                    setOrderId(data.message);
                    setIsOrderCreated(true);
                    setTasksToCreate(array);
                }).
                catch((error) => {
                    if (error.response && error.response.data.message) {
                        setMessage(error.response.data.message);
                    }
                    alert("Ошибка создания заявки " + error);
                });
        }
    }

    const checkObjectKeys = (obj) => {
        if (obj !== null && obj !== undefined) {
            return validated && Object.keys(obj).length === 0;
        }

        return validated;
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
                        <ShiftRadioButtonGroup value={orderShift} onChange={(event) => { updateShiftInName(event.target.value); setOrderShift(event.target.value) }} />
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

                    <div className="form-group col-md-6">
                        <label>Адрес погрузки (8)</label>
                        <Autocomplete
                            className={checkObjectKeys(addressA) ? "not-valid-input-border" : ""}
                            options={addresses}
                            disablePortal
                            onChange={(e, newvalue) => { setAddressA(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.textAddress}`}
                            renderInput={(params) => <TextField {...params} label="Список адресов" />} />
                        <label>{addressA && addressA.textAddress}</label>

                        <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleAddressOpen(e) }}>
                            Добавить адрес
                        </button>
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
                        <div>{material && material.name}</div>

                        <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleMaterialOpen(e) }}>
                            Добавить тип груза
                        </button>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Грузоотправитель (1)</label>
                        <Autocomplete
                            className={checkObjectKeys(client) ? "not-valid-input-border" : ""}
                            options={clients}
                            disablePortal
                            onChange={(e, newvalue) => { setClient(newvalue); updateCustomer(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.clientName}`}
                            isOptionEqualToValue={(o, v) => o === v.clientName}
                            renderInput={(params) => <TextField {...params} label="Список юр.лиц" />} />
                        {client && client.clientName}
                    </div>

                    <div className="form-group col-md-6">
                        <label>Грузополучатель (2)</label>
                        <Autocomplete
                            className={checkObjectKeys(gp) ? "not-valid-input-border" : ""}
                            options={clients}
                            disablePortal
                            onChange={(e, newvalue) => { setGp(newvalue); updateCustomer(newvalue) }}
                            sx={{ width: 300 }}
                            getOptionLabel={(option) => `${option.clientName}`}
                            renderInput={(params) => <TextField {...params} label="Список юр.лиц" />} />
                        {gp && gp.clientName}
                    </div>

                    <div className="form-group col-md-6">
                        <button className="btn btn-success mt-2" onClick={(e) => { handleClickOpen(e) }}>
                            Добавить юр.лицо
                        </button>
                    </div>


                    <div className="form-group col-md-6">
                        <div className="row">
                            <div className="col-md-6">
                                <label>Адрес выгрузки (10)</label>
                                <Autocomplete
                                    className={checkObjectKeys(addressB) ? "not-valid-input-border" : ""}
                                    options={addresses}
                                    disablePortal
                                    onChange={(e, newvalue) => { updateAddressInName(newvalue); setAddressB(newvalue) }}
                                    sx={{ width: 300 }}
                                    getOptionLabel={(option) => `${option.textAddress}`}
                                    renderInput={(params) => <TextField {...params} label="Список адресов" />} />

                                <label>{addressB && addressB.textAddress}</label>

                                <button form="profile-form" className="btn btn-success mt-2" onClick={(e) => { handleAddressOpen(e) }}>
                                    Добавить адрес
                                </button>
                            </div>

                            <div className="col-md-6">
                                <label>Время приемки на адресе</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    form="profile-form"
                                    onChange={(e) => setLoadTime(e.target.value)}
                                    value={loadTime}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="form-group col-md-6">
                        <label>Объем (общий)</label>
                        <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => setVolume(e.target.value)}
                            value={volume}
                        />
                    </div>

                    <div className="form-group col-md-6">
                        <div>
                            <label>Единица измерения</label>
                            <select className="form-select" value={loadUnit} aria-label="Единица измерения" onChange={(e) => updateUnit(e.target.value)}>
                                <option value="none">Единица измерения</option>
                                <option value="0">М3</option>
                                <option value="1">тонны</option>
                            </select>
                        </div>

                    </div>

                    <div className="form-group col-md-6">
                        <FormControl>
                            <FormLabel id="radio-buttons-group-label">Отчетность по загрузке/выгрузке</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="radio-buttons-group-label"
                                name="radio-buttons-group"
                                value={reportLoadType}
                                onChange={(e) => setReportLoadType(e.target.value)}>
                                <FormControlLabel value="0" control={<Radio />} label="Загрузка" />
                                <FormControlLabel value="1" control={<Radio />} label="Выгрузка" />
                            </RadioGroup>
                        </FormControl>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Насыпной коэффициент</label>
                        <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => updateVolume(setDensity, e.target.value)}
                            value={density}
                        />
                    </div>

                </div>

                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Комментарий по заявке (общий)</label>
                        <textarea
                            col="40"
                            rows="3"
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
                        <label>Себестоимость перевозки КарТэк руб/{unitString}</label>
                        <input
                            type="text"
                            className={validated && price.length === 0 ? "form-control not-valid-input-border" : "form-control"}
                            form="profile-form"
                            onChange={(e) => { setPrice(e.target.value); updateDiscount(e.target.value, transporterPrice); }}
                            value={price} />
                    </div>

                    {isExternal &&
                        <>
                            <div className="form-row">
                                <label>Выберите перевозчика</label>
                                <Autocomplete
                                    options={externalOrgs}
                                    disablePortal   
                                    onChange={(e, newvalue) => { setExternalTransporter(newvalue) }}
                                    id="combo-box-demo"
                                    sx={{ width: 300 }}
                                    getOptionLabel={(option) => `${option.name}`}
                                    renderInput={(params) => <TextField {...params} label="Список перевозчиков" />} />
                            </div>

                            <div className="form-group col-md-6">
                            <label>Себестоимость перевозки {externalTransporter && externalTransporter.name}</label>
                                <input
                                    type="text"
                                    className={validated && transporterPrice.length === 0 ? "form-control not-valid-input-border" : "form-control"}
                                    form="profile-form"
                                    onChange={(e) => { setTransporterPrice(e.target.value); updateDiscount(price, e.target.value); }}
                                    value={transporterPrice} />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Дисконт</label>
                                <input
                                    type="text"
                                    disabled
                                    className="form-control"
                                    form="profile-form"
                                    value={discount} />
                            </div>
                        </>
                    }

                    {!isExternal &&
                        <div className="form-group col-md-6">
                            <label>Себестоимость перевозки (Водитель) руб/{unitString}</label>
                            <input
                                type="text"
                                className="form-control"
                                form="profile-form"
                                onChange={(e) => { setDriverPrice(e.target.value); }}
                                value={driverPrice} />
                        </div>
                    }

                    <div className="form-group col-md-6">
                        <label>Себестоимость материала руб/{unitString}</label>
                        <input
                            type="text"
                            className="form-control"
                            form="profile-form"
                            onChange={(e) => { setMaterialPrice(e.target.value);  }}
                            value={materialPrice} />
                    </div>

                    <div className="form-group col-md-6">
                        <FormControlLabel required control={<Checkbox checked={isExternal}
                            onChange={(e) => setIsExternal(e.target.checked)} />} label="Наемный перевозчик" />
                    </div>

                    <div className="form-group col-md-6">
                        <label>Количество машин</label>
                        <input
                            className={validated && carCount === '' ? "form-control not-valid-input-border" : "form-control"}
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
                                            getOptionLabel={(option) => `${option.isExternal ? option.fullName + "(наём)" : option.fullName}`}
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
                                        <textarea
                                            col="40"
                                            rows="5"
                                            type="text"
                                            className="form-control"
                                            onChange={(e) => task.comment = e.target.value}
                                            value={task.comment} />
                                    </div>

                                    <div key={"shift" + index} className="col-md-6">
                                        <ShiftRadioButtonGroup value={task.shift} onChange={(event) => {
                                            task.shift = event.target.value; setReload(reload + 1);
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