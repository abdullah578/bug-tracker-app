import React from "react";
import classes from "./Table.module.css";

const Table = (props) => {
  return (
    <table className={classes.Table}>
      <tr>
        <th>Project Name</th>
        <th>Description</th>
        <th>&nsbp;</th>
      </tr>
      <tr>
        <td>Demo project 1</td>
        <td>This is project number 1</td>
        <td>&nsbp;</td>
      </tr>
      <tr>
        <td>Demo project 1</td>
        <td>This is project number 1</td>
        <td>&nsbp;</td>
      </tr>
      <tr>
        <td>Demo project 1</td>
        <td>This is project number 1</td>
        <td>&nsbp;</td>
      </tr>
      <tr>
        <td>Demo project 1</td>
        <td>This is project number 1</td>
        <td>&nsbp;</td>
      </tr>
      <tr>
        <td>Demo project 1</td>
        <td>This is project number 1</td>
        <td>&nsbp;</td>
      </tr>
      <tr>
        <td>Demo project 1</td>
        <td>This is project number 1</td>
        <td>&nsbp;</td>
      </tr>
    </table>
  );
};

export default Table;
