import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../services/cartekApiService";
import DataTable from 'react-data-table-component';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MaterialForm from "./orders/add-material.component"

const MaterialsList = () => {
    let cancelled = false;
    const navigate = useNavigate
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("name");
    const [dir, setDir] = useState("asc");
    const [totalNumber, setTotalNumber] = useState(15);
    const [list, setList] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState({});
    const [reload, setReload] = useState(0);
    const [open, setOpen] = useState(false);

    const handleClickOpen = (material) => {
        setOpen(true);
        setSelectedMaterial(material);
    };

    const handleClickOpenCreate = () => {
        setOpen(true);
        setSelectedMaterial(undefined);
    };

    const handleClose = () => {
        setOpen(false);
        setReload(reload + 1);
    };

    useEffect(() => {
        !cancelled && setLoading(true);

        ApiService.getMaterials()
            .then(({ data }) => {
                setList(data);
                !cancelled && setTotalNumber(totalNumber);
                !cancelled && setLoading(false);
            });

        return () => cancelled = true
    }, [sortBy, dir, reload]);

    const columns = [
        {
            name: "Название",
            selector: (row, index) => <div>{row.name}</div>,
            minWidth: '1em',
            sortable: false,
            wrap: true
        },
        {
            name: "Редактировать",
            selector: (row, index) => <Button onClick={(e) => handleClickOpen(row)} variant="outlined"><i className="fa fa-edit" aria-hidden="true"></i></Button>,
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
            list.length === 0 && !loading ?
                <section className="empty-view">
                    <header>Нет материалов</header>
                </section>
                :
                <div>
                    <Button color="success" className="pull-right" onClick={(e) => handleClickOpenCreate()} variant="contained">Создать</Button>
                    <DataTable
                        columns={columns}
                        responsive
                        noHeader
                        highlightOnHover
                        defaultSortAsc
                        progressPending={loading}
                        customStyles={customStyles}
                        onSort={(column, direction) => {
                            !cancelled && setSortBy(column.sortBy);
                            !cancelled && setDir(direction);
                        }}
                        data={list}
                    />
                </div>
        }

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
            <MaterialForm handleClose={handleClose} material={selectedMaterial}></MaterialForm>
        </Dialog>
    </>;
};

export default MaterialsList;
