import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { registerSchema } from "../validation/schemas";
import ErrorBanner from "./ErrorBanner";
import FormField from "./FormField";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ firstName, lastName, email, password }) => {
    setSubmitError(null);
    try {
      await registerUser(firstName, lastName, email, password);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error.message);
      setSubmitError(
        error instanceof Error ? error.message : "Registration failed.",
      );
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Register
        </h2>

        <ErrorBanner
          message={submitError}
          onDismiss={() => setSubmitError(null)}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="First Name"
            registration={register("firstName")}
            error={errors.firstName}
            placeholder="Enter your first name"
          />
          <FormField
            label="Last Name"
            registration={register("lastName")}
            error={errors.lastName}
            placeholder="Enter your last name"
          />
          <FormField
            label="Email"
            type="email"
            registration={register("email")}
            error={errors.email}
            placeholder="Enter your email"
          />
          <FormField
            label="Password"
            type="password"
            registration={register("password")}
            error={errors.password}
            placeholder="Enter your password"
          />
          <FormField
            label="Confirm Password"
            type="password"
            registration={register("passwordConfirm")}
            error={errors.passwordConfirm}
            placeholder="Confirm your password"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 hover:cursor-pointer active:scale-95 mt-6 disabled:opacity-50"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-orange-600 dark:text-orange-400 hover:underline hover:cursor-pointer font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
