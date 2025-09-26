// src/services/authService.js
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from './axiosInstance';

export const login = (credentials) => {
  return axiosInstance.post(API_PATHS.AUTH.LOGIN, credentials);
};

export const register = (userData) => {
  return axiosInstance.post(API_PATHS.AUTH.REGISTER, userData);
};

export const getUserInfo = () => {
  return axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
};