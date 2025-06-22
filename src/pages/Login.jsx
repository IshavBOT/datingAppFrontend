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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <h1 style={styles.logo}>Campus Connect</h1>
          <p style={styles.tagline}>Connect with your college community</p>
        </div>
        
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Welcome Back</h2>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="Enter your college email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            style={styles.button}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.loadingText}>
                <span style={styles.loadingDots}>...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <p style={styles.signupText}>
            Don't have an account?{" "}
            <a href="/signup" style={styles.signupLink}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    width: "100%",
    maxWidth: "420px",
    overflow: "hidden",
  },
  logoContainer: {
    background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
    padding: "2rem",
    textAlign: "center",
    color: "white",
  },
  logo: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  tagline: {
    margin: "0.5rem 0 0",
    opacity: 0.9,
    fontSize: "1rem",
  },
  formContainer: {
    padding: "2rem",
  },
  title: {
    margin: "0 0 1.5rem",
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  inputGroup: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#4b5563",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "1rem",
    transition: "all 0.2s ease",
  },
  button: {
    width: "100%",
    padding: "0.875rem",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "1rem",
  },
  loadingText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingDots: {
    animation: "loading 1.5s infinite",
  },
  signupText: {
    marginTop: "1.5rem",
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.875rem",
  },
  signupLink: {
    color: "#4f46e5",
    fontWeight: "600",
    textDecoration: "none",
  },
};
