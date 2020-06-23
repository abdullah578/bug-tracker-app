import React from "react";
import classes from "./UserList.module.css";

const UserList = (props) => {
  return (
    <div className={classes.ListContainer}>
      <p>Select a User </p>
      <ul className={classes.UserList}>
        <li>Abdullah Mohammed</li>
        <li>Abdullah Mohammed</li>
        <li>Abdullah Mohammed</li>
        <li>Abdullah Mohammed</li>
        <li>Abdullah Mohammed</li>
        <li>Abdullah Mohammed</li>
      </ul>
    </div>
  );
};

export default UserList;
