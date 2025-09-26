const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/profile').get(protect, getUserProfile).put(protect, upload.single('avatar'), updateUserProfile);

module.exports = router;