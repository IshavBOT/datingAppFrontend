import React, { useState, useEffect } from 'react';
import { FaBan, FaTimes, FaUnlock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const BlockedUsersModal = ({ isOpen, onClose, currentUserId }) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentUserId) {
      fetchBlockedUsers();
    }
  }, [isOpen, currentUserId]);

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/user-actions/blocked/${currentUserId}`);
      const data = await response.json();

      if (response.ok) {
        setBlockedUsers(data.blockedUsers || []);
      } else {
        toast.error(data.error || 'Failed to fetch blocked users');
      }
    } catch (error) {
      console.error('Fetch blocked users error:', error);
      toast.error('Failed to fetch blocked users');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      const response = await fetch('http://localhost:5000/api/user-actions/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          targetUserId: userId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User unblocked successfully');
        setBlockedUsers(prev => prev.filter(user => user._id !== userId));
      } else {
        toast.error(data.error || 'Failed to unblock user');
      }
    } catch (error) {
      console.error('Unblock user error:', error);
      toast.error('Failed to unblock user');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FaBan className="text-red-500" />
            Blocked Users
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : blockedUsers.length === 0 ? (
          <div className="text-center py-8">
            <FaBan className="text-gray-400 text-4xl mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No blocked users</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blockedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnblock(user._id)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <FaUnlock />
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockedUsersModal; 