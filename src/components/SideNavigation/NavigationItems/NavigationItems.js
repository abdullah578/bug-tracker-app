import React from "react";
import Navigationitem from "./NavigationItem/NavigationItem";
import classes from "./Navigationitems.module.css";

const Navigationitems = (props) => {
  return (
    <ul className={classes.NavList}>
      <Navigationitem itemName="Dashboard" iconName="grid-outline" path="/" />
      <Navigationitem
        itemName="Manage User Roles"
        iconName="man-outline"
        path="/users"
      />
      <Navigationitem
        itemName="Manage Project Users"
        iconName="people-outline"
        path="/projects_users"
      />
      <Navigationitem
        itemName="My Projects"
        iconName="layers-outline"
        path="/projects"
      />
      <Navigationitem
        itemName="My Tickets"
        iconName="bug-outline"
        path="/tickets"
      />
    </ul>
  );
};

export default Navigationitems;
