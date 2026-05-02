import { Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import GuestRoute from "./components/GuestRoute";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import PromptLibrary from "./components/PromptLibrary";
import "./App.css";

export default function App() {
  const theme = useTheme();
  return (
    <div
      className={`min-h-screen ${theme.bgGradient} transition-colors duration-200`}
    >
      <Header />
      <div className="py-8 px-4">
        <Routes>
          <Route path="/" element={<PromptLibrary />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
