import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ApiService from "../services/cartekApiService";
import DataTable from 'react-data-table-component';

const TrailersList = () => {
    let cancelled = false;
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("name");
    const [searchBy, setSearchBy] = useState("name");
    const [searchString, setSearchString] = useState("");
    const [dir, setDir] = useState("asc");
    const [totalNumber, setTotalNumber] = useState(15);
    const [pageSize, setPageSize] = useState(15);
    const [searchParams, setSearchParams] = useSearchParams({});
    const [pageNumber, setPageNumber] = useState(searchParams.getAll("page").length > 0 ? searchParams.getAll("page")[0] : 1);
    const [trailers, setTrailers] = useState([]);
    const [reload, setReload] = useState(0);

    const navigate = useNavigate();
    const search = () => {
        setReload(reload + 1);
        setParams();
    };

    const setParams = () => {
        let params = { page: pageNumber, searchBy: searchBy, searchString: searchString };
        setSearchParams(params);
    }
    useEffect(() => {
        !cancelled && setLoading(true);

        ApiService.getTrailers({
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
                !cancelled && setTrailers(list);
            });

        return () => cancelled = true
    }, [sortBy, dir, pageSize, pageNumber, reload]);

    const columns = [
        {
            name: "Номер",
            sortBy: "plate",
            selector: (row, index) => <Link onClick={(e) => setParams()} to={`/admin/trailer/${row.plate}`} className={"btn btn-default"}>{row.plate}</Link>,
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
            name: "Тягач",
            selector: (row, index) => row.car ? row.car.plate : "Нет тягача",
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

    const paginationComponentOptions = {
        rowsPerPageText: 'На странице',
        rangeSeparatorText: 'из',
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
                                <button className="btn btn-light" onClick={(e) => { e.preventDefault(); search() }}><i className="fa fa-search"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group col-md-5">
                    <Link onClick={(e) => setParams()} to="/admin/trailer/add" type="submit" className="pull-right btn btn-success mb-2">Добавить полуприцеп</Link>
                </div>
            </div>
        </form>
        {
            trailers.length === 0 && !loading ?
                <section className="empty-view">
                    <header>Не найдено полуприцепов</header>
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
                    paginationDefaultPage={pageNumber}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationTotalRows={totalNumber}
                    customStyles={customStyles}
                    onSort={(column, direction) => {
                        !cancelled && setSortBy(column.sortBy);
                        !cancelled && setDir(direction);
                    }}
                    data={trailers}
                    pagination
                    onChangePage={(page, totalRows) => {
                        !cancelled && setPageNumber(page);
                    }}
                    onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                        !cancelled && setPageSize(currentRowsPerPage);
                    }}
                    onRowClicked={(row, event) => {
                        setParams();
                        navigate(`/admin/trailer/${row.plate}`);
                    }}
                    paginationPerPage={pageSize}
                />
        }
    </>;
};

export default TrailersList;
