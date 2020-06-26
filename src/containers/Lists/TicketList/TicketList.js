import React from "react";
import { connect } from "react-redux";
import * as userActionCreators from "../../../store/actions/Users";
import * as ticketActionCreators from "../../../store/actions/Tickets";
import { formConfig } from "../../../Utilities/Utilities";
import WithErrorHandle from "../../../hoc/WithErrorHandle";
import Lists from "../Lists";
import axios from "../../../axiosInstance/AxiosInstance";
import Modal from "../../../components/UI/Modal/Modal";
import Table from "../../../components/UI/Table/Table";
import Button from "../../../components/UI/Button/Add/Add";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Pagination from "../../../components/UI/Pagination/Pagination";
import NewTicket from "../../../components/NewItem/NewItem";

class TicketList extends Lists {
  state = {
    newItem: false,
    deleteItem: {
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
      description: formConfig(
        "Ticket Description",
        "Description ...",
        "text",
        "",
        "textArea",
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
      ticketPriority: {
        elementConfig: [
          { value: "Low" },
          { value: "Medium" },
          { value: "High" },
        ],
        value: "High",
        name: "Ticket Priority",
        isValid: true,
        fieldType: "select",
      },
      ticketType: {
        elementConfig: [
          { value: "Bugs/Errors" },
          { value: "Feature Requests" },
        ],
        value: "Bugs/Errors",
        name: "Ticket Type",
        isValid: true,
        fieldType: "select",
      },
      ticketStatus: {
        elementConfig: [
          { value: "Open" },
          { value: "In Progress" },
          { value: "Resolved" },
          { value: "Additional Info Required" },
        ],
        value: "Open",
        name: "Ticket Status",
        isValid: true,
        fieldType: "select",
      },
    },
  };
  componentDidMount() {
    this.props.type === "User"
      ? this.props.fetchUserTickets()
      : this.props.fetchProjTickets(this.props.match.params.id);
    this.props.fetchProjUsers(this.props.match.params.id);
  }
  formSubmitHandler = () => {
    const devIndex = this.props.projUsers.findIndex(
      (curr) => curr.email === this.state.form.assigned.value
    );
    const ticketObj = {
      title: this.state.form.title.value,
      description: this.state.form.description.value,
      ticketPriority: this.state.form.ticketPriority.value,
      ticketType: this.state.form.ticketType.value,
      assigned: this.props.projUsers[devIndex].name,
      submitter: this.props.name,
      status: this.state.form.ticketStatus.value,
      created: new Date(),
      projid: this.props.match.params.id,
    };
    this.props.submitTicket(this.props.match.params.id, ticketObj);
    this.resetForm();
    this.setState({ newItem: false });
  };

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
  createTableBody() {
    const startIndex = (this.state.currentPage - 1) * this.state.numPerPage;
    const endIndex = startIndex + this.state.numPerPage;
    console.log(this.props.tickets);
    const tickets =
      this.props.type === "User" ? this.props.userTickets : this.props.tickets;
    return tickets.slice(startIndex, endIndex).map((curr) => (
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
  render() {
    const tickets =
      this.props.type === "User" ? this.props.userTickets : this.props.tickets;
    return this.props.dispSpinner ? (
      <Spinner />
    ) : (
      <div>
        <NewTicket
          open={this.state.newItem}
          form={this.state.form}
          array={this.props.projUsers}
          inputHandler={this.inputHandler}
          cancelForm={this.formCancelHandler}
          submitForm={this.formSubmitHandler}
          disabled={!this.checkFormValidity(this.state.form)}
        />

        <Button clicked={this.addItemHandler}>Add New Ticket</Button>
        <Modal
          header={<p> {`${this.props.match.params.name} Tickets`}</p>}
          footer={
            <Pagination
              currPage={this.state.currentPage}
              numPerPage={this.state.numPerPage}
              items={tickets.length}
              prev={this.prevPage}
              next={this.nextPage}
            />
          }
          err={this.props.error || tickets.length === 0}
          type="Tickets"
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
  userTickets: state.ticket.userTickets,
  error: state.ticket.error,
});

const mapDispatchToProps = (dispatch) => ({
  fetchProjUsers: (id) =>
    dispatch(userActionCreators.fetchProjUsersCreator(id)),
  fetchProjTickets: (id) =>
    dispatch(ticketActionCreators.fetchProjTicketsCreator(id)),
  fetchUserTickets: (id) =>
    dispatch(ticketActionCreators.fetchUserTicketsCreator()),
  submitTicket: (id, ticket) =>
    dispatch(ticketActionCreators.submitProjTicketsCreator(id, ticket)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(TicketList, axios));
