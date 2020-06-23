import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/Users";
import Input from "../../components/UI/Input/Input";
import Modal from "../../components/UI/Modal/Modal";
import Table from "../../components/UI/Table/Table";
import Button from "../../components/UI/Button/Add/Add";
import Spinner from "../../components/UI/Spinner/Spinner";
import Pagination from "../../components/UI/Pagination/Pagination";
import classes from "./UserRoles.module.css";

class UserRoles extends Component {
  state = {
    userRole: {
      elementConfig: [{ value: "Admin" }, { value: "Developer" }],
      value: "Admin",
      name: "User Role",
      isValid: true,
      fieldType: "select",
    },
    currentPage: 1,
    numPerPage: 5,
  };
  componentDidMount() {
    this.props.fetchAllUsers();
  }
  roleHandler = (e) => {
    const userRoleCopy = { ...this.state.userRole };
    userRoleCopy.value = e.target.value;
    this.setState({ userRole: userRoleCopy });
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
    return this.props.users.slice(startIndex, endIndex).map((curr) => (
      <tr key={curr.key}>
        <td>{curr.userName}</td>
        <td>{curr.email}</td>
        <td>{curr.role}</td>
      </tr>
    ));
  }
  nextPage = () =>
    this.setState((prevState) => ({ currentPage: prevState.currentPage + 1 }));
  prevPage = () =>
    this.setState((prevState) => ({ currentPage: prevState.currentPage - 1 }));
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
    console.log("e");
    console.log(this.createTableBody());
    return this.props.dispSpinner ? (
      <Spinner />
    ) : (
      <React.Fragment>
        <p className={classes.Para}>Manage User Roles</p>
        <div className={classes.RoleDiv}>
          <div className={classes.Roles}>
            <div className={classes.ListContainer}>
              <p>Select a User </p>
              <ul className={classes.UserList}>
                <li>Abdullah Mohammed</li>
                <li>Abdullah Mohammed</li>
                <li>Abdullah Mohammed</li>
                <li>Abdullah Mohammed</li>
                <li>Abdullah Mohammed</li>
                <li>Abdullah Mohammed</li>
              </ul>
            </div>
            <Input {...this.state.userRole} inputHandler={this.roleHandler} />
            <Button style={{ width: "100%" }}> Submit</Button>
          </div>
          <div className={classes.Users}>
            <Modal
              header={this.createHeader()}
              footer={
                <Pagination
                  currPage={this.state.currentPage}
                  numPerPage={this.state.numPerPage}
                  items={this.props.users.length}
                  prev={this.prevPage}
                  next={this.nextPage}
                />
              }
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
  dispSpinner: state.user.dispSpinner,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllUsers: () => dispatch(actionCreators.fetchAllUsersCreator()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserRoles);
