// src/components/admin/UserDetailModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { getUserById } from "../../services/adminService";
import Spinner from "../ui/Spinner";

const UserDetailModal = ({ isOpen, onClose, userId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    try {
      const res = await getUserById(userId);
      setUserDetails(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
          <Button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-3 py-1"
          >
            Close
          </Button>
        </div>

        {loading ? (
          <Spinner />
        ) : userDetails ? (
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                User Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{userDetails.user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userDetails.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">
                    {userDetails.user.isAdmin ? "Admin" : "User"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {new Date(userDetails.user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* User Blogs */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Blogs ({userDetails.blogs.length})
              </h3>
              {userDetails.blogs.length === 0 ? (
                <p className="text-gray-500">
                  This user hasn't created any blogs yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {userDetails.blogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">
                        {blog.title}
                      </h4>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Category: {blog.category}</span>
                        <span>
                          {blog.likes.length} likes • {blog.comments.length}{" "}
                          comments
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Created: {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-red-500">Failed to load user details</p>
        )}
      </motion.div>
    </div>
  );
};

export default UserDetailModal;
