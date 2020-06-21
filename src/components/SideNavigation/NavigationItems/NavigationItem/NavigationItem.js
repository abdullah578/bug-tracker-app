import React from "react";
import classes from "./NavigationItem.module.css";

const NavigationItem = (props) => {
  return (
    <li className={classes.NavItem}>
      <ion-icon name={props.iconName}></ion-icon>
      <span> {props.itemName}</span>
    </li>
  );
};

export default NavigationItem;
