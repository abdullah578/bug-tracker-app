import React from "react";
import classes from "./Add.module.css";

const Button = (props) => {
  console.log(props.disabled);
  return (
    <button
      onClick={props.clicked}
      className={classes.Button}
      disabled={props.disabled}
      style={props.style}
    >
      {props.children}
    </button>
  );
};

export default Button;
