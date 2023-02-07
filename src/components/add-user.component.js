import React, { Component, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import ApiService from "../services/cartekApiService";
import  withRouter  from "./withRouter";

class UserForm extends Component {

    statuses = {
        active: "Active",
        inactive: "Inactive"
    };

    componentDidMount() {

        const { login } = this.props.params;
        console.log(login);

        if (login) {
            this.setState({ loading: true });
            ApiService.getAdminUser(login)
                .then(({ data }) => {
                    this.setState({
                        loading: false,
                        ...data                      
                    })
                })
                .catch((error) => {
                    this.setState({ loading: false, error })
                });

        }
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: null,
            login: "",
            firstName: "",
            middleName:"",
            lastName: "",
            phone: "",
            isAdmin: false,
            password: "",
            email: "",
        };

        this.handleSubmit = (event) => {
            event.preventDefault();
                const newUser = {
                    firstName: this.state.firstName,
                    middleName: this.state.middleName,
                    lastName: this.state.lastName,
                    login: this.state.login,
                    phone: this.state.phone,
                    isAdmin: this.state.isAdmin,
                    password: this.state.password
                };

            const { login } = this.props.params;

            if (login) {
                this.updateProfile(login, newUser);
                }
                else {

                    this.setState({ loading: true });

                    ApiService.createUser({ ...newUser, email: this.state.email, login: this.state.login, password: this.state.password })
                        .then(({ data }) => {
                            this.setState({
                                ...data,
                                loading: false
                            });
                        })
                        .catch((error) => {
                            this.setState({ loading: false, error });
                        })
                }            
        };

        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleMiddleNameChange = this.handleMiddleNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleIsAdminChange = this.handleIsAdminChange.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    updateProfile(login, newUser) {
        this.setState({ loading: true });
        ApiService.updateUser(login, newUser)
            .then(({ data }) => {
                this.setState({
                    ...data,
                    loading: false
                });
            })
            .catch((error) => {
                this.setState({ loading: false });
            })
    }

    handleFirstNameChange(event) {
        this.setState({ firstName: event.target.value });
    }

    handleMiddleNameChange(event) {
        this.setState({ middleName: event.target.value });
    }

    handleLastNameChange(event) {
        this.setState({ lastName: event.target.value });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handleLoginChange(event) {
        this.setState({ login: event.target.value });
    }

    handleEmailChange(event) {
        this.setState({ email: event.target.value });
    }

    handleIsAdminChange(event) {
        this.setState({ isAdmin: event.target.value === "on" });
    }

    handlePhoneNumberChange(event) {
        let phone = event.target.value.trim().replace(/[^0-9]/g, "");

        if (phone && phone[0] !== "+") {
            phone = "+" + phone;
        }

        if (phone && phone[1] !== "7") {
            phone = phone[0] + "7" + phone.substr(1);
        }

        this.setState({ phone: phone });
    }

    render() {

        const { loading, error, firstName, middleName, lastName, isAdmin, phone, login, email, password } = this.state;

        if (loading) {
            return "ЗАГРУЗКА...";
        }

        return <>
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    {error}
                </div>
            </div>
            <h1>Пользователь</h1>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="firstName">Имя</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={this.handleFirstNameChange}
                        value={firstName}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="middleName">Отчество</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={this.handleMiddleNameChange}
                        value={middleName}/>
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="firstName">Фамилия</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={this.handleLastNameChange}
                        value={lastName}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="firstName">Email</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={this.handleEmailChange}
                        value={email}
                    />
                </div>

                <div className="form-group col-md-6">
                    <label htmlFor="login">Логин</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={this.handleLoginChange}
                        value={login}
                        disabled={this.props.login}
                    />
                </div>

                <div className="form-group col-md-6">
                    <label htmlFor="login">Пароль</label>
                    <input
                        type="password"
                        className="form-control"
                        form="profile-form"
                        onChange={this.handlePasswordChange}
                        value={password} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="phoneInput" className="control-label">Телефон</label>
                    <div className="phone-input">
                        <input type="text" className="form-control input-lg" autoComplete="tel"
                            onChange={this.handlePhoneNumberChange}
                            value={phone}
                        />
                        <div className={this.state.phone ? "has-error" : "d-none"}>
                            <span className="help-block">Неверный формат номера</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-row pb-4">
                <div className="col-md-2">
                    <label htmlFor="notifications">Администратор</label>
                    <div className="form-check">
                        <input className="form-check-input"
                            type="radio"
                            name="isAdmin"
                            onChange={this.handleIsAdminChange}
                            id="admin_on"
                            value="on"
                            form="profile-form"
                            checked={isAdmin}
                        />
                        <label className="form-check-label" htmlFor="admin_on">
                            Да
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input"
                            type="radio"
                            name="isAdmin"
                            id="admin_off"
                            value="off"
                            onChange={this.handleIsAdminChange}
                            form="profile-form"
                            checked={!isAdmin}
                        />
                        <label className="form-check-label" htmlFor="admin_off">
                            Нет
                        </label>
                    </div>
                </div>
            </div>
            <div className="row justify-content-md-center">
                <Link to="/admin/users" className="btn btn-danger col-md-2 mr-1">
                    Отмена
                </Link>
                <div className="col-md-3">
                    <button type="submit" form="profile-form" className="btn btn-success" onClick={(e) => { this.handleSubmit(e) }}>
                        Сохранить
                    </button>
                </div>
            </div>
        </>
    }
}

export default withRouter(UserForm);