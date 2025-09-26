// src/components/admin/AdminBlogManagement.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllBlogs,
  deleteBlog,
  getBlogById,
} from "../../services/adminService";
import Button from "../ui/Button";
import { FiEdit2, FiEye, FiTrash2, FiPlus } from "react-icons/fi";
import Spinner from "../ui/Spinner";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminBlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogs();
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    setDeletingId(blogId);
    try {
      await deleteBlog(blogId);
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
      toast.success("✅ Blog Deleted Successfully...")
    } catch (err) {
      alert("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateBlog = () => {
    // Navigate to create page - it will auto-detect admin mode
    navigate("/admin/blogs/create");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Blog Management</h2>
        <Button
          onClick={handleCreateBlog}
          className="bg-primary-600 text-white px-4 py-2 flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Blog</span>
        </Button>
      </div>

      {loading ? (
        <div className="p-8">
          <Spinner />
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="text-sm text-gray-500 mb-2">
                    Category:{" "}
                    <span className="font-medium">{blog.category}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    Author:{" "}
                    <span className="font-medium">{blog.author?.username}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Created: {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {blog.likes?.length || 0} likes •{" "}
                      {blog.comments?.length || 0} comments
                    </span>
                    {/* // Replace the action buttons section with this: */}
                    <div className="flex space-x-2">
                      {/* ✅ VIEW BUTTON - Link to public blog */}
                      <Link to={`/blogs/${blog._id}`}>
                        <Button
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-2"
                          title="View Blog"
                        >
                          <FiEye />
                        </Button>
                      </Link>

                      {/* ✅ EDIT BUTTON - Link to ADMIN edit route */}
                      <Link to={`/admin/blogs/${blog._id}/edit`}>
                        <Button
                          className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 p-2"
                          title="Edit Blog"
                        >
                          <FiEdit2 />
                        </Button>
                      </Link>

                      {/* ✅ DELETE BUTTON */}
                      <Button
                        onClick={() => handleDeleteBlog(blog._id)}
                        disabled={deletingId === blog._id}
                        className="bg-red-100 text-red-700 hover:bg-red-200 p-2 disabled:opacity-50"
                        title="Delete Blog"
                      >
                        {deletingId === blog._id ? (
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <FiTrash2 />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminBlogManagement;
