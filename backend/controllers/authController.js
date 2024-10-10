const admin = require('../config/firebase');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to validate if the email is from the acredge.in domain
const validateEmail = (email) => {
  const regex = /@acredge\.in$/;
  return regex.test(email);
};

// Function to send an OTP to the user's email using Nodemailer
const sendEmail = async (to, otp) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

  let info = await transporter.sendMail({
    from: '"Admin Login" <sandeephunter2002@gmail.com>',
    to: to,
    subject: "Your OTP for Admin Login",
    text: `Your OTP is: ${otp}`,
    html: `<b>Your OTP is: ${otp}</b>`
  });

  console.log("Message sent: %s", info.messageId);
};

// Generate a session token
const generateSessionToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Controller function to verify the email and send an OTP
exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Email doesn't match the required format." });
    }

    const otp = generateOTP();
    const expirationTime = Date.now() + 300000; // OTP is valid for 5 minutes

    await admin.firestore().collection('otps').doc(email).set({
      otp,
      expirationTime,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

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

    const otpDoc = await admin.firestore().collection('otps').doc(email).get();

    if (!otpDoc.exists) {
      return res.status(400).json({ message: "OTP not found or expired." });
    }

    const { otp: storedOTP, expirationTime } = otpDoc.data();

    if (Date.now() > expirationTime) {
      await admin.firestore().collection('otps').doc(email).delete();
      return res.status(400).json({ message: "OTP has expired." });
    }

    if (otp !== storedOTP) {
      return res.status(400).json({ message: "OTP is incorrect." });
    }

    await admin.firestore().collection('otps').doc(email).delete();

    const sessionToken = generateSessionToken();
    const expiresIn = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 days or 1 day
    const expirationDate = new Date(Date.now() + expiresIn);

    await admin.firestore().collection('sessions').doc(sessionToken).set({
      email,
      expirationDate,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.cookie('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expirationDate,
      sameSite: 'strict'
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OTP error occurred." });
  }
};

// Middleware to check if the user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  const sessionToken = req.cookies.session;

  if (!sessionToken) {
    return res.status(401).json({ message: "Unauthorized: No session token" });
  }

  try {
    const sessionDoc = await admin.firestore().collection('sessions').doc(sessionToken).get();

    if (!sessionDoc.exists) {
      return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }

    const { email, expirationDate } = sessionDoc.data();

    if (new Date() > new Date(expirationDate)) {
      await admin.firestore().collection('sessions').doc(sessionToken).delete();
      res.clearCookie('session');
      return res.status(401).json({ message: "Unauthorized: Session expired" });
    }

    req.user = { email };
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Authentication error occurred." });
  }
};

// Controller function for logging out
exports.logout = async (req, res) => {
  const sessionToken = req.cookies.session;

  if (sessionToken) {
    await admin.firestore().collection('sessions').doc(sessionToken).delete();
  }

  res.clearCookie('session');
  res.status(200).json({ message: "Logged out successfully" });
};