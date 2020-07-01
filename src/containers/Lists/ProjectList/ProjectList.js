import React from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../../store/actions/Projects";
import { NavLink } from "react-router-dom";
import { formConfig } from "../../../Utilities/Utilities";
import WithErrorHandle from "../../../hoc/WithErrorHandle";
import axios from "../../../axiosInstance/AxiosInstance";
import Lists from "../Lists";
import Search from "../../../components/UI/Search/Search";
import Modal from "../../../components/UI/Modal/Modal";
import Table from "../../../components/UI/Table/Table";
import Button from "../../../components/UI/Button/Add/Add";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Pagination from "../../../components/UI/Pagination/Pagination";
import NewProject from "../../../components/NewItem/NewItem";

class ProjectList extends Lists {
  state = {
    newItem: false,
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
    search: "",
  };
  componentDidMount() {
    if (!this.props.projects.length)
      this.props.fetchProjects(this.props.role, this.props.userid);
  }
  filterProjects(arr) {
    const filteredArr = arr.filter((curr) =>
      curr.name.toLowerCase().includes(this.state.search.toLowerCase())
    );
    return filteredArr.length ? filteredArr : arr;
  }
  formSubmitHandler = () => {
    const { name, description } = this.state.form;
    this.props.submitProject({
      name: name.value,
      description: description.value,
    });
    this.resetForm();
    this.setState({ newItem: false });
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
  createTableBody() {
    const { currentPage, numPerPage } = this.state;
    const startIndex = (currentPage - 1) * numPerPage;
    const endIndex = startIndex + numPerPage;

    const styles = { textDecoration: "none", color: "#551A8B" };
    return this.filterProjects(this.props.projects)
      .slice(startIndex, endIndex)
      .map((curr) => (
        <tr key={curr.key}>
          <td>{curr.name}</td>
          <td>{curr.description}</td>
          <td>
            <ul>
              {this.props.role === "Admin" ? (
                <li>
                  <NavLink
                    to={`/users/${curr.key}/${curr.name}`}
                    style={styles}
                  >
                    {" "}
                    Manage Users
                  </NavLink>
                </li>
              ) : null}
              <li>
                <NavLink
                  to={`/tickets/${curr.key}/${curr.name}`}
                  style={styles}
                >
                  {" "}
                  Manage Tickets
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/projects/${curr.key}/${curr.name}`}
                  style={styles}
                >
                  {" "}
                  Details
                </NavLink>
              </li>
            </ul>
          </td>
        </tr>
      ));
  }
  render() {
    const { newItem, form, currentPage, numPerPage } = this.state;
    return this.props.dispSpinner ? (
      <Spinner />
    ) : (
      <div>
        {this.props.role === "Admin" ? (
          <NewProject
            open={newItem}
            form={form}
            inputHandler={this.inputHandler}
            cancelForm={this.formCancelHandler}
            submitForm={this.formSubmitHandler}
            disabled={!this.checkFormValidity(this.state.form)}
          />
        ) : null}
        {this.props.role === "Admin" ? (
          <Button clicked={this.addItemHandler}>Add New Project</Button>
        ) : null}
        <Modal
          header={<p> My projects</p>}
          footer={
            <Pagination
              currPage={currentPage}
              numPerPage={numPerPage}
              items={this.filterProjects(this.props.projects).length}
              prev={this.prevPage}
              next={this.nextPage}
            />
          }
          search={
            <Search
              value={this.state.search}
              numValue={this.state.numPerPage}
              inputNumHandler={this.numPerPageInputHandler}
              inputSearchHandler={this.searchInputHandler}
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
  role: state.auth.role,
  userid: state.auth.id,
});

const mapDispatchToProps = (dispatch) => ({
  fetchProjects: (role, userid) =>
    dispatch(actionCreators.fetchProjectsCreator(role, userid)),
  submitProject: (obj) => dispatch(actionCreators.postProjectCreator(obj)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(ProjectList, axios));
