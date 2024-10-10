const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../controllers/authController');

// Middleware function to verify the JWT token
exports.verifyToken = (req, res, next) => {
  // Retrieve the token from the request headers
  const token = req.headers['authorization'];

  // If no token is found, return a 403 Forbidden response
  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  // Verify the provided token using the secret stored in environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // If token verification fails, return a 401 Unauthorized response
    if (err) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    
    // If the token is valid, save the decoded token (user data) in the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = {
  verifyToken: isAuthenticated
};
