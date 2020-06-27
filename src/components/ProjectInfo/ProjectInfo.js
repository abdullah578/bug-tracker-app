import React from "react";
import Modal from "../UI/Modal/Modal";
import classes from "./ProjectInfo.module.css";

const ProjectInfo = (props) => {
  return (
    <Modal header={<p>Details for Project </p>}>
      <div className={classes.Desc}>
        <div>
          <p className={classes.ParaHeader}>Project Name</p>
          <p>{props.name}</p>
        </div>
        <div>
          <p className={classes.ParaHeader}>Project Description</p>
          <p>{props.description}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectInfo;
