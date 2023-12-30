import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ApiService from "../services/cartekApiService";
import MessageForm from "./information-message.form"
import DataTable from 'react-data-table-component';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

const MessagesList = () => {
    let cancelled = false;
    const navigate = useNavigate
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [reload, setReload] = useState(0);
    const [localUser, setLocalUser] = useState({});


    useEffect(() => {
        !cancelled && setLoading(true);

        let user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            setLocalUser(user);
        }

        ApiService.getInfromationMessages()
            .then(({ data }) => {
                setList(data);
                !cancelled && setLoading(false);
            });

        return () => cancelled = true
    }, [reload]);


    const deleteMessage = (id) => {
        ApiService.deleteinformationmessage(id)
            .then(({ data }) => {
                setReload(reload + 1);
                !cancelled && setLoading(false);
            });   
    }

    const handleClickOpenCreate = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setReload(reload + 1);
    };


    const columns = [
        {
            name: "Дата",
            sortBy: "date",
            selector: (row, index) => <div>{new Date(row.dateCreated).toLocaleString()}</div>,
            sortable: false,
            wrap: true,
        },
        {
            name: "Сообщение",
            sortBy: "coordinates",
            selector: (row, index) => <div>{row.message}</div>,
            sortable: false,
            wrap: true,
            grow: 3
        },
        {
            name: "Удалить",
            selector: (row, index) => <Button color="error" id={row.id} onClick={(e) => { deleteMessage(row.id) }} variant="outlined"><i className="fa fa-trash" aria-hidden="true"></i></Button>,
            sortable: false,
            omit: localUser && (localUser.isDriver)
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
            {localUser && !localUser.isDriver && <Button color="success" className="pull-right" onClick={(e) => handleClickOpenCreate()} variant="contained">Создать</Button>}
            {
                list.length === 0 && !loading ?
                    <section className="empty-view">
                        <header>Нет сообщений</header>
                    </section>
                    :
                    <DataTable
                        columns={columns}
                        responsive
                        noHeader
                        highlightOnHover
                        defaultSortFieldId={1}
                        defaultSortAsc
                        progressPending={loading}
                        customStyles={customStyles}
                        data={list}
                    />}
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
            <MessageForm handleClose={handleClose}></MessageForm>
        </Dialog>
    </>;
};

export default MessagesList;
