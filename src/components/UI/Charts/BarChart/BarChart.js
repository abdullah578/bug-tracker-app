import React, { Component } from "react";
import CanvasJSReact from "../../../../assets/canvasjs.react";
import classes from "./BarChart.module.css";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class BarChart extends Component {
  render() {
    const options = {
      backgroundColor: "#CDCBCD",
      height: "250",
      axisY: {
        gridThickness: 0,
        lineThickness: 0,
        stripLines: [
          {
            value: 0,
            showOnTop: true,
            color: "white",
            thickness: 0,
          },
        ],
      },
      axisX: {
        lineThickness: 0,
      },
      data: [
        {
          // Change type to "doughnut", "line", "splineArea", etc.
          type: "column",
          dataPoints: [
            {
              label: "Apple",
              y: 10,
              color: this.props.type === "red" ? "#8C0C01" : "#00099C",
            },
            {
              label: "Orange",
              y: 15,
              color: this.props.type === "red" ? "#D21100" : "#000BC8",
            },
            {
              label: "Banana",
              y: 25,
              color: this.props.type === "red" ? "#FF1900" : "#000664",
            },
            {
              label: "Mango",
              y: 30,
              color: this.props.type === "red" ? "#460501" : "#00022E",
            },
          ],
        },
      ],
    };
    return (
      <div className={classes.BarChart}>
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

export default BarChart;
