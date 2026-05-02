import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { THEME } from "../constants/constants";

export default function Header() {
  const theme = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      className={`${theme.card} ${theme.border} border-b ${theme.shadow}`}
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Home button and greeting */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className={`${theme.text} hover:opacity-70 hover:cursor-pointer transition text-xl`}
              title="Home"
            >
              🏠
            </button>
            <p className={theme.textMuted}>
              {user ? `Hi ${user.first_name || "User"}!` : "Welcome!"}
            </p>
          </div>

          {/* Auth buttons and theme toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => logout()}
                className={`${theme.accentBg} ${theme.accentText} px-4 py-2 rounded-lg font-medium transition hover:opacity-90 hover:cursor-pointer`}
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className={`${theme.border} border px-4 py-2 rounded-lg font-medium ${theme.text} transition hover:${theme.accentBg} hover:cursor-pointer`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className={`${theme.accentBg} ${theme.accentText} px-4 py-2 rounded-lg font-medium transition hover:opacity-90 hover:cursor-pointer`}
                >
                  Register
                </button>
              </>
            )}
            <button
              onClick={theme.toggleTheme}
              className={`${theme.card} ${theme.shadow} p-3 rounded-lg transition-all hover:cursor-pointer`}
              title="Toggle theme"
            >
              {theme.theme === THEME.LIGHT ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
