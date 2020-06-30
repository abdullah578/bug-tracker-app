import React, { Component } from "react";
import { connect } from "react-redux";
import * as ticketActionCreators from "../../store/actions/Tickets";
import { createDateString } from "../../Utilities/Utilities";
import Comments from "../../components/Comments/Comments";
import Modal from "../../components/UI/Modal/Modal";
import Table from "../../components/UI/Table/Table";
import DetailItems from "../../components/TicketDetailsItems/TicketDetailsItems";
import classes from "./TicketDetails.module.css";
const obj = {
  title: "Ticket Title",
  description: "Ticket Description",
  assigned: "Assigned Developer",
  submitter: "Submitter",
  ticketPriority: "Ticket Priority",
  status: "Ticket Status",
  ticketType: "Ticket Type",
  created: "Created",
};
class TicketDetails extends Component {
  state = {
    commentsValue: "",
  };
  getTicketInfo() {
    const key = this.props.match.params.key;
    const projid = this.props.match.params.id;
    const tickets = this.props.allProjTickets[projid] || this.props.userTickets;
    const ticket = tickets.find((curr) => curr.key === key);
    const details = {};
    let history = ticket.history;
    Object.keys(obj).map((curr) => (details[obj[curr]] = ticket[curr]));
    return { details, history };
  }
  editHandler = () => {
    const { key, id, name } = this.props.match.params;
    this.props.history.push(`/tickets/${id}/${name}/${key}`);
  };
  inputChangeHandler = (e) => {
    this.setState({ commentsValue: e.target.value });
  };
  inputSubmitHandler = () => {
    const comment = {
      value: this.state.commentsValue,
      date: createDateString(new Date()),
      name: this.props.name,
    };
    const key = this.props.match.params.key;
    const projid = this.props.match.params.id;
    const tickets = this.props.allProjTickets[projid] || this.props.userTickets;
    const ticket = tickets.find((curr) => curr.key === key);
    const comments = [...ticket.comments];
    comments.unshift(comment);
    const respTicket = { ...ticket, comments };
    this.props.submitTicket(projid, respTicket, key, ticket.history);
  };
  createDetailsModalHeader() {
    return (
      <div className={classes.ModalHeader}>
        <p>Ticket Details</p>
        <button onClick={this.editHandler}>Edit Ticket</button>
        <span> / </span>
        <button>Delete Ticket</button>
      </div>
    );
  }
  createHistoryTableHeader() {
    return (
      <tr>
        <th>Property</th>
        <th>Old Value</th>
        <th> New Value</th>
        <th>Date Changed </th>
      </tr>
    );
  }
  createHistoryTableBody(hist) {
    return hist.map((curr, index) => (
      <tr key={index}>
        <td>{curr.property}</td>
        <td>{curr.oldVal}</td>
        <td>{curr.newVal}</td>
        <td>{curr.date}</td>
      </tr>
    ));
  }
  createCommentsTableHeader() {
    return (
      <tr>
        <th>Commenter</th>
        <th>Message</th>
        <th>Created</th>
      </tr>
    );
  }
  createCommentsTableBody() {
    const key = this.props.match.params.key;
    const projid = this.props.match.params.id;
    const tickets = this.props.allProjTickets[projid] || this.props.userTickets;
    const ticket = tickets.find((curr) => curr.key === key);
    return ticket.comments.map((curr, index) => (
      <tr key={index}>
        <td>{curr.name}</td>
        <td>{curr.value}</td>
        <td>{curr.date}</td>
      </tr>
    ));
  }
  render() {
    const { details, history } = this.getTicketInfo();
    return (
      <div className={classes.Content}>
        <div className={classes.Details}>
          <Modal
            header={this.createDetailsModalHeader()}
            footerStyle={{ border: "none" }}
          >
            <DetailItems details={details} />
          </Modal>
          <Modal header={<p>Ticket History</p>}>
            <Table
              header={this.createHistoryTableHeader()}
              style={{ fontSize: "60%", fontWeight: "bold" }}
            >
              {this.createHistoryTableBody(history)}
            </Table>
          </Modal>
        </div>

        <Comments
          onInputChange={this.inputChangeHandler}
          value={this.state.commentsValue}
          buttonDisabled={this.state.commentsValue.trim().length === 0}
          submit={this.inputSubmitHandler}
        >
          <Modal
            modalStyle={{ marginTop: "70px" }}
            header={<p>Ticket Comments</p>}
          >
            {" "}
            <Table header={this.createCommentsTableHeader()}>
              {this.createCommentsTableBody()}
            </Table>
          </Modal>
        </Comments>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  name: state.auth.name,
  userTickets: state.ticket.userTickets,
  allProjTickets: state.ticket.allProjTickets,
});
const mapDispatchToProps = (dispatch) => ({
  submitTicket: (id, ticket, key, history) =>
    dispatch(
      ticketActionCreators.submitProjTicketsCreator(id, ticket, key, history)
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetails);
