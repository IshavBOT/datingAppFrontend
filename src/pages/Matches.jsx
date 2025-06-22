import React, { useEffect, useState } from "react";
import axios from "axios";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/matches", {
          params: { userId },
        });
        setMatches(res.data.matches || []);
      } catch (err) {
        console.error("Failed to fetch matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [userId]);

  if (loading) return <h2>Loading matches...</h2>;
  if (matches.length === 0) return <h2>No matches yet 😢</h2>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Matches</h2>
      <div style={styles.grid}>
        {matches.map((match) => (
          <div key={match._id} style={styles.card}>
            <img
              src={match.photoURL || "https://via.placeholder.com/200"}
              alt={match.name}
              style={styles.image}
            />
            <h3 style={styles.name}>{match.name}</h3>
            <p style={styles.bio}>{match.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "900px",
    margin: "auto",
  },
  heading: {
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  name: {
    margin: "0.75rem 0 0.25rem",
    fontSize: "1.25rem",
  },
  bio: {
    fontSize: "0.9rem",
    color: "#666",
  },
};
