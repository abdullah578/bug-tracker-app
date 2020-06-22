import React from "react";
import classes from "./Input.module.css";

const Input = (props) => {
  const styles = [classes.Input];
  if (!props.isValid && props.touch) styles.push(classes.InputInvalid);
  const field =
    props.fieldType === "textArea" ? (
      <textarea
        {...props.elementConfig}
        value={props.value}
        onChange={props.inputHandler}
        id={props.name}
        className={styles.join(" ")}
      />
    ) : (
      <input
        {...props.elementConfig}
        value={props.value}
        onChange={props.inputHandler}
        id={props.elementConfig.name}
        className={styles.join(" ")}
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
