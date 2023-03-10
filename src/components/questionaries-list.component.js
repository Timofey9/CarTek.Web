import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ApiService from "../services/cartekApiService";
import DataTable from 'react-data-table-component';

const QuestionariesList = () => {
    let cancelled = false;
    const [loading, setLoading] = useState(true);
    const [searchBy, setSearchBy] = useState("plate");
    const [sortBy, setSortBy] = useState("date");
    const [searchString, setSearchString] = useState("");
    const [dir, setDir] = useState("asc");
    const [totalNumber, setTotalNumber] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [pageNumber, setPageNumber] = useState(1);
    const [questionaries, setQuestionaries] = useState([]);
    const [reload, setReload] = useState(0);

    const search = () => {
        setReload(reload + 1);
    };

    useEffect(() => {
        setLoading(true);

        ApiService.getAllQuestionaries({
            searchColumn: searchBy,
            search: searchString,
            sortColumn: sortBy,
            sortDirection: dir,
            pageSize: pageSize,
            pageNumber: pageNumber
        }).then(({ data }) => {
                const { totalNumber, list } = data;
                setTotalNumber(totalNumber);
                setQuestionaries(list);
        });

        setLoading(false);
        
    }, [sortBy, dir, pageSize, pageNumber, reload]);

    const columns = [
        {
            name: "#",
            selector: (row, index) => <Link to={`/questionary/details/${row.uniqueId}`} className={"btn btn-default"}>{index + 1}</Link>,
            sortable: false,
            maxWidth: '1em'
        },
        {
            name: "Дата",
            selector: (row, index) => new Date(row.lastUpdated).toLocaleString("pt-BR"),
            sortable: true,
            sortBy: "date",
            center: true,
            wrap: true
        },
        {
            name: "Тягач (гос.номер)",
            selector: (row, index) => <Link to={`/cars/car/${row.car.plate}`} className={"btn btn-default"}>{row.car.plate}</Link>,
            sortable: false,
            center: true,
            wrap: true
        },
        {
            name: "Механик",
            selector: (row, index) => row.user.fullName,
            sortable: false,
            center: true,
        },
        {
            name: "Водитель",
            selector: (row, index) => row.driver ? row.driver.fullName : "Не определен",
            sortable: false,
            center: true,
        },
        {
            name: "Тип",
            selector: (row, index) => row.action == 'departure' ? "На выезд" : "На въезд",
            sortable: false,
            center: true,
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
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
                <div className="form-group col-md-7">
                    <div className="row mt-3">
                        <div className="input-group mb-3 col-md-10 pl-1">
                            <input placeholder="Поиск по гос.номеру" type="text" className="form-control" value={searchString} onChange={(e) => { setSearchString(e.target.value) }} />
                            <div className="input-group-append">
                                <button className="btn btn-default" onClick={(e) => { e.preventDefault(); search() }}><i className="fa fa-search"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>

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
                    data={questionaries}
                    pagination
                    onChangePage={(page, totalRows) => {
                        !cancelled && setPageNumber(page);
                    }}
                    onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                        !cancelled && setPageSize(currentRowsPerPage);
                    }}
                    paginationPerPage={pageSize}
                />        
    </>;
};

export default QuestionariesList;
