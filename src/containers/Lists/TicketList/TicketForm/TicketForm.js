import React from "react";
import { connect } from "react-redux";
import * as userActionCreators from "../../../../store/actions/Users";
import * as ticketActionCreators from "../../../../store/actions/Tickets";
import {
  formConfig,
  createDateString,
  mapResponseToName,
} from "../../../../Utilities/Utilities";
import Lists from "../../Lists";
import Modal from "../../../../components/UI/Modal/Modal";
import Input from "../../../../components/UI/Input/Input";
import Button from "../../../../components/UI/Button/Add/Add";

import classes from "./TicketForm.module.css";
const obj = {
  ticketStatus: "status",
  ticketPriority: "ticketPriority",
  ticketType: "ticketType",
  title: "title",
  description: "description",
  assigned: "assignedEmail",
};

class TicketForm extends Lists {
  state = {
    newItem: true,
    form: {
      title: formConfig(
        "Title",
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
    const { id: projectID, key: ticketKey } = this.props.match.params;
    !this.props.allProjUsers[projectID]
      ? this.props.fetchProjUsers(projectID)
      : this.props.getProjUsers(projectID);
    if (ticketKey === "new") return null;
    this.populateForm();
  }
  mapResponseToState(name) {
    return obj[name];
  }
  populateForm() {
    const { id: projectID, key: ticketKey } = this.props.match.params;
    const formCopy = { ...this.state.form };
    const tickets =
      this.props.allProjTickets[projectID] || this.props.userTickets;
    const ticket = tickets.find((curr) => curr.key === ticketKey);
    Object.keys(formCopy).map(
      (name) =>
        (formCopy[name] = {
          ...formCopy[name],
          value: ticket[this.mapResponseToState(name)],
          isValid: true,
        })
    );
    this.setState({ form: formCopy, ticket });
  }
  formSubmitHandler = () => {
    const ticketObj = this.createResponseTicket();
    const history = this.createTicketHistory(ticketObj);
    this.props.submitTicket(
      this.props.match.params.id,
      { ...ticketObj, history },
      this.props.match.params.key
    );
    this.props.history.goBack();
  };
  createResponseTicket() {
    const devIndex = this.props.projUsers.findIndex(
      (curr) => curr.email === this.state.form.assigned.value
    );
    if (devIndex === -1) return null;
    const {
      title,
      description,
      ticketPriority,
      ticketType,
      assigned,
      ticketStatus,
    } = this.state.form;
    const ticketObj = {
      title: title.value,
      description: description.value,
      ticketPriority: ticketPriority.value,
      ticketType: ticketType.value,
      assigned: this.props.projUsers[devIndex].name,
      projName: this.props.match.params.name,
      assignedEmail: assigned.value.trim(),
      submitter: this.props.name,
      submitterEmail: this.props.email.trim(),
      status: ticketStatus.value,
      created: this.state.ticket
        ? this.state.ticket.created
        : createDateString(new Date()),
      projid: this.props.match.params.id,
      comments: this.state.ticket ? this.state.ticket.comments : [],
    };
    return ticketObj;
  }
  createTicketHistory(ticketObj) {
    let history = [];
    if (this.state.ticket) {
      history = [...this.state.ticket.history];
      Object.keys(this.state.form).forEach((curr) => {
        const current = this.mapResponseToState(curr);
        if (
          ticketObj[current] !== this.state.ticket[current] &&
          current !== "description"
        )
          history.unshift({
            property: mapResponseToName(current),
            oldVal: this.state.ticket[current],
            newVal: ticketObj[current],
            date: createDateString(new Date()),
          });
      });
    }
    return history;
  }
  render() {
    return (
      <div>
        <Modal header={<p>Create new Ticket</p>} modalStyle={{ width: "80%" }}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={classes.InputContainer}>
              <div className={classes.InputChilds}>
                {Object.keys(this.state.form)
                  .slice(0, 3)
                  .map((curr) => (
                    <Input
                      {...this.state.form[curr]}
                      key={curr}
                      inputStyle={{ padding: "5px", borderRadius: "0px" }}
                      labelStyle={{ color: "#555", fontSize: "80%" }}
                      containerStyle={{ width: "80%", margin: "auto" }}
                      inputHandler={(e) =>
                        this.inputHandler(e, curr, this.props.projUsers)
                      }
                    />
                  ))}
              </div>
              <div className={classes.InputChilds}>
                {Object.keys(this.state.form)
                  .slice(3)
                  .map((curr) => (
                    <Input
                      {...this.state.form[curr]}
                      key={curr}
                      inputStyle={{ padding: "5px", borderRadius: "0px" }}
                      labelStyle={{ color: "#555", fontSize: "80%" }}
                      containerStyle={{ width: "80%", margin: "auto" }}
                      inputHandler={(e) =>
                        this.inputHandler(e, curr, this.props.projUsers)
                      }
                    />
                  ))}
              </div>
            </div>
            <div className={classes.ButtonDiv}>
              <Button
                clicked={this.formSubmitHandler}
                disabled={!this.checkFormValidity(this.state.form)}
              >
                Submit Ticket
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  email: state.auth.email,
  name: state.auth.name,
  projUsers: state.user.projUsers,
  allProjUsers: state.user.allProjUsers,
  userTickets: state.ticket.userTickets,
  allProjTickets: state.ticket.allProjTickets,
  dispSpinner: state.ticket.dispSpinner,
  error: state.ticket.error,
});
const mapDispatchToProps = (dispatch) => ({
  fetchProjUsers: (id) =>
    dispatch(userActionCreators.fetchProjUsersCreator(id)),
  getProjUsers: (id) => dispatch(userActionCreators.getProjUsersCreator(id)),
  submitTicket: (id, ticket, key) =>
    dispatch(ticketActionCreators.submitProjTicketsCreator(id, ticket, key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketForm);
