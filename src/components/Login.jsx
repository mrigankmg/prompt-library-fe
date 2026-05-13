import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../validation/schemas";
import { submitButtonClass } from "../utils/styles";
import ErrorBanner from "./ErrorBanner";
import FormField from "./FormField";
import OAuthProviderButtons from "./OAuthProviderButtons";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ email, password }) => {
    setSubmitError(null);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Incorrect email or password.",
      );
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Login
        </h2>

        <ErrorBanner
          message={submitError}
          onDismiss={() => setSubmitError(null)}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={submitButtonClass}
          >
            Login
          </button>
        </form>

        <OAuthProviderButtons />

        <p className="text-center mt-6 text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-orange-600 dark:text-orange-400 hover:underline hover:cursor-pointer font-medium"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
