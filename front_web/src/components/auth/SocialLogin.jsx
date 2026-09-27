import React from 'react';
import { Chrome, Github, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { apiService } from '../../services/api';
import { isFirebaseConfigured } from '../../config/firebase';

const SocialLogin = ({ onLoadingChange, onError, onSuccess }) => {
  const handleGoogleLogin = async () => {
    if (onLoadingChange) onLoadingChange(true);
    try {
      // First authenticate with Firebase
      const firebaseUser = await authService.signInWithGoogle();
      
      // Send Firebase user data to backend for proper account creation/linking
      const response = await apiService.post('/auth/google/', {
        google_id: firebaseUser.id,
        email: firebaseUser.email,
        name: firebaseUser.name,
        avatar_url: firebaseUser.picture
      });
      
      if (onLoadingChange) onLoadingChange(false);
      
      // Use backend response with proper user data and token
      if (onSuccess) {
        onSuccess({
          ...response.data.user,
          token: response.data.token
        });
      }
      
      return response.data;
    } catch (err) {
      if (onLoadingChange) onLoadingChange(false);
      if (onError) onError(err.response?.data?.error || err.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  const handleGithubLogin = async () => {
    if (onLoadingChange) onLoadingChange(true);
    try {
      // First authenticate with Firebase
      const firebaseUser = await authService.signInWithGithub();
      
      // Send Firebase user data to backend for proper account creation/linking
      const response = await apiService.post('/auth/github/', {
        github_id: firebaseUser.id,
        email: firebaseUser.email,
        name: firebaseUser.name,
        avatar_url: firebaseUser.picture
      });
      
      if (onLoadingChange) onLoadingChange(false);
      
      // Use backend response with proper user data and token
      if (onSuccess) {
        onSuccess({
          ...response.data.user,
          token: response.data.token
        });
      }
      
      return response.data;
    } catch (err) {
      if (onLoadingChange) onLoadingChange(false);
      if (onError) onError(err.response?.data?.error || err.message || 'Failed to sign in with GitHub');
      throw err;
    }
  };

  // If Firebase is not configured, show a helpful message
  if (!isFirebaseConfigured) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-800 mb-1">Social Login Not Configured</p>
            <p className="text-amber-700">
              Google and GitHub sign-in require Firebase setup. See{' '}
              <a 
                href="/FIREBASE_SETUP.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-900 underline hover:text-amber-950"
              >
                FIREBASE_SETUP.md
              </a>{' '}
              for instructions. You can still sign up with email/password.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        <Chrome className="w-5 h-5" />
        Continue with Google
      </button>
      <button
        type="button"
        onClick={handleGithubLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        <Github className="w-5 h-5" />
        Continue with GitHub
      </button>
    </div>
  );
};

export default SocialLogin;
