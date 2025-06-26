// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SwipeCard from "../pages/SwipeCard"; // Adjust path
import { FaUserEdit, FaSignOutAlt, FaComments, FaVenusMars, FaGraduationCap, FaEnvelope, FaHeart, FaRegCommentDots, FaCalendarAlt } from "react-icons/fa";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleEditProfile = () => navigate("/edit-profile");
  const goToChats = () => navigate("/chats");

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner" style={styles.spinner}></div>
        <p style={styles.loadingText}>Fetching your profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span role="img" aria-label="wave">👋</span> Hey, {profile.name || profile.email.split("@")[0]}
        </h1>
        <div style={styles.buttonGroup}>
          <button style={styles.secondaryButton} onClick={handleEditProfile} title="Edit Profile">
            <FaUserEdit style={{ marginRight: 8 }} /> Edit Profile
          </button>
          <button style={styles.secondaryButton} onClick={goToChats} title="Chats">
            <FaComments style={{ marginRight: 8 }} /> Chats
          </button>
          <button style={styles.logoutButton} onClick={handleLogout} title="Logout">
            <FaSignOutAlt style={{ marginRight: 8 }} /> Logout
          </button>
        </div>
      </div>

      {/* PROFILE CARD & STATS */}
      <div style={styles.profileStatsWrapper}>
        <div style={styles.card}>
          <div style={styles.avatarWrapper}>
            <img src={profile.photoURL} alt="Profile" style={styles.avatar} />
            <span style={styles.badge}>Verified</span>
          </div>
          <h2 style={styles.name}>{profile.name}</h2>
          <p style={styles.bio}>{profile.bio || "No bio added yet."}</p>
          <div style={styles.meta}>
            <span><FaVenusMars style={{ marginRight: 4 }} />{profile.gender}</span>
            <span style={styles.dot}>•</span>
            <span><FaGraduationCap style={{ marginRight: 4 }} />{profile.year}</span>
            <span style={styles.dot}>•</span>
            <span>{profile.branch}</span>
          </div>
          <div style={styles.email}><FaEnvelope style={{ marginRight: 4 }} />{profile.email}</div>
        </div>

        {/* ACTIVITY STATS */}
        <div style={styles.statsCard}>
          <h3 style={styles.statsHeader}>Your Stats</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <FaHeart style={styles.statIcon} />
              <h4 style={styles.statNumber}>4</h4>
              <p style={styles.statLabel}>Matches</p>
            </div>
            <div style={styles.statBox}>
              <FaRegCommentDots style={styles.statIcon} />
              <h4 style={styles.statNumber}>12</h4>
              <p style={styles.statLabel}>Messages</p>
            </div>
            <div style={styles.statBox}>
              <FaCalendarAlt style={styles.statIcon} />
              <h4 style={styles.statNumber}>1</h4>
              <p style={styles.statLabel}>Events</p>
            </div>
          </div>
        </div>
      </div>

      {/* SWIPE CARDS SECTION */}
      <div style={styles.swipeSection}>
        <h2 style={styles.swipeHeader}>✨ Discover New People</h2>
        <div style={styles.swipeCardWrapper}>
          <SwipeCard />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "2rem 0",
    fontFamily: "Inter, sans-serif",
    background: "linear-gradient(120deg, #f0f4ff 0%, #f9fafb 100%)",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 auto 2.5rem auto",
    maxWidth: 1100,
    padding: "0 2rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#22223b",
    letterSpacing: "-1px",
    textShadow: "0 2px 8px rgba(99,102,241,0.08)",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
  },
  secondaryButton: {
    background: "linear-gradient(90deg, #6366f1 60%, #818cf8 100%)",
    color: "#fff",
    padding: "0.6rem 1.3rem",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
    transition: "background 0.2s, transform 0.2s",
  },
  logoutButton: {
    background: "linear-gradient(90deg, #ef4444 60%, #f87171 100%)",
    color: "#fff",
    padding: "0.6rem 1.3rem",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    boxShadow: "0 2px 8px rgba(239,68,68,0.10)",
    transition: "background 0.2s, transform 0.2s",
  },
  profileStatsWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2.5rem",
    justifyContent: "center",
    alignItems: "flex-start",
    margin: "0 auto 3.5rem auto",
    maxWidth: 1100,
    padding: "0 2rem",
  },
  card: {
    backdropFilter: "blur(16px)",
    background: "rgba(255, 255, 255, 0.85)",
    padding: "2.5rem 2rem 2rem 2rem",
    borderRadius: "28px",
    textAlign: "center",
    maxWidth: "370px",
    minWidth: "300px",
    boxShadow: "0 8px 32px rgba(99,102,241,0.08)",
    position: "relative",
    overflow: "hidden",
  },
  avatarWrapper: {
    position: "relative",
    display: "inline-block",
    marginBottom: "1.2rem",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #fff",
    boxShadow: "0 4px 16px rgba(99,102,241,0.10)",
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: -10,
    background: "linear-gradient(90deg, #34d399 60%, #6ee7b7 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.8rem",
    padding: "0.3rem 0.8rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(52,211,153,0.10)",
    border: "2px solid #fff",
  },
  name: {
    fontSize: "1.7rem",
    fontWeight: 700,
    marginBottom: "0.3rem",
    color: "#22223b",
    letterSpacing: "-0.5px",
  },
  bio: {
    fontStyle: "italic",
    color: "#6366f1",
    marginBottom: "0.9rem",
    fontWeight: 500,
    fontSize: "1.05rem",
  },
  meta: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.7rem",
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "0.5rem",
  },
  dot: {
    color: "#cbd5e1",
    fontWeight: 700,
    fontSize: "1.2rem",
  },
  email: {
    marginTop: "1.1rem",
    fontSize: "0.95rem",
    color: "#818cf8",
    fontWeight: 600,
    letterSpacing: "0.2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
  },
  statsCard: {
    background: "rgba(255,255,255,0.95)",
    padding: "2.2rem 2rem 2rem 2rem",
    borderRadius: "28px",
    boxShadow: "0 6px 24px rgba(99,102,241,0.07)",
    width: "320px",
    minWidth: "260px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statsHeader: {
    fontSize: "1.35rem",
    fontWeight: 700,
    marginBottom: "1.2rem",
    color: "#6366f1",
    textAlign: "center",
    letterSpacing: "-0.5px",
  },
  statsGrid: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    gap: "1rem",
  },
  statBox: {
    textAlign: "center",
    flex: 1,
    borderRadius: "16px",
    padding: "1.1rem 0.5rem",
    background: "linear-gradient(120deg, #e0e7ff 0%, #f0f9ff 100%)",
    margin: "0 0.5rem",
    boxShadow: "0 2px 8px rgba(99,102,241,0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.15s",
  },
  statIcon: {
    fontSize: "1.6rem",
    color: "#6366f1",
    marginBottom: "0.3rem",
  },
  statNumber: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#22223b",
    margin: 0,
  },
  statLabel: {
    fontSize: "1rem",
    color: "#6366f1",
    fontWeight: 500,
    margin: 0,
  },
  swipeSection: {
    marginTop: "4rem",
    paddingTop: "2.5rem",
    borderTop: "1px solid #e2e8f0",
    background: "rgba(255,255,255,0.7)",
    boxShadow: "0 2px 12px rgba(99,102,241,0.04)",
    borderRadius: "24px 24px 0 0",
    maxWidth: 900,
    marginLeft: "auto",
    marginRight: "auto",
  },
  swipeHeader: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#6366f1",
    textAlign: "center",
    marginBottom: "2.2rem",
    letterSpacing: "-0.5px",
  },
  swipeCardWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "320px",
    padding: "1.5rem 0",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(120deg, #f0f4ff 0%, #f9fafb 100%)",
  },
  spinner: {
    border: "5px solid #e0e7ff",
    borderTop: "5px solid #6366f1",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "1.2rem",
    fontSize: "1.1rem",
    color: "#6366f1",
    fontWeight: 600,
    letterSpacing: "0.2px",
  },
};