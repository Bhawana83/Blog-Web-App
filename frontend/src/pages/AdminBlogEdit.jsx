// src/pages/AdminBlogEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogById, updateBlog, getAllUsers } from "../services/adminService";
import RichTextEditor from "../components/editor/RichTextEditor";
import Button from "../components/ui/Button";
import { motion } from "framer-motion";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";

const AdminBlogEdit = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const fetchBlog = async () => {
    try {
      const res = await getBlogById(id);
      const blog = res.data;

      setTitle(blog.title);
      setContent(blog.content);
      setCategory(blog.category);
      setTags(blog.tags?.join(", ") || "");
      setSelectedAuthor(currentUser._id);

      if (blog.coverImage) {
        setCoverImagePreview(blog.coverImage);
      }
    } catch (err) {
      alert("Blog not found");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchUsers();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (tags) formData.append("tags", tags);
    if (coverImage) formData.append("coverImage", coverImage);
    formData.append("authorId", selectedAuthor); // Update author if needed

    try {
      setSubmitting(true);
      await updateBlog(id, formData);
      navigate("/admin", {
        state: {
          success: true,
          message: "Blog updated successfully!",
        },
      });
    } catch (err) {
      alert("Failed to update blog. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Blog as Admin
            </h1>
            <Button
              onClick={() => navigate(-1)}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2"
            >
              Back
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option key={currentUser._id} value={currentUser._id}>
                  {currentUser.username} ({currentUser.email})
                </option>

                {/* {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username} ({user.email})
                  </option>
                ))} */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              {coverImagePreview && (
                <div className="mb-4">
                  <img
                    src={coverImagePreview}
                    alt="Cover Preview"
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <RichTextEditor value={content} onChange={setContent} />

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-200 text-gray-800 px-6 py-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-primary-600 text-white px-8 py-3 text-lg"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Updating Blog...
                  </span>
                ) : (
                  "Update Blog"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminBlogEdit;
