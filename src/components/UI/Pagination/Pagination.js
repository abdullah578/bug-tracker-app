import React from "react";
import classes from "./Pagination.module.css";

const Pagination = (props) => {
  const numPages = Math.ceil(props.items / props.numPerPage);
  const lastPageEntries = props.items - (numPages - 1) * props.currPage;

  return (
    <div className={classes.Pagination}>
      <p>{`Showing 1 to ${
        props.currPage === numPages ? lastPageEntries : props.numPerPage
      } of ${props.items} entries`}</p>
      <div>
        <button disabled={props.currPage === 1} onClick={props.prev}>
          {" "}
          Previous
        </button>
        <span>{props.currPage}</span>
        <button
          disabled={props.currPage === numPages || numPages === 0}
          onClick={props.next}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
