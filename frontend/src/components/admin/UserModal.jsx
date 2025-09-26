// src/components/admin/UserModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { createUser, updateUser } from '../../services/adminService';

const UserModal = ({ isOpen, onClose, user = null, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '', // Only for new users
    isAdmin: user?.isAdmin || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (user) {
        // Update existing user (don't send password)
        const { password, ...updateData } = formData;
        response = await updateUser(user._id, updateData);
      } else {
        // Create new user
        response = await createUser(formData);
      }
      
      onUserUpdated(response.data);
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save user';
      setError(errorMessage);
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
        className="bg-white rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {user ? 'Edit User' : 'Create New User'}
        </h2>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password (optional)
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Leave blank for auto-generated password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                If left blank, user will need to reset password on first login
              </p>
            </div>
          )}
          
          {/* <div className="flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              checked={formData.isAdmin}
              onChange={(e) => setFormData({...formData, isAdmin: e.target.checked})}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
              Admin User
            </label>
          </div>
           */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white"
            >
              {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800"
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserModal;

//* Previous code
// // src/components/admin/UserModal.jsx
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import Button from "../ui/Button";
// import { createUser, updateUser } from "../../services/adminService";
// import toast from "react-hot-toast";

// const UserModal = ({ isOpen, onClose, user = null, onUserUpdated }) => {
//   const [formData, setFormData] = useState({
//     username: user?.username || "",
//     email: user?.email || "",
//     isAdmin: user?.isAdmin || false,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       let response;
//       if (user) {
//         // Update existing user
//         response = await updateUser(user._id, formData);
//         toast.success("✅ User updated Successfully...");
//       } else {
//         // Create new user (we'll implement createUser in adminService)
//         response = await createUser(formData);
//         toast.success("✅ User created Successfully...");
//       }

//       onUserUpdated(response.data);
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//         className="bg-white rounded-xl p-6 w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold text-gray-900 mb-4">
//           {user ? "Edit User" : "Create New User"}
//         </h2>

//         {error && (
//           <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Username
//             </label>
//             <input
//               type="text"
//               value={formData.username}
//               onChange={(e) =>
//                 setFormData({ ...formData, username: e.target.value })
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//               required
//             />
//           </div>

//           {/* <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="isAdmin"
//               checked={formData.isAdmin}
//               onChange={(e) => setFormData({...formData, isAdmin: e.target.checked})}
//               className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//             />
//             <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
//               Admin User
//             </label>
//           </div> */}

//           <div className="flex space-x-3 pt-4">
//             <Button
//               type="submit"
//               disabled={loading}
//               className="flex-1 bg-primary-600 text-white"
//             >
//               {loading ? "Saving..." : user ? "Update User" : "Create User"}
//             </Button>
//             <Button
//               type="button"
//               onClick={onClose}
//               className="flex-1 bg-gray-200 text-gray-800"
//             >
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default UserModal;
