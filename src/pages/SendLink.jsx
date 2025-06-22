// src/pages/SendLink.jsx
import React, { useState } from "react";
import { auth, sendSignInLinkToEmail } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const actionCodeSettings = {
  url: "http://localhost:3000/complete-signup", // user is redirected here after clicking link in email
  handleCodeInApp: true,
};

export default function SendLink() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendLink = async () => {
    const collegeEmailRegex = /^[a-zA-Z0-9._%+-]+@(dtu|nsut|igdtuw)\.ac\.in$/;
    if (!collegeEmailRegex.test(email)) {
      alert("Please use a valid college email (DTU, NSUT, or IGDTUW).");
      return;
    }

    setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setSent(true); // Just set the sent state, don't redirect yet
    } catch (err) {
      console.error("Email link error:", err);
      alert("Failed to send verification link. Please try again.");
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
          <h2 style={styles.title}>Get Started</h2>
          <p style={styles.description}>
            Enter your college email to receive a verification link and join the community.
          </p>

          <div style={styles.inputGroup}>
            <label style={styles.label}>College Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your college email"
              style={styles.input}
              disabled={sent}
            />
            <p style={styles.helperText}>
              Only DTU, NSUT, or IGDTUW email addresses are accepted.
            </p>
          </div>

          <button
            onClick={handleSendLink}
            style={{
              ...styles.button,
              background: sent ? "#22c55e" : "#4f46e5",
              cursor: sent ? "default" : "pointer",
            }}
            disabled={loading || sent}
          >
            {loading ? "Sending..." : sent ? "Link Sent!" : "Send Verification Link"}
          </button>

          <button
            onClick={() => navigate("/login")}
            style={{
              ...styles.button,
              background: "#64748b",
              marginTop: "1rem",
            }}
          >
            Login with Email & Password
          </button>

          {sent && (
            <div style={styles.successMessage}>
              <p style={styles.successText}>
                Verification link sent to <strong>{email}</strong>!
              </p>
              <p style={styles.successSubtext}>
                Please check your inbox and spam folder.
              </p>
            </div>
          )}
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
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
    margin: "0 0 0.5rem",
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  description: {
    margin: "0 0 1.5rem",
    color: "#64748b",
    fontSize: "0.875rem",
    lineHeight: "1.5",
  },
  inputGroup: {
    marginBottom: "1.5rem",
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
  helperText: {
    margin: "0.5rem 0 0",
    fontSize: "0.75rem",
    color: "#64748b",
  },
  button: {
    width: "100%",
    padding: "0.875rem",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  loadingText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  successMessage: {
    marginTop: "1.5rem",
    padding: "1rem",
    background: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: "8px",
    textAlign: "center",
  },
  successText: {
    margin: 0,
    color: "#166534",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  successSubtext: {
    margin: "0.5rem 0 0",
    color: "#166534",
    fontSize: "0.75rem",
    opacity: 0.8,
  },
};

