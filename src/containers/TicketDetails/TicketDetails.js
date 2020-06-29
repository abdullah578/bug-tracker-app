import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "../../components/UI/Modal/Modal";
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
    const index = tickets.findIndex((curr) => curr.key === key);
    const details = {};
    Object.keys(obj).map((curr) => (details[obj[curr]] = tickets[index][curr]));
    return details;
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
  render() {
    return (
      <div className={classes.Details}>
        <Modal
          header={this.createDetailsModalHeader()}
          footerStyle={{ border: "none" }}
        >
          <DetailItems details={this.getTicketInfo()} />
        </Modal>
        <Modal header={<p>Ticket History</p>} />
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
