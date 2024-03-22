import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/cartekApiService";
import DataTable from 'react-data-table-component';
import DatePicker, { registerLocale } from "react-datepicker";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import AdminEditTask from "./admin-edittask.component";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from 'file-saver';
import ru from 'date-fns/locale/ru';
import DialogContent from '@mui/material/DialogContent';
import Badge from '@mui/material/Badge';


registerLocale('ru', ru);

const constStatuses = ['Назначена', 'Принята', 'На линии', 'Прибыл на склад загрузки', 'Погрузка', 'Выписка ТН (первая часть)', 'Прибыл на объект выгрузки', 'Выгрузка', 'Выписка документов', 'Завершена', 'Отменена'];

const rowPreDisabled = row => row.subTasksCount < 1;
const rowPreExpanded = row => row.subTasksCount > 0;

const columnsSubTasks = [
    {
        name: "Номер рейса",
        selector: (row, index) => row.sequenceNumber + 1,
        wrap: true,
        center: true
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
            },
        ]
    },
];

const FullTasksList = () => {
    let cancelled = false;
    var date = new Date();
    var yesterday = date - 1000 * 60 * 60 * 24 * 2;
    yesterday = new Date(yesterday);

    let date2 = new Date(date);
    date2.setDate(date.getDate() + 2);

    const [loading, setLoading] = useState(true);
    const [totalNumber, setTotalNumber] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [pageNumber, setPageNumber] = useState(1);
    const [orders, setOrders] = useState([]);
    const [reload, setReload] = useState(0);
    const [startDate, setStartDate] = useState(yesterday);
    const [endDate, setEndDate] = useState(date2);
    const [searchBy, setSearchBy] = useState("clientName");
    const [searchString, setSearchString] = useState("");
    const [driverId, setDriverId] = useState(0);
    const [isExternal, setIsExternal] = useState(false);
    const [openEditTask, setOpenEditTask] = useState(false);
    const [openLastComment, setOpenLastComment] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(0);
    const [selectedComment, setSelectedComment] = useState({});
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

    const handleOpenLastComment = (note) => {
        if (note && note.text.length > 1) {
            setSelectedComment(note);
            setOpenLastComment(true);
        }
    }

    const handleCloseLastComment = () => {
        setOpenLastComment(false);
        setSelectedComment({});
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

    const navigate = useNavigate();

    const ExpandedComponent = ({ data }) => <pre>
        <DataTable
            columns={columnsSubTasks}
            responsive
            noHeader
            striped='true'
            highlightOnHover
            dense='true'
            data={data.subTasks}
        /></pre>;

    useEffect(() => {
        setLoading(true);

        let user = JSON.parse(localStorage.getItem("user"));

        setIsExternal(user.isExternal);
        setDriverId(user.identity.id);

        let request = {
            driverId: 0,
            pageSize: pageSize,
            pageNumber: pageNumber,
            searchBy: searchBy,
            searchString: searchString
        }

        if (startDate) {
            request.startDate = startDate.toUTCString();
        }

        if (endDate) {
            request.endDate = endDate.toUTCString();
        }

        ApiService.getDriverTasks(request).then(({ data }) => {
            const { totalNumber, list } = data;

            setTotalNumber(totalNumber);
            setOrders(list);
        });

        setLoading(false);

    }, [pageSize, pageNumber, searchBy, searchString, reload]);

    const columns = [
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
            wrap: true
        },
        {
            name: "Тип груза",
            selector: (row, index) => row.material,
            center: true,
            omit: isExternal
        },
        {
            name: "Адрес погрузки",
            selector: (row, index) => row.locationA && row.locationA.textAddress,
            center: true,
            wrap: true
        },
        {
            name: "Адрес выгрузки",
            selector: (row, index) => row.locationB && row.locationB.textAddress,
            center: true,
            wrap: true
        },
        {
            name: "Статус",
            selector: (row, index) => row.lastNote && row.lastNote.text.length > 1 ?                   
                <Button variant="text" onClick={e => handleOpenLastComment(row.lastNote)}>
                    <Badge variant="dot" color="error" invisible={!row.lastNote || row.lastNote.text.length < 1}>
                        <div>{row.isCanceled ? "Отменена" : constStatuses[row.status]}</div>
                    </Badge>
                </Button>
                : <div>{row.isCanceled ? "Отменена" : constStatuses[row.status]}</div>,

            center: true,
            wrap: true,
        },
        {
            name: "Открыть",
            selector: (row, index) => <Button variant="outlined" onClick={e => handleClickOpenTask(row.id)}><i class="fa fa-external-link" aria-hidden="true"></i></Button>,
            center: true,
        },
    ];

    const conditionalRowStyles = [
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
    ];

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

    if (loading) {
        return <div><h1>ЗАГРУЗКА...</h1></div>
    }

    return <>
        <form>
            <div className="row">
                <div className="col-md-7">
                    <div className="input-group mt-3">
                        <div className="mb-3 col-md-4 pl-1">
                            <DatePicker className="form-control" dateFormat="dd.MM.yyyy" locale="ru" selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>
                        <div className="mb-3 col-md-4 pl-1">
                            <DatePicker className="form-control" dateFormat="dd.MM.yyyy" locale="ru" selected={endDate} onChange={(date) => setEndDate(date)} />
                        </div>
                        <div className="input-group-append">
                            <button className="btn btn-default" onClick={(e) => { e.preventDefault(); search() }}><i className="fa fa-search"></i></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-7">
                    <div className="input-group mt-3">
                        <div className="mb-3 col-md-4 pl-1">
                            <select className="form-select" onChange={(e) => { setSearchBy(e.target.value) }} value={searchBy}>
                                <option value="clientName">Заказчик</option>
                                <option value="material">Тип груза</option>
                                <option value="driver">Водитель</option>
                            </select>
                        </div>
                        <div className="mb-3 col-md-4 pl-1">
                            <input className="form-control" type="text" value={searchString} onChange={(e) => { setSearchString(e.target.value) }} />
                        </div>
                    </div>
                </div>
            </div>

            {!isExternal &&
                <div className="row">
                    <div className="col-md-12">
                        <div className="input-group-append pl-2">
                            <ButtonGroup size="medium" variant="contained" aria-label="small button group">
                                <Button onClick={(e) => { e.preventDefault(); downloadSalariesFile(); }}>Реестр ЗП</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
            }
        </form>
        <DataTable
            columns={columns}
            responsive
            noHeader
            striped="true"
            highlightOnHover
            paginationServer
            noDataComponent="Задач не найдено"
            progressPending={loading}
            paginationTotalRows={totalNumber}
            customStyles={customStyles}
            conditionalRowStyles={conditionalRowStyles}
            data={orders}
            pagination
            expandableRows
            expandableRowDisabled={rowPreDisabled}
            expandableRowExpanded={rowPreExpanded}
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

        <Dialog
            open={openLastComment}
            onClose={handleCloseLastComment}>
            <DialogTitle>{new Date(selectedComment.dateCreated).toLocaleString('ru-Ru')}</DialogTitle>
            <DialogContent dividers>
                <Typography>{selectedComment.text}</Typography>
            </DialogContent>
        </Dialog>
    </>;
};

export default FullTasksList;