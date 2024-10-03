const admin = require('../config/firebase');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to validate if the email is a Gmail address (Changeable)
const validateEmail = (email) => {
  const regex = /@gmail\.com$/;
  return regex.test(email);
};

// Function to send an OTP to the user's email using Nodemailer
const sendEmail = async (to, otp) => {
  // Transporter for sending emails using Gmail
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Use of Gmail service(Changeable)
    auth: {
      user: process.env.EMAIL_USER, // Sender's email (from environment variables)
      pass: process.env.EMAIL_APP_PASSWORD // App password for the email account (from environment variables)
    }
  });

  // Send the OTP email
  let info = await transporter.sendMail({
    from: '"Admin Login" sandeephunter2002@gmail.com', // Sender's email
    to: to, // Recipient's email
    subject: "Your OTP for Admin Login", // Subject of the email
    text: `Your OTP is: ${otp}`, // Plain text version of the message
    html: `<b>Your OTP is: ${otp}</b>` // HTML version of the message
  });

  // Log the message ID for tracking
  console.log("Message sent: %s", info.messageId);
};

// Controller function to verify the email and send an OTP
exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is valid (must be a Gmail address)
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Email doesn't match the required format." });
    }

    const otp = generateOTP(); // Generate a 6-digit OTP
    const expirationTime = Date.now() + 600000; // OTP is valid for 10 minutes (600,000 ms)

    // Store the OTP in Firestore with an expiration time
    await admin.firestore().collection('otps').doc(email).set({
      otp,
      expirationTime,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send the OTP to the user's email
    await sendEmail(email, otp);

    res.status(200).json({ message: "Verified successfully. OTP sent to email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login error occurred." });
  }
};

// Controller function to verify the OTP and log the user in
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, rememberMe } = req.body;

    // Retrieve the OTP from Firestore for the provided email
    const otpDoc = await admin.firestore().collection('otps').doc(email).get();

    // Check if the OTP exists in Firestore
    if (!otpDoc.exists) {
      return res.status(400).json({ message: "OTP not found or expired." });
    }

    const { otp: storedOTP, expirationTime } = otpDoc.data(); // Get stored OTP and expiration time

    // Check if the OTP has expired
    if (Date.now() > expirationTime) {
      await admin.firestore().collection('otps').doc(email).delete(); // Delete expired OTP
      return res.status(400).json({ message: "OTP has expired." });
    }

    // Check if the provided OTP matches the stored OTP
    if (otp !== storedOTP) {
      return res.status(400).json({ message: "OTP is incorrect." });
    }

    // Delete the used OTP from Firestore
    await admin.firestore().collection('otps').doc(email).delete();

    // Generate a JWT token with an expiration time based on the rememberMe option
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? '24h' : '1h' // 24 hours if rememberMe is true, otherwise 1 hour
    });

    // Respond with the token and a success message
    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OTP error occurred." });
  }
};

// Controller function for auto-login based on a valid JWT token
exports.autoLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    // If no token is provided, return a 403 Forbidden response
    if (!token) {
      return res.status(403).json({ message: "No token provided." });
    }

    // Verify the provided JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized!" });
      }
      
      // Check if the decoded email matches the email in the request body
      if (decoded.email !== email) {
        return res.status(401).json({ message: "Email mismatch!" });
      }

      // Respond with a success message if the email matches
      res.status(200).json({ message: "Auto login successful", user: { email } });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Auto login error occurred." });
  }
};
