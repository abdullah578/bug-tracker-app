import React from "react";
import Content from "../UI/Content/Content";
import Input from "../UI/Input/Input";
import BackDrop from "../UI/BackDrop/BackDrop";
import Button from "../UI/Button/Button";
import classes from "./NewItem.module.css";

const NewItem = (props) => {
  return (
    <React.Fragment>
      <BackDrop show={props.open} clicked={props.cancelForm} />
      <Content open={props.open}>
        <form onSubmit={(e) => e.preventDefault()}>
          {Object.keys(props.form).map((curr) => (
            <Input
              {...props.form[curr]}
              key={curr}
              inputHandler={(e) => props.inputHandler(e, curr, props.array,props.notArray)}
            />
          ))}
          <div className={classes.Buttons}>
            <Button
              type="Success"
              clicked={props.submitForm}
              disabled={props.disabled}
            >
              {" "}
              Continue
            </Button>
            <Button type="Danger" clicked={props.cancelForm}>
              {" "}
              Cancel
            </Button>
          </div>
        </form>
      </Content>
    </React.Fragment>
  );
};

export default NewItem;
