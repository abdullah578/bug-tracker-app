import React, { Component } from "react";
import CanvasJSReact from "../../../assets/canvasjs.react";
import classes from "./PieChart.module.css";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class Pie extends Component {
  render() {
    const options = {
      animationEnabled: true,
      height: "250",
      backgroundColor: "#CDCBCD",
      subtitles: [
        {
          text: this.props.title,
          verticalAlign: "center",
          fontSize: 20,
          dockInsidePlotArea: true,
        },
      ],
      data: [
        {
          type: "doughnut",
          showInLegend: true,
          indexLabel: "{name}: {y}",
          yValueFormatString: "#,###'%'",
          dataPoints: this.props.data,
        },
      ],
    };
    return (
      <div className={classes.PieChart}>
        <CanvasJSChart
          options={options}
          /* onRef={ref => this.chart = ref} */
        />
        <p>Ticket By {this.props.title}</p>
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }
}
export default Pie;
