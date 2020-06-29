import React from "react";
import classes from "./Modal.module.css";

const Modal = (props) => {
  return props.err ? (
    <p style={{ fontWeight: "300", marginTop: "30px" }}>
      No {props.type} Found
    </p>
  ) : (
    <div className={classes.Modal} style={props.modalStyle}>
      <header className={classes.Header}>{props.header}</header>
      <section className={classes.Section}>
        {props.search}
        <div className={classes.Content}>{props.children}</div>
      </section>
      <footer className={classes.Footer}>{props.footer}</footer>
    </div>
  );
};

export default Modal;
