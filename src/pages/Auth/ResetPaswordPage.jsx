import React from "react";
import { assets } from "../../assets/asset";
import ResetPasswordForm from "../../components/log-in/ResetPasswordform";
const ResetPassword = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left section (form) */}
      <ResetPasswordForm />

      {/* Right section (image) */}
      <div className="hidden md:block relative h-screen">
        <img
          src={assets.resetPasswordImage}
          alt="Clothes Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ResetPassword;
