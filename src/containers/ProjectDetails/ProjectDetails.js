import React, { Component } from "react";
import { connect } from "react-redux";
import ProjectInfo from "../../components/ProjectInfo/ProjectInfo";
import UserList from "../../containers/Lists/UserList/UserList";
import TicketList from "../../containers/Lists/TicketList/TicketList";
import classes from "./ProjectDetails.module.css";

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
});

export default connect(mapStateToProps, null)(ProjectDetails);
