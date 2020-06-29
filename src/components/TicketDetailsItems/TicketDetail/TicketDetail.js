import React from "react";
import classes from "./TicketDetail.module.css"

const TicketDetail = (props) => {
  return (
    <div className={classes.DetailDiv}>
      <div>
        <p>
          <strong>{props.titleArr[0]}</strong>
        </p>
        <p className={classes.Value}> {props.details[props.titleArr[0]]}</p>
      </div>
      <div>
        <p>
          <strong>{props.titleArr[1]}</strong>
        </p>
        <p className={classes.Value}> {props.details[props.titleArr[1]]}</p>
      </div>
    </div>
  );
};

export default TicketDetail;
