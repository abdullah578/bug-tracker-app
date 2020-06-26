import React, { Component } from "react";
import Pie from "../../components/UI/Charts/PieChart";
import BarChart from "../../components/UI/Charts/BarChart/BarChart";
import classes from "./DashBoard.module.css";

class DashBoard extends Component {
  state = {};
  render() {
    return (
      <div className={classes.DashBoard}>
        <div>
          <BarChart type="red" title="Tickets By Priority" />
          <BarChart type="blue" title="Tickets By Status" />
        </div>
        <div>
          <Pie type="ticketType" title="Tickets By Type" />
          <Pie type="dev" title="Tickets By Type" />
        </div>
      </div>
    );
  }
}

export default DashBoard;
