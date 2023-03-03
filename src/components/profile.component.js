import React, { Component } from "react";
import { Navigate } from 'react-router-dom';
import { connect } from "react-redux";

class Profile extends Component {

  render() {
    const { user: currentUser } = this.props;

    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>Текущий пользователь: {currentUser.identity.lastName} {currentUser.identity.firstName} {currentUser.identity.middleName} - {currentUser.identity.login}</strong>
          </h3>
        </header>
            <p>
                <strong>Роль:</strong> {currentUser.identity.isAdmin ? "Администратор" : "Механик"}
            </p>
        <p>
          <strong>Телефон:</strong> {currentUser.identity.phone}
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(Profile);
