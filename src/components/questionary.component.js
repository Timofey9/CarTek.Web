import React, { Component } from "react";
import ApiService from "../services/cartekApiService";
import withRouter from "./withRouter";
import StateRadioButtonGroup from "./radiobuttongroup";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Link } from "react-router-dom";

class Questionary extends Component {

    constructor(props) {
        super(props);
        const { navigate } = this.props;

        this.state = {
            submitted: false,
            errorMessage: "",
            createdQuestionary: {},
            car: {},
            trailer: {},
            plate: {},
            drivers: [],
            driver: {},
            file: {},
            approvedByDriver: false,
            nearLight1: '',
            distantLight1: '',
            //габариты
            beamLight1: '',
            turnSignal1: '',
            stopSignal1: '',

            //габариты
            beamLight2: '',
            turnSignal2: '',
            stopSignal2: '',

            pressure1: "",
            rimState1: '',
            pinsState1: '',
            tireState1: '',

            pressure2: "",
            rimState2: '',
            pinsState2: '',
            tireState2: '',

            pressure3: "",
            rimState3: '',
            pinsState3: '',
            tireState3: '',

            pressure4: "",
            rimState4: '',
            pinsState4: '',
            tireState4: '',

            pressure5: "",
            rimState5: '',
            pinsState5: '',
            tireState5: '',

            pressure6: "",
            rimState6: '',
            pinsState6: '',
            tireState6: '',

            trailerPressure1: "",
            trailerRimState1: '',
            trailerPinsState1: '',
            trailerTireState1: '',

            trailerPressure2: "",
            trailerRimState2: '',
            trailerPinsState2: '',
            trailerTireState2: '',

            trailerPressure3: "",
            trailerRimState3: '',
            trailerPinsState3: '',
            trailerTireState3: '',

            trailerPressure4: "",
            trailerRimState4: '',
            trailerPinsState4: '',
            trailerTireState4: '',

            trailerPressure5: "",
            trailerRimState5: '',
            trailerPinsState5: '',
            trailerTireState5: '',

            trailerPressure6: "",
            trailerRimState6: '',
            trailerPinsState6: '',
            trailerTireState6: '',

            generalCondition: '',
            trailerCondition: '',

            cabinClean: '',
            platonInPlace: '',
            platonSwitchedOn: '',
            fendersOk1: '',
            fendersMountState1: '',

            trailerFendersOk: '',
            trailerFendersMountState: '',

            rack: '',
            comment: "",
            trailerComment: "",

            frontSuspension: '',
            backSuspension: '',
            hydroEq: '',
            mileage: 0,
            formData: new FormData(),
            userLogin: ""
        };

        this.selectFile = this.selectFile.bind(this);
        this.conditionChanged = this.conditionChanged.bind(this);
        this.trailerConditionChanged = this.trailerConditionChanged.bind(this);
        this.commonChangedEvent = this.commonChangedEvent.bind(this);
        this.mileageChanged = this.mileageChanged.bind(this);
        this.commonPressureChangedEvent = this.commonPressureChangedEvent.bind(this);
        this.commentChanged = this.commentChanged.bind(this);
        this.trailerCommentChanged = this.trailerCommentChanged.bind(this);

        this.constructAndCacheRequest = this.constructAndCacheRequest.bind(this);
        this.driverSelectionChanged = this.driverSelectionChanged.bind(this);
        this.validateForm = this.validateForm.bind(this);


        const user = JSON.parse(localStorage.getItem("user"));
        this.state.userLogin = user.identity.login;

        var cachedQuestionary = JSON.parse(localStorage.getItem("questionary"));

        if (cachedQuestionary) {
            this.state.submitted = cachedQuestionary.submitted;
            this.state.nearLight1 = cachedQuestionary.carQuestionaryModel.lightsJsonObject.nearLight;
            this.state.distantLight1 = cachedQuestionary.carQuestionaryModel.lightsJsonObject.distantLight;
                //габариты
            this.state.beamLight1 = cachedQuestionary.carQuestionaryModel.lightsJsonObject.beamLight;
            this.state.turnSignal1 = cachedQuestionary.carQuestionaryModel.lightsJsonObject.turnSignal;
            this.state.stopSignal1 = cachedQuestionary.carQuestionaryModel.lightsJsonObject.stopSignal;

            this.state.nearLight2 = cachedQuestionary.trailerQuestionaryModel.lightsJsonObject.nearLight;
            this.state.distantLight2 = cachedQuestionary.trailerQuestionaryModel.lightsJsonObject.distantLight;
                //габариты
            this.state.beamLight2 = cachedQuestionary.trailerQuestionaryModel.lightsJsonObject.beamLight;
            this.state.turnSignal2 = cachedQuestionary.trailerQuestionaryModel.lightsJsonObject.turnSignal;
            this.state.stopSignal2 = cachedQuestionary.trailerQuestionaryModel.lightsJsonObject.stopSignal;

            this.state.pressure1 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.frontAxle.leftWheel.pressure;
            this.state.rimState1 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.frontAxle.leftWheel.rimState;
            this.state.pinsState1 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.frontAxle.leftWheel.pinsState;
            this.state.tireState1 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.frontAxle.leftWheel.tireState;

            this.state.pressure2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.frontAxle.rightWheel.pressure;
            this.state.rimState2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.frontAxle.rightWheel.rimState;
            this.state.pinsState2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.frontAxle.rightWheel.pinsState;
            this.state.tireState2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.frontAxle.rightWheel.tireState;

            this.state.pressure3 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.leftWheel.pressure;
            this.state.rimState3 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.leftWheel.rimState;
            this.state.pinsState3 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.leftWheel.pinsState;
            this.state.tireState3 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.leftWheel.tireState;

            this.state.pressure4 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.rightWheel.pressure;
            this.state.rimState4 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.rightWheel.rimState;
            this.state.pinsState4 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.rightWheel.pinsState;
            this.state.tireState4 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.rightWheel.tireState;


            if (cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle) {
                this.state.pressure5 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel.pressure;
                this.staterimState5 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel.rimState;
                this.state.pinsState5 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel.pinsState;
                this.state.tireState5 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel.tireState;

                this.state.pressure6 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel.pressure;
                this.state.rimState6 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel.rimState;
                this.state.pinsState6 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel.pinsState;
                this.state.tireState6 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel.tireState;
            }


            this.state.trailerPressure1 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.frontAxle.leftWheel.pressure;
            this.state.trailerRimState1 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.frontAxle.leftWheel.rimState;
            this.state.trailerPinsState1 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.frontAxle.leftWheel.pinsState;
            this.state.trailerTireState1 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.frontAxle.leftWheel.tireState;

            this.state.trailerPressure2 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.frontAxle.rightWheel.pressure;
            this.state.trailerRimState2 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.frontAxle.rightWheel.rimState;
            this.state.trailerPinsState2 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.frontAxle.rightWheel.pinsState;
            this.state.trailerTireState2 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.frontAxle.rightWheel.tireState;

            this.state.trailerPressure3 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.backAxle.leftWheel.pressure;
            this.state.trailerRimState3 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.backAxle.leftWheel.rimState;
            this.state.trailerPinsState3 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.backAxle.leftWheel.pinsState;
            this.state.trailerTireState3 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.backAxle.leftWheel.tireState;

            this.state.trailerPressure4 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.backAxle.rightWheel.pressure;
            this.state.trailerRimState4 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.backAxle.rightWheel.rimState;
            this.state.trailerPinsState4 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.backAxle.rightWheel.pinsState;
            this.state.trailerTireState4 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.backAxle.rightWheel.tireState;

            if (cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.middleAxle) {

                //Обработать количество осей
                this.state.trailerPressure5 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel.pressure;
                this.state.trailerRimState5 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel.rimState;
                this.state.trailerPinsState5 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel.pinsState;
                this.state.trailerTireState5 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel.tireState;

                this.state.trailerPressure6 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel.pressure;
                this.state.trailerRimState6 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel.rimState;
                this.state.trailerPinsState6 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel.pinsState;
                this.state.trailerTireState6 = cachedQuestionary.trailerQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel.tireState;
            }
            this.state.generalCondition = cachedQuestionary.carQuestionaryModel.generalCondition;
            this.state.trailerCondition = cachedQuestionary.trailerQuestionaryModel.trailerCondition;
            this.state.trailerComment = cachedQuestionary.trailerQuestionaryModel.trailerComment;
            this.state.cabinCushion = cachedQuestionary.carQuestionaryModel.cabinCushion;
            this.state.cabinClean = cachedQuestionary.carQuestionaryModel.isCabinClean;
            this.state.platonInPlace = cachedQuestionary.carQuestionaryModel.platonInPlace;
            this.state.platonSwitchedOn = cachedQuestionary.carQuestionaryModel.platonSwitchedOn;
            this.state.fendersOk1 = cachedQuestionary.carQuestionaryModel.fendersOk;
            this.state.fendersMountState1 = cachedQuestionary.carQuestionaryModel.fendersMountState;

            this.state.trailerFendersOk = cachedQuestionary.carQuestionaryModel.trailerFendersOk;
            this.state.trailerFendersMountState = cachedQuestionary.carQuestionaryModel.trailerFendersMountState;

            this.state.rack = cachedQuestionary.carQuestionaryModel.rack;
            this.state.comment = cachedQuestionary.comment;
            this.state.frontSuspension = cachedQuestionary.carQuestionaryModel.frontSuspension;
            this.state.backSuspension = cachedQuestionary.carQuestionaryModel.backSuspension;
            this.state.hydroEq = cachedQuestionary.carQuestionaryModel.hydroEq;
            this.state.mileage = cachedQuestionary.carQuestionaryModel.mileage;    
        }

        this.handleSubmit = (event) => {
            event.preventDefault();

            var request = this.constructAndCacheRequest();

            this.state.formData.append("CreatedBy", user.identity.login);
            this.state.formData.append("CarQuestionaryModel", JSON.stringify(request.carQuestionaryModel));
            this.state.formData.append("TrailerQuestionaryModel", JSON.stringify(request.trailerQuestionaryModel));
            this.state.formData.append("Comment", this.state.comment);
            this.state.formData.append("DriverId", this.state.driver.id);
            this.state.formData.append("CarId", this.state.car.id); 

            this.validateForm();
            ApiService.sendQuestionary(this.state.formData).then(response => {
                this.setState({ createdQuestionary: response.data });
                this.setState({ submitted: true });
                this.constructAndCacheRequest();
                alert("Анкета сохранена");
                this.props.navigate(`/cars/acceptCar/${response.data.uniqueId}`);
            }, error => {
                if (error.code == 'ERR_NETWORK') {
                    this.setState({ errorMessage: "Ошибка сети" });
                }
                else
                    this.setState({ errorMessage: "Анкета не сохранена" });
            });
        };
    }

