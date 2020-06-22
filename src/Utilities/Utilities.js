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
