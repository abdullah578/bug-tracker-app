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

//This component renders a list of the projects along with links to view/manage tickets and users
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
    //if project data is not present in redux store, fetch from API
    const { role, userid, token } = this.props;
    if (!this.props.projects.length)
      this.props.fetchProjects(role, userid, token);
  }
  //This function is used to filter the projects based on the search results
  filterProjects(arr) {
    const filteredArr = arr.filter((curr) =>
      curr.name.toLowerCase().includes(this.state.search.toLowerCase().trim())
    );
    return filteredArr.length ? filteredArr : arr;
  }
  formSubmitHandler = () => {
    const { name, description } = this.state.form;
    this.props.submitProject(
      {
        name: name.value,
        description: description.value,
      },
      this.props.token
    );
    this.resetForm();
    this.setState({ newItem: false });
  };
  createTableHeader() {
    //Table Header
    return (
      <tr>
        <th>Project Name</th>
        <th>Description</th>
        <th>{"\u00A0"}</th>
      </tr>
    );
  }
  createTableBody() {
    //Table Body
    const { currentPage, numPerPage } = this.state;
    const startIndex = (currentPage - 1) * numPerPage;
    const endIndex = startIndex + numPerPage;

    const styles = { textDecoration: "none", color: "#551A8B" };
    return this.props.projects.length ? (
      this.filterProjects([...this.props.projects].reverse())
        .slice(startIndex, endIndex)
        .map((curr) => (
          <tr key={curr.key}>
            <td>{curr.name}</td>
            <td>
              {curr.description.length > 50
                ? `${curr.description.slice(0, 50)}...`
                : curr.description}
            </td>
            <td>
              <ul>
                {this.props.role === "Admin" ||
                this.props.role === "Project Manager" ? (
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
        ))
    ) : (
      <tr>
        <td>{"\u00A0"}</td>
        <td>No Projects Found</td>
        <td>{"\u00A0"}</td>
      </tr>
    );
  }
  render() {
    const { newItem, form, currentPage, numPerPage } = this.state;
    //display spinner until the API responds
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
  role: state.auth.role,
  userid: state.auth.id,
  token: state.auth.token,
});

const mapDispatchToProps = (dispatch) => ({
  fetchProjects: (role, userid, token) =>
    dispatch(actionCreators.fetchProjectsCreator(role, userid, token)),
  submitProject: (obj, token) =>
    dispatch(actionCreators.postProjectCreator(obj, token)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(ProjectList, axios));
