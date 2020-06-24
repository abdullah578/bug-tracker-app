import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/Projects";
import { NavLink } from "react-router-dom";
import { formConfig, checkValidation } from "../../Utilities/Utilities";
import WithErrorHandle from "../../hoc/WithErrorHandle";
import axios from "../../axiosInstance/AxiosInstance";
import Modal from "../../components/UI/Modal/Modal";
import Table from "../../components/UI/Table/Table";
import Button from "../../components/UI/Button/Add/Add";
import Spinner from "../../components/UI/Spinner/Spinner";
import Pagination from "../../components/UI/Pagination/Pagination";
import NewProject from "../../components/NewItem/NewItem";

class ProjectList extends Component {
  state = {
    newProj: false,
    currentPage: 1,
    numPerPage: 5,
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
    const startIndex = (this.state.currentPage - 1) * this.state.numPerPage;
    const endIndex = startIndex + this.state.numPerPage;
    const styles = { textDecoration: "none", color: "#551A8B" };
    return this.props.projects.slice(startIndex, endIndex).map((curr) => (
      <tr key={curr.key}>
        <td>{curr.name}</td>
        <td>{curr.description}</td>
        <td>
          <ul>
            <li>
              <NavLink to={`/users/${curr.key}/${curr.name}`} style={styles}>
                {" "}
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink to={`/ncdkcnkdnc`} style={styles}>
                {" "}
                Details
              </NavLink>
            </li>
          </ul>
        </td>
      </tr>
    ));
  }
  nextPage = () =>
    this.setState((prevState) => ({ currentPage: prevState.currentPage + 1 }));
  prevPage = () =>
    this.setState((prevState) => ({ currentPage: prevState.currentPage - 1 }));

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
    return this.props.dispSpinner ? (
      <Spinner />
    ) : (
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
        <Modal
          header={<p> My projects</p>}
          footer={
            <Pagination
              currPage={this.state.currentPage}
              numPerPage={this.state.numPerPage}
              items={this.props.projects.length}
              prev={this.prevPage}
              next={this.nextPage}
            />
          }
          err={this.props.err || this.props.projects === 0}
          type="Projects"
        >
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
  dispSpinner: state.project.dispSpinner,
  err: state.project.error,
});

const mapDispatchToProps = (dispatch) => ({
  fetchProjects: () => dispatch(actionCreators.fetchProjectsCreator()),
  submitProject: (obj) => dispatch(actionCreators.postProjectCreator(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandle(ProjectList,axios));
