import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/Projects";
import { formConfig, checkValidation } from "../../Utilities/Utilities";
import Modal from "../../components/UI/Modal/Modal";
import Table from "../../components/UI/Table/Table";
import Button from "../../components/UI/Button/Add/Add";
import NewProject from "../../components/NewProject/NewProject";

class ProjectList extends Component {
  state = {
    newProj: false,
    form: {
      name: formConfig(
        "Project Name",
        "Name ...",
        "text",
        "",
        "input",
        { isRequired: true },
        false,
        false
      ),
      description: formConfig(
        "Project Description",
        "Description ...",
        "text",
        "",
        "textArea",
        { isRequired: true },
        false,
        false
      ),
    },
  };
  componentDidMount() {
    this.props.fetchProjects();
  }
  inputHandler = (e, type) => {
    let formCopy = { ...this.state.form };
    formCopy = {
      ...formCopy,
      [type]: {
        ...this.state.form[type],
        value: e.target.value,
        touch: true,
        isValid: checkValidation(
          e.target.value,
          this.state.form[type].validationRequirement
        ),
      },
    };
    this.setState({ form: formCopy });
  };
  formCancelHandler = () => {
    this.setState({ newProj: false });
    this.resetForm();
  };
  formSubmitHandler = () => {
    this.props.submitProject({
      name: this.state.form.name.value,
      description: this.state.form.description.value,
    });
    this.resetForm();
    this.setState({ newProj: false });
  };
  resetForm() {
    const formCopy = {
      ...this.state.form,
    };
    Object.keys(formCopy).forEach((curr) => {
      formCopy[curr] = {
        ...formCopy[curr],
        value: "",
        isValid: false,
        touch: false,
      };
    });
    this.setState({ form: formCopy });
  }

  createTableHeader() {
    return (
      <tr>
        <th>Project Name</th>
        <th>Description</th>
        <th>{"\u00A0"}</th>
      </tr>
    );
  }
  createTableBody() {
    return this.props.projects.map((curr) => (
      <tr key={curr.key}>
        <td>{curr.name}</td>
        <td>{curr.description}</td>
        <td>{"\u00A0"}</td>
      </tr>
    ));
  }
  addProjectHandler = () => this.setState({ newProj: true });
  checkFormValidity = () => {
    const formCopy = { ...this.state.form };
    let isValid = true;
    Object.keys(formCopy).forEach(
      (curr) => (isValid = formCopy[curr].isValid && isValid)
    );
    console.log(isValid);
    return isValid;
  };
  render() {
    return (
      <div>
        <NewProject
          open={this.state.newProj}
          form={this.state.form}
          inputHandler={this.inputHandler}
          cancelForm={this.formCancelHandler}
          submitForm={this.formSubmitHandler}
          disabled={!this.checkFormValidity()}
        />
        <Button clicked={this.addProjectHandler}>Add New Project</Button>
        <Modal header={<p> My projects</p>}>
          <Table header={this.createTableHeader()}>
            {this.createTableBody()}
          </Table>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  projects: state.project.projects,
});

const mapDispatchToProps = (dispatch) => ({
  fetchProjects: () => dispatch(actionCreators.fetchOrdersCreator()),
  submitProject: (obj) => dispatch(actionCreators.postOrderCreator(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
