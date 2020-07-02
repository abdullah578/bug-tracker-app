import { Component } from "react";
import {
  checkValidation as validation,
  checkFormValidity as formValidation,
} from "../../Utilities/Utilities";

/*This component serves as a base for the projectList,
ticketList and userList components that inherit form it */

class Lists extends Component {
  state = { form: {}, newItem: false, currentPage: 1, deleteItem: {} };
  inputHandler = (e, type, arr, narr) => {
    let formCopy = { ...this.state.form };
    formCopy = {
      ...formCopy,
      [type]: {
        ...this.state.form[type],
        value: e.target.value,
        touch: true,
        isValid: this.checkValidation(
          e.target.value,
          this.state.form[type].validationRequirement,
          arr,
          narr
        ),
      },
    };
    this.setState({ form: formCopy });
  };
  formCancelHandler = () => {
    this.setState({ newItem: false });
    this.resetForm();
  };
  checkValidation = (inputVal, validationRequirement, inputArr, inputNarr) => {
    return validation(inputVal, validationRequirement, inputArr, inputNarr);
  };
  checkFormValidity = (form) => {
    return formValidation(form);
  };
  resetForm() {
    const formCopy = {
      ...this.state.form,
    };
    Object.keys(formCopy).forEach((curr) => {
      if (formCopy[curr].fieldType !== "select")
        formCopy[curr] = {
          ...formCopy[curr],
          value: "",
          isValid: false,
          touch: false,
        };
    });
    this.setState({ form: formCopy });
  }
  nextPage = () =>
    this.setState((prevState) => ({ currentPage: prevState.currentPage + 1 }));
  prevPage = () =>
    this.setState((prevState) => ({ currentPage: prevState.currentPage - 1 }));
  searchInputHandler = (e) => {
    this.setState({ currentPage: 1, search: e.target.value });
  };
  numPerPageInputHandler = (e) => {
    this.setState({ numPerPage: parseInt(e.target.value), currentPage: 1 });
  };
  addItemHandler = () => this.setState({ newItem: true });
}

export default Lists;
