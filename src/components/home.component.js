import React, { useEffect, useState } from 'react';
import ApiService from "../services/cartekApiService";
import { Link } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function Home() {
    const [cars, setCars] = useState([]);
    const [car, setCar] = useState({});
    const [loading, setLoading] = useState(true);
    const [cachedQuestionary, setCachedQuestionary] = useState({});

    useEffect(() => {
        setLoading(true);

        let cQuestionary = JSON.parse(localStorage.getItem("questionary"));
        if (cQuestionary) {
            setCachedQuestionary(cQuestionary);
        }

        ApiService.getAllCars()
            .then(({ data }) => {
                setCars(data);
            }).
            catch((error) => {
                console.log(error);
            });

        setLoading(false);
    }, []);


    function clearStorage(event){
        localStorage.removeItem("questionary");
    };


    if (loading) {
        return <div><h1>ЗАГРУЗКА...</h1></div>
    }


    return (<div className="container">
        {cachedQuestionary.car ?
            <div>
                <div className="row">
                    <div className="col d-flex justify-content-center">
                        <label htmlFor="goToQuestionary">Имеется неоконченный осмотр для тягача {cachedQuestionary.car.brand} {cachedQuestionary.car.model} с гос.номером: {cachedQuestionary.car.plate}</label>
                    </div>
                </div>

                <div className="row">
                    <div className="col d-flex justify-content-center mt-3">
                        {(cachedQuestionary.submitted && cachedQuestionary.uniqueId.length > 0) ?
                            <Link id="goToQuestionary" to={`/cars/acceptCar/${cachedQuestionary.uniqueId}`} className="btn btn-warning">Передать водителю</Link> :
                            <Link id="goToQuestionary" to={`/questionary/car/${cachedQuestionary.car.id}`} className="btn btn-warning">Завершить осмотр</Link>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col d-flex justify-content-center mt-3">
                        <label>Или начните новый осмотр. <b>Это приведет к удалению незавершенного осмотра!</b></label>
                    </div>
                </div>
            </div>
            : <div></div>}

        <div className="row">
            <form className="d-flex justify-content-center">
                <div className="form-group">
                    <div className="form-row">
                        <div className="col d-flex justify-content-center">
                            <label htmlFor="files">Начните вводить номер и выберите номер машины из списка.</label>
                        </div>

                        <div className="col d-flex justify-content-center mt-3">
                            <div>
                                <Autocomplete
                                    disablePortal
                                    onChange={(e, newvalue) => setCar(newvalue)}
                                    id="combo-box-demo"
                                    options={cars}
                                    sx={{ width: 300 }}
                                    getOptionLabel={(option) => `${option.plate}`}
                                    renderInput={(params) => <TextField {...params} label="Список тягачей" />} />
                            </div>
                        </div>

                        {car && car.plate ?
                            (
                                <div>
                                    <div className="row">
                                        <div className="col d-flex justify-content-center">
                                            <label htmlFor="goToQuestionary">{car.brand} {car.model}, гос.номер: {car.plate}</label>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col d-flex justify-content-center">
                                            <Link id="goToQuestionary" to={`/questionary/car/${car.id}`} onClick={(e) => clearStorage(e)} className="btn btn-success">Перейти к осмотру</Link>
                                        </div>
                                    </div>
                                </div>) : (<div></div>)}
                    </div>
                </div>

            </form>
        </div>
    </div>);
};

export default Home;
