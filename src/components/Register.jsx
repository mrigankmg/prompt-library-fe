import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
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

    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "Please enter your first name";
    if (!lastName.trim()) newErrors.lastName = "Please enter your last name";
    if (!email.trim()) newErrors.email = "Please enter your email";
    if (!password.trim()) newErrors.password = "Please enter a password";
    if (!passwordConfirm.trim())
      newErrors.passwordConfirm = "Please confirm your password";
    if (password.trim() && passwordConfirm.trim() && password !== passwordConfirm)
      newErrors.passwordConfirm = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsInFlight(true);

    try {
      await register(firstName, lastName, email, password);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error instanceof Error ? error.message : "Registration failed.");
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

  const inputClass = (field) =>
    `w-full px-4 py-2 border ${
      errors[field]
        ? "border-red-500"
        : "border-gray-300 dark:border-gray-700"
    } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 ${
      errors[field] ? "focus:ring-red-500" : "focus:ring-orange-500"
    } focus:border-transparent outline-none transition`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); clearError("firstName"); }}
              placeholder="Enter your first name"
              className={inputClass("firstName")}
            />
            {errors.firstName && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); clearError("lastName"); }}
              placeholder="Enter your last name"
              className={inputClass("lastName")}
            />
            {errors.lastName && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
              placeholder="Enter your email"
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
              placeholder="Enter your password"
              className={inputClass("password")}
            />
            {errors.password && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => { setPasswordConfirm(e.target.value); clearError("passwordConfirm"); }}
              placeholder="Confirm your password"
              className={inputClass("passwordConfirm")}
            />
            {errors.passwordConfirm && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.passwordConfirm}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isInFlight}
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
