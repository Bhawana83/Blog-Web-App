// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const { currentUser, login } = useAuth();

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
      setFormData({
        username: res.data.username,
        email: res.data.email,
        bio: res.data.bio || '',
      });
      if (res.data.avatar) {
        setAvatarPreview(res.data.avatar);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('bio', formData.bio);
    if (avatarFile) data.append('avatar', avatarFile);

    try {
      const res = await updateProfile(data);
      login(res.data);
      setUser(res.data);
      setEditing(false);
      if (res.data.avatar) {
        setAvatarPreview(res.data.avatar);
      }
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
          
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-8">
                <label htmlFor="image" className='cursor-pointer'>
                  <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-gray-500">
                        {formData.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id='image'
                  onChange={handleFileChange}
                  className="text-sm text-gray-500 cursor-pointer bg-slate-200 p-2 rounded-2xl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="4"
                />
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-3 flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-200 text-gray-800 px-6 py-3 flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-primary-100 mb-4 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-primary-600">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
              
              {user.bio && (
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
                  <p className="text-gray-700">{user.bio}</p>
                </div>
              )}
              
              <Button
                onClick={() => setEditing(true)}
                className="w-full bg-primary-600 text-white py-3"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;