export const validateSignup = (
  values
) => {
  const errors = {};

  if (!values.firstName)
    errors.firstName =
      "First Name Required";

  if (!values.email)
    errors.email =
      "Email Required";

  if (
    !/\S+@\S+\.\S+/.test(
      values.email
    )
  )
    errors.email =
      "Invalid Email";

  if (
    values.password.length < 6
  )
    errors.password =
      "Minimum 6 characters";

  return errors;
};

export const validateLogin = (
  values
) => {
  const errors = {};

  if (!values.email)
    errors.email =
      "Email Required";

  if (!values.password)
    errors.password =
      "Password Required";

  return errors;
};