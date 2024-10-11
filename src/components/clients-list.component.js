import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ApiService from "../services/cartekApiService";
import DataTable from 'react-data-table-component';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ClientForm from "./orders/add-client.component"

const ClientsList = () => {
    let cancelled = false;
    const navigate = useNavigate
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("name");
    const [dir, setDir] = useState("asc");
    const [totalNumber, setTotalNumber] = useState(15);
    const [list, setList] = useState([]);
    const [selectedClient, setSelectedClient] = useState({});
    const [reload, setReload] = useState(0);
    const [open, setOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [searchParams, setSearchParams] = useSearchParams({});

    const setParams = (id) => {
        let params = {id: id}
        setSearchParams(params);
    }

    const handleClickOpen = (client) => {
        setOpen(true);
        setSelectedClient(client);
    };

    const handleClickOpenCreate = (client) => {
        setOpen(true);
        setSelectedClient(undefined);
    };

    const handleClose = () => {
        setOpen(false);
        setReload(reload + 1);
    };


    useEffect(() => {
        !cancelled && setLoading(true);

        var id = searchParams.getAll("id").length > 0 ? searchParams.getAll("id")[0] : 0;

        ApiService.getClients()
            .then(({ data }) => {
                setList(data);
                !cancelled && setTotalNumber(totalNumber);
                !cancelled && setLoading(false);
            });

        if (id > 0) {
            document.getElementById(id).scrollIntoView();
        }

        return () => cancelled = true
    }, [sortBy, dir, reload]);


    const filteredItems = list.filter(
        item => item.clientName && item.clientName.toLowerCase().includes(filterText.toLowerCase()),
    );

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setFilterText('');
            }
        };

        return (
            <input className="pull-left" value={filterText} placeholder="Поиск по имени" onChange={(e) => setFilterText(e.target.value)}></input>
        );
    }, [filterText]);

    const columns = [
        {
            name: "Название",
            sortBy: "clientName",
            selector: (row, index) => <div id={row.id}>{row.clientName}</div>,
            minWidth: '1em',
            sortable: true,
            wrap: true
        },
        {
            name: "ИНН",
            sortBy: "inn",
            selector: (row, index) => <div>{row.inn}</div>,
            sortable: false,
            minWidth: '1em'
        },
        {
            name: "Юр.адрес",
            sortBy: "coordinates",
            selector: (row, index) => <div>{row.clientAddress}</div>,
            sortable: false,
            minWidth: '1em',
            wrap: true
        },
        {
            name: "Редактировать",
            selector: (row, index) => <Button onClick={(e) => { setParams(row.id); handleClickOpen(row) }} variant="outlined"><i className="fa fa-edit" aria-hidden="true"></i></Button>,
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

                <div>
                    <Button color="success" className="pull-right" onClick={(e) => handleClickOpenCreate()} variant="contained">Создать</Button>
            {
                list.length === 0 && !loading ?
                    <section className="empty-view">
                        <header>Нет клиентов</header>
                    </section>
                    :
                    <DataTable
                        columns={columns}
                        responsive
                        subHeader
                        subHeaderAlign="left"
                        subHeaderComponent={subHeaderComponentMemo}
                        noHeader
                        highlightOnHover
                        defaultSortFieldId={1}
                        defaultSortAsc
                        progressPending={loading}
                        customStyles={customStyles}
                        onSort={(column, direction) => {
                            !cancelled && setSortBy(column.sortBy);
                            !cancelled && setDir(direction);
                        }}
                        data={filteredItems} />
            }
                </div>
        

        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}>
            <AppBar sx={{ bgcolor: "#F6CC3" }}>
                <Toolbar variant="dense">
                    <Button autoFocus color="inherit" onClick={handleClose}>
                        Закрыть
                    </Button>
                </Toolbar>
            </AppBar>
            <ClientForm handleClose={handleClose} client={selectedClient}></ClientForm>
        </Dialog>
    </>;
};

export default ClientsList;
