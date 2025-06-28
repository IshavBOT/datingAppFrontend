import React, { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

const SwipeFilters = ({ onFiltersChange, isOpen, onToggle }) => {
  const [filters, setFilters] = useState({
    branch: '',
    year: '',
    gender: '',
    tags: []
  });

  const [newTag, setNewTag] = useState('');

  const branches = ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EEE', 'Other'];
  const years = ['1st', '2nd', '3rd', '4th'];
  const genders = ['Male', 'Female', 'Other'];
  const commonTags = ['Music', 'Sports', 'Reading', 'Travel', 'Cooking', 'Gaming', 'Art', 'Technology', 'Fitness', 'Photography'];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const addTag = () => {
    if (newTag.trim() && !filters.tags.includes(newTag.trim())) {
      const newTags = [...filters.tags, newTag.trim()];
      handleFilterChange('tags', newTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = filters.tags.filter(tag => tag !== tagToRemove);
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const clearedFilters = { branch: '', year: '', gender: '', tags: [] };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const addCommonTag = (tag) => {
    if (!filters.tags.includes(tag)) {
      const newTags = [...filters.tags, tag];
      handleFilterChange('tags', newTags);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <FaFilter />
        Filters
        {Object.values(filters).some(val => val && (Array.isArray(val) ? val.length > 0 : true)) && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
            {filters.tags.length + (filters.branch ? 1 : 0) + (filters.year ? 1 : 0) + (filters.gender ? 1 : 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-4 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filter Profiles</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Branch Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange('branch', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Genders</option>
                {genders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Interest</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add interest..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Selected Tags */}
          {filters.tags.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Selected Interests</label>
              <div className="flex flex-wrap gap-2">
                {filters.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Common Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Popular Interests</label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => addCommonTag(tag)}
                  disabled={filters.tags.includes(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.tags.includes(tag)
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
      )}
    </div>
  );
};

export default SwipeFilters; 