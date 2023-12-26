import React, { Component, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import ApiService from "../services/cartekApiService";
import withRouter from "./withRouter";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

class UserForm extends Component {
    statuses = {
        active: "Active",
        inactive: "Inactive"
    };

    componentDidMount() {
        const { login } = this.props.params;
        if (login) {
            this.setState({ loading: true });
            this.setState({ userExists: true });
            ApiService.getAdminUser(login)
                .then(({ data }) => {
                    this.setState({
                        loading: false,
                        ...data
                    })
                    if (data.isAdmin) {
                        this.setState({role: '1'});
                    }
                    if (data.isDispatcher) {
                        this.setState({ role: '2' });
                    }
                    if (data.isInitialBookkeeper) {
                        this.setState({ role: '3' });
                    }
                    if (data.isSalaryBookkeeper) {
                        this.setState({ role: '4' });
                    }
                    if (data.isLogistManager) {
                        this.setState({ role: '5' });
                    }
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
            error: "",
            login: "",
            firstName: "",
            middleName: "",
            lastName: "",
            phone: "",
            isAdmin: false,
            isDispatcher: false,
            password: "",
            email: "",
            notificationShown: false,
            userExists: false,
            role: '0'
        };

        this.handleSubmit = (event) => {
            event.preventDefault();
            if (this.validate()) {
                const newUser = {
                    firstName: this.state.firstName,
                    middleName: this.state.middleName,
                    lastName: this.state.lastName,
                    login: this.state.login,
                    phone: this.state.phone,
                    isAdmin: this.state.role === '1',
                    isDispatcher: this.state.role === '2',
                    isInitialBookkeeper: this.state.role === '3',
                    isSalaryBookkeeper: this.state.role === '4',
                    isLogistManager: this.state.role === '5',
                };
                const { login } = this.props.params;
                if (login) {
                    if (this.state.password !== '') {
                        newUser.password = this.state.password;
                    }

                    this.updateProfile(login, newUser);
                }
                else {

                    if (this.state.password.trim() === '') {
                        this.setState({ error: "Поля логин, пароль, имя и фамилия являются обязательными" })
                    } else {
                        newUser.password = this.state.password;
                        this.setState({ loading: true });
                        ApiService.createUser({ ...newUser, email: this.state.email, login: this.state.login, password: this.state.password })
                            .then(({ data }) => {
                                this.setState({
                                    ...data,
                                    loading: false
                                });
                                alert("Пользователь создан");
                                this.props.navigate(`/admin/users/`);
                            })
                            .catch((error) => {
                                this.setState({ error: error.response.data })
                                this.setState({ loading: false });
                            })
                    }
                }
            }
        };

        this.validate = () => {
            if (this.state.login.trim() === '' ||
                this.state.firstName.trim() === '' ||
                this.state.lastName.trim() === '') {
                this.setState({ error: "Поля логин, пароль, имя и фамилия являются обязательными" })
                return false;
            }
            return true;
        }

        this.deleteUser = (event) => {
            event.preventDefault();
            if (!this.state.notificationShown) {
                this.setState({ error: "Удаление пользователя приведет к удалению всех созданных им осмотров.\nЧтобы продолжить нажмите \"Удалить\" еще раз" });
                this.setState({ notificationShown: true });
            } else {
                ApiService.deleteUser(this.state.login)
                    .then(({ data }) => {
                        this.setState({
                            ...data,
                            loading: false
                        });
                        alert("Пользователь удален");
                        this.props.navigate(`/admin/users/`);
                    })
                    .catch((error) => {
                        this.setState({ error: error.response.data })
                        this.setState({ loading: false });
                    })
            }
        }

        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleMiddleNameChange = this.handleMiddleNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleIsAdminChange = this.handleIsAdminChange.bind(this);
        this.handleIsDispatcherChange = this.handleIsDispatcherChange.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRoleChange = this.handleRoleChange.bind(this);
    }


    updateProfile(login, newUser) {
        this.setState({ loading: true });
        ApiService.updateUser(login, newUser)
            .then(({ data }) => {
                this.setState({
                    ...data,
                    loading: false
                });
                alert("Пользователь обновлен")
            })
            .catch((error) => {
                this.setState({ error: error.response.data })
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


    handleRoleChange(event) {
        this.setState({ role: event.target.value });
    }

    handleIsDispatcherChange(event) {
        if (event.target.value === "on") {
            this.setState({ isDispatcher: true });
            this.setState({ isAdmin: false });
        } else {
            this.setState({ isDispatcher: false });
        }
    }

    handlePhoneNumberChange(event) {
        this.setState({ phone: event.target.value });
    }

    render() {

        const { loading, error, firstName, middleName, lastName, isAdmin, isDispatcher, phone, login, email, password, role } = this.state;

        if (loading) {
            return "ЗАГРУЗКА...";
        }

        return <>
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
                        value={middleName} />
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
                    </div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <FormControl>
                        <FormLabel id="radio-buttons-group-label">Роль</FormLabel>
                        <RadioGroup
                            aria-labelledby="radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={role}
                            onChange={(e) => this.handleRoleChange(e)}>
                            <FormControlLabel value="0" control={<Radio />} label="Mеханик" />
                            <FormControlLabel value="1" control={<Radio />} label="Логист-администратор" />
                            <FormControlLabel value="2" control={<Radio />} label="Диспетчер" />
                            <FormControlLabel value="3" control={<Radio />} label="Бухгалтер первички" />
                            <FormControlLabel value="4" control={<Radio />} label="Бухгалтер ЗП" />
                            <FormControlLabel value="5" control={<Radio />} label="Менеджер-логист" />
                        </RadioGroup>
                    </FormControl>
                </div>
            </div>
            {this.state.error && (
                <div className="row d-flex justify-content-center mt-3">
                    <div className="alert alert-danger mt-2" role="alert">
                        {this.state.error}
                    </div>
                </div>
            )}
            <div className="row mb-2">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="row">
                        {this.state.userExists &&
                            <div className="col-md-2">
                                <button className="btn btn-danger" onClick={(e) => { this.deleteUser(e) }}>
                                    Удалить
                                </button>
                            </div>}
                        <div className="col-md-2">
                            <Link to="/admin/users" className="btn btn-warning">
                                Отмена
                            </Link>
                        </div>
                        <div className="col-md-2">
                            <button type="submit" form="profile-form" className="btn btn-success ml-2" onClick={(e) => { this.handleSubmit(e) }}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}

export default withRouter(UserForm);