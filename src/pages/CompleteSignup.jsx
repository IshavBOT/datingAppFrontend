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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Complete Signup</h2>
        <p style={styles.subtitle}>
          Set your name and password to create your account.
        </p>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={handleSignup}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#333",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "1.5rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#4a90e2",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
