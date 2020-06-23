import React from "react";
import NavigationItems from "./NavigationItems/NavigationItems";
import classes from "./SideNavigation.module.css";
const SideNavigation = (props) => {
  const styles = [classes.SideNav];
  styles.push(props.open ? classes.SideNavOpen : classes.SideNavClose);
  return (
    <div className={styles.join(" ")}>
      <div className={classes.ToggleNav} onClick={props.clickIcon}>
        <ion-icon
          name={`chevron-${props.open ? "back" : "forward"}-outline`}
        ></ion-icon>
      </div>
      <nav className={classes.Items}>
        <NavigationItems />
      </nav>
    </div>
  );
};

export default SideNavigation;
