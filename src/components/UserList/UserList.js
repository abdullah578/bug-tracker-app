import React from "react";
import classes from "./UserList.module.css";

const UserList = (props) => {
  console.log(props.all);
  return (
    <div className={classes.ListContainer}>
      <p>Select a User </p>
      <ul className={classes.UserList}>
        {props.all.map((curr) => (
          <li
            style={
              props.selected === curr.key
                ? { backgroundColor: "#00abd9" }
                : null
            }
            key={curr.key}
            onClick={() => props.select(curr.key)}
          >
            {curr.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
