import React from "react";

import Navigationitem from "./NavigationItem/NavigationItem";
import classes from "./Navigationitems.module.css";

const Navigationitems = (props) => {
  return (
    <ul className={classes.NavList}>
      <Navigationitem itemName="Dashboard" iconName="grid-outline" path="/" />
      {props.role === "Admin" ? (
        <Navigationitem
          itemName="Manage User Roles"
          iconName="man-outline"
          path="/users"
        />
      ) : null}
      {props.role !== "N/A" ? (
        <Navigationitem
          itemName="My Projects"
          iconName="layers-outline"
          path="/projects"
        />
      ) : null}
      {props.role !== "N/A" ? (
        <Navigationitem
          itemName="My Tickets"
          iconName="bug-outline"
          path="/tickets"
        />
      ) : null}
    </ul>
  );
};

export default Navigationitems;
