import React, { useState } from 'react';
import { FaEllipsisV, FaBan, FaFlag, FaUserTimes, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const UserActionsMenu = ({ user, currentUserId, onUnmatch, onClose }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const handleBlock = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user-actions/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          targetUserId: user._id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User blocked successfully');
        onClose(); // Close the chat/profile
      } else {
        toast.error(data.error || 'Failed to block user');
      }
    } catch (error) {
      console.error('Block user error:', error);
      toast.error('Failed to block user');
    }
    setShowMenu(false);
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Please select a reason for reporting');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user-actions/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          targetUserId: user._id,
          reason: reportReason,
          description: reportDescription
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User reported successfully');
        setShowReportModal(false);
        setShowMenu(false);
        setReportReason('');
        setReportDescription('');
      } else {
        toast.error(data.error || 'Failed to report user');
      }
    } catch (error) {
      console.error('Report user error:', error);
      toast.error('Failed to report user');
    }
  };

  const handleUnmatch = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user-actions/unmatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          targetUserId: user._id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Unmatched successfully');
        if (onUnmatch) {
          onUnmatch(user._id);
        }
        onClose(); // Close the chat
      } else {
        toast.error(data.error || 'Failed to unmatch');
      }
    } catch (error) {
      console.error('Unmatch error:', error);
      toast.error('Failed to unmatch');
    }
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <FaEllipsisV className="text-gray-600 dark:text-gray-400" />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            <button
              onClick={handleBlock}
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaBan />
              Block User
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-orange-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaFlag />
              Report User
            </button>
            <button
              onClick={handleUnmatch}
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaUserTimes />
              Unmatch
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Report User
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for reporting
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a reason</option>
                <option value="inappropriate_behavior">Inappropriate Behavior</option>
                <option value="harassment">Harassment</option>
                <option value="fake_profile">Fake Profile</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional details (optional)
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Please provide more details..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActionsMenu; 