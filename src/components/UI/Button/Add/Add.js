import React from "react";
import classes from "./Add.module.css";

const Button = (props) => {
  return (
    <button onClick={props.clicked} className={classes.Button}>
      {props.children}
    </button>
  );
};

export default Button;
