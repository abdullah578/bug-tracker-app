import React from "react";
import classes from "./Modal.module.css";

const Modal = (props) => {
  return props.err ? (
    <p style={{ fontWeight: "300", marginTop: "30px" }}>
      No {props.type} Found
    </p>
  ) : (
    <div className={classes.Modal}>
      <header className={classes.Header}>{props.header}</header>
      <section className={classes.Section}>{props.children}</section>
      <footer className={classes.Footer}>{props.footer}</footer>
    </div>
  );
};

export default Modal;
