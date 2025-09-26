// src/components/layout/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogIn, FiUser, FiPlus, FiHome, FiSettings } from "react-icons/fi";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-sm border-b sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Blog<span className="text-indigo-700">Motion</span>
            </Link>
          </motion.div>

          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" icon={<FiHome />}>
              Home
            </NavLink>
            {currentUser && (
              <>
                <NavLink to="/create" icon={<FiPlus />}>
                  Create
                </NavLink>
                {/* ✅ ADD ADMIN LINK FOR ADMINS */}
                {currentUser.isAdmin && (
                  <NavLink to="/admin" icon={<FiSettings />}>
                    Admin Dashboard
                  </NavLink>
                )}
                  <NavLink to="/profile" icon={<FiUser />}>
                  Profile
                </NavLink>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  Hi, {currentUser.username}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors flex items-center space-x-2"
                >
                  <FiLogIn />
                  <span>Login</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const NavLink = ({ to, children, icon }) => {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={to}
        className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
      >
        {icon}
        <span>{children}</span>
      </Link>
    </motion.div>
  );
};

export default Header;
