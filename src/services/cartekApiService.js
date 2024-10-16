import axios from "axios";
import EventBus from "../common/EventBus";
import authHeader from "./auth-header";
//const API_URL = "http://185.46.8.6:5000/api/";
//const API_URL = "https://localhost:32768/api/";
const API_URL = "https://api-cartek.ru/api/";

class ApiService {
    createSetAuthInterceptor = config => {
        const { identityToken } = authHeader();

        if (identityToken) {
            config.headers.Authorization = `Bearer ${identityToken}`;
        }

        return config;
    };

    getRefreshToken = () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user && user.refreshToken) {
            return user.refreshToken;
        }
    }

    getAccessToken = () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user && user.token) {
            return user.token;
        }
    }

    constructor() {
        let failedQueue = [];

        this._processQueue = (error, token = null) => {
            failedQueue.forEach((prom) => {
                if (error) {
                    prom.reject(error);
                } else {
                    prom.resolve(token);
                }
            });

            failedQueue = [];
        };


        this._axios = axios.create({
            baseURL: API_URL,
            headers: { 'Content-Type': 'application/json' }
        });

        this._isRefreshing = false;

        this._axiosXlsx = axios.create({
            baseURL: API_URL,
            responseType: 'blob',
            headers: { 'Access-Control-Allow-Origin': '*' }
        });

        this._axios.interceptors.request.use(this.createSetAuthInterceptor);

        this._axiosXlsx.interceptors.request.use(this.createSetAuthInterceptor);

        this._axios.interceptors.response.use(
            response => response,
            error => {
                const originalConfig = error.config;
                const { status } = error.response;
                if (originalConfig.url !== "auth/login" && error.response) {
                    if (status === 401 && !originalConfig._retry) {
                        console.log("refreshing");
                        originalConfig._retry = true;

                        if (this._isRefreshing) {
                            return new Promise(function (resolve, reject) {
                                failedQueue.push({ resolve, reject });
                            })
                                .then((identity) => {
                                    originalConfig.headers["Authorization"] = "Bearer " + identity.token;
                                    return this._axios.request(originalConfig);
                                })
                                .catch((err) => {
                                    return Promise.reject(err);
                                });
                        }

                        try {
                            if (!this._isRefreshing) {

                                this._isRefreshing = true;

                                var accessToken = this.getAccessToken();
                                var refreshToken = this.getRefreshToken();

                                this.post("/auth/refresh", {
                                    "AccessToken": accessToken,
                                    "RefreshToken": refreshToken
                                }).then(response => {
                                    if (response) {
                                        localStorage.setItem("user", JSON.stringify(response.data));
                                        this._processQueue(null, response.data.token);
                                        this._isRefreshing = false;
                                        return this._axios(originalConfig);
                                    } else {
                                        EventBus.dispatch("logout", {});
                                        this._processQueue(error, null);
                                        return Promise.reject(error);
                                    }
                                }).catch((error) => {
                                    EventBus.dispatch("logout", {});
                                    this._processQueue(error, null);
                                    this._isRefreshing = false;
                                    return Promise.reject(error);
                                });
                            }

                        } catch (_error) {
                            console.log("refresh failed2");
                            EventBus.dispatch("logout", {});
                            this._processQueue(_error, null);
                            return Promise.reject(_error);
                        } 
                    }
                }
                else {
                    console.log("not refresh");
                    this._isRefreshing = false;
                    return Promise.reject(error);
                }
            }
        );

        this._axiosXlsx.interceptors.response.use(
            response => response,
            error => {
                const originalConfig = error.config;
                const { status } = error.response;
                if (originalConfig.url !== "auth/login" && error.response) {
                    if (status === 401 && !originalConfig._retry) {
                        console.log("refreshing");
                        originalConfig._retry = true;
                        try {
                            var accessToken = this.getAccessToken();
                            var refreshToken = this.getRefreshToken();

                            this.post("/auth/refresh", {
                                "AccessToken": accessToken,
                                "RefreshToken": refreshToken
                            }).then(response => {
                                console.log(response);
                                if (response) {
                                    console.log("refreshed");
                                    localStorage.setItem("user", JSON.stringify(response.data));
                                    return this._axiosXlsx(originalConfig);
                                } else {
                                    EventBus.dispatch("logout", {});
                                    return Promise.reject(error);
                                }
                            }).catch((error) => {
                                console.log("refresh failed1");
                                console.log(error);
                                EventBus.dispatch("logout", {});
                                return Promise.reject(error);
                            });
                        } catch (_error) {
                            console.log("refresh failed2");
                            EventBus.dispatch("logout", {});
                            return Promise.reject(_error);
                        }
                    }
                }
                else {
                    console.log("not refresh");
                    return Promise.reject(error);
                }
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

    getTnsList(params) {
        const query = new URLSearchParams(params).toString();
        var res = this._axiosXlsx.get(`order/gettnxls/?${query}`);
        return res;
    }

    getSalariesReport(params) {
        const query = new URLSearchParams(params).toString();
        var res = this._axiosXlsx.get(`order/getaccountantreport/?${query}`);
        return res;
    }

    getSalariesReportDriver(params) {
        const query = new URLSearchParams(params).toString();
        var res = this._axiosXlsx.get(`order/getdriverreport/?${query}`);
        return res;
    }

    downloadTN(params) {
        const query = new URLSearchParams(params).toString();
        var res = this._axiosXlsx.get(`order/gettn/?${query}`);
        return res;
    }

    downloadDriverSalaryTable(params) {
        const query = new URLSearchParams(params).toString();
        var res = this._axiosXlsx.get(`order/getdriversalariestable/?${query}`);
        return res;
    }

    downloadFullTasksReport(params) {
        const query = new URLSearchParams(params).toString();
        var res = this._axiosXlsx.get(`order/getfulltasksreport/?${query}`);
        return res;
    }

    downloadTasksReport(params) {
        const query = new URLSearchParams(params).toString();
        var res = this._axiosXlsx.get(`order/gettasksreport/?${query}`);
        return res;
    }

    downloadTasksReportShort(params) {
        const query = new URLSearchParams(params).toString();
        var res = this._axiosXlsx.get(`order/gettasksreportshort/?${query}`);
        return res;
    }

    viewTN(id, isSubTask) {
        var res = this.get(`order/viewtn/${id}/${isSubTask}`);
        return res;
    }

    viewEditTN(id, isSubTask) {
        var res = this.get(`order/viewedittn/${id}/${isSubTask}`);
        return res;
    }

    getDriverTasks(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`drivers/getdrivertasks/?${query}`);
    }

    getDriverTaskById(id) {
        return this.get(`drivers/getdrivertask/${id}`);
    }

    getSubTask(id) {
        return this.get(`drivers/getsubtask/${id}`);
    }

    getOrderById(id) {
        return this.get(`order/getorderbyid/${id}`);
    }

    deleteOrder(id) {
        return this.delete(`order/deleteorder/${id}`);
    }


    deleteSubtask(id) {
        return this.delete(`order/deleteSubTask/${id}`);
    }

    deleteTask(id) {
        return this.delete(`order/deletetask/${id}`);
    }

    createSubTask(data) {
        return this.post(`order/createsubtask`, data);
    }

    verifyTn(data) {
        return this.post(`order/verifytn`, data);
    }

    TaskGetBack(data) {
        var res = this.post(`drivers/taskgetback`, data);
        return res;
    }

    CancelTask(data) {
        var res = this.post(`order/canceldrivertask`, data);
        return res;
    }

    RestoreTask(data) {
        var res = this.post(`order/restoredrivertask`, data);
        return res;
    }

    CancelSubTask(data) {
        var res = this.post(`order/canceldriversubtask`, data);
        return res;
    }

    RestoreSubTask(data) {
        var res = this.post(`order/restoredriversubtask`, data);
        return res;
    }

    async SubmitNoteAsync(data) {
        var res = await this.post(`drivers/postnote`, data, { 'Content-Type': 'multipart/form-data' });
        return await res;
    }

    async EditDriverTaskAsync(data) {
        var res = await this.post(`drivers/updatedrivertask`, data, { 'Content-Type': 'multipart/form-data' });
        return await res;
    }

    async EditDriverSubTaskAsync(data) {
        var res = await this.post(`drivers/updatesubtask`, data, { 'Content-Type': 'multipart/form-data' });
        return await res;
    }

    async SubmitDriverSubTaskAsync(data) {
        var res = await this.post(`drivers/subtasktn`, data, { 'Content-Type': 'multipart/form-data' });
        return await res;
    }

    async startTn(data) {
        var res = await this.post(`drivers/starttn`, data, { 'Content-Type': 'multipart/form-data' });
        return await res;
    }

    async finalizeTn(data) {
        var res = await this.post(`drivers/finalizetn`, data, { 'Content-Type': 'multipart/form-data' });
        return await res;
    }

    async updateTn(data) {
        var res = await this.post(`drivers/updatetn`, data, { 'Content-Type': 'multipart/form-data' });
        return res;
    }

    async AdminEditDriverTaskAsync(data) {
        var res = await this.post(`order/updatedrivertask`, data);
        return await res;
    }

    async DeleteS3ImageAsync(data) {
        var res = await this.post(`order/deleteS3Image`, data);
        return await res;
    }

    getOrdersBetweenDates(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`order/getordersbetweendates/?${query}`);
    }

    getTnsListBetweenDates(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`tn/gettnslist/?${query}`);
    }

    getAllActiveOrders(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`order/getallactiveorders/?${query}`);
    }

    getMaterials() {
        var res = this.get(`utils/getmaterials`);
        return res;
    }

    getExternalTransporters() {
        var res = this.get(`utils/getexternaltransporterslist`);
        return res;
    }

    getExternalTransporter(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`utils/getexternaltransporter/?${query}`);
    }

    createExternalTransporter(data) {
        var res = this.post(`utils/createexternaltransporter`, data);
        return res;
    }

    updateExternalTransporter(data) {
        var res = this.post(`utils/updateexternaltransporter`, data);
        return res;
    }

    getClients() {
        var res = this.get(`utils/getclients`);
        return res;
    }

    createClient(data) {
        var res = this.post(`utils/createclient`, data);
        return res;
    }

    creatematerial(data) {
        var res = this.post(`utils/creatematerial`, data);
        return res;
    }

    updateMaterial(data) {
        var res = this.post(`utils/updatematerial`, data);
        return res;
    }

    deleteMaterial(id) {
        return this.delete(`utils/deletematerial/${id}`);
    }

    createAddress(data) {
        var res = this.post(`utils/createaddress`, data);
        return res;
    }

    updateAddress(data) {
        var res = this.post(`utils/updateaddress`, data);
        return res;
    }

    deleteAddress(id) {
        return this.delete(`utils/deleteaddress/${id}`);
    }

    updateClient(data) {
        var res = this.post(`utils/updateclient`, data);
        return res;
    }

    deleteClient(id) {
        return this.delete(`utils/deleteclient/${id}`);
    }

    createinformationmessage(data) {
        var res = this.post(`utils/createmessage`, data);
        return res;
    }

    deleteinformationmessage(id) {
        return this.delete(`utils/deleteinformationmessage/${id}`);
    }

    getInfromationMessages() {
        var res = this.get(`utils/getinformationmessages`);
        return res;
    }

    getAddresses() {
        var res = this.get(`utils/getaddresses`);
        return res;
    }

    createOrder(data) {
        return this.post("order/create", data);
    }

    createDriverTask(data) {
        return this.post("order/createtask", data);
    }

    createDriverTasksMultiple(data) {
        return this.post("order/createtasksmultiple", data);
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

    getNotifications(data) {
        const query = new URLSearchParams(data).toString();
        return this.get(`notification/getnotifications/?${query}`);
    }

    saveDeviceToken(data) {
        return this.post(`notification/savedeviceinfo/`, data);
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

    updateOrder = (orderId, params) => {
        const data = JSON.stringify(Object.keys(params).map(key => {
            return {
                op: "add",
                path: `/${key}`,
                value: params[key]
            }
        }));

        return this.patch(`order/updateorder/${orderId}`, data);
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


    fireDriver = (data) => {
        return this.post("drivers/firedriver", data);
    };

    getDrivers(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`drivers/getdrivers/?${query}`);
    }

    getAllDriversWithFired(params) {
        const query = new URLSearchParams(params).toString();
        return this.get(`drivers/getalldriverswithfired/?${query}`);
    }

    getAllDrivers() {
        return this.get(`drivers/getalldrivers`);
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