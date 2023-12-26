import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Notification from './components/notifications.component'

import DriverForm from "./components/add-driver.component";

import Login from "./components/login.component";
import Home from "./components/home.component";
import Questionary from "./components/questionary.component";
import CarsList from "./components/cars-list.component";
import TrailersList from "./components/trailers-list.component";
import QuestionariesList from "./components/questionaries-list.component"
import DriversList from "./components/drivers-list.component";
import UserForm from "./components/add-user.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardAdmin from "./components/board-admin.component";
import AcceptanceComponent from "./components/acceptance.component";
import QuestionaryDetailsComponent from "./components/questionaryDetails.component";
import CarForm from "./components/add-car.component";
import TrailerForm from "./components/add-trailer.component";
import OrdersList from "./components/orders/orders-list.component";
import OrderForm from "./components/orders/add-order.component";
import TnsList from "./components/orders/tn-list.component";
import CarsWork from "./components/orders/task-distribution.component";
import MyTasksList from "./components/driver-dashboard/my-tasks.component";
import DriverDashboard from "./components/driver-dashboard/driver-dashboard.component";
import DriverEditTask from "./components/driver-dashboard/driver-edittask.component";
import DriverEditSubTask from "./components/driver-dashboard/driver-editsubtask.component";

import AdminEditTask from "./components/orders/admin-edittask.component";
import NotificationsList from "./components/driver-dashboard/notification-list.component";
import AddressesList from "./components/addresses-list.component";
import ClientsList from "./components/clients-list.component";
import MaterialsList from "./components/materials-list.component";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from './helpers/history';

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import UsersList from "./components/users-list.component";
import CarComponent from "./components/car.component";

