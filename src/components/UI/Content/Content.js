import React from "react";
import classes from "./Content.module.css";
import CSSTransition from "react-transition-group/CSSTransition";

const Content = (props) => {
  return (
    <CSSTransition
      in={props.open}
      classNames={{
        enter:classes.ContentClose,
        enterActive: classes.ContentOpen,
        exitActive: classes.ContentClose,
      }}
      timeout={0.3}
      mountOnEnter
      unmountOnExit
    >
      <div className={classes.Content}>{props.children}</div>
    </CSSTransition>
  );
};

export default Content;
