import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import useForm from "../../hooks/useForm";
import useLoading from "../../hooks/useLoading";
import { useEffect, useState } from "react";
import {
  initialLoginFormData,
  LogInFormControls,
} from "../../config/formCongif";
import FormControl from "../common-Input/FormControl";
import { toast } from "react-toastify";
import { autoLoginAction, getUserAction } from "../../redux/user/userAction";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../helper/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../axios/userAxios";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { formData, handleOnChange, setFormData } =
    useForm(initialLoginFormData); //useform from custom hook
  const { isLoading, startLoading, stopLoading } = useLoading(); //loading from custom hook
  const [showPassword, setShowPassword] = useState(false); //state

  // Function to handle form submission
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    startLoading();

    try {
      //api call
      const response = await loginUser(formData);

      //destructure response
      const { payload, message, status } = response;

      // Check if the response is successful
      if (status !== "success" || !payload) {
        toast.error(message || "Invalid response from server.");
        return;
      }

      // Destructure accessJWT and refreshJWT from payload
      const { accessJWT, refreshJWT } = payload;

      // Store tokens
      sessionStorage.setItem("accessJWT", accessJWT);
      localStorage.setItem("refreshJWT", refreshJWT);

      // Dispatch user fetch
      dispatch(getUserAction());

      toast.success(response?.message || "Login successful!");
      setFormData(initialLoginFormData);
    } catch (error) {
      console.error("Login failed.", error);
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      stopLoading();
    }
  };

  // Logic to handle what should happen if a user is logged in
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    // if user exists [logged in], navigate to homepage
    if (user?._id) {
      navigate("/admin/dashboard");
    }

    // if no tokens, keep them in login page
    if (
      !sessionStorage.getItem("accessJWT") &&
      !localStorage.getItem("refreshJWT")
    ) {
      return;
    }
    // if not try auto login
    if (!user?._id) {
      dispatch(autoLoginAction());
    }
  }, [user?._id, navigate, dispatch]);

  return (
    <div className="flex flex-col justify-center px-10 md:px-20 h-[84vh] bg-white/10 backdrop-blur-md border border-white/30 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="space-y-6 max-w-md mx-auto w-full">
        <div>
          <h2 className="text-2xl font-bold">Welcome back!</h2>
          <p className="text-sm text-muted-foreground">
            Enter your Credentials to access your account
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleOnSubmit} className="space-y-4" autoComplete="on">
          {LogInFormControls.map((field, index) => (
            <div key={index}>
              {field.name === "password" ? (
                <div className="relative">
                  <Label
                    className=" block font-bold mb-2  "
                    htmlFor={field.name}
                  >
                    {field.label}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleOnChange}
                      placeholder={field.placeholder}
                      required
                      id={field.name}
                      autoComplete="current-password"
                      className=" dark:text-white mb-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-600 focus-visible:z-10 sm:text-sm/6"
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <FormControl
                  label={field.label}
                  handleOnChange={handleOnChange}
                  inputAttributes={{
                    type: field.type,
                    name: field.name,
                    value: formData[field.name],
                    placeholder: field.placeholder,
                    autoComplete: field.autoComplete,
                    required: true,
                    id: field.name,
                  }}
                />
              )}
            </div>
          ))}

          {/* Login button */}
          <div className="mt-6">
            <Button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-900"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : "Login"}
            </Button>
          </div>
        </form>
        <p>
          Credentials:
          <br />
          Email:physmarika@gmail.com
          <br />
          Password: Gaighat123@
        </p>

        {/* Forgot password */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Forgot password?
          <Link
            to="/forget-password"
            className="ml-1 text-sm text-blue-600 hover:underline"
          >
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
