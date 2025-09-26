export const BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    GET_USER_INFO: "/api/users/profile",
  },
  BLOGS: {
    GET_ALL: "/api/blogs",
    GET_BY_ID: (id) => `/api/blogs/${id}`,
    CREATE: "/api/blogs",
    UPDATE: (id) => `/api/blogs/${id}`,
    DELETE: (id) => `/api/blogs/${id}`,
    LIKE: (id) => `/api/blogs/${id}/like`,
    ADD_COMMENT: (id) => `/api/blogs/${id}/comment`,
    DELETE_COMMENT: (blogId, commentId) =>
      `/api/blogs/${blogId}/comment/${commentId}`,
  },
  USER: {
    GET_PROFILE: "/api/users/profile",
    UPDATE_PROFILE: "/api/users/profile",
  },
  ADMIN: {
    // User Management
    CREATE_USER: "/api/admin/users", // ✅ Add this
    GET_USER_BY_ID: (id) => `/api/admin/users/${id}`,
    UPDATE_USER: (id) => `/api/admin/users/${id}`,
    GET_ALL_USERS: "/api/admin/users",
    DELETE_USER: (id) => `/api/admin/users/${id}`,

    // Blog Management
    GET_ALL_BLOGS: "/api/admin/blogs",
    GET_BLOG_BY_ID: (id) => `/api/admin/blogs/${id}`,
    CREATE_BLOG: "/api/admin/blogs",
    UPDATE_BLOG: (id) => `/api/admin/blogs/${id}`,
    DELETE_BLOG: (id) => `/api/admin/blogs/${id}`,
  },
};
