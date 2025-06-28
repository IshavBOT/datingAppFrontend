// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SwipeCard from "../pages/SwipeCard"; // Adjust path
import BlockedUsersModal from "../components/BlockedUsersModal";
import { FaUserEdit, FaSignOutAlt, FaComments, FaVenusMars, FaGraduationCap, FaEnvelope, FaHeart, FaRegCommentDots, FaCalendarAlt, FaBan } from "react-icons/fa";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-lg text-slate-600">Fetching your profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white py-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto mb-10 px-4 gap-4">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">
          <span role="img" aria-label="wave">👋</span> Hey, {profile.name || profile.email.split("@")[0]}
        </h1>
        <div className="flex gap-3">
          <button onClick={handleEditProfile} title="Edit Profile" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition">
            <FaUserEdit /> Edit Profile
          </button>
          <button onClick={goToChats} title="Chats" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition">
            <FaComments /> Chats
          </button>
          <button onClick={() => setShowBlockedUsers(true)} title="Blocked Users" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition">
            <FaBan /> Blocked Users
          </button>
          <button onClick={handleLogout} title="Logout" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold shadow hover:bg-gray-600 transition">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* PROFILE CARD & STATS */}
      <div className="flex flex-wrap gap-8 justify-center items-start max-w-5xl mx-auto mb-12 px-4">
        <div className="backdrop-blur bg-white/90 p-8 rounded-3xl text-center max-w-xs min-w-[300px] shadow-xl relative overflow-hidden">
          <div className="flex flex-col items-center mb-4">
            <img src={profile.photoURL} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 shadow" />
            <span className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Verified</span>
          </div>
          <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
          <p className="text-slate-500 mb-2">{profile.bio || "No bio added yet."}</p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-slate-600 text-sm mb-2">
            <span className="flex items-center gap-1"><FaVenusMars />{profile.gender}</span>
            <span className="mx-1">•</span>
            <span className="flex items-center gap-1"><FaGraduationCap />{profile.year}</span>
            <span className="mx-1">•</span>
            <span>{profile.branch}</span>
          </div>
          
          {/* Display tags if available */}
          {profile.tags && profile.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-2">
              {profile.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {profile.tags.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{profile.tags.length - 4} more
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-center gap-1 text-slate-400 text-xs"><FaEnvelope />{profile.email}</div>
        </div>

        {/* ACTIVITY STATS */}
        {/* <div className="bg-white/90 rounded-3xl shadow-xl p-8 flex flex-col items-center min-w-[220px]">
          <h3 className="text-lg font-bold mb-4 text-slate-700">Your Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <FaHeart className="text-pink-400 text-2xl mb-1" />
              <h4 className="text-xl font-bold">4</h4>
              <p className="text-xs text-slate-500">Matches</p>
            </div>
            <div className="flex flex-col items-center">
              <FaRegCommentDots className="text-indigo-400 text-2xl mb-1" />4
              <h4 className="text-xl font-bold">12</h4>
              <p className="text-xs text-slate-500">Messages</p>
            </div>
            <div className="flex flex-col items-center">
              <FaCalendarAlt className="text-green-400 text-2xl mb-1" />
              <h4 className="text-xl font-bold">1</h4>
              <p className="text-xs text-slate-500">Events</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* SWIPE CARDS SECTION */}
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">✨ Discover New People</h2>
        <div>
          <SwipeCard />
        </div>
      </div>

      {/* Blocked Users Modal */}
      <BlockedUsersModal 
        isOpen={showBlockedUsers}
        onClose={() => setShowBlockedUsers(false)}
        currentUserId={profile?._id}
      />
    </div>
  );
}