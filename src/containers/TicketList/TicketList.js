import React, { Component } from "react";
import { connect } from "react-redux";
import * as userActionCreators from "../../store/actions/Users";
import * as ticketActionCreators from "../../store/actions/Tickets";
import {
  formConfig,
  checkValidation,
  checkFormValidity,
} from "../../Utilities/Utilities";
import WithErrorHandle from "../../hoc/WithErrorHandle";
import axios from "../../axiosInstance/AxiosInstance";
import Modal from "../../components/UI/Modal/Modal";
import Table from "../../components/UI/Table/Table";
import Button from "../../components/UI/Button/Add/Add";
import Spinner from "../../components/UI/Spinner/Spinner";
import Pagination from "../../components/UI/Pagination/Pagination";
import NewTicket from "../../components/NewItem/NewItem";

class UserList extends Component {
  state = {
    newTicket: false,
    deleteTicket: {
      continue: false,
      key: null,
    },
    currentPage: 1,
    numPerPage: 5,
    form: {
      title: formConfig(
        "Tile",
        "Title ...",
        "text",
        "",
        "input",
        { isRequired: true },
        false,
        false
      ),
      assigned: formConfig(
        "Assigned",
        "email ...",
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
    this.props.fetchProjTickets(this.props.match.params.id);
    this.props.fetchProjUsers(this.props.match.params.id);
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
          this.state.form[type].validationRequirement,
          this.props.projUsers
        ),
      },
    };
    this.setState({ form: formCopy });
  };
  formCancelHandler = () => {
    this.setState({ newTicket: false });
    this.resetForm();
  };
  formSubmitHandler = () => {
    const devIndex = this.props.projUsers.findIndex(
      (curr) => curr.email === this.state.form.assigned.value
    );
    const ticketObj = {
      title: this.state.form.title.value,
      assigned: this.props.projUsers[devIndex].name,
      submitter: this.props.name,
      status: "Open",
      created: new Date(),
      projid: this.props.match.params.id,
    };
    this.props.submitTicket(this.props.match.params.id, ticketObj);
    this.resetForm();
    this.setState({ newTicket: false });
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
        <th>Title</th>
        <th>Developer</th>
        <th>Submitter</th>
        <th>Status</th>
        <th>Created</th>
        <th>{"\u00A0"}</th>
      </tr>
    );
  }
  removeTicketContinue = () => {
    this.props.deleteUser(
      this.props.match.params.id,
      this.state.deleteTicket.key
    );
    this.setState({
      deleteUser: {
        key: null,
        continue: false,
      },
    });
  };
  removeTicketCancel = () =>
    this.setState({ deleteUser: { key: null, continue: false } });

  clickUser = (key) => this.setState({ deleteUser: { key, continue: true } });
  createTableBody() {
    const startIndex = (this.state.currentPage - 1) * this.state.numPerPage;
    const endIndex = startIndex + this.state.numPerPage;
    return this.props.tickets.slice(startIndex, endIndex).map((curr) => (
      <tr
        key={curr.key}
        onClick={() => this.clickUser(curr.key)}
        style={{ cursor: "pointer" }}
      >
        <td>{curr.title}</td>
        <td>{curr.assigned}</td>
        <td>{curr.submitter}</td>
        <td>{curr.status}</td>
        <td>{curr.created}</td>
      </tr>
    ));
  }
  nextPage = () =>
    this.setState((prevState) => ({ currentPage: prevState.currentPage + 1 }));
  prevPage = () =>
    this.setState((prevState) => ({ currentPage: prevState.currentPage - 1 }));

  addTicketHandler = () => this.setState({ newTicket: true });
  render() {
    return this.props.dispSpinner ? (
      <Spinner />
    ) : (
      <div>
        <NewTicket
          open={this.state.newTicket}
          form={this.state.form}
          inputHandler={this.inputHandler}
          cancelForm={this.formCancelHandler}
          submitForm={this.formSubmitHandler}
          disabled={!checkFormValidity(this.state.form)}
        />

        <Button clicked={this.addTicketHandler}>Add New Ticket</Button>
        <Modal
          header={<p> {`${this.props.match.params.name} Tickets`}</p>}
          footer={
            <Pagination
              currPage={this.state.currentPage}
              numPerPage={this.state.numPerPage}
              items={this.props.projUsers.length}
              prev={this.prevPage}
              next={this.nextPage}
            />
          }
          err={this.props.error || this.props.tickets.length === 0}
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
  email: state.auth.email,
  name: state.auth.name,
  projUsers: state.user.projUsers,
  dispSpinner: state.ticket.dispSpinner,
  tickets: state.ticket.tickets,
  error: state.ticket.error,
});

const mapDispatchToProps = (dispatch) => ({
  fetchProjUsers: (id) =>
    dispatch(userActionCreators.fetchProjUsersCreator(id)),
  fetchProjTickets: (id) =>
    dispatch(ticketActionCreators.fetchProjTicketsCreator(id)),
  submitTicket: (id, ticket) =>
    dispatch(ticketActionCreators.submitProjTicketsCreator(id, ticket)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(UserList, axios));
