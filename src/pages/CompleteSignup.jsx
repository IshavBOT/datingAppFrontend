// src/pages/CompleteSignup.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CompleteSignup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("emailForSignIn");
    if (!storedEmail) {
      alert("Email not found. Please verify your email again.");
      navigate("/");
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleSignup = async () => {
    if (!name || !password) {
      alert("Please enter both name and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        name,
        email,
        password,
      });

      localStorage.setItem("email", email);
      // Fetch userId and store in localStorage
      try {
        const profileRes = await axios.get(`http://localhost:5000/api/profile/get?email=${email}`);
        if (profileRes.data && profileRes.data._id) {
          localStorage.setItem("userId", profileRes.data._id);
        }
      } catch (e) {
        console.error("Failed to fetch userId after signup", e);
      }
      alert("Signup successful. Now complete your profile.");
      navigate("/complete-profile");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      if (error.response?.status === 409) {
        // User already exists
        alert("An account with this email already exists. Please try logging in instead.");
        navigate("/login");
      } else {
        alert("Signup failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-400 to-purple-500 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-2 text-slate-800">Complete Signup</h2>
        <p className="text-sm text-slate-500 mb-6">Set your name and password to create your account.</p>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <button
          onClick={handleSignup}
          className={`w-full py-3 rounded-lg font-semibold text-white text-base transition mb-2 ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-700 hover:bg-indigo-800 cursor-pointer"}`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