class App extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            showModeratorBoard: false,
            showAdminBoard: false,
            showDriver: false,
            isDispatcher: false,
            currentUser: undefined,
        };

        history.listen((location) => {
            props.dispatch(clearMessage()); // clear message when changing location
        });
    }

    componentDidMount() {
        const user = this.props.user;

        if (user) {
            this.setState({
                currentUser: user,
                showAdminBoard: user.identity.isAdmin,
                isDispatcher: user.identity.isDispatcher || user.identity.isInitialBookkeeper || user.identity.isSalaryBookkeeper || user.identity.isLogistManager,
                showDriver: user.isDriver
            });
        }

        EventBus.on("logout", () => {
            this.logOut();
        });
    }

    componentWillUnmount() {
        EventBus.remove("logout");
    }

    logOut() {
        this.props.dispatch(logout());
        this.setState({
            showModeratorBoard: false,
            showAdminBoard: false,
            currentUser: undefined,
            showDriver: false
        });
    }

    render() {
        const { currentUser, showAdminBoard, isDispatcher, showDriver } = this.state;

        return (
            <BrowserRouter location={history.location} navigator={history}>

                <nav className="navbar navbar-expand-lg navbar-light main-nav">
                    {showDriver ? (
                        <Link to={"/driver-dashboard"} className="navbar-brand">
                            <img src="/logo.png" height="40" alt="logo" />
                        </Link>) :
                        (<Link to={"/"} className="navbar-brand">
                            <img src="/logo.png" height="40" alt="logo" />
                        </Link>)}

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">

                            {isDispatcher && (
                                <>
                                    <li className="nav-item">
                                        <Link to={"/admin/orders"} className="nav-link">
                                            Заявки
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link to={"/admin/workload"} className="nav-link">
                                            Задачи
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link to={"/admin/tns"} className="nav-link">
                                            Реестр ТН
                                        </Link>
                                    </li>
                                </>)}

                            {!showDriver && !isDispatcher && (
                                <>
                                    <li className="nav-item">
                                        <Link to={"/home"} className="nav-link">
                                            Осмотр
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link to={"/cars"} className="nav-link">
                                            Машины
                                        </Link>
                                    </li>
                                </>)}

                            {showAdminBoard && (
                                <li className="nav-item">
                                    <Link to={"/admin"} className="nav-link">
                                        Администрирование
                                    </Link>
                                </li>
                            )}

                            {currentUser ? (
                                <div className="navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <Link to={"/profile"} className="nav-link">
                                            {currentUser.identity.login} ({currentUser.identity.firstName} {currentUser.identity.lastName})
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/login" className="nav-link" onClick={this.logOut}>
                                            Выйти
                                        </a>
                                    </li>
                                </div>
                            ) : (
                                <div className="navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <Link to="/login" className="nav-link">
                                            {"Войти"}
                                        </Link>
                                    </li>
                                </div>
                            )}
                        </ul>
                    </div>
                </nav>

                <div className="container mt-3">
                    <Notification />
                    <Routes>
                        <Route exact path="/" element={<RequireAuth currentUser={currentUser}><Home /></RequireAuth>} />
                        <Route exact path="/home" element={<RequireAuth currentUser={currentUser}><Home /></RequireAuth>} />
                        <Route exact path="/login" element={<Login />} />
                        <Route exact path="/profile" element={<RequireAuth currentUser={currentUser}><Profile /></RequireAuth>} />
                        <Route exact path="/user" element={<RequireAuth currentUser={currentUser}><BoardUser /></RequireAuth>} />
                        <Route exact path="/cars" element={<RequireAuth currentUser={currentUser}><CarsList /></RequireAuth>} />
                        <Route exact path="/driver-dashboard" element={<RequireAuth isDriverComponent={true} currentUser={currentUser}><DriverDashboard /></RequireAuth>} />
                        <Route exact path="/driver-dashboard/mytasks" element={<RequireAuth isDriverComponent={true} currentUser={currentUser}><MyTasksList /></RequireAuth>} />
                        <Route exact path="/driver/notifications" element={<RequireAuth isDriverComponent={true} currentUser={currentUser}><NotificationsList /></RequireAuth>} />
                        <Route exact path="/driver-dashboard/task/:driverTaskId" element={<RequireAuth isDriverComponent={true} currentUser={currentUser}><DriverEditTask /></RequireAuth>} />
                        <Route exact path="/driver-dashboard/subtask/:subTaskId" element={<RequireAuth isDriverComponent={true} currentUser={currentUser}><DriverEditSubTask /></RequireAuth>} />

                        <Route exact path="/cars/car/:plate" element={<RequireAuth currentUser={currentUser}><CarComponent /></RequireAuth>} />

                        <Route exact path="/admin/questionaries" element={<RequireAuth currentUser={currentUser}><QuestionariesList /></RequireAuth>} />
                        <Route exact path="/admin/trailers" element={<RequireAuth currentUser={currentUser}><TrailersList /></RequireAuth>} />
                        <Route exact path="/admin/trailer/add" element={<RequireAuth currentUser={currentUser}><TrailerForm /></RequireAuth>} />
                        <Route exact path="/admin/trailer/:trailerPlate" element={<RequireAuth currentUser={currentUser}><TrailerForm /></RequireAuth>} />
                        <Route exact path="/admin/cars" element={<RequireAuth currentUser={currentUser}><CarsList /></RequireAuth>} />
                        <Route exact path="/admin/cars/add" element={<RequireAuth currentUser={currentUser}><CarForm /></RequireAuth>} />
                        <Route exact path="/admin/cars/edit/:carPlate" element={<RequireAuth currentUser={currentUser}><CarForm /></RequireAuth>} />
                        <Route exact path="/cars/acceptCar/:uniqueId" element={<RequireAuth currentUser={currentUser}><AcceptanceComponent /></RequireAuth>} />
                        <Route exact path="/questionary/car/:plate" element={<RequireAuth currentUser={currentUser}><Questionary /></RequireAuth>} />
                        <Route exact path="/questionary/details/:uniqueId" element={<RequireAuth currentUser={currentUser}><QuestionaryDetailsComponent /></RequireAuth>} />

                        <Route exact path="/admin" element={<RequireAuth currentUser={currentUser}><RequireAdmin><BoardAdmin /></RequireAdmin></RequireAuth>} />
                        <Route exact path="/admin/user/" element={<RequireAuth currentUser={currentUser}><RequireAdmin><UserForm /></RequireAdmin></RequireAuth>} />
                        <Route exact path="/admin/tns/" element={<RequireAuth currentUser={currentUser}><RequireAdmin><TnsList /></RequireAdmin></RequireAuth>} />
                        <Route exact path="/admin/user/:login" element={<RequireAuth currentUser={currentUser}><RequireAdmin><UserForm /></RequireAdmin></RequireAuth>} />
                        <Route exact path="/admin/users" element={<RequireAuth currentUser={currentUser}><RequireAdmin> <UsersList /> </RequireAdmin></RequireAuth>} />
                        <Route exact path="/admin/drivers" element={<RequireAuth currentUser={currentUser}><RequireAdmin> <DriversList /> </RequireAdmin></RequireAuth>} />
                        <Route exact path="/admin/driver" element={<RequireAuth currentUser={currentUser}><RequireAdmin> <DriverForm /> </RequireAdmin></RequireAuth>} />
                        <Route exact path="/admin/driver/:driverId" element={<RequireAuth currentUser={currentUser}> <RequireAdmin> <DriverForm /> </RequireAdmin> </RequireAuth>} />
                        <Route exact path="/admin/orders" element={<RequireAuth currentUser={currentUser}> <RequireAdmin> <OrdersList /> </RequireAdmin> </RequireAuth>} />
                        <Route exact path="/admin/workload" element={<RequireAuth currentUser={currentUser}> <RequireAdmin> <CarsWork /> </RequireAdmin> </RequireAuth>} />
                        <Route exact path="/admin/orders/create" element={<RequireAuth currentUser={currentUser}> <RequireAdmin> <OrderForm /> </RequireAdmin> </RequireAuth>} />
                        <Route exact path="/admin/addresses" element={<RequireAuth currentUser={currentUser}> <RequireAdmin> <AddressesList /> </RequireAdmin> </RequireAuth>} />
                        <Route exact path="/admin/clients" element={<RequireAuth currentUser={currentUser}> <RequireAdmin> <ClientsList /> </RequireAdmin> </RequireAuth>} />
                        <Route exact path="/admin/materials" element={<RequireAuth currentUser={currentUser}> <RequireAdmin> <MaterialsList /> </RequireAdmin> </RequireAuth>} />
                        <Route exact path="/admin/drivertask/:driverTaskId" element={<RequireAuth currentUser={currentUser}> <RequireAdmin> <AdminEditTask /> </RequireAdmin> </RequireAuth>} />
                    </Routes>
                </div>

                {/* <AuthVerify logOut={this.logOut}/> */}
            </BrowserRouter>
        );
    }
}


function RequireAuth({ currentUser, isDriverComponent, children }) {
    let user = JSON.parse(localStorage.getItem("user"));
    let isAuthenticated = user !== null;
    
    if (isAuthenticated && isDriverComponent === undefined && user.isDriver) {
        return <Navigate to="/driver-dashboard" />;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

function RequireAdmin({ currentUser, children }) {
    let user = JSON.parse(localStorage.getItem("user"));
    let isAuthenticated = user !== null;
    if (user === null) {
        return <Navigate to="/login" />;
    }
    let hasAdminPrivileges = user.identity.isAdmin || user.identity.isDispatcher || user.identity.isInitialBookkeeper || user.identity.isSalaryBookkeeper || user.identity.isLogistManager;
    return isAuthenticated && hasAdminPrivileges ? children : <Navigate to="/" />;
}

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user,
    };
}

export default connect(mapStateToProps)(App);
