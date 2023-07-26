import React from 'react';
import { Link } from "react-router-dom";

//�������������� �� ������� ��������: 1) �������� ������; 2) �������� �����������; 3) ��������� ����. ��� ����������� ������������

const DriverEditTask = () => {
    return <div className="container">
        <div className="row justify-content-md-center text-center mt-md-5">
            <div className="col-md-3 pb-3">
                <Link to="/driver-dashboard/mytasks" className="w-100 btn btn-secondary">��� ������</Link>
            </div>
            <div className="col-md-3 pb-3">
                <Link to="/driver/notifications" className="w-100 btn btn-secondary">�����������</Link>
            </div>
        </div>
    </div>
};

export default DriverEditTask;
 