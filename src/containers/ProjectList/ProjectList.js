import React, { Component } from "react";
import Modal from "../../components/UI/Modal/Modal";
import Table from "../../components/UI/Table/Table";
import Button from "../../components/UI/Button/Button";
import NewProject from "../../components/NewProject/NewProject";

class ProjectList extends Component {
  state = {
    newProj: false,
    form: {
      name: {
        elementConfig: {
          name: "Project Name",
          placeholder: "Name ...",
          type: "text",
        },
        value: "",
        type: "input",
      },
      description: {
        elementConfig: {
          name: "Project Description ...",
          placeholder: "Description ...",
          type: "text",
        },
        value: "",
        type: "textArea",
      },
    },
  };
  inputHandler = (e, type) => {
    let formCopy = { ...this.state.form };
    formCopy = {
      ...formCopy,
      [type]: {
        ...this.state.form[type],
        value: e.target.value,
      },
    };
    this.setState({ form: formCopy });
  };
  formCancelHandler = () => {
    this.setState({ newProj: false });
  };

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
        <NewProject
          open={this.state.newProj}
          form={this.state.form}
          inputHandler={this.inputHandler}
          cancelForm={this.formCancelHandler}
        />
        <Button clicked={this.addProjectHandler}>Add New Project</Button>
        <Modal header={<p> My projects</p>}>
          <Table header={this.createTableHeader()}></Table>
        </Modal>
      </div>
    );
  }
}

export default ProjectList;
