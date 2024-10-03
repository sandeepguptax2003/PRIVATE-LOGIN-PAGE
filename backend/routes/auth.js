const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for email verification
router.post('/verify-email', authController.verifyEmail);
// Route for OTP verification
router.post('/verify-otp', authController.verifyOTP);
// Route for auto-login
router.post('/auto-login', authController.autoLogin);

module.exports = router;
