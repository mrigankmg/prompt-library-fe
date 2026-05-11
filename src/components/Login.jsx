import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../validation/schemas";
import { inputClass } from "../utils/styles";
import ErrorBanner from "./ErrorBanner";

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Login
        </h2>

        <ErrorBanner
          message={submitError}
          onDismiss={() => setSubmitError(null)}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className={inputClass(errors.email)}
            />
            {errors.email && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className={inputClass(errors.password)}
            />
            {errors.password && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 hover:cursor-pointer active:scale-95 mt-6 disabled:opacity-50"
          >
            Login
          </button>
        </form>

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
