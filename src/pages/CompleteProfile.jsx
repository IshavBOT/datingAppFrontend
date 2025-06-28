// src/pages/CompleteProfile.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();

  const commonTags = ['Music', 'Sports', 'Reading', 'Travel', 'Cooking', 'Gaming', 'Art', 'Technology', 'Fitness', 'Photography'];

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addCommonTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = async () => {
    const email = localStorage.getItem("email");

    if (!name || !bio || !gender || !year || !branch || !photo || !email) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", photo);
      formData.append("upload_preset", "DatingApp2"); // Replace with your Cloudinary preset
      formData.append("cloud_name", "dogsp3mmu");      // Replace with your Cloudinary cloud name

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dogsp3mmu/image/upload",
        formData
      );

      const photoURL = cloudRes.data.secure_url;

      await axios.post("http://localhost:5000/api/profile/complete", {
        name,
        bio,
        gender,
        year,
        branch,
        photoURL,
        tags,
        email
      });

      alert("Profile completed!");
      // Fetch userId and store in localStorage
      try {
        const profileRes = await axios.get(`http://localhost:5000/api/profile/get?email=${email}`);
        if (profileRes.data && profileRes.data._id) {
          localStorage.setItem("userId", profileRes.data._id);
        }
      } catch (e) {
        console.error("Failed to fetch userId after profile completion", e);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to complete profile.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-cyan-200 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg text-center">
        <h2 className="mb-6 text-2xl font-semibold text-slate-800">Complete Your Profile</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <input
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <input
          type="text"
          placeholder="Year (e.g., 2nd)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <input
          type="text"
          placeholder="Branch (e.g., CSE)"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        
        {/* Tags/Interests Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Interests (Optional)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add an interest..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add
            </button>
          </div>
          
          {/* Selected Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {/* Common Tags */}
          <div className="text-left">
            <p className="text-sm text-gray-600 mb-2">Popular interests:</p>
            <div className="flex flex-wrap gap-2">
              {commonTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addCommonTag(tag)}
                  disabled={tags.includes(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    tags.includes(tag)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="w-full px-4 py-3 mb-6 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating Profile..." : "Complete Profile"}
        </button>
      </div>
    </div>
  );
}
