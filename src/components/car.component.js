import React, { useEffect, useState } from 'react';
import withRouter from "./withRouter";
import { Link, useLocation, useMatch, useParams } from 'react-router-dom';
import ApiService from "../services/cartekApiService";
import DataTable from 'react-data-table-component';

function CarComponent() {
    let { cancelled } = false;
    const [car, setCar] = useState({});
    const [images, setImages] = useState([]);
    const [questionaries, setQuestionaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("approvedAt");
    const [dir, setDir] = useState("asc");
    const [totalNumber, setTotalNumber] = useState(15);
    const [pageSize, setPageSize] = useState(15);
    const [pageNumber, setPageNumber] = useState(1);
    const [reload, setReload] = useState(0);

    let { plate } = useParams();

    useEffect(() => {
        setLoading(true);
        ApiService.getCarByPlate(plate)
            .then(({ data }) => {
                setCar(data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
        return () => cancelled = true;
    }, []);

    useEffect(() => {
        setLoading(true);
        if (Object.keys(car).length > 0) {
            ApiService.getQuestionaries(
                {
                    carId: car.id,
                    sortColumn: sortBy,
                    sortDirection: dir,
                    pageSize: pageSize,
                    pageNumber: pageNumber
                })
                .then(({ data }) => {
                    const { totalNumber, list } = data;

                    !cancelled && setTotalNumber(totalNumber);
                    !cancelled && setQuestionaries(list);
                    !cancelled && setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                });
        }
        return () => cancelled = true;
    }, [car, sortBy, dir, pageSize, pageNumber, reload]);

    const getImages = (e, id) => {
        console.log(id);
        setLoading(true);
        ApiService.getQuestionaryImages(id)
            .then(({ data }) => {
                console.log(data);
                setImages(data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
        return () => cancelled = true;
    }
    
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
            selector: (row, index) => row.action,// == 'departure' ? "На выезд" : "На въезд",
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

    return (
        <div>
            <div className="row">
                <div className="col-md-8">
                    <h2>{car.brand} {car.model}, гос.номер: {car.plate}</h2>
                </div>
                <div className="col-md-4">
                    <Link to={`/admin/cars/edit/${car.plate}`} className="btn btn-success pull-right">Редактировать</Link>
                </div>
            </div>

            <div className="row d-flex justify-content-center">
                <div className="col-md-8">
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-3">
                            <label><b>Водители: </b></label>
                        </div>
                        <div className="col-md-6">
                            {car.drivers ? car.drivers.map(driver => { return <div key={driver.id}> <div>{driver.fullName}</div></div> }) : "Нет водителя"}
                        </div>
                    </div>

                    <div className="row d-flex justify-content-center">
                        <div className="col-md-3">
                            <label><b>Статус: </b></label>
                        </div>
                        <div className="col-md-6">
                            {car.state == 0 ? <label>На базе</label> : <label>На линии</label>}
                        </div>
                    </div>

                    <div className="row d-flex justify-content-center">
                        <div className="col-md-3">
                            <label><b>Полуприцеп: </b></label>
                        </div>
                        {car.trailer && <div className="col-md-6">
                            <label>{car.trailer.brand} {car.trailer.model} гос.номер: {car.trailer.plate}</label>
                        </div> }

                    </div>
                </div>
            </div>



            <div className="row">
                <div className="col-md-12">
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
                </div>
            </div>
        </div>);
}

export default CarComponent;