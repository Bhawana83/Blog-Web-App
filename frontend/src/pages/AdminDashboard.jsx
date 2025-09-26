// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiFileText, FiPlus } from "react-icons/fi";
import Button from "../components/ui/Button";
import AdminUserManagement from "../components/admin/AdminUserManagement";
import AdminBlogManagement from "../components/admin/AdminBlogManagement";
import { getAllBlogs, getAllUsers } from "../services/adminService";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState("users");

  const fetchAdminData = async () => {
    try {
      const [usersRes, blogsRes] = await Promise.all([
        getAllUsers(),
        getAllBlogs(),
      ]);

      console.log("User :", usersRes, "Blog :", blogsRes);
      setUsers(usersRes.data.users);
      setBlogs(blogsRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">Manage users and content</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl mb-8 w-fit">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              activeTab === "users"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FiUsers />
            <span>Users ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              activeTab === "blogs"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FiFileText />
            <span>Blogs ({blogs.length})</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === "users" && <AdminUserManagement />}
        {activeTab === "blogs" && <AdminBlogManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;

//* Previous code
// // src/pages/AdminDashboard.jsx
// import React, { useState, useEffect } from "react";
// import { getAllUsers, getAllBlogs, deleteUser } from "../services/adminService";
// import { useAuth } from "../hooks/useAuth";
// import { motion, AnimatePresence } from "framer-motion";
// import Button from "../components/ui/Button";
// import Spinner from "../components/ui/Spinner";
// import { FiUsers, FiFileText, FiTrash2, FiAlertCircle } from "react-icons/fi";

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [activeTab, setActiveTab] = useState("users");
//   const [loading, setLoading] = useState(true);
//   const [deleting, setDeleting] = useState(null);
//   const { currentUser } = useAuth();

//   // Redirect if not admin
//   if (!currentUser?.isAdmin) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Access Denied
//           </h2>
//           <p className="text-gray-600 mb-4">
//             You don't have permission to access this page.
//           </p>
//           <Button
//             onClick={() => window.history.back()}
//             className="bg-primary-600 text-white"
//           >
//             Go Back
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const fetchAdminData = async () => {
//     try {
//       const [usersRes, blogsRes] = await Promise.all([
//         getAllUsers(),
//         getAllBlogs(),
//       ]);

//       console.log("User :", usersRes, "Blog :", blogsRes);
//       setUsers(usersRes.data.users);
//       setBlogs(blogsRes.data);
//     } catch (err) {
//       console.error("Failed to fetch admin data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAdminData();
//   }, []);

//   const handleDeleteUser = async (userId, username) => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete user "${username}"? This action cannot be undone.`
//       )
//     ) {
//       return;
//     }

//     setDeleting(userId);
//     try {
//       await deleteUser(userId);
//       setUsers(users.filter((user) => user._id !== userId));
//     } catch (err) {
//       alert("Failed to delete user");
//     } finally {
//       setDeleting(null);
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             Admin Dashboard
//           </h1>
//           <p className="text-xl text-gray-600">Manage users and content</p>
//         </motion.div>

//         {/* Tabs */}
//         <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl mb-8 w-fit">
//           <button
//             onClick={() => setActiveTab("users")}
//             className={`px-6 py-3 rounded-lg font-medium transition-all ${
//               activeTab === "users"
//                 ? "bg-white text-primary-600 shadow-sm"
//                 : "text-gray-600 hover:text-gray-900"
//             }`}
//           >
//             <div className="flex items-center space-x-2">
//               <FiUsers />
//               <span>Users ({users.length})</span>
//             </div>
//           </button>
//           <button
//             onClick={() => setActiveTab("blogs")}
//             className={`px-6 py-3 rounded-lg font-medium transition-all ${
//               activeTab === "blogs"
//                 ? "bg-white text-primary-600 shadow-sm"
//                 : "text-gray-600 hover:text-gray-900"
//             }`}
//           >
//             <div className="flex items-center space-x-2">
//               <FiFileText />
//               <span>Blogs ({blogs.length})</span>
//             </div>
//           </button>
//         </div>

//         {/* Content */}
//         {activeTab === "users" && (
//           <motion.div
//             key="users"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="bg-white rounded-xl shadow-sm overflow-hidden"
//           >
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900">
//                 User Management
//               </h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       User
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Email
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Role
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Joined
//                     </th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   <AnimatePresence>
//                     {users.map((user, index) => (
//                       <motion.tr
//                         key={user._id}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.05 }}
//                         className="hover:bg-gray-50"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
//                               <span className="font-medium text-primary-600">
//                                 {user.username.charAt(0).toUpperCase()}
//                               </span>
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {user.username}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {user.email}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               user.isAdmin
//                                 ? "bg-purple-100 text-purple-800"
//                                 : "bg-green-100 text-green-800"
//                             }`}
//                           >
//                             {user.isAdmin ? "Admin" : "User"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {new Date(user.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           {!user.isAdmin && (
//                             <Button
//                               onClick={() =>
//                                 handleDeleteUser(user._id, user.username)
//                               }
//                               disabled={deleting === user._id}
//                               className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
//                             >
//                               {deleting === user._id ? (
//                                 <span className="flex items-center">
//                                   <svg
//                                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <circle
//                                       className="opacity-25"
//                                       cx="12"
//                                       cy="12"
//                                       r="10"
//                                       stroke="currentColor"
//                                       strokeWidth="4"
//                                     ></circle>
//                                     <path
//                                       className="opacity-75"
//                                       fill="currentColor"
//                                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                     ></path>
//                                   </svg>
//                                   Deleting...
//                                 </span>
//                               ) : (
//                                 <div className="flex items-center">
//                                   <FiTrash2 className="mr-1" /> Delete
//                                 </div>
//                               )}
//                             </Button>
//                           )}
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </AnimatePresence>
//                 </tbody>
//               </table>
//             </div>
//           </motion.div>
//         )}

//         {activeTab === "blogs" && (
//           <motion.div
//             key="blogs"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="bg-white rounded-xl shadow-sm overflow-hidden"
//           >
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900">
//                 Blog Management
//               </h2>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <AnimatePresence>
//                   {blogs.map((blog, index) => (
//                     <motion.div
//                       key={blog._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
//                     >
//                       {blog.coverImage && (
//                         <img
//                           src={blog.coverImage}
//                           alt={blog.title}
//                           className="w-full h-32 object-cover rounded mb-4"
//                         />
//                       )}
//                       <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
//                         {blog.title}
//                       </h3>
//                       <div className="text-sm text-gray-500 mb-2">
//                         Category:{" "}
//                         <span className="font-medium">{blog.category}</span>
//                       </div>
//                       <div className="text-sm text-gray-500 mb-2">
//                         Author:{" "}
//                         <span className="font-medium">
//                           {blog.author?.username}
//                         </span>
//                       </div>
//                       <div className="text-sm text-gray-500 mb-4">
//                         Created: {new Date(blog.createdAt).toLocaleDateString()}
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-500">
//                           {blog.likes?.length || 0} likes •{" "}
//                           {blog.comments?.length || 0} comments
//                         </span>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
