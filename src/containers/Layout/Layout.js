import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/auth";
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
        <Toolbar logout={this.props.logout} open={this.state.drawerOpen} />
        <SideNavigation
          open={this.state.drawerOpen}
          clickIcon={this.handleToggleSideDrawer}
        />
        <main className={styles.join(" ")}>{this.props.children}</main>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(actionCreators.authLogoutCreator()),
});

export default connect(null, mapDispatchToProps)(Layout);
