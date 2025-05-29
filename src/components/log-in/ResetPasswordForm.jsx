import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ResetPasswordFormControls,
  resetPasswordFormData,
} from "../../config/formCongif";
import useForm from "../../hooks/useForm";
import useLoading from "../../hooks/useLoading";

const ResetPasswordForm = () => {
  // useForm from custom hook
  const { formData, handleOnChange } = useForm(resetPasswordFormData);

  // loading from custom hook
  const { isLoading, startLoading, stopLoading } = useLoading();

  // Independent password visibility states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // handle form submit
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    try {
      // Example API call simulation
      alert("Password reset successful");
      // Reset fields if needed here
    } catch (error) {
      console.error("Reset Password failed:", error);
      toast.error("Reset Password failed. Please try again.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex flex-col justify-center px-10 md:px-20">
      <div className="space-y-6 max-w-md mx-auto w-full">
        <div>
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter your new password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleOnSubmit} className="space-y-4" autoComplete="on">
          {ResetPasswordFormControls.map((field, index) => {
            const isNewPassword = field.name === "newPassword";
            const isConfirmPassword = field.name === "confirmPassword";
            const showPassword = isNewPassword
              ? showNewPassword
              : isConfirmPassword
              ? showConfirmPassword
              : false;

            const toggleShowPassword = () => {
              if (isNewPassword) {
                setShowNewPassword((prev) => !prev); // prev here is the previous state, which is used to toggle the visibility
              } else if (isConfirmPassword) {
                setShowConfirmPassword((prev) => !prev);
              }
            };

            return (
              <div key={index} className="relative">
                <Label htmlFor={field.name}>{field.label}</Label>
                <div className="relative">
                  <Input
                    type={
                      (isNewPassword || isConfirmPassword) && showPassword
                        ? "text"
                        : "password"
                    }
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleOnChange}
                    placeholder={field.placeholder}
                    required
                    id={field.name}
                    className="pr-10"
                    autoComplete="current-password"
                  />
                  {(isNewPassword || isConfirmPassword) && (
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent cursor-pointer"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Reset Password button */}
          <div className="mt-6">
            <Button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-900"
              disabled={isLoading}
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
