import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const SwipeCards = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentUserEmail = localStorage.getItem("email");
  const currentUserId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!currentUserId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        // Use the profile route that excludes already swiped/matched users
        const res = await axios.get("http://localhost:5000/api/profile", {
          params: { userId: currentUserId },
        });

        const profiles = res.data.profiles || [];
        setProfiles(profiles);

        if (profiles.length === 0) {
          setError("No more profiles to show! Check back later for new connections.");
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError("Failed to fetch profiles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [currentUserId]);

  const handleSwipe = async (direction) => {
    const profile = profiles[currentIndex];
    if (!profile || !["left", "right"].includes(direction) || swiping) return;

    const action = direction === "right" ? "like" : "dislike";
    setSwiping(true);

    try {
      const response = await axios.post("http://localhost:5000/api/profile/swipe", {
        fromUserId: currentUserId,
        toUserId: profile._id,
        action,
      });

      const { message } = response.data;
      
      // Show toast for match
      if (message === "It's a match!") {
        toast.success(
          `🎉 It's a match with ${profile.name || profile.email.split("@")[0]}!`,
          {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#10b981",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
            },
          }
        );
      } else if (action === "like") {
        toast.success("❤️ Liked!", {
          duration: 2000,
          position: "top-center",
        });
      } else {
        toast.error("👎 Passed", {
          duration: 2000,
          position: "top-center",
        });
      }

      // Move to next profile
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error("Swipe failed:", err);
      toast.error("Failed to process swipe. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setSwiping(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Finding amazing people for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={styles.errorText}>{error}</h2>
        <button 
          style={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div style={styles.noMoreContainer}>
        <div style={styles.noMoreCard}>
          <h2 style={styles.noMoreTitle}>🎉 You've seen everyone!</h2>
          <p style={styles.noMoreText}>
            Check back later for new connections, or try expanding your preferences.
          </p>
          <button 
            style={styles.refreshButton}
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];
  const profilePhoto =
    currentProfile.photoURL || 
    currentProfile.photoUrl || 
    "https://via.placeholder.com/300x400?text=No+Image";

  return (
    <div style={styles.container}>
      <Toaster />
      
      <div style={styles.cardContainer}>
        <div 
          style={{ 
            ...styles.card, 
            backgroundImage: `url(${profilePhoto})`,
            opacity: swiping ? 0.7 : 1,
            transform: swiping ? "scale(0.95)" : "scale(1)",
          }}
        >
          <div style={styles.info}>
            <h2 style={styles.name}>
              {currentProfile.name || currentProfile.email.split("@")[0]}, {currentProfile.year}
            </h2>
            <p style={styles.bio}>{currentProfile.bio || "No bio available"}</p>
            <div style={styles.details}>
              <span style={styles.detail}>{currentProfile.gender}</span>
              <span style={styles.separator}>•</span>
              <span style={styles.detail}>{currentProfile.branch}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.buttonRow}>
        <button 
          style={{
            ...styles.dislikeButton,
            opacity: swiping ? 0.6 : 1,
            cursor: swiping ? "not-allowed" : "pointer",
          }}
          onClick={() => handleSwipe("left")}
          disabled={swiping}
        >
          ❌ Pass
        </button>
        <button 
          style={{
            ...styles.likeButton,
            opacity: swiping ? 0.6 : 1,
            cursor: swiping ? "not-allowed" : "pointer",
          }}
          onClick={() => handleSwipe("right")}
          disabled={swiping}
        >
          ❤️ Like
        </button>
      </div>

      <div style={styles.progressContainer}>
        <p style={styles.progressText}>
          {currentIndex + 1} of {profiles.length} profiles
        </p>
      </div>
    </div>
  );
};

export default SwipeCards;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "2rem",
    padding: "0 1rem",
  },
  cardContainer: {
    position: "relative",
    marginBottom: "2rem",
  },
  card: {
    width: "320px",
    height: "450px",
    borderRadius: "20px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "20px",
    color: "#fff",
    transition: "all 0.3s ease",
    position: "relative",
  },
  info: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "15px",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
  },
  name: {
    margin: "0 0 8px 0",
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  bio: {
    margin: "0 0 10px 0",
    fontSize: "0.9rem",
    lineHeight: "1.4",
    opacity: 0.9,
  },
  details: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.8rem",
    opacity: 0.8,
  },
  detail: {
    textTransform: "capitalize",
  },
  separator: {
    opacity: 0.6,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "320px",
    gap: "1rem",
    marginBottom: "1rem",
  },
  likeButton: {
    backgroundColor: "#10b981",
    color: "#fff",
    padding: "12px 24px",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    flex: 1,
  },
  dislikeButton: {
    backgroundColor: "#ef4444",
    color: "#fff",
    padding: "12px 24px",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    flex: 1,
  },
  progressContainer: {
    textAlign: "center",
  },
  progressText: {
    color: "#6b7280",
    fontSize: "0.875rem",
    margin: 0,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #4f46e5",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "1rem",
    color: "#6b7280",
    fontSize: "1rem",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    textAlign: "center",
  },
  errorText: {
    color: "#dc3545",
    marginBottom: "1rem",
  },
  retryButton: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  noMoreContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },
  noMoreCard: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "400px",
  },
  noMoreTitle: {
    color: "#1f2937",
    marginBottom: "1rem",
  },
  noMoreText: {
    color: "#6b7280",
    marginBottom: "1.5rem",
    lineHeight: "1.5",
  },
  refreshButton: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};
