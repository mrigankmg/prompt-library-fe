import { Routes, Route } from "react-router-dom";
import GuestRoute from "./components/GuestRoute";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import PromptLibrary from "./components/PromptLibrary";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Header />
      <div className="flex-1 flex py-8 px-4">
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
