import React from "react";
import classes from "./Input.module.css";

const Input = (props) => {
  const field =
    props.type === "textArea" ? (
      <textarea
        {...props.elementConfig}
        value={props.value}
        onChange={props.inputHandler}
        id={props.name}
        className={classes.Input}
      />
    ) : (
      <input
        {...props.elementConfig}
        value={props.value}
        onChange={props.inputHandler}
        id={props.elementConfig.name}
        className={classes.Input}
      />
    );
  return (
    <React.Fragment>
      <label htmlFor={props.elementConfig.name} className={classes.Label}>
        {props.elementConfig.name}
      </label>
      {field}
    </React.Fragment>
  );
};

export default Input;
