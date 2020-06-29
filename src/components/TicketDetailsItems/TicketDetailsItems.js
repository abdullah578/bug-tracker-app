import React from "react";
import TicketDetail from "./TicketDetail/TicketDetail";

const Details = (props) => {
  const detailsArr = Object.keys(props.details);
  if(!detailsArr.length) return null;
  return (
    <React.Fragment>
      <TicketDetail titleArr={detailsArr.slice(0, 2)} details={props.details} />
      <TicketDetail titleArr={detailsArr.slice(2, 4)} details={props.details} />
      <TicketDetail titleArr={detailsArr.slice(4, 6)} details={props.details} />
      <TicketDetail titleArr={detailsArr.slice(6, 8)} details={props.details} />
    </React.Fragment>
  );
};

export default Details;
