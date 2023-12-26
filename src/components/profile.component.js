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
                <strong>Роль:</strong> {currentUser.identity && getRoleString(currentUser.identity)}
            </p>
        <p>
          <strong>Телефон:</strong> {currentUser.identity.phone}
        </p>
      </div>
    );
  }
}

function getRoleString(identity) {
    if (identity.isAdmin) {
        return "Администратор";
    } else
        if (identity.isDispatcher) {
            return "Диспетчер";
        } else
            if (identity.isInitialBookkeeper) {
                return "Бухгалтер первички";
            } else
                if (identity.isSalaryBookkeeper) {
                    return "Бухгалтер ЗП";
                }else
                if (identity.isLogistManager) {
                    return "Менеджер-логист";
                } else
                    return "Механик";
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(Profile);
