import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, Phone, MapPin, Globe, Facebook, Twitter, Linkedin, Instagram,
  Save, RefreshCw, CheckCircle, AlertCircle, Edit2, Plus, Trash2,
  FileText, Building, Link2, Copy, ExternalLink
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { apiService } from '../../services/api';

const AdminFooter = () => {
  const [footerData, setFooterData] = useState({
    email: '',
    phone: '',
    address: '',
    company_description: '',
    social_links: {},
    copyright_text: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFooter();
      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        setFooterData({
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          company_description: data.company_description || '',
          social_links: data.social_links || {},
          copyright_text: data.copyright_text || ''
        });
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
      // Don't set error state on 404, as it might mean no footer exists yet
      if (error.response?.status !== 404) {
        setErrors({ general: 'Failed to load footer data' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSocialLinkChange = (platform, url) => {
    setFooterData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: url
      }
    }));
  };

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      handleSocialLinkChange(newSocialLink.platform, newSocialLink.url);
      setNewSocialLink({ platform: '', url: '' });
    }
  };

  const removeSocialLink = (platform) => {
    const newSocialLinks = { ...footerData.social_links };
    delete newSocialLinks[platform];
    setFooterData(prev => ({
      ...prev,
      social_links: newSocialLinks
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!footerData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(footerData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!footerData.address) {
      newErrors.address = 'Address is required';
    }

    if (!footerData.company_description) {
      newErrors.company_description = 'Company description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setErrors({});
      setSuccess(false);

      let footerId = null;
      try {
        const response = await apiService.getFooter();
        footerId = response.data[0]?.id;
      } catch (error) {
        // Footer doesn't exist yet, will create new one
        console.log('No existing footer found, creating new one');
      }

      if (footerId) {
        // Update existing footer
        await apiService.updateFooter(footerId, footerData);
      } else {
        // Create new footer
        await apiService.createFooter(footerData);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving footer data:', error);
      setErrors({ general: 'Failed to save footer data' });
    } finally {
      setSaving(false);
    }
  };

  const socialPlatforms = [
    { name: 'facebook', icon: Facebook, color: 'text-blue-600' },
    { name: 'twitter', icon: Twitter, color: 'text-sky-500' },
    { name: 'linkedin', icon: Linkedin, color: 'text-blue-700' },
    { name: 'instagram', icon: Instagram, color: 'text-pink-600' },
    { name: 'website', icon: Globe, color: 'text-green-600' }
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Footer Settings</h1>
            <p className="text-gray-600">Manage footer contact information and company details</p>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700">Footer settings saved successfully!</span>
            </motion.div>
          )}

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{errors.general}</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Building className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-2 text-gray-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={footerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="contact@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-2 text-gray-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={footerData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-2 text-gray-500" />
                    Address
                  </label>
                  <textarea
                    value={footerData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${errors.address ? 'border-red-500' : 'border-gray-200'
                      }`}
                    rows={3}
                    placeholder="123 Business Street, City, State 12345"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline w-4 h-4 mr-2 text-gray-500" />
                    Company Description
                  </label>
                  <textarea
                    value={footerData.company_description}
                    onChange={(e) => handleInputChange('company_description', e.target.value)}
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${errors.company_description ? 'border-red-500' : 'border-gray-200'
                      }`}
                    rows={4}
                    placeholder="Brief description of your company for the footer"
                  />
                  {errors.company_description && (
                    <p className="mt-1 text-sm text-red-600">{errors.company_description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Copyright Text
                  </label>
                  <input
                    type="text"
                    value={footerData.copyright_text}
                    onChange={(e) => handleInputChange('copyright_text', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="© 2024 Your Company. All rights reserved."
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Link2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
              </div>

              <div className="space-y-4">
                {/* Existing Social Links */}
                {Object.entries(footerData.social_links).map(([platform, url]) => {
                  const platformData = socialPlatforms.find(p => p.name === platform);
                  const Icon = platformData?.icon || Link2;

                  return (
                    <div key={platform} className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${platformData?.color || 'text-gray-400'}`} />
                      <input
                        type="text"
                        value={platform}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 capitalize"
                      />
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://..."
                      />
                      <button
                        onClick={() => removeSocialLink(platform)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}

                {/* Add New Social Link */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Social Link</h3>
                  <div className="flex items-center gap-3">
                    <select
                      value={newSocialLink.platform}
                      onChange={(e) => setNewSocialLink(prev => ({ ...prev, platform: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select platform</option>
                      {socialPlatforms.map(platform => (
                        <option key={platform.name} value={platform.name}>
                          {platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={newSocialLink.url}
                      onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://..."
                    />
                    <button
                      onClick={addSocialLink}
                      disabled={!newSocialLink.platform || !newSocialLink.url}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={fetchFooterData}
              className="px-6 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-semibold"
            >
              {saving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFooter;
