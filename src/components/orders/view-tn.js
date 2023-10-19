import React, { useEffect, useState } from 'react';
import ApiService from "../../services/cartekApiService";

function ViewTn({ driverTaskId, handleClose }) {
    const [error, setError] = useState("");
    const [reload, setReload] = useState(0);
    const [unit, setUnit] = useState("none");
    const [unit2, setUnit2] = useState("none");
    const [unloadUnit, setUnloadUnit] = useState("none");
    const [unloadUnit2, setUnloadUnit2] = useState("none");

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

    useEffect(() => {
        setLoading(true);
            ApiService.viewTN(driverTaskId)
                .then(({ data }) => {
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
                }).
                catch((error) => {
                    setError(error.response.data);
                });
        setLoading(false);
    }, [reload]);

    function handleSubmit(event) {
        //тут будем скачивать ТН
    }

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
                        value={tnNumber}/>
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Грузоотправитель (1)</label>
                    <label>{goInfo}</label>
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Грузополучатель (2)</label>
                    <label>{gpInfo}</label>
                </div>

                <div className="form-row">
                    <label className="bold-label">Тип груза (3)</label>
                    <label>{material}</label>
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Объем загрузки</label>
                    <label>{loadVolume} {unit} {loadVolume2} {unit2}</label>
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
                    <label>{unloadVolume} {unloadUnit} {unloadVolume2} {unloadUnit2}</label>
                </div>

                <div className="form-group mb-3 col-md-6 pl-1">
                    <label className="bold-label">Время прибытия на склад выгрузки</label>
                    <label>{dropOffArrivalTime}</label>
                </div>

                <div className="form-group col-md-6">
                    <label className="bold-label">Время выезда со склада выгрузки</label>
                    <label>{dropOffDepartureTime}</label>
                </div>

            </div>
        </div>);
}

export default ViewTn;
