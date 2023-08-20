import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/cartekApiService";
import DataTable from 'react-data-table-component';
import DatePicker, { registerLocale } from "react-datepicker";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { saveAs } from 'file-saver';
import DriverTaskForm from './add-drivertask.component';
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

const rowPreDisabled = row => row.driverTasks < 1;

const OrdersList = () => {
    let cancelled = false;
    const [loading, setLoading] = useState(true);
    const [searchBy, setSearchBy] = useState("name");
    const [sortBy, setSortBy] = useState("");
    const [searchString, setSearchString] = useState("");
    const [dir, setDir] = useState("desc");
    const [totalNumber, setTotalNumber] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [pageNumber, setPageNumber] = useState(1);
    const [orders, setOrders] = useState([]);
    const [reload, setReload] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(0);

    const handleClickOpen = (orderId) => {
        setOpen(true);
        setSelectedOrderId(orderId);
    };

    const handleClose = () => {
        setOpen(false);
        setReload(reload + 1);
    };

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
            onRowClicked={(row, event) => {
                navigate(`/admin/drivertask/${row.id}`);
            }}
        /></pre>;


    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);

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
            name: "#",
            selector: (row, index) => <div>{row.id}</div>,
            sortable: false,
            maxWidth: '1em'
        },
        {
            name: "Название",
            selector: (row, index) => <div>{row.name}</div>,
            center: true,
        },    
        {
            name: "Клиент",
            selector: (row, index) => <div>{row.clientName}</div>,
            center: true,
        },    
        {
            name: "Дата начала",
            selector: (row, index) => new Date(row.startDate).toLocaleDateString('ru-Ru', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            center: true,
        },        
        {
            name: "Материал",
            selector: (row, index) => <div>{row.material.name}</div>,
            center: true,
        },    
        {
            name: "Задач",
            selector: (row, index) => <div>{row.driverTasks.length}/{row.carCount}</div>,
            center: true,
        },    
        {
            name: "Создать",
            selector: (row, index) => <Button variant="outlined" onClick={e => handleClickOpen(row.id)}>+</Button>,
            center: true
        }
    ];

    const columnsDriverTask = [
        {
            name: "Водитель",
            selector: (row, index) => <div>{row.driver.fullName}</div>,
            center: true,
        },
        {
            name: "Тягач",
            selector: (row, index) => <div>{row.car.plate} - {row.car.brand} {row.car.model}</div>,
            center: true,
        },
        {
            name: "Смена",
            selector: (row, index) => row.shift === 0 ? "Дневная" : "Ночная",
            center: true,
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
            name: "ТН",
            selector: (row, index) => <button className="btn btn-success" onClick={(event) => downloadTN(row.id)}>Скачать ТН</button>,
            center: true,
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
                        <div className="mb-3 col-md-4 pl-1">
                            <DatePicker className="form-control" locale="ru" selected={endDate} onChange={(date) => setEndDate(date)} />
                        </div>
                        <div className="input-group-append">
                            <button className="btn btn-default" onClick={(e) => { e.preventDefault(); search() }}><i className="fa fa-search"></i></button>
                        </div>
                        <div className="input-group-append">
                            <button className="btn btn-default" onClick={(e) => { e.preventDefault(); downloadFile() }}>СКАЧАТЬ</button>
                        </div>
                    </div>
                </div>
                <div className="form-group col-md-5">
                   <Link to="/admin/orders/create" type="submit" className="pull-right btn btn-success mb-2">Создать заявку</Link>
                </div>
            </div>
        </form>
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
            <DriverTaskForm handleClose={handleClose} orderId={selectedOrderId}></DriverTaskForm>
        </Dialog>
    </>;
};

export default OrdersList;