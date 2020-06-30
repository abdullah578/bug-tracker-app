import React, { Component } from "react";
import { connect } from "react-redux";
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
  getTicketInfo() {
    const key = this.props.match.params.key;
    const projid = this.props.match.params.id;
    const tickets = this.props.allProjTickets[projid] || this.props.userTickets;
    const ticket = tickets.find((curr) => curr.key === key);;
    const details = {};
    let history = ticket.history;
    Object.keys(obj).map((curr) => (details[obj[curr]] = ticket[curr]));
    return { details, history };
  }
  editHandler = () => {
    const { key, id, name } = this.props.match.params;
    this.props.history.push(`/tickets/${id}/${name}/${key}`);
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
  createTableHeader() {
    return (
      <tr>
        <th>Property</th>
        <th>Old Value</th>
        <th> New Value</th>
        <th>Date Changed </th>
      </tr>
    );
  }
  createTableBody(hist) {
    return hist.map((curr, index) => (
      <tr key={index}>
        <td>{curr.property}</td>
        <td>{curr.oldVal}</td>
        <td>{curr.newVal}</td>
        <td>{curr.date}</td>
      </tr>
    ));
  }
  render() {
    const { details, history } = this.getTicketInfo();
    return (
      <div className={classes.Details}>
        <Modal
          header={this.createDetailsModalHeader()}
          footerStyle={{ border: "none" }}
        >
          <DetailItems details={details} />
        </Modal>
        <Modal header={<p>Ticket History</p>}>
          <Table
            header={this.createTableHeader()}
            style={{ fontSize: "60%", fontWeight: "bold" }}
          >
            {this.createTableBody(history)}
          </Table>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  name: state.auth.name,
  userTickets: state.ticket.userTickets,
  allProjTickets: state.ticket.allProjTickets,
});

export default connect(mapStateToProps)(TicketDetails);
