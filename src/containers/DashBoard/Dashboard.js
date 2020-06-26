import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/Tickets";
import WithErrorHandle from "../../hoc/WithErrorHandle";
import Spinner from "../../components/UI/Spinner/Spinner";
import axios from "../../axiosInstance/AxiosInstance";
import Pie from "../../components/UI/Charts/PieChart";
import BarChart from "../../components/UI/Charts/BarChart/BarChart";
import classes from "./DashBoard.module.css";

class DashBoard extends Component {
  state = {
    typeChart: null,
  };
  componentDidMount() {
    this.props.fetchTickets();
    console.log("hello");
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
    this.props.tickets.forEach((curr) => {
      ticketStat["status"][curr.status] =
        ticketStat["status"][curr.status] || 0;
      ticketStat["status"][curr.status] += 1;

      ticketStat["type"][curr.ticketType] =
        ticketStat["type"][curr.ticketType] || 0;
      ticketStat["type"][curr.ticketType] += 1;

      ticketStat["priority"][curr.ticketPriority] =
        ticketStat["priority"][curr.ticketPriority] || 0;
      ticketStat["priority"][curr.ticketPriority] += 1;

      ticketStat["projects"][curr.projid] =
        ticketStat["projects"][curr.projid] || 0;
      ticketStat["projects"][curr.projid] += 1;
      projLabels[curr.projid] = null;
    });
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
      ["Bugs/Errors", "Feature Requests"],
      ["#89ABBC", "#E19100"],
      "type"
    );
    const projectChart = this.createPieChart(
      ticketStat,
      Object.keys(projLabels),
      ["red", "blue", "green", "purple"],
      "projects"
    );
    console.log(typeChart);
    console.log(statusChart);
    console.log(ticketStat);
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
    if (this.props.error || this.props.tickets.length === 0)
      return <p>No Tickets Found</p>;
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
  dispSpinner: state.ticket.dispSpinner,
  error: state.ticket.error,
});
const mapDispatchToProps = (dispatch) => ({
  fetchTickets: () => dispatch(actionCreators.fetchUserTicketsCreator()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandle(DashBoard, axios));
