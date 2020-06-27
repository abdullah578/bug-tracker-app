import React from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../../store/actions/Users";
import { formConfig } from "../../../Utilities/Utilities";
import WithErrorHandle from "../../../hoc/WithErrorHandle";
import Lists from "../Lists";
import axios from "../../../axiosInstance/AxiosInstance";
import Modal from "../../../components/UI/Modal/Modal";
import Table from "../../../components/UI/Table/Table";
import Button from "../../../components/UI/Button/Add/Add";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Pagination from "../../../components/UI/Pagination/Pagination";
import NewUser from "../../../components/NewItem/NewItem";
import DeleteUser from "../../../components/DeleteItem/DeleteItem";

class UserList extends Lists {
  state = {
    newItem: false,
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
    this.props.fetchProjUsers(this.props.match.params.id);
    this.props.fetchAllUsers();
  }

  formSubmitHandler = () => {
    const index = this.props.users.findIndex(
      (curr) => curr.email === this.state.form.email.value.trim()
    );
    this.props.submitUser(this.props.match.params.id, this.props.users[index]);
    this.resetForm();
    this.setState({ newItem: false });
  };

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
    const startIndex = (this.state.currentPage - 1) * this.state.numPerPage;
    const endIndex = startIndex + this.state.numPerPage;
    return this.props.projUsers.slice(startIndex, endIndex).map((curr) => (
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
    this.props.deleteUser(
      this.props.match.params.id,
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
        <DeleteUser
          type="User"
          removeItemCancel={this.removeItemCancel}
          removeItemContinue={this.removeUserContinue}
          show={this.state.deleteItem.continue}
        />
        <Button clicked={this.addItemHandler}>Add New User</Button>
        <Modal
          header={<p> {`${this.props.match.params.name} Users`}</p>}
          footer={
            <Pagination
              currPage={this.state.currentPage}
              numPerPage={this.state.numPerPage}
              items={this.props.projUsers.length}
              prev={this.prevPage}
              next={this.nextPage}
            />
          }
          err={this.props.error || this.props.projUsers.length === 0}
          type="Users"
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
  users: state.user.users,
  projUsers: state.user.projUsers,
  dispSpinner: state.user.dispSpinner,
  error: state.user.error,
});

const mapDispatchToProps = (dispatch) => ({
  fetchProjUsers: (id) => dispatch(actionCreators.fetchProjUsersCreator(id)),
  fetchAllUsers: () => dispatch(actionCreators.fetchAllUsersCreator()),
  submitUser: (id, obj) => dispatch(actionCreators.postUserCreator(id, obj)),
  deleteUser: (projectId, userKey) =>
    dispatch(actionCreators.deleteUserCreator(projectId, userKey)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(UserList, axios));
