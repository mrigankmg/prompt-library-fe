import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Login({ onLogin }) {
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isInFlight, setIsInFlight] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validation
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

    const data = new URLSearchParams();
    data.append("username", email);
    data.append("password", password);

    setIsInFlight(true);

    try {
      await login(data);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsInFlight(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className={`${theme.card} ${theme.shadow} rounded-lg p-8 w-full max-w-md`}
      >
        <h2 className={`text-3xl font-bold ${theme.text} mb-6 text-center`}>
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
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
                emailError ? "border-red-500" : theme.border
              } ${theme.card} ${theme.text} rounded-lg focus:ring-2 ${
                emailError ? "focus:ring-red-500" : "focus:ring-orange-500"
              } focus:border-transparent outline-none transition`}
            />
            {emailError && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
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
                passwordError ? "border-red-500" : theme.border
              } ${theme.card} ${theme.text} rounded-lg focus:ring-2 ${
                passwordError ? "focus:ring-red-500" : "focus:ring-orange-500"
              } focus:border-transparent outline-none transition`}
            />
            {passwordError && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full ${theme.buttonPrimary} text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 hover:cursor-pointer active:scale-95 mt-6`}
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className={`text-center mt-6 ${theme.textSecondary}`}>
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className={`${theme.accentText} hover:underline hover:cursor-pointer font-medium`}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
