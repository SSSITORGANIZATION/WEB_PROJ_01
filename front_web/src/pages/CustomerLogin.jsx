import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe, Mail, Lock, ArrowRight,
  Github, Chrome, Shield, AlertCircle,
  CheckCircle, User, LogIn, UserPlus
} from 'lucide-react';
import { authService } from '../services/authService';

const CustomerLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        if (!showOtpInput) {
          // Send OTP first
          await authService.sendOTP(email);
          setShowOtpInput(true);
        } else {
          // Register with OTP
          const result = await authService.register({
            email,
            name,
            phone,
            password,
            otp
          });
          console.log('User registered:', result);
          navigate('/');
        }
      } else {
        // Login
        const result = await authService.login(email, password);
        console.log('User logged in:', result);
        navigate('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signInWithGoogle();
      console.log('Google user signed in:', result);

      setError(null);
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signInWithGithub();
      console.log('GitHub user signed in:', result);

      setError(null);
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      console.error('GitHub login error:', err);
      setError(err.message || 'Failed to sign in with GitHub. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_30%)] pointer-events-none" />
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute right-8 top-20 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-72 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-blue-950/85 p-7 shadow-[0_30px_80px_rgba(59,130,246,0.18)] backdrop-blur-xl"
        >
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-300 font-semibold">{isSignUp ? 'Register' : 'Login'}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              {isSignUp ? 'Create customer account' : 'Welcome back'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {isSignUp
                ? 'Quick OTP registration with secure blue glass UI.'
                : 'Sign in to manage your projects and bookings.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Full name</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-3xl border border-sky-400/10 bg-slate-950/80 px-11 py-3 text-sm text-white outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-400/20"
                  />
                </div>
              </div>
            )}

            {isSignUp && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Phone</label>
                <input
                  type="tel"
                  required={isSignUp}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+123 456 7890"
                  className="w-full rounded-3xl border border-sky-400/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-400/20"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-3xl border border-sky-400/10 bg-slate-950/80 px-11 py-3 text-sm text-white outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-400/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-3xl border border-sky-400/10 bg-slate-950/80 px-11 py-3 text-sm text-white outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-400/20"
                />
              </div>
            </div>

            {isSignUp && showOtpInput && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.35em] text-slate-400">OTP code</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required={showOtpInput}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full rounded-3xl border border-sky-400/10 bg-slate-950/80 px-11 py-3 text-sm text-white outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-400/20"
                  />
                </div>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-sky-400 to-blue-500 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent"
                />
              ) : (
                <>
                  {isSignUp ? (!showOtpInput ? 'Send OTP' : 'Create account') : 'Sign in'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 text-sm font-semibold text-white transition hover:border-sky-300 hover:bg-white/10"
            >
              <Chrome className="h-4 w-4" />
              Continue with Google
            </button>
            <button
              onClick={handleGithubLogin}
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 text-sm font-semibold text-white transition hover:border-slate-300 hover:bg-white/10"
            >
              <Github className="h-4 w-4" />
              Continue with GitHub
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-slate-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-sky-300 transition hover:text-sky-200"
            >
              {isSignUp ? 'Sign in' : 'Register now'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerLogin;
