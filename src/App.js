import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "./store/actions/auth";
import { Switch, Route } from "react-router-dom";
import Layout from "../src/containers/Layout/Layout";
import DashBoard from "./containers/DashBoard/Dashboard";
import ProjectList from "./containers/Lists/ProjectList/ProjectList";
import UserList from "./containers/Lists/UserList/UserList";
import TicketList from "./containers/Lists/TicketList/TicketList";
import TicketForm from "./containers/Lists/TicketList/TicketForm/TicketForm";
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
            <Route path="/tickets/:id/:name/new" component={TicketForm} />
            <Route path="/tickets/:id/:name" component={TicketList} />
            <Route
              path="/tickets"
              render={(props) => {
                return <TicketList {...props} type="User" />;
              }}
            />
            <Route path="/users/:id/:name" component={UserList} />
            <Route path="/users" component={UserRoles} />
            <Route path="/projects" component={ProjectList} />
            <Route path="/" component={DashBoard} />
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