    constructAndCacheRequest() {
        var carMiddleAxle = {
            leftWheel: {
                pressure: this.state.pressure5,
                rimState: this.state.rimState5,
                pinsState: this.state.pinsState5,
                tireState: this.state.tireState5
            },
            rightWheel: {
                pressure: this.state.pressure6,
                rimState: this.state.rimState6,
                pinsState: this.state.pinsState6,
                tireState: this.state.tireState6
            }
        };

        var trailerMiddleAxle = {
            leftWheel: {
                pressure: this.state.trailerPressure5,
                rimState: this.state.trailerRimState5,
                pinsState: this.state.trailerPinsState5,
                tireState: this.state.trailerTireState5
            },
            rightWheel: {
                pressure: this.state.trailerPressure6,
                rimState: this.state.trailerRimState6,
                pinsState: this.state.trailerPinsState6,
                tireState: this.state.trailerTireState6
            }
        };

        var trailerQuestionaryModel = {
            transportId: this.state.trailer.id,
            generalCondition: this.state.trailerCondition,
            trailerComment: this.state.trailerComment,
            lightsJsonObject:
            {
                nearLight: this.state.nearLight2,
                beamLight: this.state.beamLight2,
                stopSignal: this.state.stopSignal2,
                turnSignal: this.state.turnSignal2,
            },
            wheelsJsonObject: {
                frontAxle: {
                    leftWheel: {
                        pressure: this.state.trailerPressure1,
                        rimState: this.state.trailerRimState1,
                        pinsState: this.state.trailerPinsState1,
                        tireState: this.state.trailerTireState1
                    },
                    rightWheel: {
                        pressure: this.state.trailerPressure2,
                        rimState: this.state.trailerRimState2,
                        pinsState: this.state.trailerPinsState2,
                        tireState: this.state.trailerTireState2
                    }
                },
                backAxle: {
                    leftWheel: {
                        pressure: this.state.trailerPressure3,
                        rimState: this.state.trailerRimState3,
                        pinsState: this.state.trailerPinsState3,
                        tireState: this.state.trailerTireState3
                    },
                    rightWheel: {
                        pressure: this.state.trailerPressure4,
                        rimState: this.state.trailerRimState4,
                        pinsState: this.state.trailerPinsState4,
                        tireState: this.state.trailerTireState4
                    }
                }
            },
            trailerCondition: this.state.trailerCondition,
            fendersOk: this.state.trailerFendersOk,
            fendersMountState: this.state.trailerFendersMountState,
        };

        var carQuestionaryObject = {
            transportId: this.state.car.id,
            generalCondition: this.state.generalCondition,
            lightsJsonObject:
            {
                nearLight: this.state.nearLight1,
                beamLight: this.state.beamLight1,
                distantLight: this.state.distantLight1,
                stopSignal: this.state.stopSignal1,
                turnSignal: this.state.turnSignal1,
            },
            wheelsJsonObject: {
                frontAxle: {
                    leftWheel: {
                        pressure: this.state.pressure1,
                        rimState: this.state.rimState1,
                        pinsState: this.state.pinsState1,
                        tireState: this.state.tireState1
                    },
                    rightWheel: {
                        pressure: this.state.pressure2,
                        rimState: this.state.rimState2,
                        pinsState: this.state.pinsState2,
                        tireState: this.state.tireState2
                    }
                },
                backAxle: {
                    leftWheel: {
                        pressure: this.state.pressure3,
                        rimState: this.state.rimState3,
                        pinsState: this.state.pinsState3,
                        tireState: this.state.tireState3
                    },
                    rightWheel: {
                        pressure: this.state.pressure4,
                        rimState: this.state.rimState4,
                        pinsState: this.state.pinsState4,
                        tireState: this.state.tireState4
                    }
                }
            },
            hydroEq: this.state.hydroEq,
            fendersOk: this.state.fendersOk1,
            fendersMountState: this.state.fendersMountState1,
            isCabinClean: this.state.cabinClean,
            platonInPlace: this.state.platonInPlace,
            platonSwitchedOn: this.state.platonSwitchedOn,
            mileage: this.state.mileage,
            cabinCushion: this.state.cabinCushion,
            rack: this.state.rack,
            frontSuspension: this.state.frontSuspension,
            backSuspension: this.state.backSuspension,
            generalCondition: this.state.generalCondition
        };

        if (this.state.car.axelsCount > 2) {
            carQuestionaryObject.wheelsJsonObject.middleAxle = carMiddleAxle;
        }

        if (this.state.trailer.axelsCount > 2) {
            trailerQuestionaryModel.wheelsJsonObject.middleAxle = trailerMiddleAxle;
        }


        var requestObject = {
            submitted: this.state.submitted,
            approvedByDriver: this.state.approvedByDriver,
            carQuestionaryModel: carQuestionaryObject,
            trailerQuestionaryModel: trailerQuestionaryModel,
            comment: this.state.comment,
            createdBy: this.state.userLogin,
            car: this.state.car
        };

        localStorage.setItem("questionary", JSON.stringify(requestObject));

        return requestObject;
    };

