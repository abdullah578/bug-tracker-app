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
          text: "Bugs/Errors",
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
          dataPoints:
            this.props.type === "ticketType"
              ? [
                  { name: "Unsatisfied", y: 5, color: "blue" },
                  { name: "Very Unsatisfied", y: 31, color: "red" },
                  { name: "Very Satisfied", y: 40, color: "green" },
                  { name: "Satisfied", y: 17, color: "purple" },
                ]
              : [
                  { name: "Unsatisfied", y: 5, color: "#89ABBC" },
                  { name: "Very Unsatisfied", y: 31, color: "#E19100" },
                ],
        },
      ],
    };
    return (
      <div className={classes.PieChart}>
        <CanvasJSChart
          options={options}
          /* onRef={ref => this.chart = ref} */
        />
        <p>{this.props.title}</p>
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }
}
export default Pie;
