import React from "react";
import { formConfig } from "../../../../Utilities/Utilities";
import { connect } from "react-redux";
import * as userActionCreators from "../../../../store/actions/Users";
import * as ticketActionCreators from "../../../../store/actions/Tickets";
import Lists from "../../Lists";
import Modal from "../../../../components/UI/Modal/Modal";
import Input from "../../../../components/UI/Input/Input";
import Button from "../../../../components/UI/Button/Add/Add";

import classes from "./TicketForm.module.css";

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
    if (!this.props.allProjUsers[this.props.match.params.id])
      this.props.fetchProjUsers(this.props.match.params.id);
    else this.props.getProjUsers(this.props.match.params.id);
    if (this.props.match.params.key !== "new") {
      const formCopy = { ...this.state.form };
      const tickets =
        this.props.allProjTickets[this.props.match.params.id] ||
        this.props.userTickets;
      const dataIndex = tickets.findIndex(
        (curr) => curr.key === this.props.match.params.key
      );
      Object.keys(formCopy).map(
        (name) =>
          (formCopy[name] = {
            ...formCopy[name],
            value: tickets[dataIndex][this.mapResponseToState(name)],
            isValid: true,
          })
      );
      this.setState({ form: formCopy,ticket:tickets[dataIndex] });
    }
  }
  mapResponseToState(name) {
    const obj = {
      ticketStatus: "status",
      ticketPriority: "ticketPriority",
      ticketType: "ticketType",
      title: "title",
      description: "description",
      assigned: "assignedEmail",
    };
    return obj[name];
  }
  formSubmitHandler = () => {
    const devIndex = this.props.projUsers.findIndex(
      (curr) => curr.email === this.state.form.assigned.value
    );
    if (devIndex === -1) return null;

    const { form } = this.state;
    const ticketObj = {
      title: form.title.value,
      description: form.description.value,
      ticketPriority: form.ticketPriority.value,
      ticketType: form.ticketType.value,
      assigned: this.props.projUsers[devIndex].name,
      projName: this.props.match.params.name,
      assignedEmail: form.assigned.value.trim(),
      submitter: this.props.name,
      submitterEmail: this.props.email.trim(),
      status: form.ticketStatus.value,
      created: new Date().toString().split("G")[0],
      projid: this.props.match.params.id,
    };
    this.props.submitTicket(
      this.props.match.params.id,
      ticketObj,
      this.props.match.params.key
    );
    this.props.history.goBack();
  };
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
