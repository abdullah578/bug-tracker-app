import React from "react";
import { connect } from "react-redux";
import * as ticketActionCreators from "../../../store/actions/Tickets";
import { NavLink } from "react-router-dom";
import WithErrorHandle from "../../../hoc/WithErrorHandle";
import Lists from "../Lists";
import axios from "../../../axiosInstance/AxiosInstance";
import Modal from "../../../components/UI/Modal/Modal";
import Table from "../../../components/UI/Table/Table";
import Button from "../../../components/UI/Button/Add/Add";
import Search from "../../../components/UI/Search/Search";
import Pagination from "../../../components/UI/Pagination/Pagination";
/*This component is used to render a list of tickets for each projects and also 
to render all the tickets assigned to the user based on the props received */
class TicketList extends Lists {
  state = {
    deleteItem: {
      continue: false,
      key: null,
    },
    search: "",
    currentPage: 1,
    numPerPage: 5,
  };

  componentDidMount() {
    if (this.props.type === "User" && !this.props.userTickets.length) {
      const { email, role, token, userid } = this.props;
      this.props.fetchUserTickets(email, role, token, userid);
    } else if (this.props.type !== "User") {
      const projectID = this.props.match.params.id;
      if (!this.props.allProjTickets[projectID])
        this.props.fetchProjTickets(
          projectID,
          this.props.email,
          this.props.role,
          this.props.token
        );
    }
  }
  filterTickets = (arr) => {
    const keys = [
      "title",
      "assigned",
      "status",
      "ticketPriority",
      "ticketType",
    ];
    for (let key of keys) {
      let filteredArr = arr.filter((curr) =>
        curr[key].toLowerCase().startsWith(this.state.search.toLowerCase().trim())
      );
      if (filteredArr.length) return filteredArr;
    }
    return arr;
  };
  addTicketHandler = () =>
    this.props.history.push(
      `/tickets/${this.props.match.params.id}/${this.props.match.params.name}/new`
    );
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
    const { currentPage, numPerPage } = this.state;
    const startIndex = (currentPage - 1) * numPerPage;
    const endIndex = startIndex + numPerPage;
    const styles = { textDecoration: "none", color: "#551A8B" };
    const projid = this.props.match.params.id;
    const tickets =
      this.props.type === "User"
        ? this.props.userTickets
        : this.props.allProjTickets[projid] || [];
    return tickets.length ? (
      this.filterTickets(tickets)
        .slice(startIndex, endIndex)
        .map((curr) => (
          <tr key={curr.key}>
            <td>{curr.title}</td>
            <td>{curr.assigned}</td>
            <td>{curr.submitter}</td>
            <td>{curr.status}</td>
            <td>{curr.created}</td>
            <td>
              <NavLink
                to={`/tickets/${curr.projid}/${curr.projName}/${curr.key}/details`}
                style={styles}
              >
                Ticket Details
              </NavLink>
            </td>
          </tr>
        ))
    ) : (
      <tr>
        <td>{"\u00A0"}</td>
        <td>{"\u00A0"}</td>
        <td>No Tickets Found</td>
        <td>{"\u00A0"}</td>
        <td>{"\u00A0"}</td>
      </tr>
    );
  }
  render() {
    const projid = this.props.match.params.id;
    const tickets =
      this.props.type === "User"
        ? this.props.userTickets
        : this.props.allProjTickets[projid] || [];
    const addButton =
      this.props.type !== "User" &&
      this.props.role !== "Developer" &&
      this.props.role !== "N/A" &&
      !this.props.remButton;
    return (
      <div>
        {addButton ? (
          <Button clicked={this.addTicketHandler}>Add New Ticket</Button>
        ) : null}
        <Modal
          header={
            <p>
              {this.props.type === "User"
                ? "Tickets"
                : `${this.props.match.params.name} Tickets`}
            </p>
          }
          footer={
            <Pagination
              currPage={this.state.currentPage}
              numPerPage={this.state.numPerPage}
              items={this.filterTickets(tickets).length}
              prev={this.prevPage}
              next={this.nextPage}
            />
          }
          search={
            <Search
              value={this.state.search}
              numValue={this.state.numPerPage}
              inputNumHandler={this.numPerPageInputHandler}
              inputSearchHandler={this.searchInputHandler}
              style={this.props.searchStyle}
            />
          }
          type="Tickets"
        >
          <Table
            header={this.createTableHeader()}
            style={this.props.tableStyle}
          >
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
  userid: state.auth.id,
  role: state.auth.role,
  token: state.auth.token,
  dispSpinner: state.ticket.dispSpinner,
  allProjTickets: state.ticket.allProjTickets,
  userTickets: state.ticket.userTickets,
});

const mapDispatchToProps = (dispatch) => ({
  fetchProjTickets: (id, email, role, token) =>
    dispatch(
      ticketActionCreators.fetchProjTicketsCreator(id, email, role, token)
    ),
  fetchUserTickets: (email, role, token, key) =>
    dispatch(
      ticketActionCreators.fetchUserTicketsCreator(email, role, token, key)
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(TicketList, axios));
