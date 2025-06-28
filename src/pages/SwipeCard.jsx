import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import UserActionsMenu from "../components/UserActionsMenu";

const SwipeCards = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentUserEmail = localStorage.getItem("email");
  const currentUserId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [swiping, setSwiping] = useState(false);

  const fetchProfiles = async () => {
    if (!currentUserId) {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const params = { userId: currentUserId };
      const res = await axios.get("http://localhost:5000/api/profile", { params });
      const profiles = res.data.profiles || [];
      setProfiles(profiles);
      setCurrentIndex(0);
      if (profiles.length === 0) {
        setError("No profiles found. Try again later!");
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setError("Failed to fetch profiles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-lg text-slate-600">Finding amazing people for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold text-red-500 mb-2">{error}</h2>
        <div className="flex gap-2">
          <button 
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold mt-2 hover:bg-indigo-700 transition"
            onClick={fetchProfiles}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">🎉 You've seen everyone!</h2>
          <p className="text-slate-500 mb-4">
            Check back later for new connections.
          </p>
          <div className="flex gap-2 justify-center">
            <button 
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              onClick={fetchProfiles}
            >
              Refresh
            </button>
          </div>
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
    <div className="flex flex-col items-center">
      <Toaster />
      {/* Profile Card */}
      <div className="flex justify-center mb-6">
        <div 
          className={`relative w-80 h-[420px] bg-cover bg-center rounded-3xl shadow-xl flex flex-col justify-end transition-all duration-200 ${swiping ? 'opacity-70 scale-95' : 'opacity-100 scale-100'}`}
          style={{ backgroundImage: `url(${profilePhoto})` }}
        >
          {/* User Actions Menu */}
          <div className="absolute top-4 right-4 z-10">
            <UserActionsMenu 
              user={currentProfile} 
              currentUserId={currentUserId} 
              onClose={() => {
                setCurrentIndex((prev) => prev + 1);
              }}
            />
          </div>
          <div className="bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-3xl">
            <h2 className="text-2xl font-bold text-white mb-1">
              {currentProfile.name || currentProfile.email.split("@")[0]}, {currentProfile.year}
            </h2>
            <p className="text-white/80 mb-2">{currentProfile.bio || "No bio available"}</p>
            <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
              <span>{currentProfile.gender}</span>
              <span>•</span>
              <span>{currentProfile.branch}</span>
            </div>
            {currentProfile.tags && currentProfile.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {currentProfile.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {currentProfile.tags.length > 3 && (
                  <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                    +{currentProfile.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Swipe Buttons */}
      <div className="flex gap-6 mt-2">
        <button 
          className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-150 border-2 border-red-400 text-red-500 bg-white shadow hover:bg-red-50 ${swiping ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
          onClick={() => handleSwipe("left")}
          disabled={swiping}
        >
          ❌ Pass
        </button>
        <button 
          className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-150 border-2 border-green-400 text-green-600 bg-white shadow hover:bg-green-50 ${swiping ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
          onClick={() => handleSwipe("right")}
          disabled={swiping}
        >
          ❤️ Like
        </button>
      </div>
    </div>
  );
};

export default SwipeCards;
