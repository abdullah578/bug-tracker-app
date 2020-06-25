import React from "react";
import BackDrop from "../UI/BackDrop/BackDrop";
import Content from "../UI/Content/Content";
import Button from "../UI/Button/Button";

const DeleteItem = (props) => {
  return (
    <React.Fragment>
      <BackDrop show={props.show} clicked={props.removeItemCancel} />
      <Content open={props.show}>
        <p>Are you sure you want to delete the {props.type}</p>
        <Button clicked={props.removeItemContinue} type="Success">
          Yes
        </Button>
        <Button clicked={props.removeItemCancel} type="Danger">
          No
        </Button>
      </Content>
    </React.Fragment>
  );
};

export default DeleteItem;
