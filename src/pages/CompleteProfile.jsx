// src/pages/CompleteProfile.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile() {
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const email = localStorage.getItem("email");

    if (!bio || !gender || !year || !branch || !photo || !email) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", photo);
      formData.append("upload_preset", "DatingApp2"); // Replace with your Cloudinary preset
      formData.append("cloud_name", "dogsp3mmu");      // Replace with your Cloudinary cloud name

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dogsp3mmu/image/upload",
        formData
      );

      const photoURL = cloudRes.data.secure_url;

      await axios.post("http://localhost:5000/api/profile/complete", {
        bio,
        gender,
        year,
        branch,
        photoURL,
        email
      });

      alert("Profile completed!");
      // Fetch userId and store in localStorage
      try {
        const profileRes = await axios.get(`http://localhost:5000/api/profile/get?email=${email}`);
        if (profileRes.data && profileRes.data._id) {
          localStorage.setItem("userId", profileRes.data._id);
        }
      } catch (e) {
        console.error("Failed to fetch userId after profile completion", e);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to complete profile.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Complete Your Profile</h2>
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Year (e.g., 2nd)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Branch (e.g., CSE)"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          style={styles.input}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          style={styles.input}
        />
        <button onClick={handleSubmit} style={styles.button} disabled={loading}>
          {loading ? "Submitting..." : "Submit Profile"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #a1c4fd, #c2e9fb)",
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
    maxWidth: "450px",
    textAlign: "center",
  },
  title: {
    marginBottom: "1.5rem",
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
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
