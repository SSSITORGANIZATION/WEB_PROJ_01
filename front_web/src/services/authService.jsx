import { apiService } from './api';
import { auth, googleProvider, githubProvider, signInWithPopup, isFirebaseConfigured } from '../config/firebase';

// AuthUser structure for reference (not needed in JS but documented for clarity)
// {
//   id: number,
//   email: string,
//   name: string,
//   phone?: string,
//   is_verified: boolean,
//   created_at: string
// }

class AuthService {
  constructor() {
    // Initialize user from localStorage
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
    this.listeners = [];
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    // Call immediately with current user
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser));
  }

  // Save user to localStorage and notify listeners
  setUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
    this.notifyListeners();
  }

  // Send OTP for email verification
  async sendOTP(email) {
    try {
      await apiService.sendOTP(email);
    } catch (error) {
      throw new Error('Failed to send OTP. Please try again.');
    }
  }

  // Verify OTP
  async verifyOTP(email, otp) {
    try {
      const response = await apiService.verifyOTP(email, otp);
      return response.data;
    } catch (error) {
      throw new Error('Invalid or expired OTP.');
    }
  }

  // Register new customer
  async register(data) {
    try {
      const response = await apiService.registerCustomer(data);
      const user = response.data;
      this.setUser(user);
      return user;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Registration failed. Please try again.');
    }
  }

  // Login customer
  async login(email, password) {
    try {
      const response = await apiService.loginCustomer(email, password);
      const user = response.data;
      this.setUser(user);
      return user;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  // Reset password
  async resetPassword(email, newPassword) {
    try {
      await apiService.resetCustomerPassword(email, newPassword);
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Password reset failed. Please try again.');
    }
  }

  // Logout
  async signOut() {
    this.setUser(null);
  }

  // Firebase Google Authentication (Free and Easy)
  async signInWithGoogle() {
    try {
      if (!isFirebaseConfigured) {
        throw new Error('Social sign-in is not configured. Add Firebase credentials to front_web/.env.local.');
      }
      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Create user object for your app
      const firebaseUser = {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        picture: user.photoURL,
        email_verified: user.emailVerified,
        phone: user.phoneNumber || '',
        is_verified: user.emailVerified,
        created_at: user.metadata.creationTime || new Date().toISOString()
      };

      // You can optionally send this to your backend
      // await apiService.googleAuth(firebaseUser);

      this.setUser(firebaseUser);
      return firebaseUser;
    } catch (error) {
      console.error('Firebase Google auth error:', error);

      // Handle specific Firebase errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked by browser. Please allow pop-ups for this site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else {
        throw new Error('Failed to sign in with Google. Please try again.');
      }
    }
  }

  async signInWithGithub() {
    try {
      if (!isFirebaseConfigured) {
        throw new Error('Social sign-in is not configured. Add Firebase credentials to front_web/.env.local.');
      }
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      const firebaseUser = {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0],
        picture: user.photoURL,
        email_verified: user.emailVerified,
        phone: user.phoneNumber || '',
        is_verified: user.emailVerified,
        created_at: user.metadata.creationTime || new Date().toISOString()
      };

      this.setUser(firebaseUser);
      return firebaseUser;
    } catch (error) {
      console.error('Firebase GitHub auth error:', error);

      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked by browser. Please allow pop-ups for this site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else {
        throw new Error('Failed to sign in with GitHub. Please try again.');
      }
    }
  }
}

export const authService = new AuthService();
export default authService;
