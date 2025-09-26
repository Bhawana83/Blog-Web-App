// src/services/blogService.js
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from './axiosInstance';

export const getAllBlogs = (params = {}) => {
  return axiosInstance.get(API_PATHS.BLOGS.GET_ALL, { params });
};

export const getBlogById = (id) => {
  return axiosInstance.get(API_PATHS.BLOGS.GET_BY_ID(id));
};

export const createBlog = (formData) => {
  return axiosInstance.post(API_PATHS.BLOGS.CREATE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateBlog = (id, formData) => {
  return axiosInstance.put(API_PATHS.BLOGS.UPDATE(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteBlog = (id) => {
  return axiosInstance.delete(API_PATHS.BLOGS.DELETE(id));
};

export const likeBlog = (id) => {
  return axiosInstance.put(API_PATHS.BLOGS.LIKE(id));
};

export const addComment = (id, data) => {
  return axiosInstance.post(API_PATHS.BLOGS.ADD_COMMENT(id), data);
};

// Add this export
export const deleteComment = (blogId, commentId) => {
  return axiosInstance.delete(API_PATHS.BLOGS.DELETE_COMMENT(blogId, commentId));
};