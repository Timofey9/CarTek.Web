import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import './not-found-page.css';

const NotFoundPage = () => {
    return <Fragment>
        <main id="view_not_found">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="error-template">
                            <h1>
                                Oops!</h1>
                            <h2 id="error-message">
                                404 Not Found
                            </h2>
                            <div className="error-details">
                                Sorry, an error has occured, Requested page not found!
                            </div>
                            <div className="error-actions">
                                <Link to="/transactions" className="btn btn-primary btn-lg"><span className="glyphicon glyphicon-home"></span>Take Me Home </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </Fragment>
}

export default NotFoundPage;