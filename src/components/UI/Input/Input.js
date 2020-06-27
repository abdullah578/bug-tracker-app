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
        style={props.inputStyle}
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
          style={props.inputStyle}
          className={styles.join(" ")}
        />
      ) : (
        <input
          {...props.elementConfig}
          value={props.value}
          onChange={props.inputHandler}
          id={props.elementConfig.name}
          style={props.inputStyle}
          className={styles.join(" ")}
        />
      );
    name = props.elementConfig.name;
  }
  return (
    <div style={props.containerStyle}>
      <label htmlFor={name} className={classes.Label} style={props.labelStyle}>
        {name}
      </label>
      {field}
    </div>
  );
};

export default Input;
