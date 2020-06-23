import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/Users";
import { formConfig, checkValidation } from "../../Utilities/Utilities";
import Modal from "../../components/UI/Modal/Modal";
import Table from "../../components/UI/Table/Table";
import Button from "../../components/UI/Button/Add/Add";
import Spinner from "../../components/UI/Spinner/Spinner";
import Pagination from "../../components/UI/Pagination/Pagination";
import NewUser from "../../components/NewItem/NewItem";

class UserList extends Component {
  state = {
    newUser: false,
    currentPage: 1,
    numPerPage: 5,
    form: {
      userName: formConfig(
        "Username",
        "Username ...",
        "text",
        "",
        "input",
        { isRequired: true },
        false,
        false
      ),
      email: formConfig(
        "Email",
        "Email ...",
        "email",
        "",
        "input",
        { isRequired: true },
        false,
        false
      ),
      userRole: {
        elementConfig: [{ value: "Admin" }, { value: "Developer" }],
        value: "Admin",
        name: "User Role",
        isValid: true,
        fieldType: "select",
      },
    },
  };
  componentDidMount() {
    this.props.fetchUsers(this.props.match.params.id);
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
    this.setState({ newUser: false });
    this.resetForm();
  };
  formSubmitHandler = () => {
    this.props.submitUser(this.props.match.params.id, {
      userName: this.state.form.userName.value,
      email: this.state.form.email.value,
      role: this.state.form.userRole.value,
    });
    this.resetForm();
    this.setState({ newUser: false });
  };
  resetForm() {
    const formCopy = {
      ...this.state.form,
    };
    Object.keys(formCopy).forEach((curr) => {
      formCopy[curr] =
        curr.fieldType === "select"
          ? {
              ...formCopy[curr],
              value: "admin",
              isValid: true,
            }
          : {
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

  addUserHandler = () => this.setState({ newUser: true });
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
        <NewUser
          open={this.state.newUser}
          form={this.state.form}
          inputHandler={this.inputHandler}
          cancelForm={this.formCancelHandler}
          submitForm={this.formSubmitHandler}
          disabled={!this.checkFormValidity()}
        />
        <Button clicked={this.addUserHandler}>Add New User</Button>
        <Modal
          header={<p> {`${this.props.match.params.name} Users`}</p>}
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
    );
  }
}
const mapStateToProps = (state) => ({
  users: state.user.users,
  dispSpinner: state.user.dispSpinner,
});

const mapDispatchToProps = (dispatch) => ({
  fetchUsers: (id) => dispatch(actionCreators.fetchUsersCreator(id)),
  submitUser: (id, obj) => dispatch(actionCreators.postUserCreator(id, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
