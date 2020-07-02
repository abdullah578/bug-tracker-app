import React, { Component } from "react";
import { connect } from "react-redux";
import * as ticketActionCreators from "../../store/actions/Tickets";
import { createDateString } from "../../Utilities/Utilities";
import axios from "../../axiosInstance/AxiosInstance";
import WithErrorHandle from "../../hoc/WithErrorHandle";
import Comments from "../../components/Comments/Comments";
import Modal from "../../components/UI/Modal/Modal";
import Table from "../../components/UI/Table/Table";
import Pagination from "../../components/UI/Pagination/Pagination";
import Search from "../../components/UI/Search/Search";
import DetailItems from "../../components/TicketDetailsItems/TicketDetailsItems";
import classes from "./TicketDetails.module.css";
/*This component is used to render ticket details,ticket history and ticket comments
This component also allows users to delete and edit tickets  */

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
    search: "",
    commentsValue: "",
    currentPage: {
      history: 1,
      comments: 1,
    },
    numPerPage: {
      history: 5,
      comments: 5,
    },
  };
  getTicketInfo() {
    //get the ticket history and details
    const ticket = this.getTicket();
    const details = {};
    let history = ticket.history;
    Object.keys(obj).map((curr) => (details[obj[curr]] = ticket[curr]));
    return { details, history };
  }
  editHandler = () => {
    const { key, id, name } = this.props.match.params;
    this.props.history.push(`/tickets/${id}/${name}/${key}`);
  };
  deleteHandler = () => {
    const { key, id } = this.props.match.params;
    this.props.deleteTicket(id, key);
    this.props.history.goBack();
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
    const { id: projid, key } = this.props.match.params;
    const ticket = this.getTicket();
    const comments = [...ticket.comments];
    comments.unshift(comment);
    const respTicket = { ...ticket, comments };
    this.props.submitTicket(projid, respTicket, key);
    this.setState({ commentsValue: "" });
  };
  getTicket() {
    const { key, id: projid } = this.props.match.params;
    const tickets = this.props.allProjTickets[projid] || this.props.userTickets;
    const ticket = tickets.find((curr) => curr.key === key);
    return ticket;
  }
  createDetailsModalHeader() {
    return (
      <div className={classes.ModalHeader}>
        <p>Ticket Details</p>
        <button onClick={this.editHandler}>Edit Ticket</button>
        {this.props.role === "Admin" ||
        this.props.role === "Submitter" ||
        this.props.role === "Project Manager" ? (
          <span> / </span>
        ) : null}
        {this.props.role === "Admin" ||
        this.props.role === "Submitter" ||
        this.props.role === "Project Manager" ? (
          <button onClick={this.deleteHandler}>Delete Ticket</button>
        ) : null}
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
    const currentPage = this.state.currentPage.history;
    const numPerPage = this.state.numPerPage.history;
    const startIndex = (currentPage - 1) * numPerPage;
    const endIndex = startIndex + numPerPage;
    return hist.length ? (
      hist.slice(startIndex, endIndex).map((curr, index) => (
        <tr key={index}>
          <td>{curr.property}</td>
          <td>{curr.oldVal}</td>
          <td>{curr.newVal}</td>
          <td>{curr.date}</td>
        </tr>
      ))
    ) : (
      <tr key>
        <td>{"\u00A0"}</td>
        <td>{"\u00A0"}</td>
        <td>{"No History Found"}</td>
        <td>{"\u00A0"}</td>
        <td>{"\u00A0"}</td>
      </tr>
    );
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
  createCommentsTableBody(comments) {
    const currentPage = this.state.currentPage.comments;
    const numPerPage = this.state.numPerPage.comments;
    const startIndex = (currentPage - 1) * numPerPage;
    const endIndex = startIndex + numPerPage;
    return comments.length ? (
      this.filterComment(comments)
        .slice(startIndex, endIndex)
        .map((curr, index) => (
          <tr key={index}>
            <td>{curr.name}</td>
            <td style={{ overflowWrap: "break-word", maxWidth: "500px" }}>
              {curr.value}
            </td>
            <td>{curr.date}</td>
          </tr>
        ))
    ) : (
      <tr>
        <td>{"\u00A0"}</td>
        <td>{"No comment Found"}</td>
        <td>{"\u00A0"}</td>
      </tr>
    );
  }
  prevPage = (type) => {
    const currCopy = { ...this.state.currentPage };
    currCopy[type] -= 1;
    this.setState({ currentPage: currCopy });
  };
  nextPage = (type) => {
    const currCopy = { ...this.state.currentPage };
    currCopy[type] += 1;
    this.setState({ currentPage: currCopy });
  };
  searchInputHandler = (e) => {
    this.setState({
      currentPage: { ...this.state.currentPage, comments: 1 },
      search: e.target.value,
    });
  };
  numPerPageInputHandler = (e) => {
    this.setState({
      numPerPage: {
        ...this.state.numPerPage,
        comments: parseInt(e.target.value),
      },
      currentPage: { ...this.state.currentPage, comments: 1 },
    });
  };
  filterComment(arr) {
    const filterArr = arr.filter((curr) =>
      curr.name.toLowerCase().startsWith(this.state.search.toLowerCase())
    );
    return filterArr.length ? filterArr : arr;
  }
  render() {
    const { details, history } = this.getTicketInfo();
    const ticket = this.getTicket();
    return (
      <div className={classes.Content}>
        <div className={classes.Details}>
          <Modal
            header={this.createDetailsModalHeader()}
            footerStyle={{ border: "none" }}
          >
            <DetailItems details={details} />
          </Modal>
          <Modal
            header={<p>Ticket History</p>}
            footer={
              <Pagination
                currPage={this.state.currentPage.history}
                numPerPage={this.state.numPerPage.history}
                items={history.length}
                prev={() => this.prevPage("history")}
                next={() => this.nextPage("history")}
              />
            }
          >
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
            footer={
              <Pagination
                currPage={this.state.currentPage.comments}
                numPerPage={this.state.numPerPage.comments}
                items={this.filterComment(ticket.comments).length}
                prev={() => this.prevPage("comments")}
                next={() => this.nextPage("comments")}
              />
            }
            search={
              <Search
                value={this.state.search}
                numValue={this.state.numPerPage.comments}
                inputNumHandler={this.numPerPageInputHandler}
                inputSearchHandler={this.searchInputHandler}
              />
            }
          >
            {" "}
            <Table header={this.createCommentsTableHeader()}>
              {this.createCommentsTableBody(ticket.comments)}
            </Table>
          </Modal>
        </Comments>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  name: state.auth.name,
  role: state.auth.role,
  userTickets: state.ticket.userTickets,
  allProjTickets: state.ticket.allProjTickets,
});
const mapDispatchToProps = (dispatch) => ({
  submitTicket: (id, ticket, key) =>
    dispatch(ticketActionCreators.submitProjTicketsCreator(id, ticket, key)),
  deleteTicket: (id, key) =>
    dispatch(ticketActionCreators.deleteTicketCreator(id, key)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(TicketDetails, axios));
