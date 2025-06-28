// Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SwipeCard from "../pages/SwipeCard"; // Adjust path
import BlockedUsersModal from "../components/BlockedUsersModal";
import SwipeFilters from "../components/SwipeFilters";
import { FaUserEdit, FaSignOutAlt, FaComments, FaVenusMars, FaGraduationCap, FaEnvelope, FaHeart, FaRegCommentDots, FaCalendarAlt, FaBan, FaCog, FaFilter, FaCommentDots } from "react-icons/fa";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    branch: '',
    year: '',
    gender: '',
    tags: []
  });
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleEditProfile = () => navigate("/edit-profile");
  const goToChats = () => navigate("/chats");

  const handleFiltersChange = (newFilters) => {
    setActiveFilters(newFilters);
    setFiltersOpen(false); // Close modal after applying filters
    // You can add logic here to pass filters to SwipeCard if needed
  };

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-black">Hey {profile.name || profile.email.split("@")[0]}</h1>
        <button onClick={goToChats} className="text-2xl text-black hover:text-indigo-600" title="Chats">
          <FaCommentDots />
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="flex flex-col items-center mt-6">
        <div className="relative bg-white rounded-2xl shadow-lg p-4 w-[320px] flex flex-col items-center border border-indigo-200">
          {/* Gear Icon Dropdown */}
          <button
            className="absolute top-3 right-3 bg-white rounded-full p-2 border-2 border-indigo-400 text-indigo-700 hover:bg-indigo-50 focus:outline-none z-10"
            onClick={() => setShowDropdown(showDropdown => !showDropdown)}
            title="Settings"
          >
            <FaCog size={22} />
          </button>
          {showDropdown && (
            <div ref={dropdownRef} className="absolute top-12 right-0 w-48 bg-white border-2 border-dotted border-indigo-400 rounded-xl shadow-lg z-20 p-2 animate-fade-in">
              <button onClick={handleEditProfile} className="block w-full text-left px-4 py-2 hover:bg-indigo-50 rounded">Edit Profile</button>
              <button onClick={() => setShowBlockedUsers(true)} className="block w-full text-left px-4 py-2 hover:bg-indigo-50 rounded">Blocked Users</button>
              <button onClick={() => { setFiltersOpen(true); setShowDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-indigo-50 rounded">Filters</button>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-indigo-50 rounded">LogOut</button>
            </div>
          )}
          <img src={profile.photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 shadow mb-2" />
          <span className="mt-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Verified</span>
          <h2 className="text-lg font-bold mt-2 mb-1">{profile.name}</h2>
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
      </div>

      {/* DISCOVER PEOPLE + FILTER ICON */}
      <div className="flex flex-col items-center mt-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-medium text-black">Discover People</span>
        </div>
        {/* SWIPE CARDS SECTION */}
        <div className="w-full flex flex-col items-center">
          <div className="w-[260px] h-[320px] bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 relative">
            {/* SwipeCard component placeholder, should be styled inside SwipeCard */}
            <SwipeCard />
          </div>
          {/* Pass/Like Buttons */}
          {/* <div className="flex gap-4 mt-2">
            <button className="flex-1 px-8 py-2 rounded-full border border-indigo-200 bg-purple-100 text-black font-semibold shadow hover:bg-purple-200 transition">✓ Pass</button>
            <button className="flex-1 px-8 py-2 rounded-full border border-indigo-200 bg-purple-100 text-black font-semibold shadow hover:bg-purple-200 transition">♥ Like</button>
          </div> */}
        </div>
      </div>

      {/* Blocked Users Modal */}
      <BlockedUsersModal 
        isOpen={showBlockedUsers}
        onClose={() => setShowBlockedUsers(false)}
        currentUserId={profile?._id}
      />
      {/* Filters Modal as full-page overlay */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full relative">
            <SwipeFilters
              isOpen={filtersOpen}
              onToggle={() => setFiltersOpen(false)}
              onFiltersChange={handleFiltersChange}
            />
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close Filters"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}