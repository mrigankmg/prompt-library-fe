import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Register({ onRegister }) {
  const theme = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errors, setErrors] = useState({});

  const [isInFlight, setIsInFlight] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    const newErrors = {};

    // Validation
    if (!firstName.trim()) {
      newErrors.firstName = "Please enter your first name";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Please enter your last name";
    }
    if (!email.trim()) {
      newErrors.email = "Please enter your email";
    }
    if (!password.trim()) {
      newErrors.password = "Please enter a password";
    }
    if (!passwordConfirm.trim()) {
      newErrors.passwordConfirm = "Please confirm your password";
    }
    if (
      password.trim() &&
      passwordConfirm.trim() &&
      password !== passwordConfirm
    ) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsInFlight(true);

    try {
      await register(firstName, lastName, email, password);
      // navigate("/", { replace: true });
    } catch (error) {
      console.log(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsInFlight(false);
    }
  };

  const clearError = (field) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className={`${theme.card} ${theme.shadow} rounded-lg p-8 w-full max-w-md`}
      >
        <h2 className={`text-3xl font-bold ${theme.text} mb-6 text-center`}>
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                clearError("firstName");
              }}
              placeholder="Enter your first name"
              className={`w-full px-4 py-2 border ${
                errors.firstName ? "border-red-500" : theme.border
              } ${theme.card} ${theme.text} rounded-lg focus:ring-2 ${
                errors.firstName
                  ? "focus:ring-red-500"
                  : "focus:ring-orange-500"
              } focus:border-transparent outline-none transition`}
            />
            {errors.firstName && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                clearError("lastName");
              }}
              placeholder="Enter your last name"
              className={`w-full px-4 py-2 border ${
                errors.lastName ? "border-red-500" : theme.border
              } ${theme.card} ${theme.text} rounded-lg focus:ring-2 ${
                errors.lastName ? "focus:ring-red-500" : "focus:ring-orange-500"
              } focus:border-transparent outline-none transition`}
            />
            {errors.lastName && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.lastName}
              </p>
            )}
          </div>

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
                clearError("email");
              }}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : theme.border
              } ${theme.card} ${theme.text} rounded-lg focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-orange-500"
              } focus:border-transparent outline-none transition`}
            />
            {errors.email && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.email}
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
                clearError("password");
              }}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : theme.border
              } ${theme.card} ${theme.text} rounded-lg focus:ring-2 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-orange-500"
              } focus:border-transparent outline-none transition`}
            />
            {errors.password && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Password Confirmation */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                clearError("passwordConfirm");
              }}
              placeholder="Confirm your password"
              className={`w-full px-4 py-2 border ${
                errors.passwordConfirm ? "border-red-500" : theme.border
              } ${theme.card} ${theme.text} rounded-lg focus:ring-2 ${
                errors.passwordConfirm
                  ? "focus:ring-red-500"
                  : "focus:ring-orange-500"
              } focus:border-transparent outline-none transition`}
            />
            {errors.passwordConfirm && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.passwordConfirm}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full ${theme.buttonPrimary} text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 hover:cursor-pointer active:scale-95 mt-6`}
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className={`text-center mt-6 ${theme.textSecondary}`}>
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className={`${theme.accentText} hover:underline hover:cursor-pointer font-medium`}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
