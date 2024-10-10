const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/verify-email', authController.verifyEmail);
router.post('/verify-otp', authController.verifyOTP);
router.post('/logout', verifyToken, authController.logout);
router.get('/check-auth', verifyToken, (req, res) => {
  res.status(200).json({ message: "Authenticated", user: req.user });
});

module.exports = router;