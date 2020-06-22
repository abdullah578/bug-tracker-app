import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./NavigationItem.module.css";

const NavigationItem = (props) => {
  return (
    <li className={classes.NavItem}>
      <NavLink to={`${props.path}`} exact activeClassName={classes.active}>
        <ion-icon name={props.iconName}></ion-icon>
        <span> {props.itemName}</span>
      </NavLink>
    </li>
  );
};

export default NavigationItem;
