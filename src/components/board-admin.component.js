import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class BoardAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  render() {
    return (
        <div className="container">
            <div className="row justify-content-md-center text-center mt-md-5">
                <div className="col-md-3 pb-3">
                    <Link to="/admin/users" className="w-100 btn btn-secondary">Пользователи</Link>
                </div>
                <div className="col-md-3 pb-3">
                    <Link to="/admin/cars" className="w-100 btn btn-secondary">Автомобили</Link>
                </div>
                <div className="col-md-3 pb-3">
                    <Link to="/admin/drivers" className="w-100 btn btn-secondary">Водители</Link>
                </div>
                <div className="col-md-3 pb-3">
                    <Link to="/admin/questionaries" className="w-100 btn btn-secondary">Осмотры</Link>
                </div>
                <div className="col-md-3 pb-3">
                    <Link to="/admin/trailers" className="w-100 btn btn-secondary">Прицепы</Link>
                </div>
            </div>
        </div>
    );
  }
}
