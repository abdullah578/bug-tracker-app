import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "./store/actions/auth";
import { Switch, Route } from "react-router-dom";
import Layout from "../src/containers/Layout/Layout";
import ProjectList from "./containers/ProjectList/ProjectList";
import UserList from "./containers/UserList/UserList";
import UserRoles from "./containers/UserRoles/UserRoles";
import Login from "./containers/login/Login";
import "./App.css";

class App extends Component {
  componentDidMount() {
    this.props.autoSignIn();
  }
  render() {
    let routes;
    if (this.props.token) {
      routes = (
        <Layout>
          <Switch>
            <Route path="/users/:id/:name" component={UserList} />
            <Route path="/users" component={UserRoles} />
            <Route path="/projects" component={ProjectList} />
          </Switch>
        </Layout>
      );
    } else {
      routes = <Route path="/" component={Login} />;
    }
    return <div className="App">{routes}</div>;
  }
}
const mapStateToprops = (state) => ({
  token: state.auth.token,
});
const mapDispatchToprops = (dispatch) => ({
  autoSignIn: () => dispatch(actionCreators.authCheckState()),
});
export default connect(mapStateToprops, mapDispatchToprops)(App);
