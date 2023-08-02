//Здесь я получаю список машин и тяну список их работ
//Если на выбранную дату у машины нет работы -> пишу сообщение
//Затем открываю в диалоге форму для создания задачи

//Список всех машин в одной колонке, в другой колонке - за какой заявкой машина закреплена на этот день

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/cartekApiService";
import DataTable from 'react-data-table-component';
import DatePicker, { registerLocale } from "react-datepicker";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
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

    const handleClose = () => {
        setOpen(false);
        setReload(reload + 1);
    };

    const search = () => {
        setReload(reload + 1);
    }

    const getTaskStatus = (statusInt) => {
        switch (statusInt) {
            case 0:
                return "Назначена";
            case 1:
                return "Принята";
            case 2:
                return "Загрузка";
            case 3:
                return "Загружен";
            case 4:
                return "В пути";
            case 5:
                return "Разгрузка";
            case 6:
                return "Разгружен";
            case 7:
                return "Документы загружены";
            case 8:
                return "Оригиналы получены";
            case 9:
                return "Завершена";
            default:
                return "Неизвестный статус";
        }
    }
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);

        ApiService.getCarsWithTasks({
            startDate: startDate.toUTCString(),
        }).then(({ data }) => {
            console.log(data);
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
            maxWidth: '1em'
        },
        {
            name: "Создать",
            selector: (row, index) => <Button variant="outlined" onClick={e => handleClickOpen(row.id)}>+</Button>,
            center: true
        }
    ];

    const columnsDriverTask = [
        {
            name: "Клиент",
            selector: (row, index) => <div>{row.order.clientName}</div>,
            center: true,
        },
        {
            name: "Водитель",
            selector: (row, index) => <div>{row.driver.fullName}</div>,
            center: true,
        },
        {
            name: "Дата",
            selector: (row, index) => <div>{row.driver.fullName}</div>,
            center: true,
        },
        {
            name: "Смена",
            selector: (row, index) => row.shift === 0 ? "Дневная" : "Ночная",
            center: true,
        },
        {
            name: "Статус",
            selector: (row, index) => <div>{getTaskStatus(row.status)}</div>,
            center: true,
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
                            <DatePicker className="form-control" locale="ru" selected={startDate} onChange={(date) => setStartDate(date)} />
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
            onRowClicked={(row, event) => {
                navigate(`/`)
            }}
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
    </>;
};

export default CarsWork;