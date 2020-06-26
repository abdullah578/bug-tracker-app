import { Component } from "react";

class Lists extends Component {
  state = { form: {}, newItem: false, currentPage: 1, deleteItem: {} };
  inputHandler = (e, type, arr) => {
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
          arr
        ),
      },
    };
    this.setState({ form: formCopy });
  };
  formCancelHandler = () => {
    this.setState({ newItem: false });
    this.resetForm();
  };
  checkValidation = (inputVal, validationRequirement, inputArr) => {
    let isValid = true;
    if (!validationRequirement) return true;
    if (validationRequirement.isRequired)
      isValid = inputVal.trim().length > 0 && isValid;
    if (validationRequirement.isArrayPresent)
      isValid =
        isValid &&
        inputArr.findIndex((curr) => curr.email === inputVal.trim()) !== -1;
    return isValid;
  };
  checkFormValidity = (form) => {
    const formCopy = { ...form };
    let isValid = true;
    Object.keys(formCopy).forEach(
      (curr) => (isValid = formCopy[curr].isValid && isValid)
    );
    return isValid;
  };
  resetForm() {
    const formCopy = {
      ...this.state.form,
    };
    Object.keys(formCopy).forEach((curr) => {
      formCopy[curr] =
        curr.fieldType === "select"
          ? {
              ...formCopy[curr],
              value: "admin",
              isValid: true,
            }
          : {
              ...formCopy[curr],
              value: "",
              isValid: false,
              touch: false,
            };
    });
    this.setState({ form: formCopy });
  }
  removeItemCancel = () =>
    this.setState({ deleteItem: { key: null, continue: false } });

  clickItem = (key) => this.setState({ deleteItem: { key, continue: true } });
  nextPage = () =>
    this.setState((prevState) => ({ currentPage: prevState.currentPage + 1 }));
  prevPage = () =>
    this.setState((prevState) => ({ currentPage: prevState.currentPage - 1 }));
  addItemHandler = () => this.setState({ newItem: true });
}

export default Lists;
