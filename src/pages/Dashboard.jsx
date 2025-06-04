// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        alert("No email found. Please log in.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/profile/get?email=${email}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {profile.name || profile.email}</h2>
      <img src={profile.photoURL} alt="Profile" style={{ width: "150px", borderRadius: "8px" }} />
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Bio:</strong> {profile.bio}</p>
      <p><strong>Gender:</strong> {profile.gender}</p>
      <p><strong>Branch:</strong> {profile.branch}</p>
      <p><strong>Year:</strong> {profile.year}</p>
    </div>
  );
}
