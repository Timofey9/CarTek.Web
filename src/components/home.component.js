import React, { Component } from "react";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  //componentDidMount() {
  //  UserService.getPublicContent().then(
  //      response => {
  //          console.log(response);

  //      this.setState({
  //        content: response.data
  //      });
  //    },
  //    error => {
  //      this.setState({
  //        content:
  //          (error.response && error.response.data) ||
  //          error.message ||
  //          error.toString()
  //      });
  //    }
  //  );
  //}

  render() {
    return (
      <div className="container">
            <header className="jumbotron">
                <h3>{this.state.content.toString()}</h3>
        </header>
      </div>
    );
  }
}
