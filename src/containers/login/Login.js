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
    this.props.authenticate(
      this.state.form.email.value,
      this.state.form.password.value,
      this.state.isSignUp,
      this.state.form.name.value
    );
  };
  switchSignUp = () =>
    this.setState((prevState) => ({ isSignUp: !prevState.isSignUp }));
  render() {
    return (
      <div className={classes.Login}>
        {this.props.error ? <p>{this.props.error}</p> : null}
        {Object.keys(this.state.form).map((curr) => (
          <Input
            {...this.state.form[curr]}
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
