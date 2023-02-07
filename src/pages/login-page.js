import React, { Fragment } from 'react';
import AuthForm from "../components/auth/authForm";
import "./login-page.css";

const LoginPage = () => {
    return <Fragment>
        <main id="view_login">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6 col-lg-4 pr-md-5">
                        <AuthForm />
                    </div>
                </div>
            </div>
        </main>
    </Fragment>
};

export default LoginPage;