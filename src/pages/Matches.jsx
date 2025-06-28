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

  if (loading) return <h2 className="text-center text-xl font-semibold mt-10">Loading matches...</h2>;
  if (matches.length === 0) return <h2 className="text-center text-xl font-semibold mt-10">No matches yet 😢</h2>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Your Matches</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div key={match._id} className="bg-white rounded-xl p-6 shadow-lg text-center flex flex-col items-center">
            <img
              src={match.photoURL || "https://via.placeholder.com/200"}
              alt={match.name}
              className="w-full h-56 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-1">{match.name}</h3>
            <p className="text-gray-500 text-sm">{match.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
