import React, { Component } from "react";
import Modal from "../../components/UI/Modal/Modal";
import Table from "../../components/UI/Table/Table";
import Button from "../../components/UI/Button/Button";
import Content from "../../components/UI/Content/Content";

class ProjectList extends Component {
  state = { newProj: false };

  createTableHeader() {
    return (
      <tr>
        <th>Project Name</th>
        <th>Description</th>
        <th>{"\u00A0"}</th>
      </tr>
    );
  }
  addProjectHandler = () => this.setState({ newProj: true });
  render() {
    return (
      <div>
        <Content open={this.state.newProj} />
        <Button clicked={this.addProjectHandler}>Add New Project</Button>
        <Modal header={<p> My projects</p>}>
          <Table header={this.createTableHeader()}></Table>
        </Modal>
      </div>
    );
  }
}

export default ProjectList;
