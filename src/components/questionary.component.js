import React, { Component } from "react";
import ApiService from "../services/cartekApiService";
import withRouter from "./withRouter";
import StateRadioButtonGroup from "./radiobuttongroup";

class Questionary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            car: {},
            plate: {},
            file: {},
            light: {
                nearLight: true,
                distantLight: true,
                beamLight: true, 
                turnSignal: true,
                stopSignal: true
            },
            generalCondition: false,
            cabinClean: false,
            platonPresent: true,
            platonActive: true,
            fileName: "",
            formData: new FormData()
        };

        this.selectFile = this.selectFile.bind(this);
        this.conditionChanged = this.conditionChanged.bind(this);

        const user = JSON.parse(localStorage.getItem("user"));

        this.handleSubmit = (event) => {
            event.preventDefault();

            this.state.formData.append("CreatedBy", user.identity.login);
            this.state.formData.append("Comment", "TEST");
            this.state.formData.append("DriverId", 1);
            this.state.formData.append("Mileage", 1001);
            this.state.formData.append("CarId", 1);
            this.state.formData.append("IsOk", true);

            for (const pair of this.state.formData.entries()) {
                console.log(`${pair[0]}, ${pair[1]}`);
            }

            ApiService.testSendFiles(this.state.formData);
        };
    }


    selectFile = (e) => {
        for (const file of e.target.files) {
            this.state.formData.append("Images", file);
        }
        this.setState({ fileName: e.target.files[0].name, file: e.target.files[0] })
    };

    conditionChanged(event){
        if (event.target.value == "true") {
            this.setState({ generalCondition: true });
        } else {
            this.setState({ generalCondition: false });
        }
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
                        car: data                      
                    })
                })
                .catch((error) => {
                    this.setState({ loading: false, error })
                });
        }
    }

    render() {
        const { generalCondition, errorMessage } = this.state;

        return (
            <div className="container">
                <form>
                    <div className="row">
                        <h3>Световые приборы</h3>
                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Ближний свет"} id={"nearLight"} isActive={this.state.light.nearLight} option1="Исправен" option2="Не исправен" />
                            <StateRadioButtonGroup type={"Дальний свет"} id={"distantLight"} isActive={this.state.light.distantLight} option1="Исправен" option2="Не исправен" />
                            <StateRadioButtonGroup type={"Габариты"} id={"beamLight"} isActive={this.state.light.beamLight} option1="Исправен" option2="Не исправен" />
                        </div>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Поворотники"} id={"turn"} isActive={this.state.light.turnSignal} option1="Исправен" option2="Не исправен" />
                            <StateRadioButtonGroup type={"Стоп-сигналы"} id={"stop"} isActive={this.state.light.stopSignal} option1="Исправен" option2="Не исправен" />
                        </div>
                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Общее состояние</h3>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Внешнее состояние"} id={"condition"} isActive={this.state.generalCondition} option1="С повреждениями" option2="Без повреждений" onChange={this.conditionChanged} />
                        </div>

                        {generalCondition === true ? <div className="col-md-6"><label htmlFor="comment">Комментарий</label><textarea rows="5" cols="40" type="text" id="comment" /></div> : <span></span>}
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Чистота салона"} id={"cabin"} isActive={this.state.cabinClean} option1="Чистый" option2="Грязный" />
                        </div>
                        <hr className="solid" />
                    </div>

                    <div className="row">
                        <h3>Платон</h3>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Имеется"} id={"platonPresent"} isActive={this.state.platonPresent} option1="Да" option2="Нет" />
                        </div>

                        <div className="col-md-6">
                            <StateRadioButtonGroup type={"Включен"} id={"platonActive"} isActive={this.state.platonActive} option1="Да" option2="Нет" />
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
                                        <StateRadioButtonGroup type={"Диски"} id={"platonActive"} isActive={this.state.platonActive} option1="В норме" option2="Изношен" />
                                        <StateRadioButtonGroup type={"Состояние резины"} id={"platonActive"} isActive={this.state.platonActive} option1="В норме" option2="Изношена" />
                                        <StateRadioButtonGroup type={"Шпильки"} id={"platonActive"} isActive={this.state.platonActive} option1="В норме" option2="Требуется замена" />
                                        <div className="form-group">
                                            <label for="pressure">Давление:</label>
                                            <input name="pressure" id="pressure" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <h1 className="d-flex justify-content-center">Правая сторона</h1>
                            <div className="form-row">
                                <h5 className="d-flex justify-content-center">1 ось</h5>
                                <div className="col-md-12">
                                    <StateRadioButtonGroup type={"Диски"} id={"platonActive"} isActive={this.state.platonActive} option1="В норме" option2="Изношен" />
                                    <StateRadioButtonGroup type={"Состояние резины"} id={"platonActive"} isActive={this.state.platonActive} option1="В норме" option2="Изношена" />
                                    <StateRadioButtonGroup type={"Шпильки"} id={"platonActive"} isActive={this.state.platonActive} option1="В норме" option2="Требуется замена" />
                                    <div className="form-group">
                                        <label for="pressure">Давление:</label>
                                        <input name="pressure" id="pressure" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <label htmlFor="files">Выбрать файлы</label>
                    <input type="file" id="files" accept=".jpg, .png" multiple onChange={this.selectFile}></input>
                    <input value="Отправить" className="btn btn-success" type="button" onClick={this.handleSubmit}></input>
                    <header className="jumbotron">
                    </header>
                </form>
            </div>
        );
    }
}


export default withRouter(Questionary);