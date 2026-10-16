import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../auth/authContext.jsx';
import { apiService } from '../../services/api';
import PasswordInput from '../../components/auth/PasswordInput';
import OTPInput from '../../components/auth/OTPInput';
import Navbar from '../../components/Navbar';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^[0-9]+$/;

    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await apiService.sendOTP(formData.email);

      setShowOTP(true);
      setSuccess(
        'OTP sent to your email. Please verify to complete registration.'
      );
    } catch (err) {
      console.error('OTP error:', err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.registerCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        otp
      });

      const result = response?.data ?? response;

      const token =
        result?.token ||
        result?.access ||
        result?.access_token ||
        result?.key;

      const user = result?.user || result?.customer;

      if (token && user) {
        setAuth(user, token);
        navigate('/', { replace: true });
      } else {
        setError(
          result?.error ||
          result?.message ||
          'Registration succeeded, but authentication details were not returned.'
        );
      }
    } catch (err) {
      console.error('Registration error:', err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.sendOTP(formData.email);
      setSuccess('New OTP sent to your email');
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar added at the top */}
      <Navbar />

      {/* Existing registration card UI */}
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          {/* Header */}
          <div className="mb-7 text-center">
            <h1 className="mb-1.5 text-2xl font-bold text-gray-900">
              Create account
            </h1>

            <p className="text-sm text-gray-500">
              Sign up to get started
            </p>
          </div>

          {/* Form */}
          <div>
            {!showOTP ? (
              <form
                onSubmit={handleSendOTP}
                className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    autoComplete="name"
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/[^0-9]/g, '');

                      setFormData(prev => ({
                        ...prev,
                        phone: digitsOnly
                      }));

                      setError('');
                    }}
                    placeholder="7032703253"
                    autoComplete="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                  />
                </div>

                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />

                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 sm:col-span-2"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 sm:col-span-2"
                >
                  {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleVerifyAndRegister}
                className="space-y-4"
              >
                <div className="text-center">
                  <CheckCircle className="mx-auto mb-3 h-12 w-12 text-emerald-500" />

                  <h3 className="mb-1 text-base font-semibold text-gray-900">
                    Verify Your Email
                  </h3>

                  <p className="text-xs text-slate-500">
                    We've sent a 6-digit OTP to{' '}
                    <strong>{formData.email}</strong>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-center text-xs font-medium text-slate-600">
                    Enter OTP
                  </label>

                  <OTPInput
                    length={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={loading}
                  />
                </div>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span>{success}</span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  Resend OTP
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowOTP(false);
                    setOtp('');
                    setError('');
                    setSuccess('');
                  }}
                  className="w-full text-sm text-gray-500 hover:text-gray-700"
                >
                  Back to registration form
                </button>
              </form>
            )}

            {!showOTP && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/auth/login"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerRegister;
