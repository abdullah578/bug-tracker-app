import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/Users";
import WithErrorHandle from "../../hoc/WithErrorHandle";
import axios from "../../axiosInstance/AxiosInstance";
import Input from "../../components/UI/Input/Input";
import Modal from "../../components/UI/Modal/Modal";
import Table from "../../components/UI/Table/Table";
import Button from "../../components/UI/Button/Add/Add";
import Spinner from "../../components/UI/Spinner/Spinner";
import Pagination from "../../components/UI/Pagination/Pagination";
import Users from "../../components/UserList/UserList";
import classes from "./UserRoles.module.css";

class UserRoles extends Component {
  state = {
    userRole: {
      elementConfig: [
        { value: "Admin" },
        { value: "Developer" },
        { value: "Submitter" },
        { value: "N/A" },
      ],
      value: "Developer",
      name: "User Role",
      isValid: true,
      fieldType: "select",
    },
    currentPage: 1,
    numPerPage: 5,
    selectedUser: null,
  };
  componentDidMount() {
    if (!this.props.allUsers.length) this.props.fetchAllUsers();
  }
  roleHandler = (e) => {
    const userRoleCopy = { ...this.state.userRole };
    userRoleCopy.value = e.target.value;
    this.setState({ userRole: userRoleCopy });
  };
  selectUser = (key) => {
    this.setState({ selectedUser: key });
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
    const { numPerPage, currentPage } = this.state;
    const startIndex = (currentPage - 1) * numPerPage;
    const endIndex = startIndex + numPerPage;
    return this.props.users.slice(startIndex, endIndex).map((curr) => (
      <tr key={curr.key}>
        <td>{curr.name}</td>
        <td>{curr.email}</td>
        <td>{curr.role}</td>
      </tr>
    ));
  }
  nextPage = () =>
    this.setState((prevState) => ({ currentPage: prevState.currentPage + 1 }));
  prevPage = () =>
    this.setState((prevState) => ({ currentPage: prevState.currentPage - 1 }));

  formSubmit = () => {
    if (!this.state.selectedUser) return null;
    const index = this.props.allUsers.findIndex(
      (curr) => curr.key === this.state.selectedUser
    );
    const obj = {
      ...this.props.allUsers[index],
      role: this.state.userRole.value,
    };
    this.props.updateUser(this.state.selectedUser, obj);
    this.setState({ selectedUser: null });
  };
  createHeader() {
    const BigStyles = {
      fontSize: "70%",
      marginBottom: "5px",
      fontWeight: "bold",
    };
    const smallStyles = {
      fontSize: "60%",
      fontWeight: "300",
    };
    return (
      <React.Fragment>
        <p style={BigStyles}>Your Personnel</p>
        <p style={smallStyles}>All the users in your database</p>
      </React.Fragment>
    );
  }
  render() {
    const { currentPage, numPerPage, selectedUser, userRole } = this.state;
    return this.props.dispSpinner ? (
      <Spinner />
    ) : (
      <React.Fragment>
        <p className={classes.Para}>Manage User Roles</p>
        <div className={classes.RoleDiv}>
          <div className={classes.Roles}>
            <Users
              all={this.props.allUsers}
              select={this.selectUser}
              selected={selectedUser}
            />
            <Input {...userRole} inputHandler={this.roleHandler} />
            <Button style={{ width: "100%" }} clicked={this.formSubmit}>
              {" "}
              Submit
            </Button>
          </div>
          <div className={classes.Users}>
            <Modal
              header={this.createHeader()}
              footer={
                <Pagination
                  currPage={currentPage}
                  numPerPage={numPerPage}
                  items={this.props.users.length}
                  prev={this.prevPage}
                  next={this.nextPage}
                />
              }
              err={this.props.err || this.props.users.length === 0}
              type="Users"
            >
              <Table header={this.createTableHeader()}>
                {this.createTableBody()}
              </Table>
            </Modal>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  users: state.user.users,
  allUsers: state.user.allUsers,
  dispSpinner: state.user.dispSpinner,
  error: state.user.error,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllUsers: () => dispatch(actionCreators.fetchAllUsersCreator()),
  updateUser: (key, obj) =>
    dispatch(actionCreators.updateUsersCreator(key, obj)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(UserRoles, axios));
