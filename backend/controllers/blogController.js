const Blog = require("../models/Blog");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary.js");

// @desc    Create new blog
// @route   POST /api/blogs
const createBlog = async (req, res) => {
  const { title, content, category, tags } = req.body;

  try {
    let coverImageUrl = "";
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

// @desc    Get all blogs
// @route   GET /api/blogs
const getBlogs = async (req, res) => {
  try {
    const { keyword, category, author } = req.query;
    let filter = {};

    // 🔍 SEARCH BY KEYWORD (title, content, author username)
    if (keyword) {
      const users = await User.find({
        username: { $regex: keyword, $options: 'i' }
      }, '_id');
      const userIds = users.map(user => user._id);

      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
        { author: { $in: userIds } }
      ];
    }

    // 🏷️ CATEGORY + TAG FILTERING (case-insensitive + partial match)
    if (category) {
      // Create regex for the input
      const categoryRegex = { $regex: category, $options: 'i' };
      
      // Match either category field OR any tag in tags array
      const categoryTagFilter = {
        $or: [
          { category: categoryRegex },
          { tags: categoryRegex } // MongoDB automatically checks array elements
        ]
      };

      // Merge with existing filter
      if (filter.$or) {
        // If keyword search is active, combine with AND logic
        filter = {
          $and: [
            { $or: filter.$or },
            categoryTagFilter
          ]
        };
      } else {
        // No keyword search, just use category/tag filter
        filter = categoryTagFilter;
      }
    }

    // 👤 FILTER BY CURRENT USER
    if (author === 'me' && req.user) {
      if (filter.$and) {
        filter.$and.push({ author: req.user._id });
      } else if (filter.$or) {
        filter = { $and: [{ $or: filter.$or }, { author: req.user._id }] };
      } else {
        filter.author = req.user._id;
      }
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.error('Blog search error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username avatar")
      .populate({
        path: "comments.user", // 👈 Populate user inside each comment
        select: "username avatar", // 👈 Only get these fields
      });

    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
const updateBlog = async (req, res) => {
  const { title, content, category, tags } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);

    if (blog && blog.author.toString() === req.user._id.toString()) {
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
    } else {
      res.status(403).json({ message: "Not authorized or blog not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
const deleteBlog = async (req, res) => {
  try {
    // Step 1: Find blog
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Step 2: Check authorization
    if (blog.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this blog" });
    }

    // Step 3: Try to delete image (optional — failure won't block blog deletion)
    if (blog.coverImage) {
      try {
        const url = blog.coverImage.trim();
        let publicId;

        // Extract public_id — handles version, extension, folders
        const match = url.match(/\/v\d+\/(.+?)\.[a-zA-Z]+$/);
        if (match) {
          publicId = match[1]; // e.g., "blog-covers/abc123"
        } else {
          // Fallback for non-standard URLs
          const parts = url.split("/");
          const filename = parts[parts.length - 1];
          publicId = filename.split(".")[0];
          if (
            url.includes("/blog-covers/") &&
            !publicId.includes("blog-covers/")
          ) {
            publicId = `blog-covers/${publicId}`;
          }
        }

        console.log("🗑️ [Cloudinary] Attempting to delete:", publicId);
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== "ok") {
          console.warn("⚠️ [Cloudinary] Failed to delete image:", result);
        } else {
          console.log("✅ [Cloudinary] Image deleted successfully");
        }
      } catch (imgError) {
        console.error(
          "❌ [Cloudinary] Error during image deletion:",
          imgError.message
        );
        // DO NOT THROW — continue with blog deletion
      }
    }

    // Step 4: DELETE BLOG FROM MONGODB — MUST HAPPEN
    console.log("🗄️ Deleting blog from MongoDB...");
    const deleteResult = await Blog.deleteOne({ _id: req.params.id });

    if (deleteResult.deletedCount === 0) {
      console.error("❌ MongoDB deletion failed — no document deleted");
      return res
        .status(500)
        .json({ message: "Failed to delete blog from database" });
    }

    console.log("✅ Blog deleted successfully from DB");
    res.json({ message: "Blog removed successfully" });
  } catch (error) {
    console.error("🔥 [CRITICAL] Delete blog server error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// const deleteBlog = async (req, res) => {
//   try {
//     console.log('entering');
//     const blog = await Blog.findById(req.params.id);
//     console.log(blog);

//     if (blog && blog.author.toString() === req.user._id.toString()) {
//       // Delete cover image from Cloudinary
//       if (blog.coverImage) {
//         const publicId = blog.coverImage.split("/").pop().split(".")[0];
//         await cloudinary.uploader.destroy(`blog-covers/${publicId}`);
//       }

//       await blog.remove();
//       res.json({ message: "Blog removed" });
//     } else {
//       res.status(403).json({ message: "Not authorized or blog not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// @desc    Like blog
// @route   PUT /api/blogs/:id/like
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userId = req.user._id.toString();
    const hasLiked = blog.likes.some((id) => id.toString() === userId);

    if (hasLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json({ likes: blog.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add comment
// @route   POST /api/blogs/:id/comment
const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      const comment = {
        user: req.user._id,
        text,
      };

      blog.comments.push(comment);
      await blog.save();

      // Populate user in the new comment
      const populatedBlog = await Blog.findById(req.params.id).populate(
        "comments.user",
        "username avatar"
      );
      const newComment =
        populatedBlog.comments[populatedBlog.comments.length - 1];

      res.status(201).json(newComment);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete comment
// @route   DELETE /api/blogs/:id/comment/:commentId
const deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Find comment
    const comment = blog.comments.find(
      (c) => c._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check ownership
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    // Remove comment
    blog.comments = blog.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    await blog.save();

    res.json({ message: "Comment removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  deleteComment,
};
