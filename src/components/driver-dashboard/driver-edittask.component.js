import React from 'react';
import { Link } from "react-router-dom";

//редактирование со стороны водител€: 1) помен€ть статус; 2) добавить комментарий; 3) загрузить фото. ¬се выполн€етс€ одновременно

const DriverEditTask = () => {
    return <div className="container">
        <div className="row justify-content-md-center text-center mt-md-5">
            <div className="col-md-3 pb-3">
                <Link to="/driver-dashboard/mytasks" className="w-100 btn btn-secondary">ћои задачи</Link>
            </div>
            <div className="col-md-3 pb-3">
                <Link to="/driver/notifications" className="w-100 btn btn-secondary">”ведомлени€</Link>
            </div>
        </div>
    </div>
};

export default DriverEditTask;
 