    validateForm() {

        const validate = (obj, validations) =>
            validations.every(key => ![undefined, null].includes(key.split('.').reduce((acc, cur) => acc?.[cur], obj)));

        const validations = [
            'driver',
            'nearLight1',            
            'distantLight1',
            //габариты
            'beamLight1',
            'turnSignal1',
            'stopSignal1',

            //габариты
            'beamLight2',            
            'turnSignal2',
            'stopSignal2',

            'pressure1',            
            'rimState1',
            'pinsState1',
            'tireState1',

            'pressure2',
            'rimState2',
            'pinsState2',
            'tireState2',

            'pressure3',
            'rimState3',
            'pinsState3',
            'tireState3',

            'pressure4',
            'rimState4',
            'pinsState4',
            'tireState4',

            'pressure5',
            'rimState5',
            'pinsState5',
            'tireState5',

            'pressure6',
            'rimState6',
            'pinsState6',
            'tireState6',

            'trailerPressure1',
            'trailerRimState1',
            'trailerPinsState1',
            'trailerTireState1',

            'trailerPressure2',
            'trailerRimState2',
            'trailerPinsState2',
            'trailerTireState2',

            'trailerPressure3',
            'trailerRimState3',
            'trailerPinsState3',
            'trailerTireState3',

            'trailerPressure4',
            'trailerRimState4',
            'trailerPinsState4',
            'trailerTireState4',

            'trailerPressure5',
            'trailerRimState5',
            'trailerPinsState5',
            'trailerTireState5',

            'trailerPressure6',
            'trailerRimState6',
            'trailerPinsState6',
            'trailerTireState6',

            'generalCondition',
            'trailerCondition',

            'cabinClean',
            'platonInPlace',
            'platonSwitchedOn',
            'fendersOk1',
            'fendersMountState1',


            'rack',
            'comment',
            'frontSuspension',
            'backSuspension',
            'hydroEq',
            'mileage',
            'userLogin'
        ];
    }


