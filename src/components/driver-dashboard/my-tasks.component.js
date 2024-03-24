import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ApiService from "../../services/cartekApiService";
import DataTable from 'react-data-table-component';
import DatePicker, { registerLocale } from "react-datepicker";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from 'file-saver';
import ru from 'date-fns/locale/ru';
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

const MyTasksList = () => {
    let cancelled = false;
    var date = new Date();
    var yesterday = date - 1000 * 60 * 60 * 24 * 2;
    yesterday = new Date(yesterday);

    let date2 = new Date(date);
    date2.setDate(date.getDate() + 2);

    const [loading, setLoading] = useState(true);
    const [totalNumber, setTotalNumber] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [searchParams, setSearchParams] = useSearchParams({});
    const [pageNumber, setPageNumber] = useState(searchParams.getAll("page").length > 0 ? searchParams.getAll("page")[0] : 1);
    const [orders, setOrders] = useState([]);
    const [reload, setReload] = useState(0);
    const [startDate, setStartDate] = useState(searchParams.getAll("startDate").length > 0 ? new Date(searchParams.getAll("startDate")[0]) : yesterday);
    const [endDate, setEndDate] = useState(searchParams.getAll("endDate").length > 0 ? new Date(searchParams.getAll("endDate")[0]) : date2);
    const [searchBy, setSearchBy] = useState("clientName");
    const [searchString, setSearchString] = useState("");
    const [driverId, setDriverId] = useState(0);
    const [isExternal, setIsExternal] = useState(false);

    const search = () => {
        setReload(reload + 1);
        setParams();
    }

    const setParams = () => {
        let params = { page: pageNumber, searchBy: searchBy, searchString: searchString, startDate: startDate, endDate: endDate };
        setSearchParams(params);
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

    const navigate = useNavigate();

    const ExpandedComponent = ({ data }) => <pre>
        <DataTable
            columns={columnsSubTasks}
            responsive
            noHeader
            striped='true'
            highlightOnHover
            dense='true'
            onRowClicked={(row, event) => {
                navigate(`/driver-dashboard/subtask/${row.id}`);
            }}
            data={data.subTasks}
        /></pre>;



    useEffect(() => {
        setLoading(true);

        let user = JSON.parse(localStorage.getItem("user"));

        setIsExternal(user.isExternal);
        setDriverId(user.identity.id);

        let request = {
            driverId: user.identity.id,
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

    useEffect(() => {
        setParams();
    }, [pageSize, pageNumber, startDate, endDate, reload]);

    const columns = [
        //{
        //    name: "Тягач",
        //    selector: (row, index) => <div>{row.car.plate}</div>,
        //    center: true,
        //},
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
            selector: (row, index) => <div>{row.isCanceled ? "Отменена" : constStatuses[row.status]}</div>,
            center: true,
            wrap: true
        },
        {
            name: "С/ст перевозки",
            selector: (row, index) => row.driverPrice,
            center: true,
            wrap: true,
            omit: isExternal
        }
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
        ApiService.getSalariesReportDriver({
            startDate: startDate.toUTCString(),
            endDate: endDate.toUTCString(),
            driverId: driverId,
            searchBy: searchBy,
            searchString: searchString
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
            paginationDefaultPage={pageNumber}
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
            onRowClicked={(row, event) => {
                navigate(`/driver-dashboard/task/${row.id}`);
            }}
            paginationPerPage={pageSize}
        />
    </>;
};

export default MyTasksList;