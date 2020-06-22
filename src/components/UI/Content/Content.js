import React from "react";
import classes from "./Content.module.css";

const Content = (props) => {
  const styles = [classes.Content];
  props.open
    ? styles.push(classes.ContentOpen)
    : styles.push(classes.ContentClose);
  return <div className={styles.join(" ")}>{props.children}</div>;
};

export default Content;
