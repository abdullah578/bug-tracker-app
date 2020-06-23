import React from "react";
import { Switch, Route } from "react-router-dom";
import Layout from "../src/containers/Layout/Layout";
import ProjectList from "./containers/ProjectList/ProjectList";
import UserList from "./containers/UserList/UserList";
import UserRoles from "./containers/UserRoles/UserRoles";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Layout>
        <Switch>
          <Route path="/users/:id/:name" component={UserList} />
          <Route path="/users" component={UserRoles} />
          <Route path="/projects" component={ProjectList} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
