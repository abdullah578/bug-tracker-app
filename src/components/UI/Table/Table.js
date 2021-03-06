import React from "react";
import classes from "./Table.module.css";

const Table = (props) => {
  return (
    <table className={classes.Table} style={props.style}>
      <thead>{props.header}</thead>
      <tbody>{props.children}</tbody>
    </table>
  );
};

export default Table;
