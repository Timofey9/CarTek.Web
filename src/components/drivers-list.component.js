import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ApiService from "../services/cartekApiService";
import DataTable from 'react-data-table-component';

const DriversList = () => {
    let cancelled = false;
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("lastname");
    const [searchBy, setSearchBy] = useState("lastname");
    const [searchString, setSearchString] = useState("");
    const [dir, setDir] = useState("asc");
    const [totalNumber, setTotalNumber] = useState(15);
    const [pageSize, setPageSize] = useState(15);
    const [pageNumber, setPageNumber] = useState(1);
    const [cars, setCars] = useState([]);
    const [reload, setReload] = useState(0);

    const search = () => {
        setReload(reload + 1);
    };

    useEffect(() => {
        !cancelled && setLoading(true);

        ApiService.getDrivers({
            searchColumn: searchBy,
            search: searchString,
            sortColumn: sortBy,
            sortDirection: dir,
            pageSize: pageSize,
            pageNumber: pageNumber
        })
            .then(({ data }) => {
                const { totalNumber, list } = data;
                !cancelled && setTotalNumber(totalNumber);
                !cancelled && setLoading(false);
                !cancelled && setCars(list);
            });

        return () => cancelled = true
    }, [sortBy, dir, pageSize, pageNumber, reload]);

    const columns = [
        {
            name: "Имя",
            sortBy: "lastName",
            selector: (row, index) => <Link to={`admin/driver/${row.id}`} className="btn btn-default">{row.id}</Link>,
            sortable: true
        },
        {
            name: "Телефон",
            sortBy: "phone",
            selector: (row, index) => row.phone,
            sortable: false
        },
        {
            name: "Авто",
            sortBy: "carName",
            selector: (row, index) => row.carName,
            sortable: false
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
    return <>
        <form>
            <div className="row">
                <div className="form-group col-md-7">
                    <div className="row pl-3">
                        <label htmlFor="staticEmail" className="col-md-3 mr-1">Поиск:</label>
                        <select className="col-md-9" onChange={(e) => { setSearchBy(e.target.value) }} value={searchBy}>
                            <option value="lastname">Фамилия</option>
                            <option value="phone">Телефон</option>
                        </select>
                    </div>
                    <div className="row mt-3">
                        <div className="input-group mb-3 col-md-10 pl-1">
                            <input type="text" className="form-control" value={searchString} onChange={(e) => { setSearchString(e.target.value) }} />
                            <div className="input-group-append">
                                <button className="btn btn-default" onClick={(e) => { e.preventDefault(); search() }}><i className="fa fa-search"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group col-md-5">
                    <Link to="/admin/driver" type="submit" className="pull-right btn btn-success mb-2">Добавить водителя</Link>
                </div>
            </div>
        </form>
        {
            cars.length === 0 && !loading ?
                <section className="empty-view">
                    <header>Не найдено водителей</header>
                </section>
                :
                <DataTable
                    columns={columns}
                    responsive
                    noHeader
                    highlightOnHover
                    sortServer
                    paginationServer
                    defaultSortFieldId={1}
                    defaultSortAsc
                    progressPending={loading}
                    paginationTotalRows={totalNumber}
                    customStyles={customStyles}
                    onSort={(column, direction) => {
                        !cancelled && setSortBy(column.sortBy);
                        !cancelled && setDir(direction);
                    }}
                    data={cars}
                    pagination
                    onChangePage={(page, totalRows) => {
                        !cancelled && setPageNumber(page);
                    }}
                    onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                        !cancelled && setPageSize(currentRowsPerPage);
                    }}
                    paginationPerPage={pageSize}
                />
        }
    </>;
};

export default DriversList;
