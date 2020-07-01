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
        { isRequired: true, isArrayPresent: true },
        false,
        false
      ),
    },
  };
  componentDidMount() {
    const projid = this.props.match.params.id;
    !this.props.allProjUsers[projid]
      ? this.props.fetchProjUsers(projid)
      : this.props.getProjUsers(projid);
    if (!this.props.users.length) this.props.fetchAllUsers();
  }

  formSubmitHandler = () => {
    const user = this.props.users.find(
      (curr) => curr.email === this.state.form.email.value.trim()
    );
    this.props.submitUser(this.props.match.params.id, user);
    this.resetForm();
    this.setState({ newItem: false });
  };
  filterUser(arr) {
    const filterArr = arr.filter((curr) =>
      curr.name.toLowerCase().startsWith(this.state.search.toLowerCase())
    );
    return filterArr.length ? filterArr : arr;
  }

  createTableHeader() {
    return (
      <tr>
        <th>User Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    );
  }
  createTableBody() {
    const { currentPage, numPerPage } = this.state;
    const startIndex = (currentPage - 1) * numPerPage;
    const endIndex = startIndex + numPerPage;
    return this.filterUser(this.props.projUsers)
      .slice(startIndex, endIndex)
      .map((curr) => (
        <tr
          key={curr.key}
          onClick={() => this.clickItem(curr.key)}
          style={{ cursor: "pointer" }}
        >
          <td>{curr.name}</td>
          <td>{curr.email}</td>
          <td>{curr.role}</td>
        </tr>
      ));
  }
  removeUserContinue = () => {
    const userIndex = this.props.users.findIndex(
      (curr) => curr.key === this.state.deleteItem.key
    );
    if (userIndex !== -1)
      this.props.deleteUser(
        this.props.match.params.id,
        this.props.users[userIndex].email,
        this.state.deleteItem.key
      );
    this.setState({
      deleteItem: {
        key: null,
        continue: false,
      },
    });
  };
  removeItemCancel = () =>
    this.setState({ deleteItem: { key: null, continue: false } });

  clickItem = (key) => this.setState({ deleteItem: { key, continue: true } });
  render() {
    return this.props.dispSpinner ? (
      <Spinner />
    ) : (
      <div>
        <NewUser
          open={this.state.newItem}
          form={this.state.form}
          array={this.props.users}
          inputHandler={this.inputHandler}
          cancelForm={this.formCancelHandler}
          submitForm={this.formSubmitHandler}
          disabled={!this.checkFormValidity(this.state.form)}
        />
        {this.props.role === "Admin" ? (
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
              items={this.filterUser(this.props.projUsers).length}
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
          err={this.props.error || this.props.projUsers.length === 0}
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
  projUsers: state.user.projUsers,
  role: state.auth.role,
  allProjUsers: state.user.allProjUsers,
  dispSpinner: state.user.dispSpinner,
  error: state.user.error,
});

const mapDispatchToProps = (dispatch) => ({
  fetchProjUsers: (id) =>
    dispatch(userActionCreators.fetchProjUsersCreator(id)),
  fetchAllUsers: () => dispatch(userActionCreators.fetchAllUsersCreator()),
  getProjUsers: (id) => dispatch(userActionCreators.getProjUsersCreator(id)),
  submitUser: (id, obj) =>
    dispatch(userActionCreators.postUserCreator(id, obj)),
  deleteUser: (projectId, userEmail, userKey) =>
    dispatch(
      userActionCreators.deleteUserTicketsCreator(projectId, userEmail, userKey)
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(UserList, axios));
