import React from "react";
import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      onClick={props.clicked}
      className={classes[props.type] + " " + classes["Button"]}
    >
      {props.children}
    </button>
  );
};

export default Button;
