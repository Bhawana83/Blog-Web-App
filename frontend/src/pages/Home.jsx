// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllBlogs } from "../services/blogService";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";
import AnimatedCard from "../components/ui/AnimatedCard";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiFilter, FiUser } from "react-icons/fi";
import Button from "../components/ui/Button";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [showMyBlogs, setShowMyBlogs] = useState(() => {
    const saved = localStorage.getItem("showMyBlogs");
    return saved === "true";
  });
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const params = {};
      if (searchTerm) params.keyword = searchTerm;
      if (category) params.category = category;
      if (showMyBlogs && currentUser) params.author = "me";

      const res = await getAllBlogs(params);
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [searchTerm, category, showMyBlogs]);

  useEffect(() => {
    localStorage.setItem("showMyBlogs", showMyBlogs.toString());
  }, [showMyBlogs]);

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser && showMyBlogs) {
      setShowMyBlogs(false);
      return;
    }

    setLoading(true);
    fetchBlogs();
  }, [showMyBlogs, currentUser, authLoading]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://static.vecteezy.com/system/resources/thumbnails/054/046/117/small/blue-smoke-cloud-effect-on-a-transparent-background-for-creative-designs-png.png')",
            opacity: 0.8,
          }}
        ></div>
        <div className="absolute inset-0 bg-white/40"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 px-6 max-w-3xl"
        >
          <h1 className=" text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-gradient-to-r from-sky-500 to-indigo-800 bg-clip-text text-transparent drop-shadow-xl text-center">
            Welcome to BlogMotion
          </h1>

          <p className="text-lg md:text-2xl text-gray-800 mb-8">
            Discover, create, and share amazing stories with the world ✨
          </p>
          <a
            href="#blogs"
            className="px-8 py-4 bg-white/80 backdrop-blur-md text-gray-900 font-semibold rounded-full shadow-lg hover:bg-white transition"
          >
            Explore Blogs
          </a>
        </motion.div>
      </section>

      {/* Blog Section */}
      <div
        id="blogs"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20"
      >
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          {currentUser && (
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Blog
            </Link>
          )}

          {currentUser && (
            <Button
              onClick={() => setShowMyBlogs(!showMyBlogs)}
              className={`px-6 py-3 font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                showMyBlogs
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              <FiUser />
              <span>{showMyBlogs ? "Showing: My Blogs" : "Show My Blogs"}</span>
            </Button>
          )}
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md mb-10"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1 relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filter by category..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setCategory("");
                setShowMyBlogs(false);
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <Spinner />
        ) : blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-xl text-gray-500">
              {showMyBlogs
                ? "You haven't created any blogs yet."
                : "No blogs found. Try adjusting your search."}
            </p>
            {showMyBlogs && (
              <Link
                to="/create"
                className="mt-4 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Your First Blog
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {blogs.map((blog, index) => (
                <AnimatedCard key={blog._id} blog={blog} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
