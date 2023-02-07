import React, { Component } from "react";
import { Navigate } from 'react-router-dom';
import { connect } from "react-redux";

class Profile extends Component {

  render() {
    const { user: currentUser } = this.props;
      console.log(currentUser);
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.username}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Token:</strong> {currentUser.token.substring(0, 20)} ...{" "}
                {currentUser.token.substr(currentUser.token.length - 20)}
        </p>
        <p>
          <strong>Id:</strong> {currentUser.identity.id}
        </p>
        <p>
          <strong>Email:</strong> {currentUser.identity.email}
        </p>
        <strong>Admin:</strong>
        <ul>
          {currentUser.identity.isAdmin.toString()}
        </ul>
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
