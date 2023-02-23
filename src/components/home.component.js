import React, { Component } from "react";
import ApiService from "../services/cartekApiService";
import { Link } from "react-router-dom";


export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            carPlate: "",
            car: "",
            cachedQuestionary: {},
            carContent: {},
            errorMessage: ""
        };

        this.state.cachedQuestionary = JSON.parse(localStorage.getItem("questionary"));
         
        this.handleCarPlateChange = this.handleCarPlateChange.bind(this);

        this.clearStorage = (event) => {
            localStorage.removeItem("questionary");
        };

        this.handleSubmit = (event) => {
            event.preventDefault();
            ApiService.getCarByPlate(this.state.carPlate).then(response => {
                this.setState({ carContent: response.data });
                this.setState({ car: `Найден автомобиль: ${response.data.brand} ${response.data.model}` });
            }, error => {
                if (error.code == 'ERR_NETWORK') {
                    this.setState({ errorMessage: "Ошибка сети" });
                }
                else
                    this.setState({ errorMessage: "Не найден автомобиль с таким номером"});
            });
        }
    }


    handleCarPlateChange(event) {
        this.setState({carPlate: event.target.value});
    }


  //componentDidMount() {
  //  UserService.getPublicContent().then(
  //      response => {
  //          console.log(response);

  //      this.setState({
  //        content: response.data
  //      });
  //    },
  //    error => {
  //      this.setState({
  //        content:
  //          (error.response && error.response.data) ||
  //          error.message ||
  //          error.toString()
  //      });
  //    }
  //  );
  //}

    render() {
        const { car, errorMessage } = this.state;
    return (
        <div className="container">

            {this.state.cachedQuestionary ?
                <div>
                    <div className="row">
                        <div className="col d-flex justify-content-center">
                            <label htmlFor="goToQuestionary">Имеется неоконченный осмотр для тягача {this.state.cachedQuestionary.car.brand} {this.state.cachedQuestionary.car.model} с гос.номером: {this.state.cachedQuestionary.car.plate}</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col d-flex justify-content-center mt-3">
                            <Link id="goToQuestionary" to={`/questionary/car/${this.state.cachedQuestionary.car.plate}`} className="btn btn-warning">Завершить осмотр</Link>
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
                                <label htmlFor="files">Введите номер машины</label>
                            </div>

                            <div className="col d-flex justify-content-center">
                                <input type="text" className="pr-2" id="carPlate" value={this.carPlate} placeholder="A111AO198" onChange={this.handleCarPlateChange} />
                            </div>

                            <div className="col d-flex justify-content-center mt-3">
                                <input value="Отправить" className="btn btn-success" type="button" onClick={this.handleSubmit}></input>
                            </div>
                            {car ?
                                (<div>
                                    <label htmlFor="goToQuestionary">{car}</label>
                                    <div className="col d-flex justify-content-center mt-3">
                                        <Link id="goToQuestionary" to={`/questionary/car/${this.state.carPlate}`} onClick={this.clearStorage} className="btn btn-warning">Перейти к осмотру</Link>
                                    </div>
                                </div>) : (<div>{errorMessage}</div>)}
                        </div>
                    </div>
                 
                </form>
            </div>
      </div>
    );
  }
}
