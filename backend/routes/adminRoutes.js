const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getUsers,
  deleteUser,
  getAllBlogs,
  getUserById,
  updateUser,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  createUser,
} = require("../controllers/adminController");
const upload = require("../middleware/upload");

const router = express.Router();

// User Management
router
  .route("/users")
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser); // ✅ Add POST route
router
  .route("/users/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

// Blog Management
router
  .route("/blogs")
  .post(protect, admin, upload.single("coverImage"), createBlog);

router
  .route("/blogs/:id")
  .get(protect, admin, getBlogById)
  .put(protect, admin, upload.single("coverImage"), updateBlog)
  .delete(protect, admin, deleteBlog);

router.route("/blogs").get(protect, admin, getAllBlogs);

module.exports = router;
