import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../services/cartekApiService";
import AddressForm from "./orders/add-address.component"
import DataTable from 'react-data-table-component';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

const AddressesList = () => {
    let cancelled = false;
    const navigate = useNavigate
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("name");
    const [dir, setDir] = useState("asc");
    const [totalNumber, setTotalNumber] = useState(15);
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState({});
    const [reload, setReload] = useState(0);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        !cancelled && setLoading(true);

        ApiService.getAddresses()
            .then(({ data }) => {
                setList(data);
                !cancelled && setTotalNumber(totalNumber);
                !cancelled && setLoading(false);
            });

        return () => cancelled = true
    }, [sortBy, dir, reload]);


    const handleClickOpen = (address) => {
        setOpen(true);
        setSelectedAddress(address);
    };

    const handleClickOpenCreate = () => {
        setOpen(true);
        setSelectedAddress(undefined);
    };


    const handleClose = () => {
        setOpen(false);
        setReload(reload + 1);
    };


    const filteredItems = list.filter(
        item => item.textAddress && item.textAddress.toLowerCase().includes(filterText.toLowerCase()),
    );

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setFilterText('');
            }
        };

        return (
            <input className="pull-left" value={filterText} placeholder="Поиск по названию" onChange={(e) => setFilterText(e.target.value)}></input>
        );
    }, [filterText]);

    const columns = [
        {
            name: "Адрес",
            sortBy: "date",
            selector: (row, index) => <div>{row.textAddress}</div>,
            minWidth: '1em',
            sortable: true,
            wrap: true
        },
        {
            name: "Координаты",
            sortBy: "coordinates",
            selector: (row, index) => <div>{row.coordinates}</div>,
            sortable: false,
            minWidth: '1em'
        },
        {
            name: "Редактировать",
            selector: (row, index) => <Button id={row.id} onClick={(e) => handleClickOpen(row)} variant="outlined"><i className="fa fa-edit" aria-hidden="true"></i></Button>,
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
                        <header>Нет адресов</header>
                    </section>
                    :
                    <DataTable
                        columns={columns}
                        responsive
                        noHeader
                        subHeader
                        subHeaderAlign="left"
                        subHeaderComponent={subHeaderComponentMemo}
                        highlightOnHover
                        defaultSortFieldId={1}
                        defaultSortAsc
                        progressPending={loading}
                        customStyles={customStyles}
                        onSort={(column, direction) => {
                            !cancelled && setSortBy(column.sortBy);
                            !cancelled && setDir(direction);
                        }}
                        data={filteredItems}
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
            <AddressForm handleClose={handleClose} address={selectedAddress}></AddressForm>
        </Dialog>
    </>;
};

export default AddressesList;
