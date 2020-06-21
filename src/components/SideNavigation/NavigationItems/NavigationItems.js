import React from "react";
import Navigationitem from "./NavigationItem/NavigationItem";
import classes from "./Navigationitems.module.css";

const Navigationitems = (props) => {
  return (
    <ul className={classes.NavList}>
      <Navigationitem itemName="Dashboard" iconName="grid-outline" />
      <Navigationitem itemName="Manage User Roles" iconName="man-outline" />
      <Navigationitem itemName="Manage Project" iconName="people-outline" />
      <Navigationitem itemName="My Projects" iconName="layers-outline" />
      <Navigationitem itemName="My Tickets" iconName="bug-outline" />
    </ul>
  );
};

export default Navigationitems;
