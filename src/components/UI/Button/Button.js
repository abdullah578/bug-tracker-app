import React from "react";
import classes from "./Button.module.css";

const Button = (props) => {
  const styles = [classes[props.type], classes["Button"]];
  if (props.disabled) styles.push(classes.Disabled);
  return (
    <button
      onClick={props.clicked}
      className={styles.join(" ")}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
