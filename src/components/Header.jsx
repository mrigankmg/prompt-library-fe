import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const handler = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const goTo = (path) => {
    closeMenu();
    navigate(path);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  const authButtons = isAuthenticated ? (
    <button
      type="button"
      onClick={handleLogout}
      className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg font-medium transition hover:opacity-90 hover:cursor-pointer"
    >
      Logout
    </button>
  ) : (
    <>
      <button
        onClick={() => goTo("/login")}
        className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg font-medium text-gray-900 dark:text-gray-100 transition hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:cursor-pointer"
      >
        Login
      </button>
      <button
        onClick={() => goTo("/register")}
        className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg font-medium transition hover:opacity-90 hover:cursor-pointer"
      >
        Register
      </button>
    </>
  );

  const themeToggle = (
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
  );

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
            <p className="text-gray-600 dark:text-gray-300 truncate">
              {user ? `Hi ${user.first_name || "User"}!` : "Welcome!"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              {authButtons}
            </div>
            {themeToggle}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="sm:hidden relative z-[60] w-6 h-6 text-gray-900 dark:text-gray-100 hover:opacity-70 hover:cursor-pointer transition"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <Menu
                className={`absolute inset-0 w-6 h-6 transition-all duration-200 ${
                  menuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                }`}
                aria-hidden="true"
              />
              <X
                className={`absolute inset-0 w-6 h-6 transition-all duration-200 ${
                  menuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden">
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div
            className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 p-4 pt-16 flex flex-col gap-3"
            role="dialog"
            aria-label="Menu"
          >
            {authButtons}
          </div>
        </div>
      )}
    </header>
  );
}
