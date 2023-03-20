import React, { Component } from "react";
import ApiService from "../services/cartekApiService";
import withRouter from "./withRouter";
import StateRadioButtonGroup from "./radiobuttongroup";
import "./questionary.component.css";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import _ from "lodash";
import { Link } from "react-router-dom";

class Questionary extends Component {

    constructor(props) {
        super(props);

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

            pressure3_2: "",
            rimState3_2: '',
            pinsState3_2: '',
            tireState3_2: '',

            pressure4: "",
            rimState4: '',
            pinsState4: '',
            tireState4: '',

            pressure4_2: "",
            rimState4_2: '',
            pinsState4_2: '',
            tireState4_2: '',

            pressure5: "",
            rimState5: '',
            pinsState5: '',
            tireState5: '',

            pressure5_2: "",
            rimState5_2: '',
            pinsState5_2: '',
            tireState5_2: '',

            pressure6: "",
            rimState6: '',
            pinsState6: '',
            tireState6: '',

            pressure6_2: "",
            rimState6_2: '',
            pinsState6_2: '',
            tireState6_2: '',

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
            userLogin: "",
            uniqueId: "",
            validated: false
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

            this.state.pressure3_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.leftWheel2.pressure;
            this.state.rimState3_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.leftWheel2.rimState;
            this.state.pinsState3_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.leftWheel2.pinsState;
            this.state.tireState3_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.leftWheel2.tireState;

            this.state.pressure4 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.rightWheel.pressure;
            this.state.rimState4 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.rightWheel.rimState;
            this.state.pinsState4 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.rightWheel.pinsState;
            this.state.tireState4 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.rightWheel.tireState;

            this.state.pressure4_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.rightWheel2.pressure;
            this.state.rimState4_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.rightWheel2.rimState;
            this.state.pinsState4_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.rightWheel2.pinsState;
            this.state.tireState4_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.backAxle.rightWheel2.tireState;

            if (cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle) {
                this.state.pressure5 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel.pressure;
                this.staterimState5 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel.rimState;
                this.state.pinsState5 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel.pinsState;
                this.state.tireState5 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel.tireState;

                this.state.pressure5_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel2.pressure;
                this.staterimState5_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel2.rimState;
                this.state.pinsState5_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel2.pinsState;
                this.state.tireState5_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.leftWheel2.tireState;

                this.state.pressure6 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel.pressure;
                this.state.rimState6 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel.rimState;
                this.state.pinsState6 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel.pinsState;
                this.state.tireState6 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel.tireState;

                this.state.pressure6_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel2.pressure;
                this.state.rimState6_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel2.rimState;
                this.state.pinsState6_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel2.pinsState;
                this.state.tireState6_2 = cachedQuestionary.carQuestionaryModel.wheelsJsonObject.middleAxle.rightWheel2.tireState;
            }

            if (!_.isEmpty(this.state.trailer)) {
                //габариты
                this.state.beamLight2 = cachedQuestionary.trailerQuestionaryModel.lightsJsonObject.beamLight;
                this.state.turnSignal2 = cachedQuestionary.trailerQuestionaryModel.lightsJsonObject.turnSignal;
                this.state.stopSignal2 = cachedQuestionary.trailerQuestionaryModel.lightsJsonObject.stopSignal;

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
                this.state.trailerCondition = cachedQuestionary.trailerQuestionaryModel.trailerCondition;
                this.state.trailerComment = cachedQuestionary.trailerQuestionaryModel.trailerComment;

                this.state.trailerFendersOk = cachedQuestionary.trailerQuestionaryModel.fendersOk;
                this.state.trailerFendersMountState = cachedQuestionary.trailerQuestionaryModel.fendersMountState;
            }


            this.state.generalCondition = cachedQuestionary.carQuestionaryModel.generalCondition;

            this.state.cabinCushion = cachedQuestionary.carQuestionaryModel.cabinCushion;
            this.state.cabinClean = cachedQuestionary.carQuestionaryModel.isCabinClean;
            this.state.platonInPlace = cachedQuestionary.carQuestionaryModel.platonInPlace;
            this.state.platonSwitchedOn = cachedQuestionary.carQuestionaryModel.platonSwitchedOn;
            this.state.fendersOk1 = cachedQuestionary.carQuestionaryModel.fendersOk;
            this.state.fendersMountState1 = cachedQuestionary.carQuestionaryModel.fendersMountState;


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

            var isFormValid = this.validateForm();

            if (isFormValid) {
                ApiService.sendQuestionary(this.state.formData).then(response => {
                    this.setState({ createdQuestionary: response.data });
                    this.constructAndCacheRequest(true, response.data.uniqueId);
                    alert("Анкета сохранена");
                    this.props.navigate(`/cars/acceptCar/${response.data.uniqueId}`);
                }, error => {
                    if (error.code == 'ERR_NETWORK') {
                        this.setState({ errorMessage: "Ошибка сети" });
                    }
                    else
                        this.setState({ errorMessage: "Анкета не сохранена" });
                });
            }
        };
    }

    constructAndCacheRequest(submitted, uniqueId) {
        this.state.formData.delete("CreatedBy");
        this.state.formData.delete("CarQuestionaryModel");
        this.state.formData.delete("TrailerQuestionaryModel");
        this.state.formData.delete("Comment");
        this.state.formData.delete("DriverId");
        this.state.formData.delete("CarId");

        var carMiddleAxle = {
            leftWheel: {
                pressure: this.state.pressure5,
                rimState: this.state.rimState5,
                pinsState: this.state.pinsState5,
                tireState: this.state.tireState5
            },
            leftWheel2: {
                pressure: this.state.pressure5_2,
                rimState: this.state.rimState5_2,
                pinsState: this.state.pinsState5_2,
                tireState: this.state.tireState5_2
            },
            rightWheel: {
                pressure: this.state.pressure6,
                rimState: this.state.rimState6,
                pinsState: this.state.pinsState6,
                tireState: this.state.tireState6
            },
            rightWheel2: {
                pressure: this.state.pressure6_2,
                rimState: this.state.rimState6_2,
                pinsState: this.state.pinsState6_2,
                tireState: this.state.tireState6_2
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
                    leftWheel2: {
                        pressure: this.state.pressure3_2,
                        rimState: this.state.rimState3_2,
                        pinsState: this.state.pinsState3_2,
                        tireState: this.state.tireState3_2
                    },

                    rightWheel: {
                        pressure: this.state.pressure4,
                        rimState: this.state.rimState4,
                        pinsState: this.state.pinsState4,
                        tireState: this.state.tireState4
                    },
                    rightWheel2: {
                        pressure: this.state.pressure4_2,
                        rimState: this.state.rimState4_2,
                        pinsState: this.state.pinsState4_2,
                        tireState: this.state.tireState4_2
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

        var requestObject = {
            uniqueId: uniqueId,
            submitted: submitted,
            approvedByDriver: this.state.approvedByDriver,
            carQuestionaryModel: carQuestionaryObject,
            comment: this.state.comment,
            createdBy: this.state.userLogin,
            car: this.state.car
        };

        if (!_.isEmpty(this.state.trailer)) {
            var trailerQuestionaryModel = {
                transportId: this.state.trailer.id,
                generalCondition: this.state.trailerCondition,
                trailerComment: this.state.trailerComment,
                lightsJsonObject:
                {
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

            if (this.state.trailer.axelsCount > 2) {
                trailerQuestionaryModel.wheelsJsonObject.middleAxle = trailerMiddleAxle;
            }

            requestObject.trailerQuestionaryModel = trailerQuestionaryModel;

        }


        localStorage.setItem("questionary", JSON.stringify(requestObject));

        return requestObject;
    };

    validateForm() {

        let isValid = true;

        this.setState({ validated: true });

        this.setState({ errorMessage: null });


        if (this.state.nearLight1 === '') {
            isValid = false;
        }

        if (this.state.distantLight1 === '') {
            isValid = false;
        }

        if (this.state.turnSignal1 === '') {
            isValid = false;
        }

        if (this.state.beamLight1 === '') {
            isValid = false;
        }

        if (this.state.stopSignal1 === '') {
            isValid = false;
        }

        ///////////////////////////////
        if (this.state.pressure1 === "") {
            isValid = false;
        }

        if (this.state.rimState1 === '') {
            isValid = false;
        }

        if (this.state.pinsState1 === '') {
            isValid = false;
        }

        if (this.state.tireState1 === '') {
            isValid = false;
        }

        ////////////////////////////////
        if (this.state.pressure2 === "") {
            isValid = false;
        }

        if (this.state.rimState2 === '') {
            isValid = false;
        }

        if (this.state.pinsState2 === '') {
            isValid = false;
        }

        if (this.state.tireState2 === '') {
            isValid = false;
        }
        
        //////////////////////////////////
        if (this.state.pressure3 === "") {
            isValid = false;
        }

        if (this.state.rimState3 === '') {
            isValid = false;
        }

        if (this.state.pinsState3 === '') {
            isValid = false;
        }

        if (this.state.tireState3 === '') {
            isValid = false;
        }
        /////////////////////////////////


        if (this.state.pressure3_2 === "") {
            isValid = false;
        }

        if (this.state.rimState3_2 === '') {
            isValid = false;
        }

        if (this.state.pinsState3_2 === '') {
            isValid = false;
        }

        if (this.state.tireState3_2 === '') {
            isValid = false;
        }

        ////////////////////////////////
        if (this.state.pressure4 === "") {
            isValid = false;
        }

        if (this.state.rimState4 === '') {
            isValid = false;
        }

        if (this.state.pinsState4 === '') {
            isValid = false;
        }

        if (this.state.tireState4 === '') {
            isValid = false;
        }


        if (this.state.pressure4_2 === "") {
            isValid = false;
        }

        if (this.state.rimState4_2 === '') {
            isValid = false;
        }

        if (this.state.pinsState4_2 === '') {
            isValid = false;
        }

        if (this.state.tireState4_2 === '') {
            isValid = false;
        }

        if (this.state.car.axelsCount > 2) {

            if (this.state.pressure5 === "") {
                isValid = false;
            }

            if (this.state.rimState5 === '') {
                isValid = false;
            }

            if (this.state.pinsState5 === '') {
                isValid = false;
            }

            if (this.state.tireState5 === '') {
                isValid = false;
            }
            /////////////////////////////////            
            if (this.state.pressure5_2 === "") {
                isValid = false;
            }

            if (this.state.rimState5_2 === '') {
                isValid = false;
            }

            if (this.state.pinsState5_2 === '') {
                isValid = false;
            }

            if (this.state.tireState5_2 === '') {
                isValid = false;
            }
            /////////////////////////////////
            if (this.state.pressure6 === "") {
                isValid = false;
            }

            if (this.state.rimState6 === '') {
                isValid = false;
            }

            if (this.state.pinsState6 === '') {
                isValid = false;
            }

            if (this.state.tireState6 === '') {
                isValid = false;
            }
            /////////////////////////////////
            if (this.state.pressure6_2 === "") {
                isValid = false;
            }

            if (this.state.rimState6_2 === '') {
                isValid = false;
            }

            if (this.state.pinsState6_2 === '') {
                isValid = false;
            }

            if (this.state.tireState6_2 === '') {
                isValid = false;
            }
        }
        ////////////////////////////////////////

        if (!_.isEmpty(this.state.trailer)) {

            //////////////////////////////
            if (this.state.beamLight2 === '') {
                isValid = false;
            }

            if (this.state.turnSignal2 === '') {
                isValid = false;
            }

            if (this.state.stopSignal2 === '') {
                isValid = false;
            }

            if (this.state.trailerPressure1 === "") {
                isValid = false;
            }

            if (this.state.trailerRimState1 === '') {
                isValid = false;
            }

            if (this.state.trailerPinsState1 === '') {
                isValid = false;
            }

            if (this.state.trailerTireState1 === '') {
                isValid = false;
            }
            /////////////////////////////////////
            if (this.state.trailerPressure2 === "") {
                isValid = false;
            }

            if (this.state.trailerRimState2 === '') {
                isValid = false;
            }

            if (this.state.trailerPinsState2 === '') {
                isValid = false;
            }

            if (this.state.trailerTireState2 === '') {
                isValid = false;
            }
            /////////////////////////////////////
            if (this.state.trailerPressure3 === "") {
                isValid = false;
            }

            if (this.state.trailerRimState3 === '') {
                isValid = false;
            }

            if (this.state.trailerPinsState3 === '') {
                isValid = false;
            }

            if (this.state.trailerTireState3 === '') {
                isValid = false;
            }
            /////////////////////////////////////
            if (this.state.trailerPressure4 === "") {
                isValid = false;
            }

            if (this.state.trailerRimState4 === '') {
                isValid = false;
            }

            if (this.state.trailerPinsState4 === '') {
                isValid = false;
            }

            if (this.state.trailerTireState4 === '') {
                isValid = false;
            }

            if (this.state.trailer.axelsCount > 2) {

                /////////////////////////////////////
                if (this.state.trailerPressure5 === "") {
                    isValid = false;
                }

                if (this.state.trailerRimState5 === '') {
                    isValid = false;
                }

                if (this.state.trailerPinsState5 === '') {
                    isValid = false;
                }

                if (this.state.trailerTireState5 === '') {
                    isValid = false;
                }
                /////////////////////////////////////
                if (this.state.trailerPressure6 === "") {
                    isValid = false;
                }

                if (this.state.trailerRimState6 === '') {
                    isValid = false;
                }

                if (this.state.trailerPinsState6 === '') {
                    isValid = false;
                }

                if (this.state.trailerTireState6 === '') {
                    isValid = false;
                }
            }

            if (this.state.trailerCondition === '') {
                isValid = false;
            }


            if (this.state.trailerFendersOk === '') {
                isValid = false;
            }

            if (this.state.trailerFendersMountState === '') {
                isValid = false;
            }
        }


        if (this.state.hydroEq === '') {
            isValid = false;
        }

        if (this.state.generalCondition === '') {
            isValid = false;
        }

        if (this.state.cabinCushion === '') {
            isValid = false;
        }

        if (this.state.cabinClean === '') {
            isValid = false;
        }

        if (this.state.platonInPlace === '') {
            isValid = false;
        }

        if (this.state.platonSwitchedOn === '') {
            isValid = false;
        }

        if (this.state.fendersOk1 === '') {
            isValid = false;
        }

        if (this.state.fendersMountState1 === '') {
            isValid = false;
        }

        if (this.state.rack === '') {
            isValid = false;
        }

        if (this.state.frontSuspension === '') {
            isValid = false;
        }

        if (this.state.backSuspension === '') {
            isValid = false;
        }


        if (this.state.mileage === 0 || this.state.mileage === '' ){
            isValid = false;
        }

        if (this.state.driver.id == undefined) {
            isValid = false;
        }

        if (!isValid)
            this.setState({ errorMessage: "Не все поля заполнены!\n Внимательно проверьте анкету и отправьте еще раз!" });

        return (isValid);
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
        this.state.formData.delete("Images");

        for (const file of e.target.files) {
            console.log(file);
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
            if (this.state.drivers.length === 0 || this.state.drivers == null) {
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
                    <h2>Осмотр</h2>

                    <h2>Тягач {car.brand} {car.model} (гос.номер: {car.plate}) {trailer && <>, прицеп: {trailer.plate} </>}</h2>
                    <div className="row">
                        <h3>Световые приборы</h3>
                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Ближний свет"} id={"nearLight1"} validated={this.state.validated} isActive={this.state.nearLight1} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "nearLight1")} />
                            <StateRadioButtonGroup type={"Дальний свет"} id={"distantLight1"} validated={this.state.validated} isActive={this.state.distantLight1} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "distantLight1")} />
                            <StateRadioButtonGroup type={"Габариты"} id={"beamLigh1t"} validated={this.state.validated} isActive={this.state.beamLight1} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "beamLight1")} />
                        </div>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Поворотники"} id={"turn1"} validated={this.state.validated} isActive={this.state.turnSignal1} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "turnSignal1")} />
                            <StateRadioButtonGroup type={"Стоп-сигналы"} id={"stop1"} validated={this.state.validated} isActive={this.state.stopSignal1} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "stopSignal1")} />
                        </div>
                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Общее состояние</h3>

                        <div className="col-md-6">
                            <div className="col-md-6">
                                <label htmlFor="mileage">Пробег</label>
                                <input type="text" className={this.state.validated && this.state.mileage === 0 || this.state.mileage === '' ? "not-valid-input-border" : ""} id="mileage" value={this.state.mileage} onChange={this.mileageChanged} />
                            </div> 

                            <StateRadioButtonGroup type={"Внешнее состояние"} validated={this.state.validated} id={"condition"} isActive={this.state.generalCondition} option1="С повреждениями" option2="Без повреждений" onChange={this.conditionChanged} />
                        </div>

                        {generalCondition === true ? <div className="col-md-6"><label htmlFor="comment">Комментарий</label><textarea rows="5" cols="40" type="text" id="comment" value={this.state.comment} onChange={this.commentChanged}/></div> : <span></span>}
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Чистота салона"} validated={this.state.validated} id={"cabin"} isActive={this.state.cabinClean} option1="Чистый" option2="Грязный" onChange={(event) => this.commonChangedEvent(event, "cabinClean")} />
                        </div>
                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Платон</h3>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Имеется"} validated={this.state.validated} id={"platonPresent"} isActive={this.state.platonInPlace} option1="Да" option2="Нет" onChange={(event) => this.commonChangedEvent(event, "platonInPlace")} />
                        </div>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Включен"} validated={this.state.validated} id={"platonActive"} isActive={this.state.platonSwitchedOn} option1="Да" option2="Нет" onChange={(event) => this.commonChangedEvent(event, "platonSwitchedOn")} />
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
                                        <StateRadioButtonGroup type={"Диски"} validated={this.state.validated} id={"rimState1"} isActive={this.state.rimState1} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState1")} />
                                        <StateRadioButtonGroup type={"Состояние резины"} validated={this.state.validated} id={"tireState1"} isActive={this.state.tireState1} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState1")} />
                                        <StateRadioButtonGroup type={"Шпильки"} validated={this.state.validated} id={"pinsState1"} isActive={this.state.pinsState1} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState1")} />
                                        <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"pressure1"} isActive={this.state.pressure1} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "pressure1")} />
                                    </div>
                                </div>
                                <div className="row">
                                    <h5 className="d-flex justify-content-center">2 ось</h5>
                                    <div className="col-md-6">
                                        <h6>Внешнее</h6>
                                        <StateRadioButtonGroup type={"Диски"} validated={this.state.validated} id={"rimState3"} isActive={this.state.rimState3} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState3")} />
                                        <StateRadioButtonGroup type={"Состояние резины"} validated={this.state.validated} id={"tireState3"} isActive={this.state.tireState3} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState3")} />
                                        <StateRadioButtonGroup type={"Шпильки"} validated={this.state.validated} id={"pinsState3"} isActive={this.state.pinsState3} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState3")} />
                                        <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"pressure3"} isActive={this.state.pressure3} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "pressure3")} />
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Внутреннее</h6>
                                        <StateRadioButtonGroup validated={this.state.validated} id={"rimState3_2"} isActive={this.state.rimState3_2} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState3_2")} />
                                        <StateRadioButtonGroup validated={this.state.validated} id={"tireState3_2"} isActive={this.state.tireState3_2} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState3_2")} />
                                        <StateRadioButtonGroup validated={this.state.validated} id={"pinsState3_2"} isActive={this.state.pinsState3_2} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState3_2")} />
                                        <StateRadioButtonGroup validated={this.state.validated} id={"pressure3_2"} isActive={this.state.pressure3_2} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pressure3_2")} />
                                    </div>
                                </div>
                                {car.axelsCount > 2 ? <div className="row">
                                    <h5 className="d-flex justify-content-center">3 ось</h5>
                                    <div className="col-md-6">
                                        <h6>Внешнее</h6>
                                        <StateRadioButtonGroup type={"Диски"} validated={this.state.validated} id={"rimState5"} isActive={this.state.rimState5} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState5")} />
                                        <StateRadioButtonGroup type={"Состояние резины"} validated={this.state.validated} id={"tireState5"} isActive={this.state.tireState5} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState5")} />
                                        <StateRadioButtonGroup type={"Шпильки"} validated={this.state.validated} id={"pinsState5"} isActive={this.state.pinsState5} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState5")} />
                                        <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"pressure5"} isActive={this.state.pressure5} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "pressure5")} />
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Внутреннее</h6>
                                        <StateRadioButtonGroup type={"Диски"} validated={this.state.validated} id={"rimState5_2"} isActive={this.state.rimState5_2} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState5_2")} />
                                        <StateRadioButtonGroup type={"Состояние резины"} validated={this.state.validated} id={"tireState5_2"} isActive={this.state.tireState5_2} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState5_2")} />
                                        <StateRadioButtonGroup type={"Шпильки"} validated={this.state.validated} id={"pinsState5_2"} isActive={this.state.pinsState5_2} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState5_2")} />
                                        <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"pressure5_2"} isActive={this.state.pressure5_2} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "pressure5_2")} />
                                    </div>
                                </div> : <></>}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <h1 className="d-flex justify-content-center">Правая сторона</h1>
                            <div className="form-row">
                                <h5 className="d-flex justify-content-center">1 ось</h5>
                                <div className="col-md-12">
                                    <StateRadioButtonGroup type={"Диски"} validated={this.state.validated} id={"rimState2"} isActive={this.state.rimState2} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState2")} />
                                    <StateRadioButtonGroup type={"Состояние резины"} validated={this.state.validated} id={"tireState2"} isActive={this.state.tireState2} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState2")} />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"pinsState2"} validated={this.state.validated} isActive={this.state.pinsState2} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState2")} />
                                    <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"pressure2"} isActive={this.state.pressure2} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "pressure2")} />
                                </div>
                            </div>
                            <div className="row">
                                <h5 className="d-flex justify-content-center">2 ось</h5>
                                <div className="col-md-6">
                                    <h6>Внешнее</h6>
                                    <StateRadioButtonGroup type={"Диски"} id={"rimState4"} validated={this.state.validated} isActive={this.state.rimState4} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState4")} />
                                    <StateRadioButtonGroup type={"Состояние резины"} id={"tireState4"} validated={this.state.validated} isActive={this.state.tireState4} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState4")} />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"pinsState4"} validated={this.state.validated} isActive={this.state.pinsState4} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState4")} />
                                    <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"pressure4"} isActive={this.state.pressure4} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "pressure4")} />
                                </div>
                                <div className="col-md-6">
                                    <h6>Внутреннее</h6>
                                    <StateRadioButtonGroup type={"Диски"} id={"rimState4_2"} validated={this.state.validated} isActive={this.state.rimState4_2} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState4_2")} />
                                    <StateRadioButtonGroup type={"Состояние резины"} id={"tireState4_2"} validated={this.state.validated} isActive={this.state.tireState4_2} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState4_2")} />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"pinsState4_2"} validated={this.state.validated} isActive={this.state.pinsState4_2} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState4_2")} />
                                    <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"pressure4_2"} isActive={this.state.pressure4_2} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "pressure4_2")} />
                                </div>
                            </div>
                            {car.axelsCount > 2 ?
                                <div className="row">
                                <h5 className="d-flex justify-content-center">3 ось</h5>
                                    <div className="col-md-6">
                                        <h6>Внешнее</h6>

                                        <StateRadioButtonGroup type={"Диски"} id={"rimState6"} validated={this.state.validated} isActive={this.state.rimState6} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState6")} />
                                        <StateRadioButtonGroup type={"Состояние резины"} id={"tireState6"} validated={this.state.validated} isActive={this.state.tireState6} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState6")} />
                                        <StateRadioButtonGroup type={"Шпильки"} id={"pinsState6"} validated={this.state.validated} isActive={this.state.pinsState6} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState6")} />
                                        <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"pressure6"} isActive={this.state.pressure6} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "pressure6")} />
                                </div>
                                    <div className="col-md-6">
                                        <h6>Внутреннее</h6>
                                        <StateRadioButtonGroup type={"Диски"} id={"rimState6_2"} validated={this.state.validated} isActive={this.state.rimState6_2} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "rimState6_2")} />
                                        <StateRadioButtonGroup type={"Состояние резины"} id={"tireState6_2"} validated={this.state.validated} isActive={this.state.tireState6_2} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "tireState6_2")} />
                                        <StateRadioButtonGroup type={"Шпильки"} id={"pinsState6_2"} validated={this.state.validated} isActive={this.state.pinsState6_2} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "pinsState6_2")} />
                                        <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"pressure6_2"} isActive={this.state.pressure6_2} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "pressure6_2")} />
                                </div>
                            </div> : <></> }
                        </div>
                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Состояние подушек</h3>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Как стоят подушки?"} validated={this.state.validated} id={"cabinCushion"} isActive={this.state.cabinCushion} option1="Штатно" option2="Не штатно" onChange={(event) => this.commonChangedEvent(event, "cabinCushion")} />
                        </div>

                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Состояние крыльев</h3>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Крепления"} id={"fendersOk1"} validated={this.state.validated} isActive={this.state.fendersOk1} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "fendersOk1")} />
                        </div>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Целостность"} id={"fendersMountState1"} validated={this.state.validated} isActive={this.state.fendersMountState1} option1="Целые" option2="Повреждения" onChange={(event) => this.commonChangedEvent(event, "fendersMountState1")} />
                        </div>

                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Рама и подвеска</h3>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Рама целая?"} id={"rack"} validated={this.state.validated} isActive={this.state.rack} option1="Да" option2="Нет" onChange={(event) => this.commonChangedEvent(event, "rack")} />
                        </div>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Стук лифтов передней подвески"} validated={this.state.validated} id={"frontSuspension"} isActive={this.state.frontSuspension} option1="Да" option2="Нет" onChange={(event) => this.commonChangedEvent(event, "frontSuspension")} />
                            <StateRadioButtonGroup type={"Стук лифтов задней подвески"} validated={this.state.validated} id={"backSuspension"} isActive={this.state.backSuspension} option1="Да" option2="Нет" onChange={(event) => this.commonChangedEvent(event, "backSuspension")} />
                        </div>

                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Гидрооборудование</h3>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Гидрооборудование"} id={"hydroEq"} validated={this.state.validated} isActive={this.state.hydroEq} option1="Не протёрто" option2="Протёрто" onChange={(event) => this.commonChangedEvent(event, "hydroEq")} />
                        </div>
                        <hr className="solid" />
                    </div>

                    {trailer &&
                        <div>
                            <h2>Полуприцеп {trailer.brand} {trailer.model} (гос.номер: {trailer.plate})</h2>
                        <div className="row">
                            <h3>Световые приборы</h3>
                            <div className="col-md-6">
                                    <StateRadioButtonGroup type={"Габариты"} id={"beamLight2"} validated={this.state.validated} isActive={this.state.beamLight2} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "beamLight2")} />
                            </div>

                            <div className="col-md-6">
                                    <StateRadioButtonGroup type={"Поворотники"} id={"turn2"} validated={this.state.validated} isActive={this.state.turnSignal2} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "turnSignal2")} />
                                    <StateRadioButtonGroup type={"Стоп-сигналы"} id={"stop2"} validated={this.state.validated} isActive={this.state.stopSignal2} option1="Исправен" option2="Не исправен" onChange={(event) => this.commonChangedEvent(event, "stopSignal2")} />
                            </div>
                            <hr className="solid" />
                        </div>

                        <div className="row">
                            <h3>Общее состояние</h3>

                            <div className="col-md-6">
                                    <StateRadioButtonGroup type={"Внешнее состояние"} id={"trailercondition"} validated={this.state.validated} isActive={this.state.trailerCondition} option1="С повреждениями" option2="Без повреждений" onChange={this.trailerConditionChanged} />
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
                                                <StateRadioButtonGroup type={"Диски"} validated={this.state.validated} id={"trailerRimState1"} isActive={this.state.trailerRimState1} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "trailerRimState1")} />
                                                <StateRadioButtonGroup type={"Состояние резины"} validated={this.state.validated} id={"trailerTireState1"} isActive={this.state.trailerTireState1} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "trailerTireState1")} />
                                                <StateRadioButtonGroup type={"Шпильки"} validated={this.state.validated} id={"trailerPinsState1"} isActive={this.state.trailerPinsState1} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "trailerPinsState1")} />
                                                <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"trailerPressure1"} isActive={this.state.trailerPressure1} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "trailerPressure1")} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <h5 className="d-flex justify-content-center">2 ось</h5>
                                        <div className="col-md-12">
                                                <StateRadioButtonGroup type={"Диски"} validated={this.state.validated} id={"trailerRimState3"} isActive={this.state.trailerRimState3} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "trailerRimState3")} />
                                                <StateRadioButtonGroup type={"Состояние резины"} validated={this.state.validated} id={"trailerTireState3"} isActive={this.state.trailerTireState3} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "trailerTireState3")} />
                                                <StateRadioButtonGroup type={"Шпильки"} validated={this.state.validated} id={"trailerPinsState3"} isActive={this.state.trailerPinsState3} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "trailerPinsState3")} />
                                                <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"trailerPressure3"} isActive={this.state.trailerPressure3} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "trailerPressure3")} />                                             
                                        </div>
                                    </div>
                                    {trailer.axelsCount > 2 ? <div className="form-row">
                                        <h5 className="d-flex justify-content-center">3 ось</h5>
                                        <div className="col-md-12">
                                                <StateRadioButtonGroup type={"Диски"} id={"trailerRimState5"} validated={this.state.validated} isActive={this.state.trailerRimState5} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "trailerRimState5")} />
                                                <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState5"} validated={this.state.validated} isActive={this.state.trailerTireState5} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "trailerTireState5")} />
                                                <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState5"} validated={this.state.validated} isActive={this.state.trailerPinsState5} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "trailerPinsState5")} />
                                                <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"trailerPressure5"} isActive={this.state.trailerPressure5} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "trailerPressure5")} />                                                                                       
                                        </div>
                                    </div> : <></>}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <h1 className="d-flex justify-content-center">Правая сторона</h1>
                                <div className="form-row">
                                    <h5 className="d-flex justify-content-center">1 ось</h5>
                                    <div className="col-md-12">
                                            <StateRadioButtonGroup type={"Диски"} id={"trailerRimState2"} validated={this.state.validated} isActive={this.state.trailerRimState2} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "trailerRimState2")} />
                                            <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState2"} validated={this.state.validated} isActive={this.state.trailerTireState2} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "trailerTireState2")} />
                                            <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState2"} validated={this.state.validated} isActive={this.state.trailerPinsState2} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "trailerPinsState2")} />
                                            <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"trailerPressure2"} isActive={this.state.trailerPressure2} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "trailerPressure2")} />                                                                                       
                                    </div>
                                </div>
                                <div className="form-row">
                                    <h5 className="d-flex justify-content-center">2 ось</h5>
                                    <div className="col-md-12">
                                            <StateRadioButtonGroup type={"Диски"} id={"trailerRimState4"} validated={this.state.validated} isActive={this.state.trailerRimState4} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "trailerRimState4")} />
                                            <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState4"} validated={this.state.validated} isActive={this.state.trailerTireState4} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "trailerTireState4")} />
                                            <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState4"} validated={this.state.validated} isActive={this.state.trailerPinsState4} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "trailerPinsState4")} />
                                            <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"trailerPressure4"} isActive={this.state.trailerPressure4} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "trailerPressure4")} />                                                                                       
                                        </div>
                                </div>
                                {trailer.axelsCount > 2 ? <div className="form-row">
                                    <h5 className="d-flex justify-content-center">3 ось</h5>
                                    <div className="col-md-12">
                                            <StateRadioButtonGroup type={"Диски"} id={"trailerRimState6"} validated={this.state.validated} isActive={this.state.trailerRimState6} option1="В норме" option2="Изношен" onChange={(event) => this.commonChangedEvent(event, "trailerRimState6")} />
                                            <StateRadioButtonGroup type={"Состояние резины"} id={"trailerTireState6"} validated={this.state.validated} isActive={this.state.trailerTireState6} option1="В норме" option2="Изношена" onChange={(event) => this.commonChangedEvent(event, "trailerTireState6")} />
                                            <StateRadioButtonGroup type={"Шпильки"} id={"trailerPinsState6"} validated={this.state.validated} isActive={this.state.trailerPinsState6} option1="В норме" option2="Требуется замена" onChange={(event) => this.commonChangedEvent(event, "trailerPinsState6")} />
                                            <StateRadioButtonGroup type={"Давление"} validated={this.state.validated} id={"trailerPressure6"} isActive={this.state.trailerPressure6} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "trailerPressure6")} />                                                                                       
                                    </div>
                                </div> : <></>}
                            </div>
                            <hr className="solid" />
                        </div>

                        <div className="row">
                            <h3>Состояние крыльев</h3>

                            <div className="col-md-6">
                                    <StateRadioButtonGroup type={"Крепления"} id={"trailerFendersOk"} validated={this.state.validated} isActive={this.state.trailerFendersOk} option1="В норме" option2="Не в норме" onChange={(event) => this.commonChangedEvent(event, "trailerFendersOk")} />
                            </div>

                            <div className="col-md-6">
                                    <StateRadioButtonGroup type={"Целостность"} id={"trailerFendersMountState1"} validated={this.state.validated} isActive={this.state.trailerFendersMountState} option1="Целые" option2="Повреждения" onChange={(event) => this.commonChangedEvent(event, "trailerFendersMountState")} />
                            </div>

                            <hr className="solid" />
                        </div>
                     </div>}

                    <div className="row mb-3">
                        <div className="form-row">
                            <div className="col-md-6">
                                <label htmlFor="files">Прикрепить фотографии</label>
                                <input type="file" id="files" accept=".jpg, .png, .jpeg" multiple onChange={this.selectFile}></input>
                            </div>

                            { }
                            <div className="col-md-6">
                                <label>Выберите водителя</label>
                                <div>
                                    <Autocomplete
                                        className={this.state.validated && this.state.driver.id === undefined ? "not-valid-input-border" : ""}
                                        disablePortal
                                        onChange={(e, newvalue) => this.driverSelectionChanged(e, newvalue)}
                                        id="combo-box-demo"
                                        options={drivers}
                                        sx={{ width: 300 }}
                                        getOptionLabel={(option) => `${option.lastName} ${option.firstName} ${option.middleName}`}
                                            renderInput={(params) => <TextField {...params} label="Список водителей" />} />
                                </div>
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
                                    <div className="line-break-text">{this.state.errorMessage}</div>
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