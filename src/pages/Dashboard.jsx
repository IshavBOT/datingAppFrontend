import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SwipeCard from "../pages/SwipeCard"; // Make sure path is correct
import axios from "axios";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        alert("No email found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/profile/get?email=${email}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!profile?._id) return;
      setMatchLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/matches", {
          params: { userId: profile._id },
        });
        setMatches(res.data.matches || []);
      } catch (err) {
        console.error("Failed to fetch matches:", err);
      } finally {
        setMatchLoading(false);
      }
    };

    fetchMatches();
  }, [profile]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Fetching your awesome profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Welcome, {profile.name || profile.email.split("@")[0]} 👋
        </h1>
        <div>
          <button style={styles.editButton} onClick={handleEditProfile}>
            Edit Profile
          </button>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.profileSection}>
        <div style={styles.card}>
          <img src={profile.photoURL} alt="Profile" style={styles.avatar} />
          <h2 style={styles.name}>{profile.name}</h2>
          <p style={styles.bio}>{profile.bio || "No bio added yet."}</p>

          <div style={styles.meta}>
            <span>{profile.gender}</span>
            <span>•</span>
            <span>{profile.year}</span>
            <span>•</span>
            <span>{profile.branch}</span>
          </div>

          <div style={styles.email}>{profile.email}</div>
        </div>

        <div style={styles.statsCard}>
          <h3 style={styles.statsHeader}>Your Activity</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <h4>{matches.length}</h4>
              <p>Connections</p>
            </div>
            <div style={styles.statBox}>
              <h4>0</h4>
              <p>Messages</p>
            </div>
            <div style={styles.statBox}>
              <h4>0</h4>
              <p>Events</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.swipeSection}>
        <h2 style={styles.swipeHeader}>✨ Discover New People</h2>
        <SwipeCard />
      </div>

      <div style={styles.matchesSection}>
        <h2 style={styles.swipeHeader}>💖 Your Matches</h2>
        {matchLoading ? (
          <p>Loading matches...</p>
        ) : matches.length === 0 ? (
          <p>No matches yet. Start swiping!</p>
        ) : (
          <div style={styles.matchGrid}>
            {matches.map((match) => (
              <div key={match._id} style={styles.matchCard}>
                <img
                  src={match.photoURL || "https://via.placeholder.com/200"}
                  alt={match.name}
                  style={styles.matchImage}
                />
                <h4 style={styles.matchName}>{match.name}</h4>
                <p style={styles.matchBio}>{match.bio}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    background: "linear-gradient(to right top, #dfe9f3, #ffffff)",
    minHeight: "100vh",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7fafc",
  },
  spinner: {
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #4f46e5",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "1rem",
    fontSize: "1rem",
    color: "#64748b",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#1f2937",
  },
  editButton: {
    background: "linear-gradient(to right, #6366f1, #8b5cf6)",
    color: "#fff",
    padding: "0.5rem 1rem",
    marginRight: "1rem",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },
  logoutButton: {
    background: "linear-gradient(to right, #f43f5e, #fb7185)",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },
  profileSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
    justifyContent: "center",
    marginBottom: "3rem",
  },
  card: {
    backdropFilter: "blur(10px)",
    background: "rgba(255, 255, 255, 0.6)",
    padding: "2rem",
    borderRadius: "20px",
    textAlign: "center",
    maxWidth: "350px",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "1rem",
    border: "3px solid white",
  },
  name: {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "0.25rem",
  },
  bio: {
    fontStyle: "italic",
    color: "#475569",
    marginBottom: "0.75rem",
  },
  meta: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  email: {
    marginTop: "1rem",
    fontSize: "0.85rem",
    color: "#94a3b8",
  },
  statsCard: {
    background: "#ffffff",
    padding: "2rem",
    borderRadius: "20px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.05)",
    width: "300px",
  },
  statsHeader: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "#1e293b",
  },
  statsGrid: {
    display: "flex",
    justifyContent: "space-between",
  },
  statBox: {
    textAlign: "center",
    flex: 1,
  },
  swipeSection: {
    marginTop: "4rem",
    paddingTop: "2rem",
    borderTop: "1px solid #e2e8f0",
  },
  swipeHeader: {
    fontSize: "1.75rem",
    fontWeight: 600,
    color: "#1f2937",
    textAlign: "center",
    marginBottom: "2rem",
  },
  matchesSection: {
    marginTop: "4rem",
    paddingTop: "2rem",
    borderTop: "1px solid #e2e8f0",
  },
  matchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  },
  matchCard: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  matchImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  matchName: {
    marginTop: "0.5rem",
    fontWeight: "bold",
  },
  matchBio: {
    fontSize: "0.9rem",
    color: "#555",
    marginTop: "0.25rem",
  },
};
