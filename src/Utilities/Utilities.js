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

export const checkValidation = (inputVal, validationRequirement) => {
  let isValid = true;
  if (validationRequirement.isRequired)
    isValid = inputVal.trim().length > 0 && isValid;
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
