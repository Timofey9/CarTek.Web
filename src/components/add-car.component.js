import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from "../services/cartekApiService";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function CarForm() {
    const [driver, setDriver] = useState({});
    const [car, setCar] = useState({});
    const [trailerId, setTrailerId] = useState(0);
    const [trailers, setTrailers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [plate, setPlate] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [axelsCount, setAxelsCount] = useState(2);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [notificationShown, setNotificationShown] = useState(false);

    const navigate = useNavigate();

    let { carPlate } = useParams();

    useEffect(() => {
        setLoading(true);
        ApiService.getAllTrailers()
            .then(({ data }) => {
                setTrailers(data);
            }).
            catch((error) => {
                setMessage(error.response.data.message);
            });

        setLoading(false);
    }, []);


    useEffect(() => {
        setLoading(true);

        if (carPlate) {
            ApiService.getCar(carPlate)
                .then(({ data }) => {
                    setCar(data);
                    setPlate(data.plate);
                    setBrand(data.brand);
                    setModel(data.model);
                    setAxelsCount(data.axelsCount);
                    setDriver(data.driver);
                }).
                catch((error) => {
                    if (error.response.data.message) {
                        setMessage(error.response.data.message);
                    }
                });
        }
        setLoading(false);
    }, []);

    function deleteCar(event) {
        event.preventDefault();

        if (!notificationShown) {
            setMessage("Удаление атвомобиля приведет к удалению всех связанных с ним осмотров! Чтобы продолжить нажмите \"Удалить\" еще раз");
            setNotificationShown(true);
        } else {
            ApiService.deleteCar(car.id)
                .then(({ data }) => {
                    setLoading(false);
                    alert("Тягач удален");
                    navigate("/admin/cars/");
                })
                .catch((error) => {
                    setMessage(error.response.data);
                    setLoading(false);
                })
        }
    }


    function handleSubmit(event) {
        event.preventDefault();
        setMessage("");

        const newCar = {
            plate: plate, 
            brand: brand,
            model: model,
            axelsCount: axelsCount,
            trailerId: trailerId
        };

        if (carPlate) {
            ApiService.updateCar(car.id, newCar)
                .then(({ data }) => {
                    alert("Тягач обновлен");
                }).
                catch((error) => {
                    if (error.response.data.message) {
                        setMessage(error.response.data.message);
                    }
                });
        } else {
            ApiService.createCar(newCar)
                .then(({ data }) => {
                    alert("Тягач создан");
                    navigate("/admin/cars/");
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
        <div>
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    {error}
                </div>
            </div>
            <h1>Тягач</h1>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="firstName">Гос. номер</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setPlate(e.target.value)}
                        value={plate}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="middleName">Марка</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setBrand(e.target.value)}
                        value={brand} />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="firstName">Модель</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setModel(e.target.value)}
                        value={model}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="login">Количество осей</label>
                    <input
                        type="number"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setAxelsCount(e.target.value)}
                        value={axelsCount} />
                </div>

                {car.trailer ? <div className="form-group col-md-6">
                    <label htmlFor="car">Текущий полуприцеп: {car.trailer.brand} {car.trailer.model}, гос.номер {car.trailer.plate}</label>
                </div> : <></>}
            </div>

            {trailers && <div className="form-row">
                <label>Выберите полуприцеп</label>
                <Autocomplete
                    options={trailers}
                    disablePortal
                    onChange={(e, newvalue) => { setTrailerId(newvalue.id) }}
                    id="combo-box-demo"
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => `${option.brand} ${option.model} - ${option.plate}`}
                    renderInput={(params) => <TextField {...params} label="Список полуприцепов" />} />
            </div>}


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
                        {car &&
                            <div className="col-md-2">
                                <button className="btn btn-danger" onClick={(e) => { deleteCar(e) }}>
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
        </div>);
};

export default CarForm;