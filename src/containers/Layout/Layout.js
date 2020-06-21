import React, { Component } from "react";
import Toolbar from "../../components/Toolbar/Toolbar";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import classes from "./Layout.module.css";

class Layout extends Component {
  state = { drawerOpen: true };
  handleToggleSideDrawer = () =>
    this.setState((prevState) => ({
      drawerOpen: !prevState.drawerOpen,
    }));
  render() {
    const styles = [classes.Content];
    styles.push(
      this.state.drawerOpen ? classes.ContentOpen : classes.ContentClose
    );
    return (
      <React.Fragment>
        <Toolbar />
        <SideNavigation
          open={this.state.drawerOpen}
          clickIcon={this.handleToggleSideDrawer}
        />
        <main
          className={
            styles.join(" ")
          }
        >
          {this.props.children}
        </main>
      </React.Fragment>
    );
  }
}

export default Layout;
