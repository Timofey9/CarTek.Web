import React, { useEffect, useState } from 'react';
import ApiService from "../../services/cartekApiService";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import { useDebouncedCallback } from 'use-debounce';
registerLocale('ru', ru);

function EditTn({ driverTaskId, isSubTask, handleClose }) {
    const [error, setError] = useState("");
    const [reload, setReload] = useState(0);
    const [unit, setUnit] = useState("none");
    const [unit2, setUnit2] = useState("none");
    const [unloadUnit, setUnloadUnit] = useState("none");
    const [unloadUnit2, setUnloadUnit2] = useState("none");
    const [gp, setGp] = useState({});
    const [go, setGo] = useState({});
    const [material, setMaterial] = useState({});
    const [addressA, setAddressA] = useState({});
    const [addressB, setAddressB] = useState({});
    const [message, setMessage] = useState("");
    const [tnNumber, setTnNumber] = useState("");
    const [loadVolume, setLoadVolume] = useState(0);
    const [loadVolume2, setLoadVolume2] = useState(0);
    const [unloadVolume, setUnloadVolume] = useState(0);
    const [unloadVolume2, setUnloadVolume2] = useState(0);
    const [pickupArrivalTime, setPickupArrivalTime] = useState(new Date());
    const [pickupDepartureTime, setPickupDepartureTime] = useState(new Date());
    const [dropOffArrivalTime, setDropOffArrivalTime] = useState(new Date());
    const [dropOffDepartureTime, setDropOffDepartureTime] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [materialsList, setMaterialsList] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [formData, setFormData] = useState(new FormData());

    const stringToUnit = (unit) => {
        switch (unit) {
            case 'm3':
                return '0';
            case 'тн':
                return '1';
            default:
                return "m3";
        }
    }

    const handleSubmit = useDebouncedCallback((event) => {
            var lv = loadVolume && loadVolume.replace(',', '.');
            var lv2 = loadVolume2 ? loadVolume.replace(',', '.') : 0;
            var unlv = unloadVolume && unloadVolume.replace(',', '.');
            var unlv2 = unloadVolume2 ? unloadVolume2.replace(',', '.') : 0;

            formData.append("IsSubtask", isSubTask === undefined ? "false" : "true");
            formData.append("SubTaskId", driverTaskId);
            formData.append("DriverTaskId", driverTaskId);
            formData.append("MaterialId", material.id);
            formData.append("Number", tnNumber);
            formData.append("GoId", go.id);
            formData.append("GpId", gp.id);
            formData.append("LoadVolume", lv);
            formData.append("Unit", unit);
            formData.append("LoadVolume2", lv2);
            formData.append("Unit2", unit2);
            formData.append("LocationAId", addressA.id);
            formData.append("PickUpArrivalDate", pickupArrivalTime.toUTCString());
            formData.append("PickUpDepartureDate", pickupDepartureTime.toUTCString());
            formData.append("UnloadVolume", unlv);
            formData.append("UnloadVolume2", unlv2);
            formData.append("UnloadUnit", unloadUnit);
            formData.append("UnloadUnit2", unloadUnit2);
            formData.append("LocationBId", addressB.id);
            formData.append("DropOffArrivalDate", dropOffArrivalTime.toUTCString());
            formData.append("DropOffDepartureDate", dropOffDepartureTime.toUTCString());

            ApiService.updateTn(formData)
                .then(({ data }) => {
                    alert("ТН обновлена");
                    handleClose();
                    setReload(reload + 1);
                })
                .catch((error) => {
                    setFormData(new FormData());
                    if (error.response.data) {
                        setError(error.response.data.message);
                    }
                });
    }, 500);


    useEffect(() => {
        setLoading(true);
        ApiService.getMaterials()
            .then(({ data }) => {
                setMaterialsList(data);
            }).
            catch((error) => {
                if (error.response.data.message) {
                    setMessage(error.response.data);
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
        ApiService.viewEditTN(driverTaskId, isSubTask)
            .then(({ data }) => {
                setTnNumber(data.number);
                setMaterial(data.material);
                setLoadVolume(data.loadVolume);
                setLoadVolume2(data.loadVolume2);
                setUnloadVolume(data.unloadVolume);
                setUnloadVolume2(data.unloadVolume2);
                setUnit(stringToUnit(data.unit));
                setUnit2(stringToUnit(data.unit2));
                setUnloadUnit(stringToUnit(data.unloadUnit));
                setUnloadUnit2(stringToUnit(data.unloadUnit2));
                setAddressA(data.locationA);
                setAddressB(data.locationB);

                if (data.pickUpArrivalTime) {
                    var date1 = data.pickUpArrivalTime.split('.');
                    var gg = new Date(date1[2] + '-' + date1[1] + '-' + date1[0]);
                    setPickupArrivalTime(gg);
                }
                if (data.pickUpDepartureTime) {
                    var date1 = data.pickUpDepartureTime.split('.');
                    setPickupDepartureTime(new Date(date1[2] + '-' + date1[1] + '-' + date1[0]));
                }
                if (data.dropOffArrivalTime) {
                    var date1 = data.dropOffArrivalTime.split('.');
                    setDropOffArrivalTime(new Date(date1[2] + '-' + date1[1] + '-' + date1[0]));
                }
                if (data.dropOffDepartureTime) {
                    var date1 = data.dropOffDepartureTime.split('.');
                    setDropOffDepartureTime(new Date(date1[2] + '-' + date1[1] + '-' + date1[0]));
                }
                setGp(data.gp);
                setGo(data.go);
            }).
            catch((error) => {
                setError(error.response.data);
            });
        setLoading(false);
    }, [reload]);

    return (
        <div className="m-5">
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    {error}
                </div>
            </div>

            <h1 className="mt-3">Информация по задаче</h1>

            <div className="form-row">
                <div className="form-group col-md-6">
                    <label className="bold-label">Номер ТН</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        value={tnNumber}
                        onChange={(e) => setTnNumber(e.target.value)}
                    />
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Грузоотправитель (1)</label>
                    <Autocomplete
                        options={clients}
                        defaultValue={go}
                        value={go}
                        disablePortal
                        onChange={(e, newvalue) => { setGo(newvalue) }}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => `${option.clientName}`}
                        renderInput={(params) => <TextField {...params} label="Список юр.лиц" />}>
                    </Autocomplete>
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Грузополучатель (2)</label>
                    <Autocomplete
                        options={clients}
                        defaultValue={gp}
                        value={gp}
                        disablePortal
                        onChange={(e, newvalue) => { setGp(newvalue) }}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => `${option.clientName}`}
                        renderInput={(params) => <TextField {...params} label="Список юр.лиц" />}>
                    </Autocomplete>
                </div>

                <div className="form-row">
                    <label className="bold-label">Тип груза (3)</label>
                    <Autocomplete
                        options={materialsList}
                        defaultValue={material}
                        value={material}
                        disablePortal
                        onChange={(e, newvalue) => { setMaterial(newvalue) }}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => `${option.name}`}
                        renderInput={(params) => <TextField {...params} label="Тип груза" />}>
                    </Autocomplete>
                </div>

                <div className="form-group col-md-6">
                    <label>Объем загрузки</label>
                    <input
                        type="number"
                        step="0.1"
                        form="profile-form"
                        onChange={(e) => setLoadVolume(e.target.value)}
                        value={loadVolume} />
                </div>

                <div className="form-group col-md-6">
                    <FormControl>
                        <FormLabel id="radio-buttons-group-label">Ед. измерения</FormLabel>
                        <RadioGroup row
                            aria-labelledby="radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}>
                            <FormControlLabel value="0" control={<Radio />} label="M3" />
                            <FormControlLabel value="1" control={<Radio />} label="Тонны" />
                        </RadioGroup>
                    </FormControl>
                </div>

                <div className="form-group col-md-6">
                    <Accordion>
                        <AccordionSummary
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <Typography>В другой ед. измерения</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="form-group col-md-6">
                                <label>Объем загрузки</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    form="profile-form"
                                    onChange={(e) => setLoadVolume2(e.target.value)}
                                    value={loadVolume2} />
                            </div>

                            <div className="form-group col-md-6">
                                <FormControl>
                                    <FormLabel id="buttons-group-label">Ед. измерения</FormLabel>
                                    <RadioGroup row
                                        aria-labelledby="buttons-group-label"
                                        name="buttons-group"
                                        value={unit2}
                                        onChange={(e) => setUnit2(e.target.value)}>
                                        <FormControlLabel value="0" control={<Radio />} label="M3" />
                                        <FormControlLabel value="1" control={<Radio />} label="Тонны" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Адрес погрузки(8)</label>
                    <Autocomplete
                        options={addresses}
                        defaultValue={addressA}                        
                        value={addressA}
                        disablePortal
                        onChange={(e, newvalue) => { setAddressA(newvalue) }}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => `${option.textAddress}`}
                        renderInput={(params) => <TextField {...params} label="Список адресов" />} />

                </div>

                <div className="input-group mb-3 col-md-6 pl-1">
                    <label>Дата прибытия на адрес погрузки</label>
                    <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={pickupArrivalTime} onChange={(date) => { setPickupArrivalTime(date) }} />
                </div>

                <div className="input-group mb-3 col-md-6 pl-1">
                    <label>Дата выезда с адреса погрузки</label>
                    <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={pickupDepartureTime} onChange={(date) => { setPickupDepartureTime(date) }} />
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Адрес выгрузки (10)</label>
                    <Autocomplete
                        options={addresses}
                        defaultValue={addressB}
                        value={addressB}
                        disablePortal
                        onChange={(e, newvalue) => { setAddressB(newvalue) }}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => `${option.textAddress}`}
                        renderInput={(params) => <TextField {...params} label="Список адресов" />} />                </div>



                <div className="form-group col-md-6">
                    <label>Объем выгрузки</label>
                    <input
                        type="number"
                        step="0.1"
                        form="profile-form"
                        onChange={(e) => setUnloadVolume(e.target.value)}
                        value={unloadVolume} />
                </div>

                <div className="form-group col-md-6">
                    <FormControl>
                        <FormLabel id="radio-buttons-group-label">Ед. измерения</FormLabel>
                        <RadioGroup row
                            aria-labelledby="radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={unloadUnit}
                            onChange={(e) => setUnloadUnit(e.target.value)}>
                            <FormControlLabel value="0" control={<Radio />} label="M3" />
                            <FormControlLabel value="1" control={<Radio />} label="Тонны" />
                        </RadioGroup>
                    </FormControl>
                </div>

                <div className="form-group col-md-6">
                    <Accordion>
                        <AccordionSummary
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <Typography>В другой ед. измерения</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="form-group col-md-6">
                                <label>Объем выгрузки</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    form="profile-form"
                                    onChange={(e) => setUnloadVolume2(e.target.value)}
                                    value={unloadVolume2} />
                            </div>

                            <div className="form-group col-md-6">
                                <FormControl>
                                    <FormLabel id="buttons-group-label">Ед. измерения</FormLabel>
                                    <RadioGroup row
                                        aria-labelledby="buttons-group-label"
                                        name="buttons-group"
                                        value={unloadUnit2}
                                        onChange={(e) => setUnloadUnit2(e.target.value)}>
                                        <FormControlLabel value="0" control={<Radio />} label="M3" />
                                        <FormControlLabel value="1" control={<Radio />} label="Тонны" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>

                <div className="input-group mb-3 col-md-6 pl-1">
                    <label>Дата прибытия на адрес выгрузки</label>
                    <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={dropOffArrivalTime} onChange={(date) => { setDropOffArrivalTime(date) }} />
                </div>

                <div className="input-group mb-3 col-md-6 pl-1">
                    <label>Дата выезда с адреса выгрузки</label>
                    <DatePicker locale="ru" dateFormat="dd.MM.yyyy" selected={dropOffDepartureTime} onChange={(date) => { setDropOffDepartureTime(date) }} />
                </div>

                <div className="btn btn-success" onClick={(e) => handleSubmit(e)}>Обновить</div>
            </div>
        </div>);
}

export default EditTn;
