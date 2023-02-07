import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "https://localhost:55000/api/";

class ApiService {

    createSetAuthInterceptor = config => {

        const { identityToken } = authHeader();

        console.log(identityToken);

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

        this._axios.interceptors.request.use(this.createSetAuthInterceptor);
    }

    post(url, data, headers = {}) {

        const config = {
            method: 'post',
            url,
            data,
            headers
        };

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


    getUsers(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`user/all/?${query}`);
    }

    createUser = (data) => {
        return this.post("user/registeruser", data);
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

    getDrivers(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`drivers/getdrivers/?${query}`);
    }

    getDriver(carId) {
        return this.get(`drivers/getdriver/${carId}`);
    }

    getCars(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`cars/getcars/?${query}`);
    }

    getCar(carId) {
        return this.get(`cars/getcar/${carId}`);
    }

    login(username, password) {
        return this.post("auth/login", { login: username, password: password })
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