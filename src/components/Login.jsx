import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isInFlight, setIsInFlight] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    let hasError = false;
    if (!email.trim()) {
      setEmailError("Please enter your email");
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError("Please enter your password");
      hasError = true;
    }

    if (hasError) return;

    setIsInFlight(true);

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsInFlight(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border ${
                emailError
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 ${
                emailError ? "focus:ring-red-500" : "focus:ring-orange-500"
              } focus:border-transparent outline-none transition`}
            />
            {emailError && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border ${
                passwordError
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 ${
                passwordError ? "focus:ring-red-500" : "focus:ring-orange-500"
              } focus:border-transparent outline-none transition`}
            />
            {passwordError && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isInFlight}
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
