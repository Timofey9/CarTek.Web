import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class BoardAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModeratorBoard: false,
            isAdmin: false,
            isDispatcher: false,
            currentUser: undefined,
        };
    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            this.setState({
                currentUser: user,
                isAdmin: user.identity.isAdmin,
                isDispatcher: user.identity.isAdmin || user.identity.isDispatcher || user.identity.isInitialBookkeeper || user.identity.isSalaryBookkeeper || user.identity.isLogistManager,
            });
        }
    }

    render() {
        const { currentUser, isAdmin, isDispatcher } = this.state;
        console.log(isAdmin);
        return (
            <div className="container">
                <div className="row justify-content-md-center text-center mt-md-5">

                    {isAdmin &&
                        <>
                            <div className="col-md-3 pb-3">
                                <Link to="/admin/users" className="w-100 btn btn-secondary">Пользователи</Link>
                            </div>
                            <div className="col-md-3 pb-3">
                                <Link to="/admin/cars" className="w-100 btn btn-secondary">Автомобили</Link>
                            </div>
                            <div className="col-md-3 pb-3">
                                <Link to="/admin/drivers" className="w-100 btn btn-secondary">Водители</Link>
                            </div>
                            <div className="col-md-3 pb-3">
                                <Link to="/admin/trailers" className="w-100 btn btn-secondary">Прицепы</Link>
                            </div>

                            <div className="col-md-3 pb-3">
                                <Link to="/admin/materials" className="w-100 btn btn-secondary">Материалы</Link>
                            </div>

                            <div className="col-md-3 pb-3">
                                <Link to="/admin/externaltransporters" className="w-100 btn btn-secondary">Перевозчики</Link>
                            </div>

                            <div className="col-md-3 pb-3">
                                <Link to="/admin/addresses" className="w-100 btn btn-secondary">Адреса</Link>
                            </div>

                        </>
                    }

                    {(!isDispatcher || isAdmin) &&
                        <>
                            <div className="col-md-3 pb-3">
                                <Link to="/admin/questionaries" className="w-100 btn btn-secondary">Осмотры</Link>
                            </div>
                            <div className="col-md-3 pb-3">
                                <Link to="/admin/cars" className="w-100 btn btn-secondary">Машины</Link>
                            </div>
                        </>}

                    {isDispatcher && <>
                        <div className="col-md-3 pb-3">
                            <Link to="/admin/orders" className="w-100 btn btn-secondary">Заявки</Link>
                        </div>
                        <div className="col-md-3 pb-3">
                            <Link to="/admin/workload" className="w-100 btn btn-secondary">Задачи</Link>
                        </div>

                        <div className="col-md-3 pb-3">
                            <Link to="/admin/tns" className="w-100 btn btn-secondary">Реестр ТН</Link>
                        </div>

                        <div className="col-md-3 pb-3">
                            <Link to="/admin/taskslist" className="w-100 btn btn-secondary">Все задачи</Link>
                        </div>

                        <div className="col-md-3 pb-3">
                            <Link to="/admin/messages" className="w-100 btn btn-secondary">Доска сообщений</Link>
                        </div>


                        <div className="col-md-3 pb-3">
                            <Link to="/admin/clients" className="w-100 btn btn-secondary">Юр. лица</Link>
                        </div>
                    </>}
                </div>
            </div>
        );
    }
}
