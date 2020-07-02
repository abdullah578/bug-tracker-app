import React from "react";
import classes from "./Modal.module.css";

const Modal = (props) => {
  return (
    <div className={classes.Modal} style={props.modalStyle}>
      <header className={classes.Header}>{props.header}</header>
      <section className={classes.Section}>
        {props.search}
        <div className={classes.Content}>{props.children}</div>
      </section>
      <footer className={classes.Footer} style={props.footerStyle}>
        {props.footer}
      </footer>
    </div>
  );
};

export default Modal;
