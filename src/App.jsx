// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SendLink from "./pages/SendLink";
import CompleteSignup from "./pages/CompleteSignup";
import CompleteProfile from "./pages/CompleteProfile";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"; // ✅ Add this line

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SendLink />} />
        <Route path="/complete-signup" element={<CompleteSignup />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
