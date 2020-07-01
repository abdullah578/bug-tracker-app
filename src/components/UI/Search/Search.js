import React from "react";
import classes from "./Search.module.css";

const Search = (props) => {
  return (
    <div className={classes.Input}>
      <div style={props.style}>
        Show{" "}
        <input
          type="number"
          name="num"
          min="1"
          onChange={props.inputNumHandler}
          value={props.numValue}
          className={classes.NumInput}
        />{" "}
        entries
      </div>
      <div>
        <label htmlFor="search" style={props.style}>
          Search
        </label>
        <input
          type="text"
          id="search"
          name="search"
          style={props.style}
          value={props.value}
          className={classes.SearchInput}
          onChange={props.inputSearchHandler}
        ></input>
      </div>
    </div>
  );
};

export default Search;
