// src/pages/BlogDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getBlogById,
  likeBlog,
  addComment,
  deleteComment,
  deleteBlog,
} from "../services/blogService";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi"; // ✅ Add back icon

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [deletingBlog, setDeletingBlog] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchBlog = async () => {
    try {
      const res = await getBlogById(id);
      setBlog(res.data);
    } catch (err) {
      alert("Blog not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (!currentUser) {
      alert("Please login to like blogs");
      return;
    }

    try {
      setBlog((prev) => {
        const hasLiked = prev.likes.includes(currentUser._id);
        return {
          ...prev,
          likes: hasLiked
            ? prev.likes.filter((id) => id !== currentUser._id)
            : [...prev.likes, currentUser._id],
        };
      });

      await likeBlog(id);
      const updatedBlogRes = await getBlogById(id);
      setBlog(updatedBlogRes.data);
    } catch (err) {
      console.error("Failed to like blog:", err);
      fetchBlog();
      alert("Failed to update like. Please try again.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to comment");
      return;
    }
    if (!commentText.trim()) return;

    try {
      const res = await addComment(id, { text: commentText });
      setBlog((prev) => ({
        ...prev,
        comments: [...prev.comments, res.data],
      }));
      setCommentText("");
    } catch (err) {
      console.error(err);
      alert("Failed to post comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return;

    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setDeletingCommentId(commentId);

    try {
      await deleteComment(id, commentId);
      setBlog((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleDeleteBlog = async () => {
    if (!currentUser) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this blog? This cannot be undone."
      )
    ) {
      return;
    }

    setDeletingBlog(true);

    try {
      await deleteBlog(id);
      navigate("/", {
        state: {
          success: true,
          message: "Blog deleted successfully!",
        },
      });
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog. Please try again.");
    } finally {
      setDeletingBlog(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ✅ BACK BUTTON AT THE TOP */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            // onClick={() => navigate(-1)} // Goes back in history without refresh
             onClick={() => window.history.back()}
            className="flex items-center space-x-2 bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-lg"
          >
            <FiArrowLeft />
            <span>Back to Blogs</span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {blog.coverImage && (
            <div className="h-80 overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full mb-2 sm:mb-0">
                {blog.category}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* ✅ TAGS DISPLAY */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between mb-8 pb-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">
                    {blog.author?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {blog.author?.username}
                  </p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                <Button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    blog.likes.includes(currentUser?._id)
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {blog.likes.includes(currentUser?._id) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>
                    {blog.likes.length}{" "}
                    {blog.likes.length === 1 ? "Like" : "Likes"}
                  </span>
                </Button>

                {currentUser && blog.author?._id === currentUser._id && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/blogs/${blog._id}/edit`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                    >
                      Edit Blog
                    </Link>
                    <Button
                      onClick={handleDeleteBlog}
                      disabled={deletingBlog}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center disabled:opacity-50"
                    >
                      {deletingBlog ? "Deleting..." : "Delete Blog"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Comments Section */}
            <div className="pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Comments ({blog.comments.length})
              </h3>

              {currentUser && (
                <form
                  onSubmit={handleAddComment}
                  className="mb-8 p-6 bg-gray-50 rounded-xl"
                >
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
                    rows="4"
                    required
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-primary-600 text-white px-6 py-2"
                    >
                      Post Comment
                    </Button>
                  </div>
                </form>
              )}

              <AnimatePresence>
                {blog.comments.map((comment, index) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-6 p-6 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {comment.user?.avatar ? (
                          <img
                            src={comment.user.avatar}
                            alt={comment.user.username || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="font-bold text-gray-700">
                              {comment.user?.username
                                ?.charAt(0)
                                .toUpperCase() || "?"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {comment.user?.username || "Anonymous"}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>

                            {currentUser &&
                              comment.user?._id === currentUser._id && (
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                  disabled={deletingCommentId === comment._id}
                                  className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                                >
                                  {deletingCommentId === comment._id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              )}
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-line">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetail;
