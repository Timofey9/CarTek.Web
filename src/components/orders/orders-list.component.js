import React, { useEffect, useState } from 'react';
import ApiService from "../../services/cartekApiService";
import DataTable from 'react-data-table-component';
import DatePicker, { registerLocale } from "react-datepicker";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { saveAs } from 'file-saver';
import DriverTaskForm from './add-drivertask.component';
import OrderForm from './add-order.component';
import EditOrderForm from './view-order.component';
import AdminEditTask from "./admin-edittask.component";
import "./orders.css";
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
import {
    TransformWrapper,
    TransformComponent,
    ReactZoomPanPinchProps,
    ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";
registerLocale('ru', ru);

const rowPreDisabled = row => row.driverTasks < 1;

const OrdersList = () => {
    let cancelled = false;
    const [loading, setLoading] = useState(true);
    const [searchBy, setSearchBy] = useState("clientName");
    const [searchString, setSearchString] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [dir, setDir] = useState("desc");
    const [totalNumber, setTotalNumber] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [pageNumber, setPageNumber] = useState(1);
    const [orders, setOrders] = useState([]);
    const [reload, setReload] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [openOrder, setOpenOrder] = useState(false);
    const [openEditOrder, setOpenEditOrder] = useState(false);
    const [openEditTask, setOpenEditTask] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState({});
    const [selectedTaskId, setSelectedTaskId] = useState(0);
    const [localUser, setLocalUser] = useState({});
    const [cloningOrder, setCloningOrder] = useState({});

    const constStatuses = ['Назначена', 'Принята', 'На линии', 'Прибыл на склад загрузки', 'Погрузка', 'Выписка ТН (первая часть)', 'Прибыл на объект выгрузки', 'Выгрузка', 'Выписка документов', 'Завершена', 'Отменена'];

    const handleClickOpen = (orderId) => {
        setSelectedOrderId(orderId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setReload(reload + 1);
    };

    const handleClickOpenOrder = (order) => {
        setCloningOrder(order);
        setOpenOrder(true);
    };

    const handleCloseOrderForm = () => {
        setOpenOrder(false);
        setCloningOrder({});
        setReload(reload + 1);
    };

    const handleClickOpenEditOrder = (orderId) => {
        setSelectedOrderId(orderId);
        setOpenEditOrder(true);
    };

    const handleCloseEditOrderForm = () => {
        setOpenEditOrder(false);
        setReload(reload + 1);
    };

    const handleClickOpenTask = (taskId) => {
        setSelectedTaskId(taskId);
        setOpenEditTask(true);
    }

    const handleCloseTaskForm = () => {
        setOpenEditTask(false);
        setReload(reload + 1);
    };

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

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

    const search = () => {
        setReload(reload + 1);
    }

    const downloadFile = () => {
        ApiService.testGetFile({
            startDate: startDate.toUTCString(),
            endDate: endDate.toUTCString()
        }).then(response => {
            let url = window.URL
                .createObjectURL(new Blob([response.data]));
            saveAs(url, "заявки.xlsx");
        });
    };

    const downloadFullTasks = () => {
        ApiService.downloadFullTasksReport({
            startDate: startDate.toUTCString(),
            endDate: endDate.toUTCString()
        }).then(response => {
            let url = window.URL
                .createObjectURL(new Blob([response.data]));
            saveAs(url, "задачи.xlsx");
        });
    };

    const downloadTnsFile = () => {
        ApiService.getTnsList({
            startDate: startDate.toUTCString(),
            endDate: endDate.toUTCString()
        }).then(response => {
            let url = window.URL
                .createObjectURL(new Blob([response.data]));
            saveAs(url, "реестр.xlsx");
        });
    };


    const downloadSalariesFile = () => {
        ApiService.getSalariesReport({
            startDate: startDate.toUTCString(),
            endDate: endDate.toUTCString()
        }).then(response => {
            let url = window.URL
                .createObjectURL(new Blob([response.data]));
            saveAs(url, "реестр_зп.xlsx");
        });
    };


    const downloadTN = (id) => {
        ApiService.downloadTN({
            driverTaskId: id
        }).then(response => {
            let url = window.URL
                .createObjectURL(new Blob([response.data]));
            saveAs(url, "TN.xlsx");
        });
    };

    const ExpandedComponent = ({ data }) => <pre>
        <DataTable
            columns={columnsDriverTask}
            responsive
            noHeader
            striped='true'
            highlightOnHover
            dense='true'
            progressPending={loading}
            customStyles={subCustomStyles}
            data={data.driverTasks}
        /></pre>;


    useEffect(() => {
        setLoading(true);
        let user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            setLocalUser(user);
        }

        ApiService.getOrdersBetweenDates({
            sortColumn: sortBy,
            sortDirection: dir,
            pageSize: pageSize,
            pageNumber: pageNumber,
            searchColumn: searchBy,
            search: searchString,
            startDate: startDate.toUTCString(),
            endDate: endDate.toUTCString()
        }).then(({ data }) => {
            const { totalNumber, list } = data;
            setTotalNumber(totalNumber);
            setOrders(list);
        });

        setLoading(false);

    }, [sortBy, dir, pageSize, pageNumber, reload]);

    const conditionalRowStyles = [
        {
            when: row => row.carCount > row.driverTasks.length || !row.driverTasks.length,
            style: {
                backgroundColor: '#ff726f',
                color: 'white',
                '&:hover': {
                    cursor: 'pointer',
                }
            }
        },
        {
            when: row => row.driverTasks.length && (row.carCount <= row.driverTasks.length),
            style: {
                backgroundColor: '#d1ffbd',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                }
            }
        }
    ];

    const columns = [
        {
            name: "Название",
            selector: (row, index) => <div>{row.name}</div>,
            wrap: true
        },
        {
            name: "Заказчик",
            selector: (row, index) => <div>{row.service === 0 ? (row.client && row.client.clientName) : (row.gp && row.gp.clientName)}</div>,
            wrap: true
        },
        {
            name: "Услуга",
            selector: (row, index) => <div>{row.service === 0 ? "Перевозка" : "Поставка"}</div>,
            center: true,
        },
        {
            name: "Дата",
            selector: (row, index) => buildDates(new Date(row.startDate), new Date(row.dueDate)),
            wrap: true,
            center: true,
        },
        {
            name: "Погрузка",
            selector: (row, index) => row.locationA,
            wrap: true,
        },
        {
            name: "Выгрузка",
            selector: (row, index) => row.locationB,
            wrap: true,
        },
        {
            name: "Материал",
            selector: (row, index) => <div>{row.material && row.material.name}</div>,
            wrap: true
        },
        {
            name: "Задачи",
            selector: (row, index) => <div>{row.driverTasks.length}/{row.carCount}</div>,
            center: true,
            compact: true
        },
        {
            name: "Действия",
            selector: (row, index) =>
                <ButtonGroup orientation="vertical" size="medium" variant="contained" aria-label="small button group">
                    <Button disabled={row.driverTasks.length >= row.carCount} onClick={e => handleClickOpen(row)}><i className="fa fa-plus" aria-hidden="true"></i></Button>
                    <Button onClick={e => handleClickOpenEditOrder(row.id)}><i className="fa fa-external-link" aria-hidden="true"></i></Button>
                    <Button onClick={e => handleClickOpenOrder(row)}><i className="fa fa-clone" aria-hidden="true"></i></Button>
                </ButtonGroup>,
            center: true,
            wrap: true,
            omit: localUser.identity && (localUser.identity.isDispatcher)
        }
    ];

    const columnsDriverTask = [
        {
            name: "Водитель",
            selector: (row, index) => <div>{row.driver.fullName}</div>,
            center: true,
            grow: 2,
            wrap: true
        },
        {
            name: "Тягач",
            selector: (row, index) => <div>{row.car.plate}</div>,
            center: true,
        },
        {
            name: "Смена",
            selector: (row, index) => intToShift(row.shift),
            center: true,
            grow: 2,
            wrap: true
        },
        {
            name: "Статус",
            selector: (row, index) => <div>{row.isCanceled ? "Отменена" : constStatuses[row.status]}</div>,
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
                },
                {
                    when: row => row.isCanceled,
                    style: {
                        backgroundColor: '#696969',
                        color: 'white',
                        '&:hover': {
                            cursor: 'pointer',
                        }
                    }
                }
            ]
        },
        {
            name: "Дата",
            selector: (row, index) => buildDates(new Date(row.startDate), addDays(new Date(row.startDate), 1)),
            center: true,
        },
        {
            name: "Открыть",
            selector: (row, index) => <Button variant="outlined" onClick={e => handleClickOpenTask(row.id)}><i class="fa fa-external-link" aria-hidden="true"></i></Button>,
            center: true,
        },
        {
            name: "ТН",
            selector: (row, index) => row.status === 9 ? <Button variant="contained" color="success" onClick={(event) => downloadTN(row.id)}><i className="fa fa-download" aria-hidden="true"></i></Button> : "-",
            center: true,
            grow: 1
        },
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

    const subCustomStyles = {
        headRow: {
            style: {
                backgroundColor: "#F6CC3A80"
            }
        },
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


    const buildDates = (start, end) => {
        return `${start.getDate()}-${end.toLocaleDateString('ru-Ru', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
    }

    if (loading) {
        return <div><h1>ЗАГРУЗКА...</h1></div>
    }

    return (<>
        <form>
            <div className="row">
                <div className="col-md-8">
                    <div className="input-group mt-3">
                        <div className="mb-3 col-md-4 pl-1">
                            <DatePicker className="form-control" dateFormat="dd.MM.yyyy" locale="ru" selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>
                        <div className="mb-3 col-md-4 pl-1">
                            <DatePicker className="form-control" dateFormat="dd.MM.yyyy" locale="ru" selected={endDate} onChange={(date) => setEndDate(date)} />
                        </div>
                        <div className="input-group-append">
                            <button className="btn btn-default" onClick={(e) => { e.preventDefault(); search() }}><i class="fa fa-search"></i></button>
                        </div>
                    </div>
                </div>
                {localUser.identity && localUser.identity.isAdmin &&
                    <div className="form-group col-md-4">
                        <Button variant="contained" color="success" onClick={() => handleClickOpenOrder()} className="pull-right mb-2">Создать заявку</Button>
                    </div>
                }
            </div>

            <div className="row">
                <div className="col-md-7">
                    <div className="input-group mt-3">
                        <div className="mb-3 col-md-4 pl-1">
                            <select className="form-select" onChange={(e) => { setSearchBy(e.target.value) }} value={searchBy}>
                                <option value="clientName">Заказчик</option>
                                <option value="material">Тип груза</option>
                                <option value="addressA">Адрес погрузки</option>
                                <option value="addressB">Адрес выгрузки</option>
                                <option value="service">Услуга</option>
                            </select>
                        </div>
                        <div className="mb-3 col-md-4 pl-1">
                            {searchBy === 'service' ?
                                <select className="form-select" onChange={(e) => { setSearchString(e.target.value) }} value={searchString}>
                                    <option value="0">Перевозка</option>
                                    <option value="1">Поставка</option>
                                </select> : <input className="form-control" type="text" value={searchString} onChange={(e) => { setSearchString(e.target.value) }} />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="input-group-append pl-2">
                        <ButtonGroup size="medium" variant="contained" aria-label="small button group">
                            {localUser.identity && !localUser.identity.isDispatcher &&
                                <>
                                    <Button onClick={(e) => { e.preventDefault(); downloadTnsFile(); }}>Реестр ТН</Button>
                                    {localUser.identity && !localUser.identity.isLogistManager &&
                                        <Button onClick={(e) => { e.preventDefault(); downloadSalariesFile(); }}>Реестр ЗП</Button>}
                                </>
                            }
                            <Button onClick={(e) => { e.preventDefault(); downloadFile(); }}>Заявки</Button>
                            <Button onClick={(e) => { downloadFullTasks(); }}>Задачи</Button>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        </form>

        <div className="row">

            <div className="col-md-12">
                <div>
                    <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={1}
                        wheel={{ wheelDisabled: "True" }}
                        initialPositionX={0}
                        initialPositionY={0}>
                        {({ zoomOut, resetTransform, ...rest }) => (
                            <React.Fragment>
                                <TransformComponent>
                                    <DataTable
                                        columns={columns}
                                        responsive
                                        noHeader
                                        striped="true"
                                        highlightOnHover
                                        sortServer
                                        paginationServer
                                        defaultSortFieldId={1}
                                        defaultSortAsc
                                        conditionalRowStyles={conditionalRowStyles}
                                        noDataComponent="Заявок за указанный период не найдено"
                                        progressPending={loading}
                                        paginationTotalRows={totalNumber}
                                        customStyles={customStyles}
                                        onSort={(column, direction) => {
                                            !cancelled && setSortBy(column.sortBy);
                                            !cancelled && setDir(direction);
                                        }}
                                        data={orders}
                                        pagination
                                        expandableRows
                                        expandableRowDisabled={rowPreDisabled}
                                        expandableRowsComponent={ExpandedComponent}
                                        onChangePage={(page, totalRows) => {
                                            !cancelled && setPageNumber(page);
                                        }}
                                        onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                                            !cancelled && setPageSize(currentRowsPerPage);
                                        }}
                                        paginationPerPage={pageSize}
                                    />
                                </TransformComponent>
                            </React.Fragment>
                        )}
                    </TransformWrapper>
                </div>
            </div>
        </div>

        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}>
            <AppBar sx={{ bgcolor: "#F6CC3" }}>
                <Toolbar variant="dense">
                    <Button autoFocus color="inherit" onClick={handleClose}>
                        Закрыть
                    </Button>
                </Toolbar>
            </AppBar>
            <DriverTaskForm handleClose={handleClose} order={selectedOrderId}></DriverTaskForm>
        </Dialog>

        <Dialog
            fullScreen
            open={openOrder}
            onClose={handleCloseOrderForm}>
            <AppBar sx={{ bgcolor: "#F6CC3" }}>
                <Toolbar variant="dense">
                    <Button autoFocus color="inherit" onClick={handleCloseOrderForm}>
                        Закрыть
                    </Button>
                </Toolbar>
            </AppBar>
            <OrderForm clonedOrder={cloningOrder} handleCloseOrderForm={handleCloseOrderForm}></OrderForm>
        </Dialog>

        <Dialog
            fullScreen
            open={openEditOrder}
            onClose={handleCloseEditOrderForm}>
            <AppBar sx={{ bgcolor: "#F6CC3" }}>
                <Toolbar variant="outlined">
                    <Button autoFocus color="inherit" onClick={handleCloseEditOrderForm}>
                        Закрыть
                    </Button>
                </Toolbar>
            </AppBar>
            <EditOrderForm orderId={selectedOrderId} handleCloseOrderForm={handleCloseEditOrderForm}></EditOrderForm>
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
    </>);
};

export default OrdersList;