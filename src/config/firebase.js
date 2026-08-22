const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

// Read from Environment Variables to keep credentials secure
const serviceAccount = {
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
};

try {
  if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully');
  } else {
    console.log('Firebase Admin not initialized. Environment variables are missing.');
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error.message);
}

const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  if (!fcmToken || !serviceAccount.project_id) {
    console.log('Skipping push notification because Firebase is not fully configured or missing FCM token.');
    return;
  }
  
  try {
    const payload = {
      token: fcmToken,
      notification: {
        title,
        body
      },
      data
    };
    const response = await getMessaging().send(payload);
    console.log('Successfully sent push notification:', response);
  } catch (error) {
    if (error.code === 'messaging/registration-token-not-registered' || error.code === 'messaging/invalid-registration-token') {
      console.log(`[Firebase] Device unregistered for token: ${fcmToken.substring(0, 10)}... Removing from DB.`);
      try {
        const User = require('../modules/user/user.model');
        await User.updateMany(
          { fcmToken: fcmToken },
          { $unset: { fcmToken: 1 } }
        );
      } catch (dbError) {
        console.error('[Firebase] Failed to remove unregistered token from DB:', dbError.message);
      }
    } else {
      console.error('Error sending push notification:', error);
    }
  }
};

module.exports = { sendPushNotification };
