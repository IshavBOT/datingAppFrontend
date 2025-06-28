// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    gender: "",
    year: "",
    branch: "",
    photoURL: "",
    tags: []
  });
  const [newTag, setNewTag] = useState("");

  const navigate = useNavigate();

  const commonTags = ['Music', 'Sports', 'Reading', 'Travel', 'Cooking', 'Gaming', 'Art', 'Technology', 'Fitness', 'Photography'];

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return navigate("/login");

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/get?email=${email}`);
        const data = await res.json();
        setProfile(data);
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          gender: data.gender || "",
          year: data.year || "",
          branch: data.branch || "",
          photoURL: data.photoURL || "",
          tags: data.tags || []
        });
      } catch (err) {
        alert("Failed to fetch profile.");
        console.error(err);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  const addCommonTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");

    try {
      const res = await fetch("http://localhost:5000/api/profile/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...formData }),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Profile updated!");
      navigate("/dashboard");
    } catch (err) {
      alert("Something went wrong while saving changes.");
      console.error(err);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="mb-6 text-2xl font-semibold text-slate-800 text-center">Edit Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Gender"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Year"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Branch"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            name="photoURL"
            value={formData.photoURL}
            onChange={handleChange}
            placeholder="Photo URL"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {/* Tags/Interests Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add an interest..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
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
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
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
            <div>
              <p className="text-sm text-gray-600 mb-2">Popular interests:</p>
              <div className="flex flex-wrap gap-2">
                {commonTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addCommonTag(tag)}
                    disabled={formData.tags.includes(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      formData.tags.includes(tag)
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

          <button
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
