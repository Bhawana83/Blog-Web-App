// src/components/ui/AnimatedCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AnimatedCard = ({ blog, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {blog.coverImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
            {blog.category}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 150) + "..." }} />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">By {blog.author?.username}</span>
          <Link
            to={`/blogs/${blog._id}`}
            className="text-primary-600 font-medium hover:text-primary-700 transition-colors flex items-center space-x-1"
          >
            <span>Read More</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedCard;