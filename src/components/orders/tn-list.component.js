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
import ViewTn from "./view-tn";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import EditOrderForm from './view-order.component';
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

const TnsList = () => {
    let cancelled = false;
    const [loading, setLoading] = useState(true);
    const [searchBy, setSearchBy] = useState("tnNumber");
    const [searchString, setSearchString] = useState("");
    const [totalNumber, setTotalNumber] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [pageNumber, setPageNumber] = useState(1);
    const [tns, setTns] = useState([]);
    const [reload, setReload] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [sortBy, setSortBy] = useState("");
    const [dir, setDir] = useState("desc");
    const [open, setOpen] = useState(false);
    const [openOrder, setOpenOrder] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState({});
    const [selectedTaskId, setSelectedTaskId] = useState(0);
    const [localUser, setLocalUser] = useState({});
    const [cloningOrder, setCloningOrder] = useState({});
    const [subTaskId, setSubTaskId] = useState(0);
    const [taskId, setTaskId] = useState(0);
    const [subTaskTnOpen, setSubTaskTnOpen] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    const handleClickOpen = (row) => {
        if (row.driverTaskId !== undefined) {
            setTaskId(row.driverTaskId);
            setOpen(true);
        } else {
            setSubTaskId(row.subTaskId);
            setSubTaskTnOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setReload(reload + 1);
    };

    const handleSubTaskTnClose = () => {
        setSubTaskTnOpen(false);
        setSubTaskId(0);
        setReload(reload + 1);
    };

    const handleClickOpenEditOrder = (orderId) => {
        setSelectedOrderId(orderId);
        setOpenOrder(true);
    };

    const handleCloseEditOrderForm = () => {
        setOpenOrder(false);
        setReload(reload + 1);
    };

    useEffect(() => {
        setShowSpinner(true);
        let user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            setLocalUser(user);
        }

        ApiService.getTnsListBetweenDates({
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
            setTns(list);
            setShowSpinner(false);
        });
        setLoading(false);
    }, [pageSize, pageNumber, searchBy, searchString, reload]);

    const search = () => {
        setReload(reload + 1);
    }

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

    const columns = [
        {
            name: "Номер ТН",
            selector: (row, index) => <div>{row.number}</div>,
            wrap: true
        },
        {
            name: "Водитель",
            selector: (row, index) => <div>{row.driverInfo}</div>,
            wrap: true
        },
        {
            name: "Заказчик",
            selector: (row, index) => <div>{row.customer && row.customer.clientName}</div>,
            wrap: true
        },
        //{
        //    name: "Заявка",
        //    selector: (row, index) => <div className='align-left'><Button onClick={(e) => handleClickOpenEditOrder(row.orderId)}>{row.orderName}</Button></div>,
        //    wrap: true,
        //    grow: 2
        //},
        {
            name: "Адрес погрузки",
            selector: (row, index) => row.locationA,
            wrap: true,
        },
        {
            name: "Адрес выгрузки",
            selector: (row, index) => row.locationB,
            wrap: true,
        },
        {
            name: "Материал",
            selector: (row, index) => <div>{row.material}</div>,
            wrap: true
        },
        {
            name: "Проверена",
            selector: (row, index) => <div>{row.isVerified ? "Да" : "Нет"}</div>,
            wrap: true,
            conditionalCellStyles: [
                {
                    when: row => row.isVerified,
                    style: {
                        backgroundColor: '#d1ffbd',
                        '&:hover': {
                            cursor: 'pointer',
                        }
                    }
                },
                {
                    when: row => !row.isVerified,
                    style: {
                        backgroundColor: '#ff726f',
                        color: 'white',
                        '&:hover': {
                            cursor: 'pointer',
                        }
                    }
                }
            ]
        },
        {
            name: "Оригинал",
            selector: (row, index) => <div>{row.isOriginalReceived ? "Да" : "Нет"}</div>,
            wrap: true,
            compact: true,
            conditionalCellStyles: [
                {
                    when: row => row.isOriginalReceived,
                    style: {
                        backgroundColor: '#d1ffbd',
                        '&:hover': {
                            cursor: 'pointer',
                        }
                    }
                },
                {
                    when: row => !row.isOriginalReceived,
                    style: {
                        backgroundColor: '#ff726f',
                        color: 'white',
                        '&:hover': {
                            cursor: 'pointer',
                        }
                    }
                }
            ]
        },
        {
            name: "Действия",
            selector: (row, index) =>
                <ButtonGroup orientation="vertical" size="medium" variant="contained" aria-label="small button group">
                    <Button onClick={(e) => handleClickOpen(row)}><i className="fa fa-external-link" aria-hidden="true"></i></Button>
                    <Button onClick={(e) => handleClickOpenEditOrder(row.orderId)}><i className="fa  fa-file-text" aria-hidden="true"></i></Button>
                </ButtonGroup>,
            center: true,
            wrap: true,
            omit: localUser.identity && (localUser.identity.isDispatcher || localUser.identity.isSalaryBookkeeper)
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '14px',
                fontWeight: 'bold'
            }
        },
        cells: {
            style: {
                fontSize: '14px'
            }
        }
    };

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
            </div>

            <div className="row">
                <div className="col-md-7">
                    <div className="input-group mt-3">
                        <div className="mb-3 col-md-4 pl-1">
                            <select className="form-select" onChange={(e) => { setSearchBy(e.target.value) }} value={searchBy}>
                                <option value="tnNumber">Номер ТН</option>
                                <option value="customer">Заказчик</option>
                                <option value="loadAddress">Адрес погрузки</option>
                                <option value="unloadAddress">Адрес выгрузки</option>
                                <option value="driver">Водитель</option>
                            </select>
                        </div>
                        <div className="mb-3 col-md-4 pl-1">
                            <input className="form-control" type="text" value={searchString} onChange={(e) => { setSearchString(e.target.value) }} />
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
                                    <Button onClick={(e) => { e.preventDefault(); downloadSalariesFile(); }}>Реестр ЗП</Button>
                                </>
                            }
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        </form>

        <div className="row">
            <div className="col-md-12">
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
                    noDataComponent="ТН за указанный период не найдено"
                    progressPending={loading}
                    paginationTotalRows={totalNumber}
                    customStyles={customStyles}
                    data={tns}
                    pagination
                    onChangePage={(page, totalRows) => {
                        !cancelled && setPageNumber(page);
                    }}
                    onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                        !cancelled && setPageSize(currentRowsPerPage);
                    }}
                    paginationPerPage={pageSize}
                />

            </div>
        </div>

        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showSpinner}
        >
            <CircularProgress color="inherit" />
        </Backdrop>


        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}>
            <AppBar sx={{ bgcolor: "#F6CC3" }}>
                <Toolbar variant="outlined">
                    <Button autoFocus color="inherit" onClick={handleClose}>
                        Закрыть
                    </Button>
                </Toolbar>
            </AppBar>
            <ViewTn driverTaskId={taskId} handleClose={handleClose}></ViewTn>
        </Dialog>

        <Dialog
            fullScreen
            open={subTaskTnOpen}
            onClose={handleSubTaskTnClose}>
            <AppBar sx={{ bgcolor: "#F6CC3" }}>
                <Toolbar variant="outlined">
                    <Button autoFocus color="inherit" onClick={handleSubTaskTnClose}>
                        Закрыть
                    </Button>
                </Toolbar>
            </AppBar>
            <ViewTn driverTaskId={subTaskId} isSubTask={'true'} handleClose={handleSubTaskTnClose}></ViewTn>
        </Dialog>


        <Dialog
            fullScreen
            open={openOrder}
            onClose={handleCloseEditOrderForm}>
            <AppBar sx={{ bgcolor: "#F6CC3" }}>
                <Toolbar variant="outlined">
                    <Button autoFocus color="inherit" onClick={handleCloseEditOrderForm}>
                        Закрыть
                    </Button>
                </Toolbar>
            </AppBar>
            <EditOrderForm orderId={selectedOrderId} handleClose={handleCloseEditOrderForm}></EditOrderForm>
        </Dialog>

    </>);

};

export default TnsList;