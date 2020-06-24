import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/auth";
import Input from "../../components/UI/Input/Input";
import {
  formConfig,
  checkValidation,
  checkFormValidity,
} from "../../Utilities/Utilities";
import Button from "../../components/UI/Button/Add/Add";
import classes from "./Login.module.css";

class Login extends Component {
  state = {
    form: {
      name: formConfig(
        "Name",
        "Name ...",
        "name",
        "",
        "input",
        { isRequired: true },
        false,
        false
      ),
      email: formConfig(
        "Email",
        "Email ...",
        "email",
        "",
        "input",
        { isRequired: true },
        false,
        false
      ),
      password: formConfig(
        "Password",
        "Password ...",
        "password",
        "",
        "input",
        { isRequired: true },
        false,
        false
      ),
    },
    isSignUp: true,
  };
  constructor(props) {
    super(props);
    this.props.history.push("/");
  }
  inputHandler = (e, type) => {
    let formCopy = { ...this.state.form };
    formCopy = {
      ...formCopy,
      [type]: {
        ...this.state.form[type],
        value: e.target.value,
        touch: true,
        isValid: checkValidation(
          e.target.value,
          this.state.form[type].validationRequirement
        ),
      },
    };
    this.setState({ form: formCopy });
  };
  formSubmitHandler = () => {
    const name = this.state.isSignUp ? this.state.form.name.value : null;
    this.props.authenticate(
      this.state.form.email.value,
      this.state.form.password.value,
      this.state.isSignUp,
      name
    );
  };
  switchSignUp = () =>
    this.setState((prevState) => {
      let form;
      if (prevState.isSignUp)
        form = {
          email: prevState.form.email,
          password: prevState.form.password,
        };
      else {
        form = {
          ...this.state.form,
          name: formConfig(
            "Name",
            "Name ...",
            "name",
            "",
            "input",
            { isRequired: true },
            false,
            false
          ),
        };
      }
      return { isSignUp: !prevState.isSignUp, form };
    });
  render() {
    return (
      <div className={classes.Login}>
        {this.props.error ? <p>{this.props.error}</p> : null}
        {Object.keys(this.state.form).map((curr) => (
          <Input
            {...this.state.form[curr]}
            key={curr}
            inputHandler={(e) => this.inputHandler(e, curr)}
          />
        ))}
        <Button
          style={{ width: "100%" }}
          disabled={!checkFormValidity(this.state.form)}
          clicked={this.formSubmitHandler}
        >
          {this.state.isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        <button className={classes.Button} onClick={this.switchSignUp}>
          {this.state.isSignUp
            ? "Already have an account?"
            : "Create new account"}
        </button>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  error: state.auth.error,
});
const mapDispatchToProps = (dispatch) => ({
  authenticate: (email, password, isSignUp, name) =>
    dispatch(actions.authenticate(email, password, isSignUp, name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
