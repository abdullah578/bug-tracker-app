import React from 'react';
import Button from '../UI/Button/Add/Add'
import classes from './Comments.module.css';

const Comments = (props) => {
    return (  <div className={classes.Comments}>
        <p className={classes.CommentsPara}>Add a Comment ?</p>
        <div className={classes.CommentsInput}>
          <input></input>
          <Button
            style={{
              display: "inline-block",
              borderRadius: "0px",
              width: "20%",
            }}
          >
            Add
          </Button>
        </div>
        {props.children}
      </div> );
}
 
export default Comments;