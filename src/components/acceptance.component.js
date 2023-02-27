import React, { useEffect, useState } from 'react';
import withRouter from "./withRouter";
import { useLocation, useMatch, useParams } from 'react-router-dom'
import ApiService from "../services/cartekApiService";
import DataTable from 'react-data-table-component';

function AcceptanceComponent() {
    let { cancelled } = false;
    const [questionary, setQuestionary] = useState({});
    const [driver, setDriver] = useState({});
    const [driverPassword, setDriverPassword] = useState("");
    const [car, setCar] = useState({});
   // const [uniqueId, setUniqueId] = useState({});

    let { uniqueId } = useParams();

    const acceptCar = () => {
        var request = {
            driverId: driver.id,
            driverPass: driverPassword,
            questionaryId: uniqueId
        };

        console.log(request);

        ApiService.acceptQuestionary(request)
            .then(({ data }) =>

            {
                localStorage.removeItem("questionary");
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const equipmentList = [
        { name: "Свидетельство о регистрации ТС 1 шт.", price: "5 000" },
        { name: "Ключ от ТС, 1 комплект", price: "5 000" },
        { name: "Гос. регистраионный знак 2 шт.", price: "3 500" },
        { name: "Полис ОСАГО 1 шт.", price: "2 000" },
        { name: 'Прибор "Платон" 1 шт.', price: "8 000" },
        { name: "Транспондер 1 шт.", price: "1 500" },
        { name: "Прикуриватель 1 шт.", price: "500" },
        { name: "Аптечка 1 шт.", price: "1 000" },
        { name: "Знак аварийной остановки 1 шт.", price: "500" },
        { name: "Огнетушитель 1 шт.", price: "1 500" },
        { name: "Резиновые коврики 2 шт.", price: "3 000" },
        { name: "Шланг подкачки 1 шт.", price: "3 000" },
        { name: "Балонный ключ 1 шт.", price: "1 500" },
        { name: "Домкрат 1 шт.", price: "3 000" },
        { name: "Рация 1 шт.", price: "10 000" },
        { name: "Тахограф 1 шт.", price: "50 000" },
        { name: "Блок управления GPS 1 шт.", price: "16 000" },
    ];

    useEffect(() => {
        ApiService.getQuestionary(uniqueId)
            .then(({ data }) => {
                console.log(data);
                setQuestionary(data);
                setDriver(data.driver);
                setCar(data.car);
            })
            .catch((error) => {

            });

        return () => cancelled = true;
    }, []);

    const columns = [
        {
            name: "#",
            selector: (row, index) => index + 1,
            sortable: false,
            maxWidth: '1em'
        },
        {
            name: "Наименование",
            selector: (row, index) => <div className="d-flex justify-content-center">{row.name}</div>,
            sortable: false,
            center: true,
            wrap: true
        },
        {
            name: <div className="d-flex justify-content-center">Размер штрафа в случае утери или порчи комплектующих за 1 ед. в руб</div>,
            selector: (row, index) => row.price,
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

    return (
        <div>
            <div>
                <h2>Акт приема-передачи автомобиля {car.brand} {car.model} (гос.номер: {car.plate})</h2>
            </div>
            <div className="row d-flex justify-content-center">
                <div className="col-md-10">
                    <DataTable
                        title="Комплектация, дополнительное оборудование, оценочная стоимость ТС"
                        columns={columns}
                        responsive
                        highlightOnHover
                        customStyles={customStyles}
                        data={equipmentList}
                    />
                    <hr className="solid" />
                </div>
            </div>

            <div className="row  d-flex justify-content-center mb-3">
                <div className="col-md-10">
                    <div className="row d-flex justify-content-center mb-3">
                        <div className="col-md-8 d-flex justify-content-center">
                            <b>ТС передается в технически исправном состоянии, регистрационные номера ТС сверены и соответствуют указанным в документах, комплектация ТС сверена</b>
                        </div>
                    </div>

                    <div className="row d-flex justify-content-center">
                        <div className="col-md-3">{driver.lastName} {driver.firstName} {driver.middleName}</div>
                        <div className="col-md-3"><input type="password" placeholder="Пароль" onChange={(e) => setDriverPassword(e.target.value)}></input></div>
                    </div>


                    <div className="row d-flex justify-content-center mt-3">
                        <div className="col-md-3 d-flex justify-content-center"><input type="button" onClick={acceptCar} className="btn btn-success" value="Принять ТС"></input></div>
                    </div>

                    <div className="row d-flex justify-content-center mb-3">
                        <div className="col-md-8 d-flex justify-content-center">
                            <label>*Для приемки ТС водитель должен ввести свой уникальный ключ-пароль. Ввод пароль означает согласие с осмотром ТС и принятие ответственности за оборудование, перечисленное в списке</label>
                        </div>
                    </div>
                </div>
            </div>
            
    </div>);
}

export default AcceptanceComponent;