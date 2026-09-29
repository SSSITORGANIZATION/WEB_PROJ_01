import { apiService } from './api';

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

  // Get token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null && this.getToken() !== null;
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

  // Set token
  setToken(token) {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
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
      const user = response.data.user || response.data;
      const token = response.data.token;
      
      this.setUser(user);
      this.setToken(token);
      
      return { user, token };
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
      const user = response.data.user || response.data;
      const token = response.data.token;
      
      this.setUser(user);
      this.setToken(token);
      
      return { user, token };
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
    this.setToken(null);
  }
}

export const authService = new AuthService();
export default authService;
