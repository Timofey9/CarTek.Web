import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/cartekApiService";
import DataTable from 'react-data-table-component';

const NotificationsList = () => {
    let cancelled = false;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("name");
    const [searchBy, setSearchBy] = useState("plate");
    const [searchString, setSearchString] = useState("");
    const [dir, setDir] = useState("asc");
    const [totalNumber, setTotalNumber] = useState(15);
    const [pageSize, setPageSize] = useState(15);
    const [pageNumber, setPageNumber] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState({});



    useEffect(() => {

        let localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser) {
            setUser(localUser);
        }

        !cancelled && setLoading(true);

        ApiService.getNotifications({
            isDriver: localUser.isDriver,
            userId: localUser.identity.id,
            pageSize: pageSize,
            pageNumber: pageNumber
        })
            .then(({ data }) => {
                const { totalNumber, list } = data;
                !cancelled && setTotalNumber(totalNumber);
                !cancelled && setLoading(false);
                !cancelled && setNotifications(list);
            });

        return () => cancelled = true
    }, [sortBy, dir, pageSize, pageNumber]);

    const ExpandedComponent = ({ data }) => <pre><div>{data.description}</div></pre>;

    const columns = [
        {
            name: "Дата",
            sortBy: "date",
            selector: (row, index) => <div>{row.dateSent}</div>,
            minWidth: '1em',
            sortable: true
        },
        {
            name: "Заголовок",
            sortBy: "tit;e",
            selector: (row, index) => row.title,
            sortable: false,
            minWidth: '1em'
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
        {
            notifications.length === 0 && !loading ?
                <section className="empty-view">
                    <header>Нет уведомлений</header>
                </section>
                :
                <DataTable
                    columns={columns}
                    responsive
                    noHeader
                    highlightOnHover
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
                    data={notifications}
                    pagination
                    expandableRowExpanded={() => true}
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                    onChangePage={(page, totalRows) => {
                        !cancelled && setPageNumber(page);
                    }}
                    onRowClicked={(row, event) => {
                        navigate(`/cars/car/${row.plate}`);
                    }}
                    onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                        !cancelled && setPageSize(currentRowsPerPage);
                    }}
                    paginationPerPage={pageSize}
                />
        }
    </>;
};

export default NotificationsList;
