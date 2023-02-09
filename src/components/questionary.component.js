import React, { Component } from "react";
import ApiService from "../services/cartekApiService";

export default class Questionary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: {},
            fileName: "",
            formData: new FormData()
        };

        this.selectFile = this.selectFile.bind(this);

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

        console.log(e.target.files);

        for (const file of e.target.files) {
            this.state.formData.append("Images", file);
        }

        this.setState({ fileName: e.target.files[0].name, file: e.target.files[0] })
    };

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
        return (
            <div className="container">
                <form>
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
