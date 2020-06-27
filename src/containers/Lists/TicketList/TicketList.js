import React from "react";
import { connect } from "react-redux";
import * as ticketActionCreators from "../../../store/actions/Tickets";
import WithErrorHandle from "../../../hoc/WithErrorHandle";
import Lists from "../Lists";
import axios from "../../../axiosInstance/AxiosInstance";
import Modal from "../../../components/UI/Modal/Modal";
import Table from "../../../components/UI/Table/Table";
import Button from "../../../components/UI/Button/Add/Add";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Pagination from "../../../components/UI/Pagination/Pagination";
import DeleteTicket from "../../../components/DeleteItem/DeleteItem";

class TicketList extends Lists {
  state = {
    deleteItem: {
      continue: false,
      key: null,
    },
    currentPage: 1,
    numPerPage: 5,
  };

  componentDidMount() {
    this.props.type === "User"
      ? this.props.fetchUserTickets()
      : this.props.fetchProjTickets(this.props.match.params.id);
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
  createTableBody() {
    const startIndex = (this.state.currentPage - 1) * this.state.numPerPage;
    const endIndex = startIndex + this.state.numPerPage;
    console.log(this.props.tickets);
    const tickets =
      this.props.type === "User" ? this.props.userTickets : this.props.tickets;
    return tickets.slice(startIndex, endIndex).map((curr) => (
      <tr
        key={curr.key}
        onClick={() => this.clickItem(curr.key, curr.projid)}
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
    this.props.deleteTicket(
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
  render() {
    const tickets =
      this.props.type === "User" ? this.props.userTickets : this.props.tickets;
    return this.props.dispSpinner ? (
      <Spinner />
    ) : (
      <div>
        <DeleteTicket
          type="Ticket"
          removeItemCancel={this.removeItemCancel}
          removeItemContinue={this.removeTicketContinue}
          show={this.state.deleteItem.continue}
        />
        <Button
          clicked={() =>
            this.props.history.push(
              `/tickets/${this.props.match.params.id}/${this.props.match.params.name}/new`
            )
          }
        >
          Add New Ticket
        </Button>
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
  fetchProjTickets: (id) =>
    dispatch(ticketActionCreators.fetchProjTicketsCreator(id)),
  fetchUserTickets: (id) =>
    dispatch(ticketActionCreators.fetchUserTicketsCreator()),
  deleteTicket: (id, key) =>
    dispatch(ticketActionCreators.deleteTicketCreator(id, key)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(TicketList, axios));
