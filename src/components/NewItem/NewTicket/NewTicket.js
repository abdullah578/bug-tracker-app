import React from "react";
import Modal from "../../UI/Modal/Modal";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
const NewTicket = (props) => {
  return (
    <Modal header={<p>Add Ticket</p>} hide={!props.open}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <div>
            {Object.keys(props.form)
              .slice(0, 3)
              .map((curr) => (
                <Input
                  {...props.form[curr]}
                  key={curr}
                  inputHandler={(e) => props.inputHandler(e, curr, props.array)}
                />
              ))}
          </div>
          <div>
            {Object.keys(props.form)
              .slice(0, 3)
              .map((curr) => (
                <Input
                  {...props.form[curr]}
                  key={curr}
                  inputHandler={(e) => props.inputHandler(e, curr, props.array)}
                />
              ))}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
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
    </Modal>
  );
};

export default NewTicket;
