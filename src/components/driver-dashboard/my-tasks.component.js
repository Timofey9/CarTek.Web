/// <reference path="../orders/add-drivertask.component.js" />
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/cartekApiService";
import DataTable from 'react-data-table-component';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

const rowPreDisabled = row => row.driverTasks < 1;

const MyTasksList = () => {
    let cancelled = false;
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("");
    const [dir, setDir] = useState("desc");
    const [totalNumber, setTotalNumber] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [pageNumber, setPageNumber] = useState(1);
    const [orders, setOrders] = useState([]);
    const [reload, setReload] = useState(0);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const search = () => {
        setReload(reload + 1);
    }

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

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        let user = JSON.parse(localStorage.getItem("user"));

        let request = {
            driverId: user.identity.id,
            pageSize: pageSize,
            pageNumber: pageNumber,
        }

        if (startDate) {
            request.startDate = startDate.toUTCString();
        }

        if (endDate) {
            request.endDate = endDate.toUTCString();
        }

        ApiService.getDriverTasks(request).then(({ data }) => {
            const { totalNumber, list } = data;

            console.log(data);
            setTotalNumber(totalNumber);
            setOrders(list);
        });

        setLoading(false);

    }, [sortBy, dir, pageSize, pageNumber, reload]);

    const columns = [
        {
            name: "Тягач",
            selector: (row, index) => <div>{row.car.plate}</div>,
            center: true,
        },
        {
            name: "Дата назначения",
            selector: (row, index) => new Date(row.dateCreated).toLocaleDateString('ru-Ru', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            center: true,
        },
        {
            name: "Дата выполнения",
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
            name: "Точка А",
            selector: (row, index) => row.locationA.textAddress,
            center: true,
            wrap: true
        },
        {
            name: "Точка B",
            selector: (row, index) => row.locationB.textAddress,
            center: true,
            wrap: true
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
            when: row => row.status === 10,
            style: {
                backgroundColor: '#d1ffbd',
                '&:hover': {
                    cursor: 'pointer',
                }
            }
        },
        {
            when: row => row.status !== 0 && row.status !== 10,
            style: {
                backgroundColor: '#ffefac',
                '&:hover': {
                    cursor: 'pointer',
                }
            }
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
                    </div>
                </div>
            </div>
        </form>
        <DataTable
            columns={columns}
            responsive
            noHeader
            striped="true"
            highlightOnHover
            paginationServer
            defaultSortFieldId={1}
            defaultSortAsc
            noDataComponent="Задач не найдено"
            progressPending={loading}
            paginationTotalRows={totalNumber}
            customStyles={customStyles}
            conditionalRowStyles={conditionalRowStyles}
            data={orders}
            pagination
            //expandableRows
            //expandableRowDisabled={rowPreDisabled}
            //expandableRowsComponent={ExpandedComponent}
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