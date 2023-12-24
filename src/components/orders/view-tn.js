import React, { useEffect, useState } from 'react';
import ApiService from "../../services/cartekApiService";
import { useDebouncedCallback } from 'use-debounce';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import EditTn from './edit-tn.component'
import Divider from '@mui/material/Divider';
import "./orders.css";

function ViewTn({ driverTaskId, isSubTask, handleClose }) {
    const [error, setError] = useState("");
    const [reload, setReload] = useState(0);
    const [unit, setUnit] = useState("none");
    const [unit2, setUnit2] = useState("none");
    const [unloadUnit, setUnloadUnit] = useState("none");
    const [unloadUnit2, setUnloadUnit2] = useState("none");
    const [originalReceived, setOriginalReceived] = useState(false);
    const [material, setMaterial] = useState();
    const [addressA, setAddressA] = useState("");
    const [addressB, setAddressB] = useState("");
    const [message, setMessage] = useState("");
    const [tnNumber, setTnNumber] = useState("");
    const [loadVolume, setLoadVolume] = useState(0);
    const [loadVolume2, setLoadVolume2] = useState(0);
    const [unloadVolume, setUnloadVolume] = useState(0);
    const [unloadVolume2, setUnloadVolume2] = useState(0);
    const [goInfo, setGoInfo] = useState("");
    const [gpInfo, setGpInfo] = useState("");
    const [pickupArrivalTime, setPickupArrivalTime] = useState("");
    const [pickupDepartureTime, setPickupDepartureTime] = useState("");
    const [dropOffArrivalTime, setDropOffArrivalTime] = useState("");
    const [dropOffDepartureTime, setDropOffDepartureTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [openEditTn, setOpenEditTn] = useState(false);
    const [openEditSubTn, setOpenEditSubTn] = useState(false);
    const [s3Links, setS3Links] = useState([]);
    const [transporter, setTransporter] = useState("");

    useEffect(() => {
        setLoading(true);
        ApiService.viewTN(driverTaskId, isSubTask)
            .then(({ data }) => {
                setOriginalReceived(data.isOriginalReceived);
                setTnNumber(data.number);
                setGoInfo(data.goInfo);
                setGpInfo(data.gpInfo);
                setMaterial(data.material);
                setLoadVolume(data.loadVolume);
                setLoadVolume2(data.loadVolume2);
                setUnloadVolume(data.unloadVolume);
                setUnloadVolume2(data.unloadVolume2);
                setUnit(data.unit);
                setUnit2(data.unit2);
                setUnloadUnit(data.unloadUnit);
                setUnloadUnit2(data.unloadUnit2);
                setAddressA(data.locationA);
                setAddressB(data.locationB);
                setPickupArrivalTime(data.pickUpArrivalTime);
                setPickupDepartureTime(data.pickUpDepartureTime);
                setDropOffArrivalTime(data.dropOffArrivalTime);
                setDropOffDepartureTime(data.dropOffDepartureTime);
                setS3Links(data.s3Links);

                if (data.transporter && data.transporter.length > 0) {
                    setTransporter(data.transporter);
                } else {
                    setTransporter("ООО \"КарТэк\"");
                }
            }).
            catch((error) => {
                setError(error.response.data);
            });
        setLoading(false);
    }, [reload]);

    const handleEditTnClose = () => {
        setOpenEditTn(false);
    }

    const handleEditTnOpen = () => {
        if (isSubTask) {
            setOpenEditSubTn(true);
        } else {
            setOpenEditTn(true);
        }
    }


    const handleEditSubTnClose = () => {
        setOpenEditSubTn(false);
    }

    const handleEditSubTnOpen = () => {
        setOpenEditSubTn(true);
    }

    const handleSubmit = useDebouncedCallback((event) => {
        var data = {
            driverTaskId: driverTaskId,
            isSubTask: isSubTask,
            isOriginalReceived: originalReceived
        }

        ApiService.verifyTn(data)
            .then(({ res }) => {
                alert("ТН подтверждена");
                handleClose();
                setReload(reload + 1);
            })
            .catch((error) => {
                if (error.response.data) {
                    setError(error.response.data.message);
                }
            });
    }, 500);

    return (
        <div className="m-5">
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    {error}
                </div>
            </div>

            <div className="row">
                <div col-md-6>
                    <h1 className="mt-3">Информация по ТН</h1>
                </div>

                <div col-md-6>
                    <button onClick={handleEditTnOpen} className="btn btn-warning">Редактировать</button>
                </div>
            </div>

            <div className="form-row">
                {s3Links && s3Links.length > 0 &&
                    <div className="form-group col-md-6">
                        <label className="bold-label">Фото</label>
                        {s3Links.map((link, linkindex) => {
                            const fullLink = "https://storage.yandexcloud.net/" + link;

                            return (
                            <div>
                                <a target="_blank" href={fullLink}>Фото {linkindex + 1}</a>
                            </div>);
                        })}
                    </div>
                }

                <div className="form-group col-md-6">
                    <label className="bold-label">Номер ТН</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        value={tnNumber} />
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Грузоотправитель (1)</label>
                    <label>{goInfo}</label>
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Грузополучатель (2)</label>
                    <label>{gpInfo}</label>
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Перевозчик (6)</label>
                    <label>{transporter}</label>
                </div>

                <div className="form-row">
                    <label className="bold-label">Тип груза (3)</label>
                    <label>{material}</label>
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Объем загрузки</label>
                    <label>{loadVolume} {unit} {loadVolume2 > 0 ? loadVolume2 : ""} {loadVolume2 > 0 ? unit2 : ""}</label>
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Прием груза (8)</label>
                    <label>{addressA}</label>
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Выдача груза (10)</label>
                    <label>{addressB}</label>
                </div>

                <div className="form-group mb-3 col-md-6 pl-1">
                    <label className="bold-label">Время прибытия на склад погрузки</label>
                    <label>{pickupArrivalTime}</label>
                </div>

                <div className="form-group mb-3 col-md-6 pl-1">
                    <label className="bold-label">Время выезда со склада погрузки</label>
                    <label>{pickupDepartureTime}</label>
                </div>


                <div className="form-group col-md-6">
                    <label className="bold-label">Объем выгрузки</label>
                    <label>{unloadVolume} {unloadUnit} {unloadVolume2 > 0 ? unloadVolume2 : ""} {unloadVolume2 > 0 ? unloadUnit2 : ""}</label>
                </div>

                <div className="form-group mb-3 col-md-6 pl-1">
                    <label className="bold-label">Время прибытия на склад выгрузки</label>
                    <label>{dropOffArrivalTime}</label>
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Время выезда со склада выгрузки</label>
                    <label>{dropOffDepartureTime}</label>
                </div>

                <div className="form-group col-md-6">
                    <Divider className="mt-3" sx={{ borderBottomWidth: 3 }, { bgcolor: "black" }}></Divider>

                    <FormControlLabel required control={<Checkbox checked={originalReceived}
                        onChange={(e) => setOriginalReceived(e.target.checked)} />} label="Оригинал получен" />
                </div>

                <div className="form-group col-md-6 mt-3">
                    <button onClick={handleSubmit} className="btn btn-success">Подтвердить</button>
                </div>

            </div>
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

            <Dialog
                fullScreen
                open={openEditSubTn}
                onClose={handleEditSubTnClose}>
                <AppBar sx={{ bgcolor: "#F6CC3" }}>
                    <Toolbar variant="dense">
                        <Button autoFocus color="inherit" onClick={handleEditSubTnClose}>
                            Закрыть
                        </Button>
                    </Toolbar>
                </AppBar>
                <EditTn driverTaskId={driverTaskId} isSubTask={'true'} handleClose={handleEditSubTnClose}></EditTn>
            </Dialog>
        </div>);
}

export default ViewTn;
