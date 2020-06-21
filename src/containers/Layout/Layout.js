import React, { Component } from "react";
import Toolbar from "../../components/Toolbar/Toolbar";
import SideNavigation from "../../components/SideNavigation/SideNavigation";

class Layout extends Component {
  state = { drawerOpen: true };
  handleToggleSideDrawer = () =>
    this.setState((prevState) => ({
      drawerOpen: !prevState.drawerOpen,
    }));
  render() {
    return (
      <React.Fragment>
        <Toolbar />
        <SideNavigation
          open={this.state.drawerOpen}
          clickIcon={this.handleToggleSideDrawer}
        />
        <main>{this.props.chidren}</main>
      </React.Fragment>
    );
  }
}

export default Layout;