    commonChangedEvent(event, parameterName) {
        if (event.target.value == 'true') {
            this.setState({[parameterName]: true });
        } else {
            this.setState({[parameterName]: false });
        }
        this.constructAndCacheRequest();
    }

    commonPressureChangedEvent(event, parameterName) {
        if (event.target.value < 0) {
            this.setState({ [parameterName]: 0 });
        } else if (event.target.value > 15) {
            this.setState({ [parameterName]: 15 });
        } else {
            this.setState({ [parameterName]: event.target.value });
        }
        this.constructAndCacheRequest();
    }

    selectFile = (e) => {
        for (const file of e.target.files) {
            this.state.formData.append("Images", file);
        }
        this.constructAndCacheRequest();
    };

    mileageChanged(event) {
        this.setState({ mileage: event.target.value });
        this.constructAndCacheRequest();
    }

    commentChanged(event) {
        this.setState({ comment: event.target.value });
        this.constructAndCacheRequest();
    }

    trailerCommentChanged(event) {
        this.setState({ trailerComment: event.target.value });
        this.constructAndCacheRequest();
    }

    driverSelectionChanged(event, newValue) {
        this.setState({ driver: newValue });
    }

    conditionChanged(event){
        if (event.target.value == "true") {
            this.setState({ generalCondition: true });
        } else {
            this.setState({ generalCondition: false });
        }
        this.constructAndCacheRequest();
    }

