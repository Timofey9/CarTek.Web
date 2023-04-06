import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from "../services/cartekApiService";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { setMessage } from '../actions/message';

function TrailerForm() {
    const [cars, setCars] = useState([]);
    const [carId, setCarId] = useState(0);
    const [trailer, setTrailer] = useState({});
    const [loading, setLoading] = useState(true);
    const [plate, setPlate] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [axelsCount, setAxelsCount] = useState(2);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [notificationShown, setNotificationShown] = useState(false);

    const navigate = useNavigate();
    let { trailerPlate } = useParams();

    useEffect(() => {
        setLoading(true);

        ApiService.getAllCars()
            .then(({ data }) => {
                setCars(data);
            }).
            catch((error) => {
                console.log(error);
            });

        setLoading(false);
    }, []);


    useEffect(() => {
        setLoading(true);

        if (trailerPlate) {
            ApiService.getTrailerByPlate(trailerPlate)
                .then(({ data }) => {
                    setTrailer(data);
                    setPlate(data.plate);
                    setBrand(data.brand);
                    setModel(data.model);
                    setAxelsCount(data.axelsCount);
                }).
                catch((error) => {
                    setMessage(error.response.data);
                });
        }
        setLoading(false);
    }, []);

    function validate() {
        if (!plate) {
            setMessage("Необходимо ввести гос.номер и выбрать тягач");
            return false;
        }
        return true;
    }

    function handleSubmit(event) {
        event.preventDefault();
        setMessage("");

        const newTrailer = {
            plate: plate,
            brand: brand,
            model: model,
            axelsCount: axelsCount,
            carId: carId
        };

        if (!validate()) {
            setMessage("Необходимо выбрать тягач");
        } else {
            if (trailerPlate) {
                ApiService.updateTrailer(trailer.id, newTrailer)
                    .then(({ data }) => {
                        alert("Полуприцеп обновлен");
                        navigate("/admin/trailers/");
                    }).
                    catch((error) => {
                        setMessage(error.response);
                    });
            } else {
                ApiService.createTrailer(newTrailer)
                    .then(({ data }) => {
                        alert("Полуприцеп создан");
                        navigate("/admin/trailers/");
                    }).
                    catch((error) => {
                        if (error.response.data) {
                            setMessage(error.response.data);
                        }
                    });
                }
        }
    }

    function deleteTrailer(event) {
        event.preventDefault();

        if (!notificationShown) {
            setMessage("Чтобы продолжить нажмите \"Удалить\" еще раз");
            setNotificationShown(true);
        } else {
            var id = trailer.id;
            ApiService.deleteTrailer(id)
                .then(({ data }) => {
                    setLoading(false);
                    alert("Прицеп удален");
                    navigate("/admin/trailers/");
                })
                .catch((error) => {
                    setMessage(error.response.data);
                    setLoading(false);
                })
        }
    }

    if (loading) {
        return <div><h1>ЗАГРУЗКА...</h1></div>
    }

    return (
        <div>
            <h1>Полуприцеп</h1>
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

                {trailer.car ? <div className="form-group col-md-6">
                    <label htmlFor="car">Текущий тягач: {trailer.car.brand} {trailer.car.model}, гос.номер {trailer.car.plate}</label>
                </div> : <></>}
            </div>

            {cars && <div className="form-row">
                <label>Выберите тягач</label>
                <Autocomplete
                    options={cars}
                    disablePortal
                    onChange={(e, newvalue) => { setCarId(newvalue.id) }}
                    id="combo-box-demo"
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => `${option.brand} ${option.model} - ${option.plate}`}
                    renderInput={(params) => <TextField {...params} label="Список тягачей" />} />
            </div>}


            {message && (
                <div className="form-group">
                    <div className="alert alert-danger mt-2" role="alert">
                        {message}
                    </div>
                </div>
            )}

            <div className="row mb-2">
                <div className="col-md-3"></div>
                <div className="col-md-9">
                    <div className="row">
                        {trailer &&
                            <div className="col-md-2">
                                <button className="btn btn-danger mx-2" onClick={(e) => { deleteTrailer(e) }}>
                                    Удалить
                                </button>
                            </div>}
                        <div className="col-md-2">
                            <Link to="/admin/trailers" className="btn btn-warning mx-2">
                                Отмена
                            </Link>
                        </div>
                        <div className="col-md-2">
                            <button type="submit" form="profile-form" className="btn btn-success mx-2" onClick={(e) => { handleSubmit(e) }}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};

export default TrailerForm;