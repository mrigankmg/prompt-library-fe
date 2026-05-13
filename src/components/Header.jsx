import { useNavigate } from "react-router-dom";
import { Home, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="text-gray-900 dark:text-gray-100 hover:opacity-70 hover:cursor-pointer transition text-xl"
              title="Home"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
            </button>
            <p className="text-gray-600 dark:text-gray-300">
              {user ? `Hi ${user.first_name || "User"}!` : "Welcome!"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => logout()}
                className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg font-medium transition hover:opacity-90 hover:cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg font-medium text-gray-900 dark:text-gray-100 transition hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg font-medium transition hover:opacity-90 hover:cursor-pointer"
                >
                  Register
                </button>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="bg-white dark:bg-gray-800 shadow-md p-3 rounded-lg transition-all hover:cursor-pointer"
              title="Toggle theme"
            >
              {isDark
                ? <Sun className="w-5 h-5 text-orange-400" aria-hidden="true" />
                : <Moon className="w-5 h-5 text-gray-700" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
