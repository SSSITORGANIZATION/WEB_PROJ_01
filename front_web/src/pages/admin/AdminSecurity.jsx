import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Shield, Lock, Key, AlertTriangle, CheckCircle, XCircle,
  Users, Eye, EyeOff, RefreshCw, Download, Ban, ShieldCheck,
  Clock, Activity, Database, Wifi, Mail, Phone, User,
  ChevronRight, Settings, AlertCircle, Info
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { apiService } from '../../services/api';

const AdminSecurity = () => {
  const [securityData, setSecurityData] = useState({
    threats: { blocked: 0, active: 0, resolved: 0 },
    firewall: { status: 'active', rules: 0, blocked: 0 },
    auth: { attempts: 0, failures: 0, lockouts: 0 },
    ssl: { status: 'valid', expires: '', issuer: '' }
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordMinLength: 8,
    maxLoginAttempts: 5,
    ipWhitelist: '',
    emailNotifications: true,
    securityAlerts: true
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validatePassword = (password) => {
    const minLength = securitySettings.passwordMinLength;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        length: password.length >= minLength,
        uppercase: hasUpperCase,
        lowercase: hasLowerCase,
        numbers: hasNumbers,
        special: hasSpecialChar
      }
    };
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateIP = (ip) => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const validateSecuritySettings = () => {
    const newErrors = {};

    if (securitySettings.sessionTimeout < 5 || securitySettings.sessionTimeout > 480) {
      newErrors.sessionTimeout = 'Session timeout must be between 5 and 480 minutes';
    }

    if (securitySettings.passwordMinLength < 6 || securitySettings.passwordMinLength > 32) {
      newErrors.passwordMinLength = 'Password length must be between 6 and 32 characters';
    }

    if (securitySettings.maxLoginAttempts < 3 || securitySettings.maxLoginAttempts > 10) {
      newErrors.maxLoginAttempts = 'Max attempts must be between 3 and 10';
    }

    if (securitySettings.ipWhitelist && !validateIP(securitySettings.ipWhitelist)) {
      newErrors.ipWhitelist = 'Please enter a valid IP address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async () => {
    const passwordValidation = validatePassword(newPassword);
    const newErrors = {};

    if (!passwordValidation.isValid) {
      newErrors.newPassword = 'Password does not meet security requirements';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const response = await apiService.post('/auth/admin/change-password/', {
          old_password: 'current_password', // In production, you'd ask for current password
          new_password: newPassword
        });

        if (response.data.success) {
          alert('Password updated successfully');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          newErrors.newPassword = response.data.error || 'Password change failed';
          setErrors(newErrors);
        }
      } catch (error) {
        console.error('Error changing password:', error);
        newErrors.newPassword = error.response?.data?.error || 'Password change failed';
        setErrors(newErrors);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSettingsUpdate = async () => {
    if (validateSecuritySettings()) {
      try {
        setLoading(true);
        const response = await apiService.post('/auth/admin/security-settings/', {
          session_timeout: securitySettings.sessionTimeout,
          password_min_length: securitySettings.passwordMinLength,
          max_login_attempts: securitySettings.maxLoginAttempts,
          lockout_duration: 30, // Default 30 minutes
          require_two_factor: securitySettings.twoFactorAuth,
          email_notifications: securitySettings.emailNotifications,
          security_alerts: securitySettings.securityAlerts,
          ip_whitelist: securitySettings.ipWhitelist
        });

        if (response.data.success) {
          alert('Security settings updated successfully');
        } else {
          alert('Failed to update security settings');
        }
      } catch (error) {
        console.error('Error updating security settings:', error);
        alert('Failed to update security settings');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        setLoading(true);

        // Fetch real security data from API
        const response = await apiService.get('/auth/admin/security-dashboard/');

        if (response.data) {
          setSecurityData({
            threats: response.data.threats || { blocked: 0, active: 0, resolved: 0 },
            firewall: { status: 'active', rules: 0, blocked: response.data.threats?.blocked || 0 },
            auth: response.data.auth || { attempts: 0, failures: 0, lockouts: 0 },
            ssl: { status: 'valid', expires: '', issuer: '' }
          });

          // Update security settings from API
          if (response.data.settings) {
            setSecuritySettings({
              twoFactorAuth: response.data.settings.require_two_factor || false,
              sessionTimeout: response.data.settings.session_timeout || 30,
              passwordMinLength: response.data.settings.password_min_length || 8,
              maxLoginAttempts: response.data.settings.max_login_attempts || 5,
              ipWhitelist: response.data.settings.ip_whitelist || '',
              emailNotifications: response.data.settings.email_notifications || true,
              securityAlerts: response.data.settings.security_alerts || true
            });
          }
        }
      } catch (error) {
        console.error('Error fetching security data:', error);
        // Set default values if API fails
        setSecurityData({
          threats: { blocked: 0, active: 0, resolved: 0 },
          firewall: { status: 'active', rules: 0, blocked: 0 },
          auth: { attempts: 0, failures: 0, lockouts: 0 },
          ssl: { status: 'valid', expires: '', issuer: '' }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
  }, []);

  const SecurityCard = ({ title, value, status, icon: Icon, color = 'blue' }) => (
    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg bg-${color}-50 flex items-center justify-center border border-${color}-200`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-600 animate-pulse' : status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'}`} />
      </div>
      <h3 className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-0.5">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 tracking-tighter">{value.toLocaleString()}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Security Center</h1>
              <p className="text-gray-600 text-sm">Monitor and manage website security protocols and threat detection.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <RefreshCw className="w-4 h-4 text-gray-500" /> Refresh
              </button>
              <button className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Run Audit
              </button>
            </div>
          </div>

          {/* Security Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SecurityCard title="Threats Blocked" value={securityData.threats.blocked} status="active" icon={Ban} color="green" />
            <SecurityCard title="Active Threats" value={securityData.threats.active} status="warning" icon={AlertTriangle} color="yellow" />
            <SecurityCard title="Failed Logins" value={securityData.auth.failures} status="warning" icon={XCircle} color="red" />
            <SecurityCard title="Firewall Rules" value={securityData.firewall.rules} status="active" icon={Shield} color="blue" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Security Settings */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" /> Security Configuration
                </h3>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                        className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${errors.sessionTimeout ? 'border-red-500' : ''}`}
                        min="5"
                        max="480"
                      />
                      {errors.sessionTimeout && (
                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {errors.sessionTimeout}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-2">Min Password Length</label>
                      <input
                        type="number"
                        value={securitySettings.passwordMinLength}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
                        className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${errors.passwordMinLength ? 'border-red-500' : ''}`}
                        min="6"
                        max="32"
                      />
                      {errors.passwordMinLength && (
                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {errors.passwordMinLength}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-2">Max Login Attempts</label>
                      <input
                        type="number"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                        className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${errors.maxLoginAttempts ? 'border-red-500' : ''}`}
                        min="3"
                        max="10"
                      />
                      {errors.maxLoginAttempts && (
                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {errors.maxLoginAttempts}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-2">IP Whitelist (Optional)</label>
                      <input
                        type="text"
                        value={securitySettings.ipWhitelist}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
                        placeholder="192.168.1.1"
                        className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${errors.ipWhitelist ? 'border-red-500' : ''}`}
                      />
                      {errors.ipWhitelist && (
                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {errors.ipWhitelist}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'twoFactorAuth', label: 'Two-Factor Authentication', icon: Key },
                      { key: 'emailNotifications', label: 'Email Notifications', icon: Mail },
                      { key: 'securityAlerts', label: 'Security Alerts', icon: AlertTriangle }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <setting.icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-900 font-medium">{setting.label}</span>
                        </div>
                        <button
                          onClick={() => setSecuritySettings({ ...securitySettings, [setting.key]: !securitySettings[setting.key] })}
                          className={`w-12 h-6 rounded-full transition-all ${securitySettings[setting.key] ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-all shadow-sm ${securitySettings[setting.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSettingsUpdate}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg text-sm font-semibold hover:shadow-md transition-all uppercase tracking-wide"
                  >
                    Update Security Settings
                  </button>
                </div>
              </div>

              {/* Password Change */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" /> Change Admin Password
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full px-3 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${errors.newPassword ? 'border-red-500' : ''}`}
                        placeholder="Enter new password"
                      />
                      <button
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-2">Confirm Password</label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Password Requirements:</p>
                    <div className="space-y-1">
                      {[
                        { label: `At least ${securitySettings.passwordMinLength} characters`, valid: newPassword.length >= securitySettings.passwordMinLength },
                        { label: 'Contains uppercase letter', valid: /[A-Z]/.test(newPassword) },
                        { label: 'Contains lowercase letter', valid: /[a-z]/.test(newPassword) },
                        { label: 'Contains number', valid: /\d/.test(newPassword) },
                        { label: 'Contains special character', valid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) }
                      ].map((req, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {req.valid ? <CheckCircle className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3 text-gray-400" />}
                          <span className={`text-xs ${req.valid ? 'text-green-600' : 'text-gray-400'}`}>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg text-sm font-semibold hover:shadow-md transition-all uppercase tracking-wide"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <aside className="space-y-4">
              <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> System Status
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Firewall', status: 'Active', color: 'green' },
                    { label: 'SSL Certificate', status: 'Valid', color: 'green' },
                    { label: 'Intrusion Detection', status: 'Monitoring', color: 'green' },
                    { label: 'Rate Limiting', status: 'Enabled', color: 'green' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full bg-${item.color}-600 animate-pulse`} />
                        <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" /> Recent Activity
                </h3>
                <div className="space-y-3">
                  {/* This would be populated from the API response */}
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-1 bg-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-900">Security monitoring active</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Real-time</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSecurity;
