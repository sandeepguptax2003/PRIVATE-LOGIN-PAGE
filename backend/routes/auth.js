const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/verify-email', authController.verifyEmail);
router.post('/verify-otp', authController.verifyOTP);
router.post('/logout', isAuthenticated, authController.logout);
router.get('/check-auth', isAuthenticated, (req, res) => {
  res.status(200).json({ message: "Authenticated", user: req.user });
});

module.exports = router;