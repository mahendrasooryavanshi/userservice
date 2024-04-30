const admin = require("firebase-admin");
const secretJson = require("../secret.json");
const config = require("./config.json")[secretJson.ENVIRONMENT];
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = require(config.FIREBASE_PATH);
const firebaseConfig = {
  apiKey: config.API_KEY,
  authDomain: config.AUTH_DOMAIN,
  projectId: config.PROJECT_ID,
  storageBucket: config.STORAGE_BUCKET,
  messagingSenderId: config.MESSAGING_SENDER_ID,
  appId: config.APP_ID,
  measurementId: config.MEASUREMENT_ID,
  credential: admin.credential.cert(serviceAccount),
};
const app = admin.initializeApp(firebaseConfig);
const adminAuth = getAuth(app);
const fireStore = admin.firestore(app);
// module.exports = auth;
module.exports = {
  adminAuth,
  fireStore,
  admin,
};
