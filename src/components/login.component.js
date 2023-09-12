import React, { Component } from "react";
import { Navigate } from 'react-router-dom';
import { connect } from "react-redux";
import { login } from "../actions/auth";
import Switch from '@mui/material/Switch';

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                Поле не заполнено!
            </div>
        );
    }
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeIsDriver = this.onChangeIsDriver.bind(this);

        this.state = {
            username: "",
            password: "",
            isDriver: false,
            loading: false,
        };
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value,
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value,
        });
    }

    onChangeIsDriver(e) {
        this.setState({
            isDriver: e.target.checked
        });
    }

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            loading: true,
        });

        const { dispatch, history } = this.props;

        if (this.state.username && this.state.password) {
            dispatch(login(this.state.username, this.state.password, this.state.isDriver))
                .then(() => {
                    window.location.reload(true);
                })
                .catch(() => {
                    this.setState({
                        loading: false
                    });
                });
        } else {
            this.setState({
                loading: false
            });

            dispatch({
                type: "SET_MESSAGE",
                payload: "Поле не может быть пустым",
            });
        }
    }

    render() {
        const { isLoggedIn, message, isDriver } = this.props;
        if (isLoggedIn) {
            if (isDriver) {
                return <Navigate to="/driver-dashboard" />;
            } else {
                return <Navigate to="/profile" />;
            }
        }

        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <div className="form-group">
                        <label htmlFor="username">{"Логин"}</label>
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="text"
                            className="form-control"
                            name="password"
                            value={this.state.password}
                            onChange={this.onChangePassword} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="isDriver">Водитель</label>
                        <Switch name="isDriver" onChange={(e) => this.onChangeIsDriver(e)} />
                    </div>

                    <div className="form-group">
                        <button
                            className="btn btn-primary btn-block mt-2"
                            disabled={this.state.loading} onClick={(e) => { this.handleLogin(e) }}>
                            {this.state.loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <span>Войти</span>
                        </button>
                    </div>

                    {message && (
                        <div className="form-group">
                            <div className="alert alert-danger mt-2" role="alert">
                                {message}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { isLoggedIn } = state.auth;
    const { message } = state.message;
    const isDriver = state.auth.isDriver
    return {
        isLoggedIn,
        message,
        isDriver
    };
}

export default connect(mapStateToProps)(Login);
