import React from "react";
import classes from "./Toolbar.module.css";

const Toolbar = (props) => {
  const styles = [classes.UserInfo];
  props.open
    ? styles.push(classes.UserInfoOpen)
    : styles.push(classes.UserInfoClose);
  return (
    <div className={classes.Toolbar}>
      <span className={styles.join(" ")}>
        Logged in as <strong>Abdullah</strong>
      </span>
      <div className={classes.UserActions} onClick={props.logout}>
        <span className={classes.Logout}>Logout</span>
        <ion-icon name="person"></ion-icon>
      </div>
    </div>
  );
};

export default Toolbar;
