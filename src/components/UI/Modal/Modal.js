import React from "react";
import classes from "./Modal.module.css";

const Modal = (props) => {
  return (
    <div className={classes.Modal}>
      <header className={classes.Header}>{props.header}</header>
      <section className={classes.Section}>{props.children}</section>
    </div>
  );
};

export default Modal;