    trailerConditionChanged(event) {
        if (event.target.value == "true") {
            this.setState({ trailerCondition: true });
        } else {
            this.setState({ trailerCondition: false });
        }
        this.constructAndCacheRequest();
    }

    componentDidMount() {
        const { plate } = this.props.params;
        if (plate) {
            this.setState({ loading: true });

            ApiService.getCarByPlate(plate)
                .then(({ data }) =>
                {
                    this.setState({
                        loading: false,
                        car: data,
                        drivers: data.drivers,
                        trailer: data.trailer
                    })
                })
                .catch((error) => {
                    this.setState({ loading: false, error })
                });

            this.setState({ loading: true });

            if (this.state.drivers.length === 0) {
                ApiService.getDrivers()
                    .then(({ data }) => {
                        this.setState({
                            loading: false,
                            drivers: data.list,
                        })
                    })
                    .catch((error) => {
                        this.setState({ loading: false, error })
                    });
            }
        }
    }

    render() {
        const { generalCondition, car, trailer, drivers, trailerCondition, errorMessage } = this.state;

        return (
            <div className="container">
                <form>
                    <h2>Осмотр {car.state === 0 ? <span>на выезд</span> : <span>на въезд</span>}</h2>

                    <h2>Тягач {car.brand} {car.model} (гос.номер: {car.plate})</h2>
                    <div className="row">
                        <h3>Световые приборы</h3>
                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Ближний свет"} id={"nearLight1"} isActive={this.state.nearLight1} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "nearLight1")} />
                            <StateRadioButtonGroup type={"Дальний свет"} id={"distantLight1"} isActive={this.state.distantLight1} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "distantLight1")} />
                                <StateRadioButtonGroup type={"Габариты"} id={"beamLigh1t"} isActive={this.state.beamLight1} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "beamLight1")} />
                        </div>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Поворотники"} id={"turn1"} isActive={this.state.turnSignal1} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "turnSignal1")} />
                            <StateRadioButtonGroup type={"Стоп-сигналы"} id={"stop1"} isActive={this.state.stopSignal1} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "stopSignal1")} />
                        </div>
                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Общее состояние</h3>

                        <div className="col-md-6">
                            <div className="col-md-6">
                                <label htmlFor="mileage">Пробег</label>
                                <input type="text" id="mileage" value={this.state.mileage} onChange={this.mileageChanged} />
                            </div> 

                            <StateRadioButtonGroup type={"Внешнее состояние"} id={"condition"} isActive={this.state.generalCondition} option1="С повреждениями" option2="Без повреждений" onChange={this.conditionChanged} />
                        </div>

                        {generalCondition === true ? <div className="col-md-6"><label htmlFor="comment">Комментарий</label><textarea rows="5" cols="40" type="text" id="comment" value={this.state.comment} onChange={this.commentChanged}/></div> : <span></span>}
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Чистота салона"} id={"cabin"} isActive={this.state.cabinClean} option1="Чистый" option2="Грязный" onChange={(event) => this.commonChangedEvent(event, "cabinClean")} />
                        </div>
                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Платон</h3>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Имеется"} id={"platonPresent"} isActive={this.state.platonInPlace} option1="Да" option2="Нет" onChange={(event) => this.commonChangedEvent(event, "platonInPlace")} />
                        </div>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Включен"} id={"platonActive"} isActive={this.state.platonSwitchedOn} option1="Да" option2="Нет" onChange={(event) => this.commonChangedEvent(event, "platonSwitchedOn")} />
                        </div>

                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <h1 className="d-flex justify-content-center">Левая сторона</h1>
                                <div className="form-row">
                                    <h5 className="d-flex justify-content-center">1 ось</h5>
                                    <div className="col-md-12">
                                        <StateRadioButtonGroup type={"Диски"} id={"rimState1"} isActive={this.state.rimState1} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState1")} />
                                        <StateRadioButtonGroup type={"Состояние резины"} id={"tireState1"} isActive={this.state.tireState1} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState1")} />
                                        <StateRadioButtonGroup type={"Шпильки"} id={"pinsState1"} isActive={this.state.pinsState1} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState1")} />
                                        <div className="form-group">
                                            <label htmlFor="pressure">Давление:</label>
                                            <input name="pressure" type="number" step="0.1" min="0" max="15" id="pressure1" value={this.state.pressure1} onChange={(event) => this.commonPressureChangedEvent(event, "pressure1")} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <h5 className="d-flex justify-content-center">2 ось</h5>
                                    <div className="col-md-12">
                                        <StateRadioButtonGroup type={"Диски"} id={"rimState3"} isActive={this.state.rimState3} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState3")} />
                                        <StateRadioButtonGroup type={"Состояние резины"} id={"tireState3"} isActive={this.state.tireState3} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState3")} />
                                        <StateRadioButtonGroup type={"Шпильки"} id={"pinsState3"} isActive={this.state.pinsState3} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState3")} />
                                        <div className="form-group">
                                            <label htmlFor="pressure">Давление:</label>
                                            <input name="pressure" type="number" step="0.1" min="0" max="15" id="pressure3" value={this.state.pressure3} onChange={(event) => this.commonPressureChangedEvent(event, "pressure3")} />
                                        </div>
                                    </div>
                                </div>
                                {car.axelsCount > 2 ? <div className="form-row">
                                    <h5 className="d-flex justify-content-center">3 ось</h5>
                                    <div className="col-md-12">
                                        <StateRadioButtonGroup type={"Диски"} id={"rimState5"} isActive={this.state.rimState5} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState5")} />
                                        <StateRadioButtonGroup type={"Состояние резины"} id={"tireState5"} isActive={this.state.tireState5} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState5")} />
                                        <StateRadioButtonGroup type={"Шпильки"} id={"pinsState5"} isActive={this.state.pinsState5} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState5")} />
                                        <div className="form-group">
                                            <label htmlFor="pressure">Давление:</label>
                                            <input name="pressure" type="number" step="0.1" min="0" max="15" id="pressure5" value={this.state.pressure5} onChange={(event) => this.commonPressureChangedEvent(event, "pressure5")} />
                                        </div>
                                    </div>
                                </div> : <></>}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <h1 className="d-flex justify-content-center">Правая сторона</h1>
                            <div className="form-row">
                                <h5 className="d-flex justify-content-center">1 ось</h5>
                                <div className="col-md-12">
                                    <StateRadioButtonGroup type={"Диски"} id={"rimState2"} isActive={this.state.rimState2} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState2")} />
                                    <StateRadioButtonGroup type={"Состояние резины"} id={"tireState2"} isActive={this.state.tireState2} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState2")} />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"pinsState2"} isActive={this.state.pinsState2} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState2")} />
                                    <div className="form-group">
                                        <label htmlFor="pressure">Давление:</label>
                                        <input name="pressure" type="number" step="0.1" min="0" max="15" id="pressure2" value={this.state.pressure2} onChange={(event) => this.commonPressureChangedEvent(event, "pressure2")} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <h5 className="d-flex justify-content-center">2 ось</h5>
                                <div className="col-md-12">
                                    <StateRadioButtonGroup type={"Диски"} id={"rimState4"} isActive={this.state.rimState4} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState4")} />
                                    <StateRadioButtonGroup type={"Состояние резины"} id={"tireState4"} isActive={this.state.tireState4} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState4")} />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"pinsState4"} isActive={this.state.pinsState4} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState4")} />
                                    <div className="form-group">
                                        <label htmlFor="pressure">Давление:</label>
                                        <input name="pressure" type="number" step="0.1" min="0" max="15" id="pressure4" value={this.state.pressure4} onChange={(event) => this.commonPressureChangedEvent(event, "pressure4")} />
                                    </div>
                                </div>
                            </div>
                            {car.axelsCount > 2 ?
                                <div className="form-row">
                                <h5 className="d-flex justify-content-center">3 ось</h5>
                                <div className="col-md-12">
                                    <StateRadioButtonGroup type={"Диски"} id={"rimState6"} isActive={this.state.rimState6} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState6")} />
                                    <StateRadioButtonGroup type={"Состояние резины"} id={"tireState6"} isActive={this.state.tireState6} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState6")} />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"pinsState6"} isActive={this.state.pinsState6} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState6")} />
                                    <div className="form-group">
                                        <label htmlFor="pressure">Давление:</label>
                                        <input name="pressure" type="number" step="0.1" min="0" max="15" id="pressure6" value={this.state.pressure6} onChange={(event) => this.commonPressureChangedEvent(event, "pressure6")} />
                                    </div>
                                </div>
                            </div> : <></> }
                        </div>
                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Состояние подушек</h3>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Как стоят подушки?"} id={"cabinCushion"} isActive={this.state.cabinCushion} option1="Штатно" option2="Не штатно" onChange={(event) => this.commonChangedEvent(event, "cabinCushion")} />
                        </div>

                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Состояние крыльев</h3>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Крепления"} id={"fendersOk1"} isActive={this.state.fendersOk1} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "fendersOk1")} />
                        </div>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Целостность"} id={"fendersMountState1"} isActive={this.state.fendersMountState1} option1="Целые" option2="Повреждения" onChange={(event) => this.commonChangedEvent(event, "fendersMountState1")} />
                        </div>

                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Рама и подвеска</h3>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Рама целая?"} id={"rack"} isActive={this.state.rack} option1="Да" option2="Нет" onChange={(event) => this.commonChangedEvent(event, "rack")} />
                        </div>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Стук лифтов передней подвески"} id={"frontSuspension"} isActive={this.state.frontSuspension} option1="Да" option2="Нет" onChange={(event) => this.commonChangedEvent(event, "frontSuspension")} />
                            <StateRadioButtonGroup type={"Стук лифтов задней подвески"} id={"backSuspension"} isActive={this.state.backSuspension} option1="Да" option2="Нет" onChange={(event) => this.commonChangedEvent(event, "backSuspension")} />
                        </div>

                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Гидрооборудование</h3>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Гидрооборудование"} id={"hydroEq"} isActive={this.state.hydroEq} option1="Не протёрто" option2="Протёрто" onChange={(event) => this.commonChangedEvent(event, "hydroEq")} />
                        </div>
                        <hr className="solid" />
                    </div>

                    {trailer && <div>                    <h2>Полуприцеп {trailer.brand} {trailer.model} (гос.номер: {trailer.plate})</h2>

                        <div className="row">
                            <h3>Световые приборы</h3>
                            <div className="col-md-6">
                                <StateRadioButtonGroup type={"Габариты"} id={"beamLight2"} isActive={this.state.beamLight2} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "beamLight2")} />
                            </div>

                            <div className="col-md-6">
                                <StateRadioButtonGroup type={"Поворотники"} id={"turn2"} isActive={this.state.turnSignal2} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "turnSignal2")} />
                                <StateRadioButtonGroup type={"Стоп-сигналы"} id={"stop2"} isActive={this.state.stopSignal2} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "stopSignal2")} />
                            </div>
                            <hr className="solid" />
                        </div>

                        <div className="row">
                            <h3>Общее состояние</h3>

                            <div className="col-md-6">
                                <StateRadioButtonGroup type={"Внешнее состояние"} id={"trailercondition"} isActive={this.state.trailerCondition} option1="С повреждениями" option2="Без повреждений" onChange={this.trailerConditionChanged} />
                            </div>

                            {trailerCondition === true ? <div className="col-md-6"><label htmlFor="comment">Комментарий</label><textarea rows="5" cols="40" type="text" id="comment" value={this.state.trailerComment} onChange={this.trailerCommentChanged} /></div> : <span></span>}

                            <hr className="solid" />
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <h1 className="d-flex justify-content-center">Левая сторона</h1>
                                    <div className="form-row">
                                        <h5 className="d-flex justify-content-center">1 ось</h5>
                                        <div className="col-md-12">
                                            <StateRadioButtonGroup type={"Диски"} id={"trailerRimState1"} isActive={this.state.trailerRimState1} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "trailerRimState1")} />
                                            <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState1"} isActive={this.state.trailerTireState1} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "trailerTireState1")} />
                                            <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState1"} isActive={this.state.trailerPinsState1} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "trailerPinsState1")} />
                                            <div className="form-group">
                                                <label htmlFor="pressure">Давление:</label>
                                                <input name="pressure" type="number" step="0.1" min="0" max="15" id="trailerPressure1" value={this.state.trailerPressure1} onChange={(event) => this.commonPressureChangedEvent(event, "trailerPressure1")} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <h5 className="d-flex justify-content-center">2 ось</h5>
                                        <div className="col-md-12">
                                            <StateRadioButtonGroup type={"Диски"} id={"trailerRimState3"} isActive={this.state.trailerRimState3} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "trailerRimState3")} />
                                            <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState3"} isActive={this.state.trailerTireState3} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "trailerTireState3")} />
                                            <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState3"} isActive={this.state.trailerPinsState3} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "trailerPinsState3")} />
                                            <div className="form-group">
                                                <label htmlFor="pressure">Давление:</label>
                                                <input name="pressure" type="number" step="0.1" min="0" max="15" id="trailerPressure3" value={this.state.trailerPressure3} onChange={(event) => this.commonPressureChangedEvent(event, "trailerPressure3")} />
                                            </div>
                                        </div>
                                    </div>
                                    {trailer.axelsCount > 2 ? <div className="form-row">
                                        <h5 className="d-flex justify-content-center">3 ось</h5>
                                        <div className="col-md-12">
                                            <StateRadioButtonGroup type={"Диски"} id={"trailerRimState5"} isActive={this.state.trailerRimState5} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "trailerRimState5")} />
                                            <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState5"} isActive={this.state.trailerTireState5} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "trailerTireState5")} />
                                            <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState5"} isActive={this.state.trailerPinsState5} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "trailerPinsState5")} />
                                            <div className="form-group">
                                                <label htmlFor="pressure">Давление:</label>
                                                <input name="pressure" type="number" step="0.1" min="0" max="15" id="trailerPressure5" value={this.state.trailerPressure5} onChange={(event) => this.commonPressureChangedEvent(event, "trailerPressure5")} />
                                            </div>
                                        </div>
                                    </div> : <></>}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <h1 className="d-flex justify-content-center">Правая сторона</h1>
                                <div className="form-row">
                                    <h5 className="d-flex justify-content-center">1 ось</h5>
                                    <div className="col-md-12">
                                        <StateRadioButtonGroup type={"Диски"} id={"trailerRimState2"} isActive={this.state.trailerRimState2} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "trailerRimState2")} />
                                        <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState2"} isActive={this.state.trailerTireState2} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "trailerTireState2")} />
                                        <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState2"} isActive={this.state.trailerPinsState2} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "trailerPinsState2")} />
                                        <div className="form-group">
                                            <label htmlFor="pressure">Давление:</label>
                                            <input name="pressure" type="number" step="0.1" min="0" max="15" id="trailerPressure2" value={this.state.trailerPressure2} onChange={(event) => this.commonPressureChangedEvent(event, "trailerPressure2")} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <h5 className="d-flex justify-content-center">2 ось</h5>
                                    <div className="col-md-12">
                                        <StateRadioButtonGroup type={"Диски"} id={"trailerRimState4"} isActive={this.state.trailerRimState4} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "trailerRimState4")} />
                                        <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState4"} isActive={this.state.trailerTireState4} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "trailerTireState4")} />
                                        <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState4"} isActive={this.state.trailerPinsState4} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "trailerPinsState4")} />
                                        <div className="form-group">
                                            <label htmlFor="pressure">Давление:</label>
                                            <input name="pressure" type="number" step="0.1" min="0" max="15" id="trailerPressure4" value={this.state.trailerPressure4} onChange={(event) => this.commonPressureChangedEvent(event, "trailerPressure4")} />
                                        </div>
                                    </div>
                                </div>
                                {trailer.axelsCount > 2 ? <div className="form-row">
                                    <h5 className="d-flex justify-content-center">3 ось</h5>
                                    <div className="col-md-12">
                                        <StateRadioButtonGroup type={"Диски"} id={"trailerRimState6"} isActive={this.state.trailerRimState6} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "trailerRimState6")} />
                                        <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState6"} isActive={this.state.trailerTireState6} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "trailerTireState6")} />
                                        <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState6"} isActive={this.state.trailerPinsState6} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "trailerPinsState6")} />
                                        <div className="form-group">
                                            <label htmlFor="pressure">Давление:</label>
                                            <input name="pressure" type="number" step="0.1" min="0" max="15" id="trailerPressure6" value={this.state.trailerPressure6} onChange={(event) => this.commonPressureChangedEvent(event, "trailerPressure6")} />
                                        </div>
                                    </div>
                                </div> : <></>}
                            </div>
                            <hr className="solid" />
                        </div>

                        <div className="row">
                            <h3>Состояние крыльев</h3>

                            <div className="col-md-6">
                                <StateRadioButtonGroup type={"Крепления"} id={"trailerFendersOk"} isActive={this.state.trailerFendersOk} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "trailerFendersOk")} />
                            </div>

                            <div className="col-md-6">
                                <StateRadioButtonGroup type={"Целостность"} id={"trailerFendersMountState1"} isActive={this.state.trailerFendersMountState} option1="Целые" option2="Повреждения" onChange={(event) => this.commonChangedEvent(event, "trailerFendersMountState")} />
                            </div>

                            <hr className="solid" />
                        </div>
                     </div>}

                    <div className="row mb-3">
                        <div className="form-row">
                            <div className="col-md-6">
                                <label htmlFor="files">Прикрепить фотографии</label>
                                <input type="file" id="files" accept=".jpg, .png" multiple onChange={this.selectFile}></input>
                            </div>

                            { }
                            <div className="col-md-6">
                                <label>Выберите водителя</label>
                                <Autocomplete
                                    disablePortal
                                    onChange={(e, newvalue) => this.driverSelectionChanged(e, newvalue)}
                                    id="combo-box-demo"
                                    options={drivers}
                                    sx={{ width: 300 }}
                                    getOptionLabel={(option) => `${option.lastName} ${option.firstName} ${option.middleName}`}
                                    renderInput={(params) => <TextField {...params} label="Список водителей" />}/>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <input type="button" className="btn btn-success" onClick={this.handleSubmit} value="Сохранить и передать водителю"></input>
                            </div>
                        </div>
                        {this.state.errorMessage && (
                            <div>
                                <div className="alert alert-danger mt-2" role="alert">
                                    {this.state.errorMessage}
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(Questionary);