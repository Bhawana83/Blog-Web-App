// src/components/admin/AdminUserManagement.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllUsers, deleteUser } from "../../services/adminService";
import Button from "../ui/Button";
import { FiEdit2, FiEye, FiTrash2, FiUserPlus } from "react-icons/fi";
import Spinner from "../ui/Spinner";
import UserModal from "./UserModal";
import UserDetailModal from "./UserDetailModal";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Modal state variables
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.users); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(userId);
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      alert("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  // Modal handlers
  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleViewUser = (userId) => {
    setSelectedUser({ _id: userId });
    setShowDetailModal(true);
  };

  const handleUserUpdated = (updatedUser) => {
    // Refresh the user list
    fetchUsers();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <Button
          onClick={handleCreateUser}
          className="bg-primary-600 text-white px-4 py-2 flex items-center space-x-2"
        >
          <FiUserPlus />
          <span>Add User</span>
        </Button>
      </div>

      {loading ? (
        <div className="p-8">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="font-medium text-primary-600">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isAdmin
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        onClick={() => handleViewUser(user._id)}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-2"
                        title="View Details"
                      >
                        <FiEye />
                      </Button>

                      <Button
                        onClick={() => handleEditUser(user)}
                        className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 p-2"
                        title="Edit User"
                      >
                        <FiEdit2 />
                      </Button>

                      {!user.isAdmin && (
                        <Button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={deletingId === user._id}
                          className="bg-red-100 text-red-700 hover:bg-red-200 p-2 disabled:opacity-50"
                          title="Delete User"
                        >
                          {deletingId === user._id ? (
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
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <UserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {showEditModal && selectedUser && (
        <UserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {showDetailModal && selectedUser && (
        <UserDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          userId={selectedUser._id}
        />
      )}
    </motion.div>
  );
};

export default AdminUserManagement;

//* Previous code
// // src/components/admin/AdminUserManagement.jsx
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { getAllUsers, deleteUser } from "../../services/adminService";
// import Button from "../ui/Button";
// import { FiEdit2, FiEye, FiTrash2, FiUserPlus } from "react-icons/fi";
// import Spinner from "../ui/Spinner";
// import UserModal from "./UserModal";
// import UserDetailModal from "./UserDetailModal";
// import toast from "react-hot-toast";

// const AdminUserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   // Modal state variables
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const fetchUsers = async () => {
//     try {
//       const res = await getAllUsers();
//       setUsers(res.data.users);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleDeleteUser = async (userId) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     setDeletingId(userId);
//     try {
//       await deleteUser(userId);
//       setUsers(users.filter((user) => user._id !== userId));
//       toast.success("✅ Blog deleted Successfully...");
//     } catch (err) {
//       alert("Failed to delete user");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Modal handlers
//   const handleCreateUser = () => {
//     setShowCreateModal(true);
//   };

//   const handleEditUser = (user) => {
//     setSelectedUser(user);
//     setShowEditModal(true);
//   };

//   const handleViewUser = (userId) => {
//     setSelectedUser({ _id: userId });
//     setShowDetailModal(true);
//   };

//   const handleUserUpdated = (updatedUser) => {
//     // Refresh the user list
//     fetchUsers();
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="bg-white rounded-xl shadow-sm overflow-hidden"
//     >
//       <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//         <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
//         <Button
//           onClick={handleCreateUser}
//           className="bg-primary-600 text-white px-4 py-2 flex items-center space-x-2"
//         >
//           <FiUserPlus />
//           <span>Add User</span>
//         </Button>
//       </div>

//       {loading ? (
//         <div className="p-8">
//           <Spinner />
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   User
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Joined
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               <AnimatePresence>
//                 {users.map((user, index) => (
//                   <motion.tr
//                     key={user._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                     className="hover:bg-gray-50"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
//                           <span className="font-medium text-primary-600">
//                             {user.username.charAt(0).toUpperCase()}
//                           </span>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {user.username}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {user.email}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           user.isAdmin
//                             ? "bg-purple-100 text-purple-800"
//                             : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {user.isAdmin ? "Admin" : "User"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(user.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                       {/* ✅ VIEW BUTTON */}
//                       <Button
//                         onClick={() => handleViewUser(user._id)}
//                         className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-2"
//                         title="View Details"
//                       >
//                         <FiEye />
//                       </Button>

//                       {/* ✅ EDIT BUTTON */}
//                       <Button
//                         onClick={() => handleEditUser(user)}
//                         className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 p-2"
//                         title="Edit User"
//                       >
//                         <FiEdit2 />
//                       </Button>

//                       {/* ✅ DELETE BUTTON */}
//                       {!user.isAdmin && (
//                         <Button
//                           onClick={() => handleDeleteUser(user._id)}
//                           disabled={deletingId === user._id}
//                           className="bg-red-100 text-red-700 hover:bg-red-200 p-2 disabled:opacity-50"
//                           title="Delete User"
//                         >
//                           {deletingId === user._id ? (
//                             <svg
//                               className="animate-spin h-4 w-4"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               ></circle>
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                               ></path>
//                             </svg>
//                           ) : (
//                             <FiTrash2 />
//                           )}
//                         </Button>
//                       )}
//                     </td>
//                   </motion.tr>
//                 ))}
//               </AnimatePresence>
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modals */}
//       {showCreateModal && (
//         <UserModal
//           isOpen={showCreateModal}
//           onClose={() => setShowCreateModal(false)}
//           onUserUpdated={handleUserUpdated}
//         />
//       )}

//       {showEditModal && selectedUser && (
//         <UserModal
//           isOpen={showEditModal}
//           onClose={() => setShowEditModal(false)}
//           user={selectedUser}
//           onUserUpdated={handleUserUpdated}
//         />
//       )}

//       {showDetailModal && selectedUser && (
//         <UserDetailModal
//           isOpen={showDetailModal}
//           onClose={() => setShowDetailModal(false)}
//           userId={selectedUser._id}
//         />
//       )}
//     </motion.div>
//   );
// };