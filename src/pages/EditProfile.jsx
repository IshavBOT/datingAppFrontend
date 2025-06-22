// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    gender: "",
    year: "",
    branch: "",
    photoURL: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return navigate("/login");

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/get?email=${email}`);
        const data = await res.json();
        setProfile(data);
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          gender: data.gender || "",
          year: data.year || "",
          branch: data.branch || "",
          photoURL: data.photoURL || "",
        });
      } catch (err) {
        alert("Failed to fetch profile.");
        console.error(err);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");

    try {
      const res = await fetch("http://localhost:5000/api/profile/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...formData }),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Profile updated!");
      navigate("/dashboard");
    } catch (err) {
      alert("Something went wrong while saving changes.");
      console.error(err);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" required />
        <input name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" required />
        <input name="year" value={formData.year} onChange={handleChange} placeholder="Year" required />
        <input name="branch" value={formData.branch} onChange={handleChange} placeholder="Branch" required />
        <input name="photoURL" value={formData.photoURL} onChange={handleChange} placeholder="Photo URL" required />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
