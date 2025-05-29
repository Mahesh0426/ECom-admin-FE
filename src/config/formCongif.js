export const LogInFormControls = [
  {
    name: "userEmail",
    label: "Email Address",
    type: "email",
    placeholder: "Enter  your email address",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter  your password",
    autComplete: "current-password",
  },
];

//initial login form
export const initialLoginFormData = {
  userEmail: "",
  password: "",
};
//This is for forgot password
export const ForgotPasswordFormControls = [
  {
    name: "userEmail",
    label: "Email Address",
    type: "email",
    placeholder: "Enter  your email address",
    autoComplete: "email",
  },
];

//Initial forgot password form
export const initialForgotPasswordFormData = {
  userEmail: "",
};
//This is for reset password
export const ResetPasswordFormControls = [
  {
    name: "newPassword",
    label: "New Password",
    type: "password",
    placeholder: "Enter your new password",
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your new password",
    autoComplete: "new-password",
  },
];

//Reset password form
export const resetPasswordFormData = {
  newPassword: "",
  confirmPassword: "",
};
