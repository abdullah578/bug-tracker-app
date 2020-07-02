import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/auth";
import Toolbar from "../../components/Toolbar/Toolbar";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import classes from "./Layout.module.css";


/*This component consists of a toolbar and a collpsable side navigation 
Every page in the application has this component */
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
        <Toolbar logout={this.props.logout} open={this.state.drawerOpen} name={this.props.name}/>
        <SideNavigation
          open={this.state.drawerOpen}
          clickIcon={this.handleToggleSideDrawer}
          role={this.props.role}
        />
        <main className={styles.join(" ")}>{this.props.children}</main>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  name: state.auth.name,
  role: state.auth.role,
});
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(actionCreators.authLogoutCreator()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
