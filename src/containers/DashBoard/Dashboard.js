import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/Tickets";
import WithErrorHandle from "../../hoc/WithErrorHandle";
import axios from "../../axiosInstance/AxiosInstance";
import Spinner from "../../components/UI/Spinner/Spinner";
import Pie from "../../components/UI/Charts/PieChart";
import BarChart from "../../components/UI/Charts/BarChart/BarChart";
import classes from "./DashBoard.module.css";

class DashBoard extends Component {
  componentDidMount() {
    if (!this.props.tickets.length)
      this.props.fetchTickets(this.props.email, this.props.role);
  }

  createStat() {
    if (!this.props.tickets.length) return null;
    const ticketStat = {
      priority: {},
      status: {},
      type: {},
      projects: {},
    };
    const projLabels = {};
    const typeLabels = {};
    this.props.tickets.forEach((curr) => {
      const { status, ticketType, ticketPriority, projName } = curr;
      this.updateStat(ticketStat, "status", status);
      this.updateStat(ticketStat, "type", ticketType);
      this.updateStat(ticketStat, "priority", ticketPriority);
      this.updateStat(ticketStat, "projects", projName);
      typeLabels[curr.ticketType] = null;
      projLabels[curr.projName] = null;
    });
    return this.createCharts(ticketStat, typeLabels, projLabels);
  }

  updateStat(ticketStat, statLabel, labelType) {
    ticketStat[statLabel][labelType] = ticketStat[statLabel][labelType] || 0;
    ticketStat[statLabel][labelType] += 1;
  }
  createCharts(ticketStat, typeLabels, projLabels) {
    const priorityChart = this.createBarChart(
      ticketStat,
      ["None", "Low", "Medium", "High"],
      ["#8C0C01", "#D21100", "#FF1900", "#460501"],
      "priority"
    );
    const statusChart = this.createBarChart(
      ticketStat,
      ["Open", "In Progress", "Resolved", "Additional Info Required"],
      ["#00099C", "#000BC8", "#000664", "#00022E"],
      "status"
    );
    const typeChart = this.createPieChart(
      ticketStat,
      Object.keys(typeLabels),
      ["#89ABBC", "#E19100"],
      "type"
    );
    const projectChart = this.createPieChart(
      ticketStat,
      Object.keys(projLabels),
      ["red", "blue", "green", "purple"],
      "projects"
    );
    return {
      priority: priorityChart,
      status: statusChart,
      type: typeChart,
      proj: projectChart,
    };
  }
  createBarChart(ticketStat, labels, colors, type) {
    return labels.map((curr, index) => ({
      label: curr,
      color: colors[index],
      y: ticketStat[type][curr],
      x: index,
    }));
  }
  createPieChart(ticketStat, labels, colors, type) {
    let total = 0;
    return labels
      .map((curr, index) => {
        total += ticketStat[type][curr];
        return {
          name: curr,
          color: colors[index],
          y: ticketStat[type][curr],
        };
      })
      .map((curr) => ({ ...curr, y: (curr.y / total) * 100 }));
  }
  render() {
    const chart = this.createStat();
    if (this.props.role === "N/A")
      return <p style={{ fontWeight: 300 }}>No Role Assigned</p>;
    else if (this.props.error || this.props.tickets.length === 0)
      return <p style={{ fontWeight: 300 }}>No Tickets Found</p>;
    else
      return this.props.dispSpinner ? (
        <Spinner />
      ) : (
        <div className={classes.DashBoard}>
          <div>
            <BarChart data={chart ? chart.priority : []} title="Priority" />
            <BarChart data={chart ? chart.status : []} title="Status" />
          </div>
          <div>
            <Pie data={chart ? chart.type : []} title="Types" />
            <Pie data={chart ? chart.proj : []} title="Projects" />
          </div>
        </div>
      );
  }
}
const mapStateToProps = (state) => ({
  tickets: state.ticket.userTickets,
  email: state.auth.email,
  dispSpinner: state.ticket.dispSpinner,
  role: state.auth.role,
  error: state.ticket.error,
});
const mapDispatchToProps = (dispatch) => ({
  fetchTickets: (email, role) =>
    dispatch(actionCreators.fetchUserTicketsCreator(email, role)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(DashBoard, axios));
