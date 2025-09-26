const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  deleteComment,
} = require("../controllers/blogController");
const upload = require("../middleware/upload");
const { optionalAuth } = require("../middleware/optionalAuth");

const router = express.Router();

// Apply optionalAuth to ALL blog routes so req.user is available when possible
router.use(optionalAuth);

router
  .route("/")
  .get(getBlogs)
  .post(protect, upload.single("coverImage"), createBlog);

router
  .route("/:id")
  .get(getBlogById)
  .put(protect, upload.single("coverImage"), updateBlog)
  .delete(protect, deleteBlog);

router.route("/:id/like").put(protect, likeBlog);
router.route("/:id/comment").post(protect, addComment);
// Add this route (place it after other comment routes)
router.route("/:id/comment/:commentId").delete(protect, deleteComment);

module.exports = router;
