import axios from "axios";
import EventBus from "../common/EventBus";
import authHeader from "./auth-header";
//const API_URL = "http://185.46.8.6:5000/api/";
const API_URL = "https://localhost:32768/api/";

class ApiService {

    createSetAuthInterceptor = config => {

        const { identityToken } = authHeader();

        if (identityToken) {
            config.headers.Authorization = `Bearer ${identityToken}`;
        }

        return config;
    };

    constructor() {
        this._axios = axios.create({
            baseURL: API_URL,
            headers: { 'Content-Type': 'application/json' }
        });

        this._axiosXlsx = axios.create({
            baseURL: API_URL,
            responseType: 'blob',
            headers: { 'Access-Control-Allow-Origin': '*' }
        });

        this._axios.interceptors.request.use(this.createSetAuthInterceptor);

        this._axiosXlsx.interceptors.request.use(this.createSetAuthInterceptor);

        this._axiosXlsx.interceptors.response.use(
            response => response,
            error => {
                const { status } = error.response;
                if (status === 401) {
                    EventBus.dispatch("logout", {});
                }
                return Promise.reject(error);
            }
        );

        this._axios.interceptors.response.use(
            response => response,
            error => {
                const { status } = error.response;
                if (status === 401) {
                    EventBus.dispatch("logout", {});
                }
                return Promise.reject(error);
            }
        );
    }

    post(url, data, headers = {}) {
        return this._axios.post(url, data, { headers });
    }

    patch(url, data) {
        return this._axios.patch(url, data);
    }

    get(url) {
        return this._axios.get(url);
    }

    delete(url) {
        return this._axios.delete(url);
    }

    testGetFile(params) {
        const query = new URLSearchParams(params).toString();
        var res = this._axiosXlsx.get(`order/getxls/?${query}`);
        return res;
    }

    getDriverTasks(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`drivers/getdrivertasks/?${query}`);
    }

    getOrdersBetweenDates(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`order/getordersbetweendates/?${query}`);
    }

    getAllActiveOrders(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`order/getallactiveorders/?${query}`);
    }

    getMaterials() {
        var res = this.get(`order/getmaterials`);
        return res;
    }

    createOrder(data) {
        return this.post("order/create", data);
    }

    createDriverTask(data) {
        return this.post("order/createtask", data);
    }

    sendQuestionary(data) {
        var res = this.post(`questionary`, data, { 'Content-Type': 'multipart/form-data' });
        return res;
    }

    async sendQuestionaryAsync(data) {
        var res = await this.post(`questionary`, data, { 'Content-Type': 'multipart/form-data' });
        return await res;
    }

    getQuestionary(uniqueId) {
        var res = this.get(`questionary/${uniqueId}`);
        return res;
    }

    deleteQuestionary(uniqueId) {
        var res = this.delete(`questionary/${uniqueId}`);
        return res;
    }


    getQuestionaryUnit(uniqueId) {
        var res = this.get(`questionary/getunit/${uniqueId}`);
        return res;
    }

    getQuestionaryImages(uniqueId) {
        var res = this.get(`questionary/getImages/${uniqueId}`);
        return res;
    }

    acceptQuestionary(data) {
        var res = this.post(`questionary/acceptquestionary`, data);
        return res;
    }

    getQuestionaries(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`questionary/all/?${query}`);
    }

    getAllQuestionaries(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`questionary/history/?${query}`);
    }

    getUsers(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`user/all/?${query}`);
    }

    createUser = (data) => {
        return this.post("user/registeruser", data);
    };

    deleteUser = (login) => {
        return this.delete(`user/deleteuser/${login}`);
    };

    deleteDriver = (id) => {
        return this.delete(`drivers/deletedriver/${id}`);
    };


    getAdminUser = (login) => {
        return this.get(`user/${login}`);
    };

    updateUser = (login, params) => {
        const data = JSON.stringify(Object.keys(params).map(key => {
                return {
                    op: "add",
                    path: `/${key}`,
                    value: params[key]                
            }
        }));

        return this.patch(`user/updateuser/${login}`, data);
    };


    updateDriver = (driverId, params) => {
        const data = JSON.stringify(Object.keys(params).map(key => {
            return {
                op: "add",
                path: `/${key}`,
                value: params[key]
            }
        }));

        return this.patch(`drivers/updatedriver/${driverId}`, data);
    };

    updateCar = (carId, params) => {
        const data = JSON.stringify(Object.keys(params).map(key => {
            return {
                op: "add",
                path: `/${key}`,
                value: params[key]
            }
        }));

        return this.patch(`cars/updatecar/${carId}`, data);
    };

    updateTrailer = (trailerId, params) => {
        const data = JSON.stringify(Object.keys(params).map(key => {
            return {
                op: "add",
                path: `/${key}`,
                value: params[key]
            }
        }));

        return this.patch(`cars/updatetrailer/${trailerId}`, data);
    };

    createDriver = (data) => {
        return this.post("drivers/createdriver", data);
    };

    getDrivers(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`drivers/getdrivers/?${query}`);
    }

    getAllDrivers(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`drivers/getalldrivers/?${query}`);
    }

    getDriver(driverId) {
        return this.get(`drivers/driver/${driverId}/`);
    }

    getCars(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`cars/getcars/?${query}`);
    }

    getCarsWithTasks(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`cars/getcarswithtasks/?${query}`);
    }

    getAllCars() {
        return this.get(`cars/getallcars/`);
    }

    getAllTrailers() {
        return this.get(`cars/getalltrailers/`);
    }

    getTrailers(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`cars/gettrailers/?${query}`);
    }

    createTrailer(data) {
        return this.post(`cars/createtrailer/`, data);

    }

    createCar(data) {
        return this.post(`cars/createcar/`, data);

    }

    getCar(carId) {
        return this.get(`cars/getcar/${carId}`);
    }

    getCarByPlate(plate) {
        return this.get(`cars/plate/${plate}`);
    }

    getTrailerByPlate(plate) {
        return this.get(`cars/trailer/${plate}`);
    }


    deleteCar(carId) {
        return this.delete(`cars/deletecar/${carId}`);
    }


    deleteTrailer(trailerId) {
        console.log(trailerId);
        return this.delete(`cars/deletetrailer/${trailerId}`);
    }

    login(username, password, isDriver) {
        return this.post("auth/login", { login: username, password: password, isDriver: isDriver })
            .then((response) => {
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }
}

export default new ApiService();