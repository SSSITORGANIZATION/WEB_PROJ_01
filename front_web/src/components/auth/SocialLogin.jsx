import React from 'react';
import { Chrome, Github } from 'lucide-react';
import { authService } from '../../services/authService';

const SocialLogin = ({ onLoadingChange, onError }) => {
  const handleGoogleLogin = async () => {
    if (onLoadingChange) onLoadingChange(true);
    try {
      const result = await authService.signInWithGoogle();
      if (onLoadingChange) onLoadingChange(false);
      return result;
    } catch (err) {
      if (onLoadingChange) onLoadingChange(false);
      if (onError) onError(err.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  const handleGithubLogin = async () => {
    if (onLoadingChange) onLoadingChange(true);
    try {
      const result = await authService.signInWithGithub();
      if (onLoadingChange) onLoadingChange(false);
      return result;
    } catch (err) {
      if (onLoadingChange) onLoadingChange(false);
      if (onError) onError(err.message || 'Failed to sign in with GitHub');
      throw err;
    }
  };

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
