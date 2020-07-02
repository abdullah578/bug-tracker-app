import React from "react";
import { connect } from "react-redux";
import * as userActionCreators from "../../../../store/actions/Users";
import * as ticketActionCreators from "../../../../store/actions/Tickets";
import {
  formConfig,
  createDateString,
  mapResponseToName,
} from "../../../../Utilities/Utilities";
import axios from "../../../../axiosInstance/AxiosInstance";
import WithErrorHandler from "../../../../hoc/WithErrorHandle";
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

/*This component is rendered when the user wants
to add a new ticket or edit and existing ticket.In case of adding a 
new ticket , the key is set to new .  */

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
          { value: "None" },
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
    //Developers are not allowed to add new tickets
    if (
      ticketKey === "new" &&
      (this.props.role === "developer" || this.props.role === "N/A")
    )
      this.props.history.goBack();
    if (!this.props.allProjUsers[projectID])
      this.props.fetchProjUsers(projectID, this.props.token);

    if (ticketKey === "new") return null;
    this.populateForm();
  }
  mapResponseToState(name) {
    return obj[name];
  }
  populateForm() {
    // populate form with existing ticket input field values
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
      this.props.match.params.key,
      this.props.token
    );
    this.props.history.goBack();
  };
  createResponseTicket() {
    //This function craetes the response object to be stored in the API
    const users = this.props.allProjUsers[this.props.match.params.id] || [];
    const devIndex = users.findIndex(
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
      assigned: users[devIndex].name,
      projName: this.props.match.params.name,
      assignedEmail: assigned.value.trim().toLowerCase(),
      submitter: this.state.ticket
        ? this.state.ticket.submitter
        : this.props.name,
      submitterEmail: this.state.ticket
        ? this.state.ticket.submitterEmail
        : this.props.email.trim().toLowerCase(),
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
    //this function keeps track of all changes made on existing tickets
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
                {this.props.role !== "Developer" ? (
                  Object.keys(this.state.form)
                    .slice(0, 3)
                    .map((curr) => (
                      <Input
                        {...this.state.form[curr]}
                        key={curr}
                        inputStyle={{ padding: "5px", borderRadius: "0px" }}
                        labelStyle={{ color: "#555", fontSize: "80%" }}
                        containerStyle={{ width: "80%", margin: "auto" }}
                        inputHandler={(e) =>
                          this.inputHandler(
                            e,
                            curr,
                            this.props.allProjUsers[
                              this.props.match.params.id
                            ] || []
                          )
                        }
                      />
                    ))
                ) : (
                  <Input
                    {...this.state.form["ticketStatus"]}
                    inputStyle={{ padding: "5px", borderRadius: "0px" }}
                    labelStyle={{ color: "#555", fontSize: "80%" }}
                    containerStyle={{ width: "80%", margin: "auto" }}
                    inputHandler={(e) =>
                      this.inputHandler(
                        e,
                        "ticketStatus",
                        this.props.allProjUsers[this.props.match.params.id] ||
                          []
                      )
                    }
                  />
                )}
              </div>
              {this.props.role !== "Developer" ? (
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
                          this.inputHandler(
                            e,
                            curr,
                            this.props.allProjUsers[
                              this.props.match.params.id
                            ] || []
                          )
                        }
                      />
                    ))}
                </div>
              ) : null}
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
  role: state.auth.role,
  token: state.auth.token,
  allProjUsers: state.user.allProjUsers,
  userTickets: state.ticket.userTickets,
  allProjTickets: state.ticket.allProjTickets,
  dispSpinner: state.ticket.dispSpinner,
  error: state.ticket.error,
});
const mapDispatchToProps = (dispatch) => ({
  fetchProjUsers: (id, token) =>
    dispatch(userActionCreators.fetchProjUsersCreator(id, token)),
  submitTicket: (id, ticket, key, token) =>
    dispatch(
      ticketActionCreators.submitProjTicketsCreator(id, ticket, key, token)
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandler(TicketForm, axios));
