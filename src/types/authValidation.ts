interface VuelidateInterface {
  $invalid: boolean;
  $ending: boolean;
  $dirty: boolean;
  $touch: () => void;
}

export const getValidationClass = (form: any, fieldName: string) => {
  const field = form[fieldName];
  let error = false;
  if (field) {
    error = field.$invalid && !field.$ending && field.$dirty;
  }
  return {
    error,
  };
};

export const checkValidation = (form: VuelidateInterface) => {
  form.$touch();
  return form.$invalid;
};
