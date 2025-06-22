import React, { useEffect, useState } from "react";
import axios from "axios";

const SwipeCards = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentUserEmail = localStorage.getItem("email"); // Stored on login
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/swipe/others", {
          params: { email: currentUserEmail },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.users;
        setProfiles(data || []);

        if (!data || data.length === 0) {
          setError("No profiles found. Please check your backend or add more users.");
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError("Failed to fetch profiles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [currentUserEmail]);

  const handleSwipe = async (direction) => {
    const profile = profiles[currentIndex];
    if (!profile || !["left", "right"].includes(direction)) return;

    const action = direction === "right" ? "like" : "dislike";

    try {
      await axios.post("http://localhost:5000/api/profile/swipe", {
        fromUserId: localStorage.getItem("userId"),
        toUserId: profile._id,
        action,
      });
      console.log(`Swiped ${direction} on ${profile._id}`);
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error("Swipe failed:", err);
    }
  };

  if (loading) return <h2>Loading profiles...</h2>;
  if (error) return <h2 style={{ color: "#dc3545" }}>{error}</h2>;
  if (currentIndex >= profiles.length) {
    return <h2>No more profiles to show!</h2>;
  }

  const currentProfile = profiles[currentIndex];
  const profilePhoto =
    currentProfile.photoURL || currentProfile.photoUrl || "https://via.placeholder.com/300x400?text=No+Image";

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, backgroundImage: `url(${profilePhoto})` }}>
        <div style={styles.info}>
          <h2>{currentProfile.name}, {currentProfile.year}</h2>
          <p>{currentProfile.bio}</p>
        </div>
      </div>

      <div style={styles.buttonRow}>
        <button style={styles.dislikeButton} onClick={() => handleSwipe("left")}>❌ Dislike</button>
        <button style={styles.likeButton} onClick={() => handleSwipe("right")}>❤️ Like</button>
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
  },
  card: {
    width: "300px",
    height: "400px",
    borderRadius: "20px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "20px",
    color: "#fff",
  },
  info: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "10px",
    borderRadius: "10px",
  },
  buttonRow: {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
    width: "60%",
    gap: "1rem",
  },
  likeButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  dislikeButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
