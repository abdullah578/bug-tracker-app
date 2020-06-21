import React from "react";
import Layout from "../src/containers/Layout/Layout";
import Modal from "./components/UI/Modal/Modal";
import Table from "./components/UI/Table/Table";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Layout>
        <Modal>
          <Table />
        </Modal>
      </Layout>
    </div>
  );
}

export default App;
