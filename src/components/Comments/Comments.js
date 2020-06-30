import React from "react";
import Button from "../UI/Button/Add/Add";
import classes from "./Comments.module.css";

const Comments = (props) => {
  return (
    <div className={classes.Comments}>
      <p className={classes.CommentsPara}>Add a Comment ?</p>
      <div className={classes.CommentsInput}>
        <input
          type="text"
          name="comment"
          value={props.value}
          onChange={props.onInputChange}
        />
        <Button
          style={{
            display: "inline-block",
            borderRadius: "0px",
            width: "20%",
          }}
          clicked={props.submit}
          disabled={props.buttonDisabled}
        >
          Add
        </Button>
      </div>
      {props.children}
    </div>
  );
};

export default Comments;
