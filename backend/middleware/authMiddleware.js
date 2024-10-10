const admin = require('../config/firebase');

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