const User = require("../models/User");
const Blog = require("../models/Blog");
const cloudinary = require("../utils/cloudinary.js");
const bcrypt = require('bcrypt');

// Add this to your adminController.js

// @desc    Create user (admin only)
// @route   POST /api/admin/users
const createUser = async (req, res) => {
  const { username, email, password, isAdmin = false } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password: password || 'temporary123', // Default password if not provided
      isAdmin,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    // Remove password from response
    user.password = undefined;

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }, "-password");
    res.json({ totalUsers: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get user by ID with their blogs
// @route   GET /api/admin/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all blogs by this user
    const blogs = await Blog.find({ author: req.params.id }).sort({
      createdAt: -1,
    });

    res.json({
      user,
      blogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update user (admin can change username/email)
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    user.username = username || user.username;
    user.email = email || user.email;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: "Cannot delete admin user" });
    }

    // ✅ Delete all blogs authored by this user
    const deletedBlogs = await Blog.deleteMany({ author: req.params.id });

    // ✅ Delete the user
    await User.deleteOne({ _id: req.params.id });

    res.json({
      message: "User and all associated blogs removed successfully",
      deletedBlogsCount: deletedBlogs.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//* BLOG MANAGEMENT
// @desc    Get all blogs (admin)
// @route   GET /api/admin/blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get blog by ID
// @route   GET /api/admin/blogs/:id
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username avatar"
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create blog as admin
// @route   POST /api/admin/blogs
// In adminController.js - createBlog function
const createBlog = async (req, res) => {
  const { title, content, category, tags, authorId } = req.body;

  try {
    const blogAuthor = authorId || req.user._id;
    const author = await User.findById(blogAuthor);
    if (!author) {
      return res.status(400).json({ message: "Invalid author ID" });
    }

    let coverImageUrl = "";

    // ✅ FIX: Handle file upload correctly
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "blog-covers",
            width: 800,
            crop: "fill",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      coverImageUrl = result.secure_url;
    }

    const blog = new Blog({
      title,
      content,
      coverImage: coverImageUrl,
      author: req.user._id,
      category,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update any blog
// @route   PUT /api/admin/blogs/:id
const updateBlog = async (req, res) => {
  const { title, content, category, tags, authorId } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update author if provided
    if (authorId) {
      const author = await User.findById(authorId);
      if (!author) {
        return res.status(400).json({ message: "Invalid author ID" });
      }
      blog.author = authorId;
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.tags = tags ? tags.split(",").map((tag) => tag.trim()) : blog.tags;

    if (req.file) {
      // Delete old image if exists
      if (blog.coverImage) {
        const publicId = blog.coverImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`blog-covers/${publicId}`);
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "blog-covers",
            width: 800,
            crop: "fill",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      blog.coverImage = result.secure_url;
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete any blog
// @route   DELETE /api/admin/blogs/:id
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete cover image
    if (blog.coverImage) {
      const publicId = blog.coverImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`blog-covers/${publicId}`);
    }

    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: "Blog removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
