import React from "react";
import classes from "./Input.module.css";

const Input = (props) => {
  const styles = [classes.Input];
  if (!props.isValid && props.touch) styles.push(classes.InputInvalid);
  let field, name;
  if (props.fieldType === "select") {
    field = (
      <select
        value={props.value}
        onChange={props.inputHandler}
        id={props.name}
        className={classes.Input}
      >
        {props.elementConfig.map((curr) => (
          <option key={curr.value} value={curr.value}>
            {curr.value}
          </option>
        ))}
      </select>
    );
    name = props.name;
  } else {
    field =
      props.fieldType === "textArea" ? (
        <textarea
          {...props.elementConfig}
          value={props.value}
          onChange={props.inputHandler}
          id={props.elementConfig.name}
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
    name = props.elementConfig.name;
  }
  return (
    <React.Fragment>
      <label htmlFor={name} className={classes.Label}>
        {name}
      </label>
      {field}
    </React.Fragment>
  );
};

export default Input;
