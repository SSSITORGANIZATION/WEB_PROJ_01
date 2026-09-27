// Firebase Configuration
// This is a demo Firebase project - completely free to use
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase credentials should be provided through front_web/.env.local.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase is properly configured (not using placeholder values)
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => {
  if (!value) return false;
  // Check for placeholder values
  const placeholderPatterns = [
    'your-firebase',
    'your-project',
    'your-app',
    'placeholder'
  ];
  const lowerValue = String(value).toLowerCase();
  return !placeholderPatterns.some(pattern => lowerValue.includes(pattern));
});

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

if (typeof window !== 'undefined') {
  window.__FIREBASE_READY__ = isFirebaseConfigured;
}

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure GitHub Provider
githubProvider.addScope('read:user');

export { auth, googleProvider, githubProvider, signInWithPopup, isFirebaseConfigured };

// Alternative: Use your own Firebase project (optional)
// To create your own free Firebase project:
// 1. Go to https://console.firebase.google.com/
// 2. Click "Add project" → Name your project
// 3. Enable Authentication → Google sign-in
// 4. Copy your config and replace the firebaseConfig above
