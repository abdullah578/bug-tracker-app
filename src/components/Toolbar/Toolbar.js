import React from "react";
import classes from "./Toolbar.module.css";

const Toolbar = (props) => {
  const styles = [classes.Content];
  props.open
    ? styles.push(classes.ContentOpen)
    : styles.push(classes.ContentClose);
  return (
    <div className={classes.Toolbar}>
      <div className={styles.join(" ")}>
        <span className={classes.UserInfo}>
          Logged in as <strong>{props.name}</strong>
        </span>

        <div className={classes.UserActions} onClick={props.logout}>
          <span className={classes.Logout}>Logout</span>
          <ion-icon name="person"></ion-icon>
        </div>
      </div>
    </div>
  );
};


export default Toolbar;


