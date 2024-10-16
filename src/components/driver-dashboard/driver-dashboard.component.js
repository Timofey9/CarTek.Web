import React from 'react';
import { Link } from "react-router-dom";
import MessagesList from '../information-messages';

const DriverDashboard = () => {
    return <div className="container">
        <div className="row justify-content-md-center text-center mt-md-5">
            <div className="col-md-3 pb-3">
                <Link to="/driver-dashboard/mytasks" className="w-100 btn btn-secondary">Мои задачи</Link>
            </div>
            <div className="col-md-3 pb-3">
                <Link to="/driver/notifications" className="w-100 btn btn-secondary">Уведомления</Link>
            </div>
        </div>
        <div className="row">
            <div className="bold-label">Доска сообщений</div>
            <div className="col-md-12">
                <MessagesList></MessagesList>
            </div>
        </div>
    </div>
};

export default DriverDashboard;
