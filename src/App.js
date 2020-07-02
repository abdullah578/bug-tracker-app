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
import ProjectDetails from "./containers/ProjectDetails/ProjectDetails";
import TicketDetails from "./containers/TicketDetails/TicketDetails";
import Login from "./containers/login/Login";
import "./App.css";
/*This component renders routes based on the user 's role, if the user if not authenticated,
he is taken to the login page */
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
            <Route
              path="/tickets/:id/:name/:key/details"
              component={TicketDetails}
            />
            <Route path="/tickets/:id/:name/:key" component={TicketForm} />
            <Route path="/tickets/:id/:name" component={TicketList} />
            <Route
              path="/tickets"
              render={(props) => {
                return <TicketList {...props} type="User" />;
              }}
            />
            {this.props.role === "Admin" ||
            this.props.role === "Project Manager" ? (
              <Route path="/users/:id/:name" component={UserList} />
            ) : null}
            {this.props.role === "Admin" ? (
              <Route path="/users" component={UserRoles} />
            ) : null}
            <Route path="/projects/:id/:name" component={ProjectDetails} />
            <Route path="/projects" component={ProjectList} />
            <Route path="/" component={DashBoard} />
          </Switch>
        </Layout>
      );
    } else routes = <Route path="/" component={Login} />;
    return <div className="App">{routes}</div>;
  }
}
const mapStateToprops = (state) => ({
  token: state.auth.token,
  role: state.auth.role,
});
const mapDispatchToprops = (dispatch) => ({
  autoSignIn: () => dispatch(actionCreators.authCheckState()),
});
export default connect(mapStateToprops, mapDispatchToprops)(App);
