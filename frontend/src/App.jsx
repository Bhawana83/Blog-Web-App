// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { AnimatePresence } from "framer-motion";
import Header from "./components/layout/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BlogCreate from "./pages/BlogCreate";
import BlogDetail from "./pages/BlogDetail";
import BlogEdit from "./pages/BlogEdit";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlogEdit from "./pages/AdminBlogEdit";
import AdminBlogCreate from "./pages/AdminBlogCreate";
import { Toaster } from "react-hot-toast";


// Only for routes that require authentication
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  return currentUser ? children : <Navigate to="/login" />;
};

// Only for admin routes
const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  return currentUser?.isAdmin ? children : <Navigate to="/" />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
      <Routes location={location} key={location.pathname}>
        {/* ✅ Public Routes — accessible to everyone */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Blog Detail — public view, but comments/likes require login */}
        <Route path="/blogs/:id" element={<BlogDetail />} />

        {/* 🔐 Private Routes — require login */}
        <Route
          path="/create"
          element={
            // <PrivateRoute>
            <BlogCreate />
            // </PrivateRoute>
          }
        />
        <Route
          path="/blogs/:id/edit"
          element={
            <PrivateRoute>
              <BlogEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* 🛠️ Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/blogs/create"
          element={
            <AdminRoute>
              <AdminBlogCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/blogs/:id/edit"
          element={
            <AdminRoute>
              <AdminBlogEdit />
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} BlogMotion. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
