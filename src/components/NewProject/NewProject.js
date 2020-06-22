import React from "react";
import Content from "../UI/Content/Content";
import Input from "../UI/Input/Input";
import BackDrop from "../UI/BackDrop/BackDrop";

const NewProject = (props) => (
  <React.Fragment>
    <BackDrop show={props.open} clicked={props.cancelForm} />
    <Content open={props.open}>
      <form onSubmit={(e) => e.preventDefault()}>
        {Object.keys(props.form).map((curr) => (
          <Input
            {...props.form[curr]}
            key={curr}
            inputHandler={(e) => props.inputHandler(e, curr)}
          />
        ))}
      </form>
    </Content>
  </React.Fragment>
);

export default NewProject;
