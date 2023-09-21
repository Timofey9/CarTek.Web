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
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

const rowPreDisabled = row => row.driverTasks < 1;

const CarsWork = () => {
    let cancelled = false;
    const [loading, setLoading] = useState(true);
    const [searchBy, setSearchBy] = useState("name");
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
    const constStatuses = ['Назначена', 'Принята', 'На линии', 'На складе загрузки', 'Выписка документов', 'Погрузился', 'Выехал со склада', 'На объекте выгрузки', 'Выгрузка', 'Выписка документов', 'Завершена'];

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
            onRowClicked={(row, event) => {
                navigate(`/admin/drivertask/${row.id}`);
            }}
        /></pre>;

    const handleClickOpen = (carId) => {
        setOpen(true);
        setSelectedCarId(carId);
    };

    const intToShift = (shift) => {
        switch (shift) {
            case 0:
                return "Дневная (08:00 - 20:00)";
            case 1:
                return "Ночная (20:00 - 08:00)";
            case 2:
                return "Сутки";
            case 3:
                return "Сутки (не ограничено)";
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


    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        let user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            setLocalUser(user);
        }

        ApiService.getCarsWithTasks({
            startDate: startDate.toUTCString(),
        }).then(({ data }) => {
            setCars(data);
        });

        setLoading(false);

    }, [sortBy, dir, reload]);

    const columns = [
        {
            name: "Номер",
            sortBy: "plate",
            selector: (row, index) => row.plate,
            sortable: true
        },
        {
            name: "Марка",
            sortBy: "brand",
            selector: (row, index) => row.brand,
            sortable: false,
            maxWidth: '1em'
        },
        {
            name: "Модель",
            sortBy: "model",
            selector: (row, index) => row.model,
            sortable: false,
            minWidth: '1em',
        },
        {
            name: "Статус",
            selector: (row, index) => row.state === 0 ? "На базе" : "На линии",
            sortable: false,
            maxWidth: '1em',
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
            selector: (row, index) => <div>{row.order.service === '0' ? row.order.clientName : row.order.gp.clientName}</div>,
            center: true,
        },
        {
            name: "Услуга",
            selector: (row, index) => <div>{row.order.service === '0' ? "Поставка" : "Перевозка"}</div>,
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
                        backgroundColor: '#d1ffbd',
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
            </div>
        </form>

        <DataTable
            columns={columns}
            responsive
            noHeader
            conditionalRowStyles={conditionalRowStyles}
            highlightOnHover
            defaultSortFieldId={1}
            defaultSortAsc
            noDataComponent="Машин не найдено"
            progressPending={loading}
            customStyles={customStyles}
            data={cars}
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