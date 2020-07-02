import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axiosInstance/AxiosInstance";
import WithErrorHandle from "../../hoc/WithErrorHandle";
import ProjectInfo from "../../components/ProjectInfo/ProjectInfo";
import UserList from "../../containers/Lists/UserList/UserList";
import TicketList from "../../containers/Lists/TicketList/TicketList";
import classes from "./ProjectDetails.module.css";
/*This component renders the project name,decription
 and a list of users and tickets for the project */
class ProjectDetails extends Component {
  state = { name: "", desc: "" };
  componentDidMount() {
    const proj = this.props.projects.find(
      (curr) => curr.key === this.props.match.params.id
    );
    if (proj === null) return null;

    this.setState({ name: proj.name, description: proj.description });
  }
  render() {
    const searchStyle = {
      fontSize: "30%",
      fontWeight: "bold",
    };
    return (
      <div className={classes.Details}>
        <ProjectInfo
          name={this.state.name}
          description={this.state.description}
        />
        <div className={classes.Objects}>
          <UserList
            {...this.props}
            remButton={true}
            tableStyle={{ fontSize: "55%", fontWeight: "bold" }}
            searchStyle={searchStyle}
          />
          <TicketList
            {...this.props}
            remButton={true}
            tableStyle={{ fontSize: "55%", fontWeight: "bold" }}
            searchStyle={searchStyle}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  projects: state.project.projects,
  role: state.auth.role,
});

export default connect(
  mapStateToProps,
  null
)(WithErrorHandle(ProjectDetails, axios));
