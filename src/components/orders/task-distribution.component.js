/// <reference path="orders-list.component.js" />
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/cartekApiService";
import DataTable from 'react-data-table-component';
import DatePicker, { registerLocale } from "react-datepicker";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AdminEditTask from "./admin-edittask.component";
import DriverTaskCarForm from './add-drivertaskCar.component';
import { saveAs } from 'file-saver';
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

const rowPreDisabled = row => row.driverTasks < 1;

const CarsWork = () => {
    let cancelled = false;
    const [loading, setLoading] = useState(true);
    const [searchBy, setSearchBy] = useState("none");
    const [sortBy, setSortBy] = useState("");
    const [searchString, setSearchString] = useState("");
    const [dir, setDir] = useState("desc");
    const [cars, setCars] = useState([]);
    const [reload, setReload] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState(0);
    const [selectedTaskId, setSelectedTaskId] = useState(0);
    const [openEditTask, setOpenEditTask] = useState(false);
    const [localUser, setLocalUser] = useState({});
    const [filtered, setFiltered] = useState([]);
    const constStatuses = ['Назначена', 'Принята', 'На линии', 'Прибыл на склад загрузки', 'Погрузка', 'Выписка ТН (первая часть)', 'Прибыл на объект выгрузки', 'Выгрузка', 'Выписка документов', 'Завершена'];

    const ExpandedComponent = ({ data }) => <pre>
        <DataTable
            columns={columnsDriverTask}
            responsive
            noHeader
            striped='true'
            highlightOnHover
            dense='true'
            progressPending={loading}
            data={data.driverTasks}
        /></pre>;

    const handleClickOpen = (carId) => {
        setOpen(true);
        setSelectedCarId(carId);
    };

    const downloadFile = () => {
        ApiService.downloadTasksReport({
            startDate: startDate.toUTCString(),
        }).then(response => {
            let url = window.URL
                .createObjectURL(new Blob([response.data]));
            saveAs(url, `Задачи_${startDate.toLocaleDateString()}.xlsx`);
        });
    };

    const downloadFileShort = () => {
        ApiService.downloadTasksReportShort({
            startDate: startDate.toUTCString(),
        }).then(response => {
            let url = window.URL
                .createObjectURL(new Blob([response.data]));
            saveAs(url, `Разнарядка_${startDate.toLocaleDateString()}.xlsx`);
        });
    };

    const intToShift = (shift) => {
        switch (shift) {
            case 0:
                return "Ночная (20:00 - 08:00)";
            case 1:
                return "Дневная (08:00 - 20:00)";
            case 2:
                return "Сутки";
            case 3:
                return "Сутки (неограниченно)";
        }
    } 

    const handleClose = () => {
        setOpen(false);
        setReload(reload + 1);
    };

    const search = () => {
        setReload(reload + 1);
    }

    const handleClickOpenTask = (taskId) => {
        setSelectedTaskId(taskId);
        setOpenEditTask(true);
    }

    const handleCloseTaskForm = () => {
        setOpenEditTask(false);
        setReload(reload + 1);
    };


    useEffect(() => {
        setLoading(true);
        let user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            setLocalUser(user);
        }

        ApiService.getCarsWithTasks({
            startDate: startDate.toISOString(),
        }).then(({ data }) => {
            setCars(data);
            filterData(searchString, JSON.parse(JSON.stringify(data)));
        });

        setLoading(false);

    }, [sortBy, dir, reload]);

    const columns = [
        {
            name: "П/П",
            selector: (row, index) => index + 1,
            sortable: false,
            maxWidth: '0.2em',
        },
        {
            name: "Номер",
            selector: (row, index) => row.plate,
            sortable: false
        },
        {
            name: "Статус",
            selector: (row, index) => row.state === 0 ? "На базе" : "На линии",
            sortable: false,
            maxWidth: '1em',
            wrap:true
        },
        {
            name: "Задачи",
            selector: (row, index) => <div>{row.driverTasks.length}</div>,
            sortable: false,
            maxWidth: '1em',
        },
        {
            name: "Создать",
            selector: (row, index) => <Button variant="outlined" onClick={e => handleClickOpen(row.id)}>+</Button>,
            center: true,
            omit: localUser.identity && localUser.identity.isDispatcher
        }
    ];

    const columnsDriverTask = [
        {
            name: "Заказчик",
            selector: (row, index) => <div>{row.order.service === 0 ? row.order.clientName : row.order.gp.clientName}</div>,
            center: true,
        },
        {
            name: "Погрузка",
            selector: (row, index) => row.locationA && row.locationA.textAddress,
            wrap: true
        },
        {
            name: "Выгрузка",
            selector: (row, index) => row.locationB && row.locationB.textAddress,
            wrap: true
        },
        {
            name: "Услуга",
            selector: (row, index) => <div>{row.order.service === 0 ? "Перевозка" : "Поставка"}</div>,
            center: true,
        },    
        {
            name: "Водитель",
            selector: (row, index) => <div>{row.driver.fullName}</div>,
            center: true,
            grow: 2,
            wrap: true
        },
        {
            name: "Дата",
            selector: (row, index) => new Date(row.startDate).toLocaleDateString('ru-Ru', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            center: true,
        },
        {
            name: "Смена",
            selector: (row, index) => intToShift(row.shift),
            center: true,
        },
        {
            name: "Статус",
            selector: (row, index) => <div>{constStatuses[row.status]}</div>,
            center: true,
            wrap: true,
            conditionalCellStyles: [
                {
                    when: row => row.status === 0,
                    style: {
                        backgroundColor: '#ff726f',
                        color: 'white',
                        '&:hover': {
                            cursor: 'pointer',
                        }
                    }
                },
                {
                    when: row => row.status === 10,
                    style: {
                        backgroundColor: '#696969',
                        color: 'white',
                        '&:hover': {
                            cursor: 'pointer',
                        }
                    }
                },
                {
                    when: row => row.status === 9,
                    style: {
                        backgroundColor: '#d1ffbd',
                        '&:hover': {
                            cursor: 'pointer',
                        }
                    }
                },
                {
                    when: row => row.status !== 0 && row.status !== 9 && row.status !== 10,
                    style: {
                        backgroundColor: '#ffefac',
                        '&:hover': {
                            cursor: 'pointer',
                        }
                    }
                }]
        },
        {
            name: "Открыть",
            selector: (row, index) => <Button variant="outlined" onClick={e => handleClickOpenTask(row.id)}><i class="fa fa-external-link" aria-hidden="true"></i></Button>,
            center: true
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '14px',
                fontWeight: 'bold'
            },
        },
        cells: {
            style: {
                fontSize: '14px'
            },
        }
    };

    const filterData = (search, temp) => {
        setSearchString(search);

        switch (searchBy) {
            case "plate": {
                setFiltered(temp.filter((car) => car.plate.includes(search)));
                break;
            }
            case "status": {
                var filteredArr = [];
                for (var i = 0; i < temp.length; i++) {
                    var filteredTasks = temp[i].driverTasks.filter((dt) => dt.status === parseInt(search));
                    temp[i].driverTasks = filteredTasks;

                    if (temp[i].driverTasks.length > 0) {
                        filteredArr.push(temp[i]);
                    }
                }
                setFiltered(filteredArr);
                break;
            }
            case "driver": {
                var filteredArr = [];
                const capitalized = search.charAt(0).toUpperCase() + search.slice(1);
                setSearchString(capitalized);
                for (var i = 0; i < temp.length; i++) {
                    var filteredTasks = temp[i].driverTasks.filter((dt) => dt.driver.fullName.includes(capitalized));
                    temp[i].driverTasks = filteredTasks;

                    if (temp[i].driverTasks.length > 0) {
                        filteredArr.push(temp[i]);
                    }
                }
                setFiltered(filteredArr);
                break;
            }
            default: {
                setSearchString("");
                setFiltered(temp);
            }
        }
    }

    const conditionalRowStyles = [
        {
            when: row => row.driverTasks.length === 0,
            style: {
                backgroundColor: '#ff726f',
                color: 'white',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },
        {
            when: row => row.driverTasks.length > 0,
            style: {
                backgroundColor: '#d1ffbd',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        }
    ];

    const updateSearchBy = (value) => {
        if (value === 'none') {
            setSearchBy(value);
            setSearchString("");
            filterData("", JSON.parse(JSON.stringify(cars)));
        } else {
            setSearchBy(value);
            filterData(searchString, JSON.parse(JSON.stringify(cars)));
        }
    }

    if (loading) {
        return <div><h1>ЗАГРУЗКА...</h1></div>
    }

    return <>
        <form>
            <div className="row">
                <div className="col-md-7">
                    <div className="input-group mt-3">
                        <div className="mb-3 col-md-4 pl-1">
                            <DatePicker dateFormat="dd.MM.yyyy" className="form-control" locale="ru" selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>
                        <div className="input-group-append">
                            <button className="btn btn-default" onClick={(e) => { e.preventDefault(); search() }}><i className="fa fa-search"></i></button>
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <button className="btn btn-success pull-right" onClick={(e) => { e.preventDefault(); downloadFile() }}>Скачать</button>
                    <button className="btn btn-success pull-right" onClick={(e) => { e.preventDefault(); downloadFileShort() }}>Сводная табл.</button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-7">
                    <div className="input-group mt-3">
                        <div className="mb-3 col-md-4 pl-1">
                            <select className="form-select" onChange={(e) => { updateSearchBy(e.target.value) }} value={searchBy}>
                                <option value="none">Поиск по</option>
                                <option value="plate">Номер</option>
                                <option value="status">Статус</option>
                                <option value="driver">Водитель</option>
                            </select>
                        </div>

                        <div className="mb-3 col-md-4 pl-1">
                            {searchBy === 'status' ?
                                <select className="form-select" onChange={(e) => { filterData(e.target.value, JSON.parse(JSON.stringify(cars)))}} value={searchString}>
                                    <option value="0">Назначена</option>
                                    <option value="1">Принята</option>
                                    <option value="2">На линии</option>
                                    <option value="3">Прибыл на склад загрузки</option>
                                    <option value="4">Погрузка</option>
                                    <option value="5">Выписка ТН (первая часть)</option>
                                    <option value="6">Выехал со склада</option>
                                    <option value="7">Прибыл на объект выгрузки</option>
                                    <option value="8">Выгрузка</option>
                                    <option value="9">Выписка документов</option>
                                    <option value="10">Завершена</option>
                                </select>                                
                                :
                                <input className="form-control" type="text" value={searchString} onChange={(e) => { filterData(e.target.value, JSON.parse(JSON.stringify(cars)))}} />}
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <DataTable
            columns={columns}
            responsive
            noHeader
            conditionalRowStyles={conditionalRowStyles}
            highlightOnHover
            noDataComponent="Машин не найдено"
            progressPending={loading}
            customStyles={customStyles}
            data={filtered}
            expandableRows
            expandableRowDisabled={rowPreDisabled}
            expandableRowsComponent={ExpandedComponent}
        />

        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}>
            <AppBar sx={{ bgcolor: "#F6CC3" }}>
                <Toolbar>
                    <Button autoFocus color="inherit" onClick={handleClose}>
                        Закрыть
                    </Button>
                </Toolbar>
            </AppBar>
            <DriverTaskCarForm handleClose={handleClose} carId={selectedCarId}></DriverTaskCarForm>
        </Dialog>

        <Dialog
            fullScreen
            open={openEditTask}
            onClose={handleCloseTaskForm}>
            <AppBar sx={{ bgcolor: "#F6CC3" }}>
                <Toolbar variant="outlined">
                    <Button autoFocus color="inherit" onClick={handleCloseTaskForm}>
                        Закрыть
                    </Button>
                </Toolbar>
            </AppBar>
            <AdminEditTask driverTaskId={selectedTaskId} handleCloseTaskForm={handleCloseTaskForm}></AdminEditTask>
        </Dialog>
    </>;
};

export default CarsWork;