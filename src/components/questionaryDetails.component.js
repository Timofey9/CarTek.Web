import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import ApiService from "../services/cartekApiService";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import StateRadioButtonGroup from "./radiobuttongroup";
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';

function QuestionaryDetailsComponent() {
    let { cancelled } = false;
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [imgIndex, setImgIndex] = useState(0);
    const [questionary, setQuestionary] = useState({});
    const [carQuestionary, setCarQuestionary] = useState({});
    const [trailerQuestionary, setTrailerQuestionary] = useState({});
    const [car, setCar] = useState({});
    const [trailer, setTrailer] = useState({});

    let { uniqueId } = useParams();

    useEffect(() => {
        setLoading(true);
        ApiService.getQuestionaryImages(uniqueId)
            .then(({ data }) => {
                let imagesConverted = [];
                data.map(image => {
                    imagesConverted.push(`data:image/${image.extension};base64,${image.binaryData}`);
                });
                setImages(imagesConverted);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
        return () => cancelled = true;
    }, []);

    useEffect(() => {
        setLoading(true);
        ApiService.getQuestionaryUnit(uniqueId)
            .then(({ data }) => {
                console.log(data);
                setQuestionary(data);
                setCar(data.car);
                setTrailer(data.trailer);
                setCarQuestionary(data.carQuestionaryModel);
                setTrailerQuestionary(data.trailerQuestionaryModel);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });

        setLoading(false);

        return () => { cancelled = true; }
    }, []);

    const imagesList = images.map(image => {
        return <ImageListItem key={image}>
            <img onClick={() => setIsOpen(true)}
                src={image}
                srcSet={image}
                loading="lazy"
            />
        </ImageListItem>
    });

    if (loading) {
        return <div><h1>ЗАГРУЗКА...</h1></div>
    }


    if (questionary.carQuestionaryModel && questionary.trailerQuestionaryModel) {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h2>Результаты осмотра тягача {car.brand} {car.model}, гос.номер: {car.plate} от {new Date(questionary.lastUpdated).toLocaleString("pt-BR")}</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={200}>
                            {imagesList}
                        </ImageList>
                    </div>
                </div>

                <div className="row">
                    <h3>Световые приборы</h3>
                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Ближний свет"} id={"nearLight1"} isActive={carQuestionary.lightsJsonObject.nearLight} option1="Исправен" option2="Не исправен" />
                        <StateRadioButtonGroup type={"Дальний свет"} id={"distantLight1"} isActive={carQuestionary.lightsJsonObject.distantLight} option1="Исправен" option2="Не исправен" />
                        <StateRadioButtonGroup type={"Габариты"} id={"beamLigh1t"} isActive={carQuestionary.lightsJsonObject.beamLight1} option1="Исправен" option2="Не исправен" />
                    </div>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Поворотники"} id={"turn1"} isActive={carQuestionary.lightsJsonObject.turnSignal} option1="Исправен" option2="Не исправен" />
                        <StateRadioButtonGroup type={"Стоп-сигналы"} id={"stop1"} isActive={carQuestionary.lightsJsonObject.stopSignal} option1="Исправен" option2="Не исправен" />
                    </div>
                    <hr className="solid" />
                </div>

                <div className="row">
                    <h3>Общее состояние</h3>

                    <div className="col-md-6">
                        <div className="col-md-6">
                            <label htmlFor="mileage">Пробег</label>
                            <input type="text" id="mileage" value={carQuestionary.mileage} disabled />
                        </div>

                        <StateRadioButtonGroup type={"Внешнее состояние"} id={"condition"} isActive={true} option1="С повреждениями" option2="Без повреждений" />
                    </div>

                    <div className="col-md-6"><label htmlFor="comment">Комментарий</label>
                        <textarea rows="5" cols="40" type="text" id="comment" value={questionary.comment} disabled /></div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Чистота салона"} id={"cabin"} isActive={carQuestionary.isCabinClean} option1="Чистый" option2="Грязный" />
                    </div>
                    <hr className="solid" />
                </div>

                <div className="row">
                    <h3>Платон</h3>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Имеется"} id={"platonPresent"} isActive={carQuestionary.platonInPlace} option1="Да" option2="Нет" />
                    </div>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Включен"} id={"platonActive"} isActive={carQuestionary.platonSwitchedOn} option1="Да" option2="Нет" />
                    </div>

                    <hr className="solid" />
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div>
                            <h1 className="d-flex justify-content-center">Левая сторона</h1>
                            <div className="row">
                                <h5 className="d-flex justify-content-center">1 ось</h5>
                                <div className="col-md-12">
                                    <StateRadioButtonGroup type={"Диски"} id={"rimState1"} isActive={carQuestionary.wheelsJsonObject.frontAxle.leftWheel.rimState} option1="В норме" option2="Изношен" />
                                    <StateRadioButtonGroup type={"Состояние резины"} id={"tireState1"} isActive={carQuestionary.wheelsJsonObject.frontAxle.leftWheel.tireState} option1="В норме" option2="Изношена" />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"pinsState1"} isActive={carQuestionary.wheelsJsonObject.frontAxle.leftWheel.pinsState} option1="В норме" option2="Требуется замена" />
                                    <div>
                                        <label htmlFor="pressure">Давление:</label>
                                        <input disabled name="pressure" type="number" step="0.1" min="0" max="15" id="pressure1" value={carQuestionary.wheelsJsonObject.frontAxle.leftWheel.pressure} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <h5 className="d-flex justify-content-center">2 ось</h5>
                                <div className="col-md-12">
                                    <StateRadioButtonGroup type={"Диски"} id={"rimState3"} isActive={carQuestionary.wheelsJsonObject.backAxle.leftWheel.rimState} option1="В норме" option2="Изношен" />
                                    <StateRadioButtonGroup type={"Состояние резины"} id={"tireState3"} isActive={carQuestionary.wheelsJsonObject.backAxle.leftWheel.tireState} option1="В норме" option2="Изношена" />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"pinsState3"} isActive={carQuestionary.wheelsJsonObject.backAxle.leftWheel.pinsState} option1="В норме" option2="Требуется замена" />
                                    <div>
                                        <label htmlFor="pressure">Давление:</label>
                                        <input disabled name="pressure" type="number" step="0.1" min="0" max="15" id="pressure3" value={carQuestionary.wheelsJsonObject.backAxle.leftWheel.pressure} />
                                    </div>
                                </div>
                            </div>
                            {car.axelsCount > 2 ? <div className="form-row">
                                <h5 className="d-flex justify-content-center">3 ось</h5>
                                <div className="col-md-12">
                                    <StateRadioButtonGroup type={"Диски"} id={"rimState5"} isActive={carQuestionary.wheelsJsonObject.middleAxle.leftWheel.rimState} option1="В норме" option2="Изношен" />
                                    <StateRadioButtonGroup type={"Состояние резины"} id={"tireState5"} isActive={carQuestionary.wheelsJsonObject.middleAxle.leftWheel.tireState} option1="В норме" option2="Изношена" />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"pinsState5"} isActive={carQuestionary.wheelsJsonObject.middleAxle.pinsState} option1="В норме" option2="Требуется замена" />
                                    <div className="form-group">
                                        <label htmlFor="pressure">Давление:</label>
                                        <input disabled name="pressure" type="number" step="0.1" min="0" max="15" id="pressure5" value={carQuestionary.wheelsJsonObject.middleAxle.leftWheel.pressure}  />
                                    </div>
                                </div>
                            </div> : <></>}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h1 className="d-flex justify-content-center">Правая сторона</h1>
                        <div className="row">
                            <h5 className="d-flex justify-content-center">1 ось</h5>
                            <div className="col-md-12">
                                <StateRadioButtonGroup type={"Диски"} id={"rimState2"} isActive={carQuestionary.wheelsJsonObject.frontAxle.rightWheel.rimState} option1="В норме" option2="Изношен" />
                                <StateRadioButtonGroup type={"Состояние резины"} id={"tireState2"} isActive={carQuestionary.wheelsJsonObject.frontAxle.rightWheel.tireState} option1="В норме" option2="Изношена" />
                                <StateRadioButtonGroup type={"Шпильки"} id={"pinsState2"} isActive={carQuestionary.wheelsJsonObject.frontAxle.rightWheel.pinsState} option1="В норме" option2="Требуется замена" />
                                <div>
                                    <label htmlFor="pressure">Давление:</label>
                                    <input disabled name="pressure" type="number" step="0.1" min="0" max="15" id="pressure2" value={carQuestionary.wheelsJsonObject.frontAxle.rightWheel.pressure} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <h5 className="d-flex justify-content-center">2 ось</h5>
                            <div className="col-md-12">
                                <StateRadioButtonGroup type={"Диски"} id={"rimState4"} isActive={carQuestionary.wheelsJsonObject.backAxle.rightWheel.rimState} option1="В норме" option2="Изношен" />
                                <StateRadioButtonGroup type={"Состояние резины"} id={"tireState4"} isActive={carQuestionary.wheelsJsonObject.backAxle.rightWheel.tireState} option1="В норме" option2="Изношена" />
                                <StateRadioButtonGroup type={"Шпильки"} id={"pinsState4"} isActive={carQuestionary.wheelsJsonObject.backAxle.rightWheel.pinsState} option1="В норме" option2="Требуется замена" />
                                <div>
                                    <label htmlFor="pressure">Давление:</label>
                                    <input disabled name="pressure" type="number" step="0.1" min="0" max="15" id="pressure4" value={carQuestionary.wheelsJsonObject.backAxle.rightWheel.pressure} />
                                </div>
                            </div>
                        </div>
                        {car.axelsCount > 2 ? <div className="form-row">
                            <h5 className="d-flex justify-content-center">3 ось</h5>
                            <div className="col-md-12">
                                <StateRadioButtonGroup type={"Диски"} id={"rimState6"} isActive={carQuestionary.wheelsJsonObject.middleAxle.rightWheel.rimState} option1="В норме" option2="Изношен"  />
                                <StateRadioButtonGroup type={"Состояние резины"} id={"tireState6"} isActive={carQuestionary.wheelsJsonObject.middleAxle.rightWheel.tireState} option1="В норме" option2="Изношена" />
                                <StateRadioButtonGroup type={"Шпильки"} id={"pinsState6"} isActive={carQuestionary.wheelsJsonObject.middleAxle.rightWheel.pinsState} option1="В норме" option2="Требуется замена"  />
                                <div className="form-group">
                                    <label htmlFor="pressure">Давление:</label>
                                    <input disabled name="pressure" type="number" step="0.1" min="0" max="15" id="pressure6" value={carQuestionary.wheelsJsonObject.middleAxle.rightWheel.pressure}/>
                                </div>
                            </div>
                        </div> : <></>}
                    </div>
                    <hr className="solid" />
                </div>

                <div className="row">
                    <h3>Состояние подушек</h3>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Как стоят подушки?"} id={"cabinCushion"} isActive={carQuestionary.cabinCushion} option1="Штатно" option2="Не штатно" />
                    </div>

                    <hr className="solid" />
                </div>

                <div className="row">
                    <h3>Состояние крыльев</h3>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Крепления"} id={"fendersOk1"} isActive={carQuestionary.fendersOk} option1="В норме" option2="Не в норме" />
                    </div>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Целостность"} id={"fendersMountState1"} isActive={carQuestionary.fendersMountState} option1="Целые" option2="Повреждения" />
                    </div>

                    <hr className="solid" />
                </div>

                <div className="row">
                    <h3>Рама и подвеска</h3>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Рама целая?"} id={"rack"} isActive={carQuestionary.rack} option1="Да" option2="Нет" />
                    </div>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Стук лифтов передней подвески"} id={"frontSuspension"} isActive={carQuestionary.frontSuspension} option1="Да" option2="Нет" />
                        <StateRadioButtonGroup type={"Стук лифтов задней подвески"} id={"backSuspension"} isActive={carQuestionary.backSuspension} option1="Да" option2="Нет" />
                    </div>

                    <hr className="solid" />
                </div>

                <div className="row">
                    <h3>Гидрооборудование</h3>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Гидрооборудование"} id={"hydroEq"} isActive={carQuestionary.hydroEq} option1="Не протёрто" option2="Протёрто" />
                    </div>
                    <hr className="solid" />
                </div>

                <h2>Полуприцеп {trailer.brand} {trailer.model} (гос.номер: {trailer.plate})</h2>

                <div className="row">
                    <h3>Световые приборы</h3>
                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Габариты"} id={"beamLight2"} isActive={trailerQuestionary.lightsJsonObject.beamLight} option1="Исправен" option2="Не исправен" />
                    </div>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Поворотники"} id={"turn2"} isActive={trailerQuestionary.lightsJsonObject.turnSignal} option1="Исправен" option2="Не исправен" />
                        <StateRadioButtonGroup type={"Стоп-сигналы"} id={"stop2"} isActive={trailerQuestionary.lightsJsonObject.stopSignal} option1="Исправен" option2="Не исправен" />
                    </div>
                    <hr className="solid" />
                </div>

                <div className="row">
                    <h3>Общее состояние</h3>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Внешнее состояние"} id={"trailercondition"} isActive={trailerQuestionary.generalCondition} option1="С повреждениями" option2="Без повреждений" />
                    </div>

                    <div className="col-md-6"><label htmlFor="comment">Комментарий</label>
                        <textarea disabled rows="5" cols="40" type="text" id="comment" />
                    </div>

                    <hr className="solid" />
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div>
                            <h1 className="d-flex justify-content-center">Левая сторона</h1>
                            <div className="row">
                                <h5 className="d-flex justify-content-center">1 ось</h5>
                                <div className="col-md-12">
                                    <StateRadioButtonGroup type={"Диски"} id={"trailerRimState1"} isActive={trailerQuestionary.wheelsJsonObject.frontAxle.leftWheel.rimState} option1="В норме" option2="Изношен" />
                                    <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState1"} isActive={trailerQuestionary.wheelsJsonObject.frontAxle.leftWheel.tireState} option1="В норме" option2="Изношена" />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState1"} isActive={trailerQuestionary.wheelsJsonObject.frontAxle.leftWheel.pinsState} option1="В норме" option2="Требуется замена" />
                                    <div>
                                        <label htmlFor="pressure">Давление:</label>
                                        <input disabled name="pressure" type="number" step="0.1" min="0" max="15" id="trailerPressure1" value={trailerQuestionary.wheelsJsonObject.frontAxle.leftWheel.pressure} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <h5 className="d-flex justify-content-center">2 ось</h5>
                                <div className="col-md-12">
                                    <StateRadioButtonGroup type={"Диски"} id={"trailerRimState3"} isActive={trailerQuestionary.wheelsJsonObject.backAxle.leftWheel.rimState} option1="В норме" option2="Изношен" />
                                    <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState3"} isActive={trailerQuestionary.wheelsJsonObject.backAxle.leftWheel.tireState} option1="В норме" option2="Изношена" />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState3"} isActive={trailerQuestionary.wheelsJsonObject.backAxle.leftWheel.pinsState} option1="В норме" option2="Требуется замена" />
                                    <div>
                                        <label htmlFor="pressure">Давление:</label>
                                        <input disabled name="pressure" type="number" step="0.1" min="0" max="15" id="trailerPressure3" value={trailerQuestionary.wheelsJsonObject.backAxle.leftWheel.pressure} />
                                    </div>
                                </div>
                            </div>
                            {car.axelsCount > 2 ? <div className="form-row">
                                <h5 className="d-flex justify-content-center">3 ось</h5>
                                <div className="col-md-12">
                                    <StateRadioButtonGroup type={"Диски"} id={"trailerRimState5"} isActive={trailerQuestionary.wheelsJsonObject.middleAxle.leftWheel.rimState} option1="В норме" option2="Изношен" />
                                    <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState5"} isActive={trailerQuestionary.wheelsJsonObject.middleAxle.leftWheel.tireState} option1="В норме" option2="Изношена" />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState5"} isActive={trailerQuestionary.wheelsJsonObject.middleAxle.leftWheel.pinsState} option1="В норме" option2="Требуется замена" />
                                    <div className="form-group">
                                        <label htmlFor="pressure">Давление:</label>
                                        <input disabled name="pressure" type="number" step="0.1" min="0" max="15" id="trailerPressure5" value={trailerQuestionary.wheelsJsonObject.middleAxle.leftWheel.pressure} />
                                    </div>
                                </div>
                            </div> : <></>}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h1 className="d-flex justify-content-center">Правая сторона</h1>
                        <div className="row">
                            <h5 className="d-flex justify-content-center">1 ось</h5>
                            <div className="col-md-12">
                                <StateRadioButtonGroup type={"Диски"} id={"trailerRimState2"} isActive={trailerQuestionary.wheelsJsonObject.frontAxle.rightWheel.rimState} option1="В норме" option2="Изношен" />
                                <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState2"} isActive={trailerQuestionary.wheelsJsonObject.frontAxle.rightWheel.tireState} option1="В норме" option2="Изношена" />
                                <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState2"} isActive={trailerQuestionary.wheelsJsonObject.frontAxle.pinsState} option1="В норме" option2="Требуется замена" />
                                <div>
                                    <label htmlFor="pressure">Давление:</label>
                                    <input disabled name="pressure" type="number" step="0.1" min="0" max="15" id="trailerPressure2" value={trailerQuestionary.wheelsJsonObject.frontAxle.rightWheel.pressure} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <h5 className="d-flex justify-content-center">2 ось</h5>
                            <div className="col-md-12">
                                <StateRadioButtonGroup type={"Диски"} id={"trailerRimState4"} isActive={trailerQuestionary.wheelsJsonObject.backAxle.rightWheel.rimState} option1="В норме" option2="Изношен" />
                                <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState4"} isActive={trailerQuestionary.wheelsJsonObject.backAxle.rightWheel.tireState} option1="В норме" option2="Изношена" />
                                <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState4"} isActive={trailerQuestionary.wheelsJsonObject.backAxle.rightWheel.pinsState} option1="В норме" option2="Требуется замена" />
                                <div>
                                    <label htmlFor="pressure">Давление:</label>
                                    <input disabled name="pressure" type="number" step="0.1" min="0" max="15" id="trailerPressure4" value={trailerQuestionary.wheelsJsonObject.backAxle.rightWheel.pressure} />
                                </div>
                            </div>
                        </div>
                        {car.axelsCount > 2 ? <div className="form-row">
                            <h5 className="d-flex justify-content-center">3 ось</h5>
                            <div className="col-md-12">
                                <StateRadioButtonGroup type={"Диски"} id={"trailerRimState6"} isActive={trailerQuestionary.wheelsJsonObject.middleAxle.rightWheel.rimState} option1="В норме" option2="Изношен" />
                                <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState6"} isActive={trailerQuestionary.wheelsJsonObject.middleAxle.rightWheel.tireState} option1="В норме" option2="Изношена" />
                                <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState6"} isActive={trailerQuestionary.wheelsJsonObject.middleAxle.rightWheel.pinsState} option1="В норме" option2="Требуется замена" />
                                <div className="form-group">
                                    <label htmlFor="pressure">Давление:</label>
                                    <input disabled name="pressure" type="number" step="0.1" min="0" max="15" id="trailerPressure6" value={trailerQuestionary.wheelsJsonObject.middleAxle.rightWheel.pressure} />
                                </div>
                            </div>
                        </div> : <></>}
                    </div>
                    <hr className="solid" />
                </div>

                <div className="row">
                    <h3>Состояние крыльев</h3>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Крепления"} id={"trailerFendersOk"} isActive={trailerQuestionary.fendersOk} option1="В норме" option2="Не в норме" />
                    </div>

                    <div className="col-md-6">
                        <StateRadioButtonGroup type={"Целостность"} id={"trailerFendersMountState1"} isActive={trailerQuestionary.fendersMountState} option1="Целые" option2="Повреждения" />
                    </div>

                    <hr className="solid" />
                </div>



                {isOpen && (
                    <Lightbox
                        mainSrc={images[imgIndex]}
                        nextSrc={images[(imgIndex + 1) % images.length]}
                        prevSrc={images[(imgIndex + images.length - 1) % images.length]}
                        onCloseRequest={() => setIsOpen(false)}
                        onMovePrevRequest={() =>
                            setImgIndex((imgIndex + images.length - 1) % images.length)
                        }
                        onMoveNextRequest={() =>
                            setImgIndex((imgIndex + 1) % images.length)
                        }
                    />
                )}

            </div>
        );
    }
};

export default QuestionaryDetailsComponent;