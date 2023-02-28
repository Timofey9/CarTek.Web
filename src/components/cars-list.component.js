import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ApiService from "../services/cartekApiService";
import DataTable from 'react-data-table-component';

const CarsList = () => {
    let cancelled = false;
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("name");
    const [searchBy, setSearchBy] = useState("name");
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

        ApiService.getCars({
            searchColumn: searchBy,
            search: searchString,
            sortColumn: sortBy,
            sortDirection: dir,
            pageSize: pageSize,
            pageNumber: pageNumber
        })
            .then(({ data }) => {
                console.log(data);
                const { totalNumber, list } = data;
                !cancelled && setTotalNumber(totalNumber);
                !cancelled && setLoading(false);
                !cancelled && setCars(list);
            });

        return () => cancelled = true
    }, [sortBy, dir, pageSize, pageNumber, reload]);

    const columns = [
        {
            name: "Номер",
            sortBy: "plate",
            selector: (row, index) => <Link to={`/cars/car/${row.plate}`} className={"btn btn-default"}>{row.plate}</Link>,
            sortable: true
        },
        {
            name: "Марка",
            sortBy: "brand",
            selector: (row, index) => row.brand,
            sortable: false
        },
        {
            name: "Модель",
            sortBy: "model",
            selector: (row, index) => row.model,
            sortable: false
        },
        {
            name: "Статус",
            selector: (row, index) => row.status, 
            sortable: false
        },
        {
            name: "Водитель",
            selector: (row, index) => row.driver ? row.driver.fullName  : "Нет водителя",
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
                            <option value="plate">Номер</option>
                            <option value="model">Модель</option>
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
                    <Link to="/admin/user" type="submit" className="pull-right btn btn-success mb-2">Добавить авто</Link>
                </div>
            </div>
        </form>
        {
            cars.length === 0 && !loading ?
                <section className="empty-view">
                    <header>Не найдено машин</header>
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

export default CarsList;
