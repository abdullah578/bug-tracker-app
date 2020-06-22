import React from "react";
import { Switch, Route } from "react-router-dom";
import Layout from "../src/containers/Layout/Layout";
import ProjectList from "./containers/ProjectList/ProjectList";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Layout>
        <Switch>
          <Route to="/projects" component={ProjectList} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
