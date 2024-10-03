const admin = require('firebase-admin');

// Imported the service account key to authenticate the Firebase Admin SDK
// This key contains all necessary credentials to access Firebase services
const serviceAccount = require('../Firebase key/wisdompeak-assignment-firebase-adminsdk-gds59-e4bfd3f57a.json');

// Initialized the Firebase Admin SDK with the service account credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount) // Use the service account to authenticate
});

module.exports = admin;