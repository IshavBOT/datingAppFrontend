import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SendLink from "./pages/SendLink";
import CompleteSignup from "./pages/CompleteSignup";
import CompleteProfile from "./pages/CompleteProfile";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SwipePage from "./pages/SwipeCard";
import EditProfile from "./pages/EditProfile"; // ✅ NEW: Edit Profile route

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SendLink />} />
        <Route path="/complete-signup" element={<CompleteSignup />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/swipe" element={<SwipePage />} />
        <Route path="/edit-profile" element={<EditProfile />} /> {/* ✅ NEW */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
