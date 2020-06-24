import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Layout from "../src/containers/Layout/Layout";
import ProjectList from "./containers/ProjectList/ProjectList";
import UserList from "./containers/UserList/UserList";
import UserRoles from "./containers/UserRoles/UserRoles";
import Login from "./containers/login/Login";
import "./App.css";

function App(props) {
  let routes;
  if (props.token) {
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
const mapStateToProps = (state) => ({
  token: state.auth.token,
});
export default connect(mapStateToProps)(App);
