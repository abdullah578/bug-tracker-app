import React from "react";
import { connect } from "react-redux";
import * as userActionCreators from "../../../store/actions/Users";
import { formConfig } from "../../../Utilities/Utilities";
import WithErrorHandle from "../../../hoc/WithErrorHandle";
import Lists from "../Lists";
import axios from "../../../axiosInstance/AxiosInstance";
import Modal from "../../../components/UI/Modal/Modal";
import Table from "../../../components/UI/Table/Table";
import Button from "../../../components/UI/Button/Add/Add";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Pagination from "../../../components/UI/Pagination/Pagination";
import Search from "../../../components/UI/Search/Search";
import NewUser from "../../../components/NewItem/NewItem";
import DeleteUser from "../../../components/DeleteItem/DeleteItem";

/*This componenet a list of users added
that have been added to the project
Only admins and project managers can add/delete users from projects
*/

class UserList extends Lists {
  state = {
    newItem: false,
    search: "",
    deleteItem: {
      continue: false,
      key: null,
    },
    currentPage: 1,
    numPerPage: 5,
    form: {
      email: formConfig(
        "Email",
        "Email ...",
        "email",
        "",
        "input",
        { isRequired: true, isArrayPresent: true, isNotArrayPresent: true },
        false,
        false
      ),
    },
  };
  componentDidMount() {
    //if project users are not present in the redux store,fetch from API
    const projid = this.props.match.params.id;
    if (!this.props.allProjUsers[projid])
      this.props.fetchProjUsers(projid, this.props.token);
    if (!this.props.users.length) this.props.fetchAllUsers(this.props.token);
  }

  formSubmitHandler = () => {
    const user = this.props.users.find(
      (curr) => curr.email === this.state.form.email.value.trim().toLowerCase()
    );
    this.props.submitUser(this.props.match.params.id, user, this.props.token);
    this.resetForm();
    this.setState({ newItem: false });
  };
  filterUser(arr) {
    //filter the user list based on the search results
    const filterArr = arr.filter((curr) =>
      curr.name.toLowerCase().startsWith(this.state.search.toLowerCase().trim())
    );
    return filterArr.length ? filterArr : arr;
  }

  createTableHeader() {
    //Table Header
    return (
      <tr>
        <th>User Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    );
  }
  createTableBody() {
    //Table Body
    const { currentPage, numPerPage } = this.state;
    const startIndex = (currentPage - 1) * numPerPage;
    const endIndex = startIndex + numPerPage;
    const projid = this.props.match.params.id;
    const users = this.props.allProjUsers[projid] || [];
    return users.length ? (
      this.filterUser(users)
        .slice(startIndex, endIndex)
        .map((curr) => {
          const notPointer =
            this.props.role === "Developer" || this.props.role === "Submitter";
          return (
            <tr
              key={curr.key}
              onClick={() =>
                curr.key === (this.props.userid && curr.role !== "Admin") ||
                notPointer
                  ? null
                  : this.clickItem(curr.key)
              }
              style={{
                cursor:
                  curr.key === (this.props.userid && curr.role !== "Admin") ||
                  notPointer
                    ? "auto"
                    : "pointer",
              }}
            >
              <td>{curr.name}</td>
              <td>{curr.email}</td>
              <td>{curr.role}</td>
            </tr>
          );
        })
    ) : (
      <tr>
        <td>{"\u00A0"}</td>
        <td>No Users Found</td>
        <td>{"\u00A0"}</td>
      </tr>
    );
  }
  removeUserContinue = () => {
    const user = this.props.users.find(
      (curr) => curr.key === this.state.deleteItem.key
    );
    if (user) {
      this.props.deleteUser(
        this.props.match.params.id,
        user.email,
        this.state.deleteItem.key,
        this.props.token
      );
    }

    this.setState({
      deleteItem: {
        key: null,
        continue: false,
      },
    });
  };
  removeItemCancel = () =>
    this.setState({ deleteItem: { key: null, continue: false } });

  clickItem = (key) => {
    this.setState({ deleteItem: { key, continue: true } });
  };
  render() {
    return this.props.dispSpinner ? (
      <Spinner />
    ) : (
      <div>
        <NewUser
          open={this.state.newItem}
          form={this.state.form}
          array={this.props.users}
          notArray={this.props.allProjUsers[this.props.match.params.id] || []}
          inputHandler={this.inputHandler}
          cancelForm={this.formCancelHandler}
          submitForm={this.formSubmitHandler}
          disabled={!this.checkFormValidity(this.state.form)}
        />
        {this.props.role === "Admin" ||
        this.props.role === "Project Manager" ? (
          <DeleteUser
            type="User"
            removeItemCancel={this.removeItemCancel}
            removeItemContinue={this.removeUserContinue}
            show={this.state.deleteItem.continue}
          />
        ) : null}
        {!this.props.remButton ? (
          <Button clicked={this.addItemHandler}>Add New User</Button>
        ) : null}
        <Modal
          header={<p> {`${this.props.match.params.name} Users`}</p>}
          footer={
            <Pagination
              currPage={this.state.currentPage}
              numPerPage={this.state.numPerPage}
              items={
                this.filterUser(
                  this.props.allProjUsers[this.props.match.params.id] || []
                ).length
              }
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
              style={this.props.searchStyle}
            />
          }
          type="Users"
        >
          <Table
            header={this.createTableHeader()}
            style={this.props.tableStyle}
          >
            {this.createTableBody()}
          </Table>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  users: state.user.users,
  role: state.auth.role,
  token: state.auth.token,
  userid: state.auth.id,
  allProjUsers: state.user.allProjUsers,
  dispSpinner: state.user.dispSpinner,
});

const mapDispatchToProps = (dispatch) => ({
  fetchProjUsers: (id, token) =>
    dispatch(userActionCreators.fetchProjUsersCreator(id, token)),
  fetchAllUsers: (token) =>
    dispatch(userActionCreators.fetchAllUsersCreator(token)),
  submitUser: (id, obj, token) =>
    dispatch(userActionCreators.postUserCreator(id, obj, token)),
  deleteUser: (projectId, userEmail, userKey, token) =>
    dispatch(
      userActionCreators.deleteUserTicketsCreator(
        projectId,
        userEmail,
        userKey,
        token
      )
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(UserList, axios));
