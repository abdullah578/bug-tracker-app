import React, { Component } from "react";
import { connect } from "react-redux";
import ProjectInfo from "../../components/ProjectInfo/ProjectInfo";
import UserList from "../../containers/Lists/UserList/UserList";
import TicketList from "../../containers/Lists/TicketList/TicketList";
import classes from "./ProjectDetails.module.css";

class ProjectDetails extends Component {
  state = { name: "", desc: "" };
  componentDidMount() {
    const projIndex = this.props.projects.findIndex(
      (curr) => curr.key === this.props.match.params.id
    );
    if (projIndex === -1) return null;
    const project = this.props.projects[projIndex];
    this.setState({ name: project.name, description: project.description });
  }
  render() {
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
          />
          <TicketList
            {...this.props}
            remButton={true}
            tableStyle={{ fontSize: "55%", fontWeight: "bold" }}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  projects: state.project.projects,
});

export default connect(mapStateToProps, null)(ProjectDetails);
