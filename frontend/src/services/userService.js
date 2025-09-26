// src/services/userService.js
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from './axiosInstance';

export const getProfile = () => {
  return axiosInstance.get(API_PATHS.USER.GET_PROFILE);
};

export const updateProfile = (formData) => {
  return axiosInstance.put(API_PATHS.USER.UPDATE_PROFILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};