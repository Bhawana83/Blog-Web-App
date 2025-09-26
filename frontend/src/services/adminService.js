// src/services/adminService.js
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from './axiosInstance';

// User Management
export const getAllUsers = () => {
  return axiosInstance.get(API_PATHS.ADMIN.GET_ALL_USERS);
};

export const getUserById = (id) => {
  return axiosInstance.get(API_PATHS.ADMIN.GET_USER_BY_ID(id));
};

export const createUser = (userData) => {
  return axiosInstance.post(API_PATHS.ADMIN.CREATE_USER, userData);
};

export const updateUser = (id, userData) => {
  return axiosInstance.put(API_PATHS.ADMIN.UPDATE_USER(id), userData);
};

export const deleteUser = (id) => {
  return axiosInstance.delete(API_PATHS.ADMIN.DELETE_USER(id));
};


// Blog Management
export const getAllBlogs = () => {
  return axiosInstance.get(API_PATHS.ADMIN.GET_ALL_BLOGS);
};

export const getBlogById = (id) => {
  return axiosInstance.get(API_PATHS.ADMIN.GET_BLOG_BY_ID(id));
};

export const createBlog = (formData) => {
  return axiosInstance.post(API_PATHS.ADMIN.CREATE_BLOG, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateBlog = (id, formData) => {
  return axiosInstance.put(API_PATHS.ADMIN.UPDATE_BLOG(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteBlog = (id) => {
  return axiosInstance.delete(API_PATHS.ADMIN.DELETE_BLOG(id));
};