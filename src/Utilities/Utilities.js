export const formConfig = (
  name,
  placeholder,
  type,
  value,
  fieldType,
  validationRequirement,
  isValid,
  touch
) => ({
  elementConfig: {
    name,
    placeholder,
    type,
  },
  value,
  fieldType,
  validationRequirement,
  isValid,
  touch,
});
export const createDateString = (date) => date.toString().split("G")[0];
export const mapResponseToName = (property) => {
  const obj = {
    title: "Ticket Title",
    description: "Ticket Description",
    assigned: "Assigned Developer",
    assignedEmail: "Assigned Developer",
    submitter: "Submitter",
    ticketPriority: "Ticket Priority",
    status: "Ticket Status",
    ticketType: "Ticket Type",
    created: "Created",
  };
  return obj[property];
};
export const checkValidation = (inputVal, validationRequirement, inputArr) => {
  let isValid = true;
  if (validationRequirement.isRequired)
    isValid = inputVal.trim().length > 0 && isValid;
  if (validationRequirement.isArrayPresent)
    isValid =
      isValid &&
      inputArr.findIndex((curr) => curr.email === inputVal.trim()) !== -1;
  return isValid;
};
export const checkFormValidity = (form) => {
  const formCopy = { ...form };
  let isValid = true;
  Object.keys(formCopy).forEach(
    (curr) => (isValid = formCopy[curr].isValid && isValid)
  );
  return isValid;
};
