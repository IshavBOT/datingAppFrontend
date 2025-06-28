// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("email", email);
      // Fetch userId and store in localStorage
      try {
        const profileRes = await fetch(`http://localhost:5000/api/profile/get?email=${email}`);
        const profileData = await profileRes.json();
        if (profileData && profileData._id) {
          localStorage.setItem("userId", profileData._id);
        }
      } catch (e) {
        console.error("Failed to fetch userId after login", e);
      }
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      alert("Something went wrong during login.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-2 sm:p-4">
      <div className="bg-black rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-[400px] md:max-w-md lg:max-w-lg xl:max-w-xl overflow-hidden border border-slate-700 mx-auto">
        <div className="bg-black p-4 sm:p-6 md:p-8 text-center text-white">
          <h1 className="m-0 text-3xl sm:text-4xl font-bold tracking-tight text-white font-pacifico" style={{ fontFamily: 'Pacifico, cursive' }}>
            Campus Connect
          </h1>
        </div>
        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="mb-2 text-lg sm:text-xl font-semibold text-white">Welcome Back</h2>
          <p className="mb-6 text-white text-xs sm:text-sm leading-relaxed">
            Sign in to your account to continue connecting with your college community.
          </p>
          <div className="mb-5">
            <label className="block mb-2 text-xs sm:text-sm font-medium text-white">Email</label>
            <input
              className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-slate-600 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-black text-white placeholder-slate-400"
              type="email"
              placeholder="Enter your college email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-xs sm:text-sm font-medium text-white">Password</label>
            <input
              className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-slate-600 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-black text-white placeholder-slate-400"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className={`w-full py-2 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base transition mb-2 ${
              loading ? "bg-indigo-400 cursor-not-allowed opacity-70" : "bg-indigo-700 hover:bg-indigo-800 cursor-pointer"
            }`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-2 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base transition bg-slate-500 hover:bg-slate-600 mt-4"
          >
            Create New Account
          </button>
          <p className="mt-6 text-center text-slate-400 text-xs sm:text-sm">
            Don't have an account?{" "}
            <a href="/" className="text-indigo-400 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
