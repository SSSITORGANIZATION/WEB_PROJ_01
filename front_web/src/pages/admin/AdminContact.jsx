import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Save, Plus, X, Edit2, Trash2, Phone, Mail, MapPin, Clock,
  Globe, MessageSquare, Building, AlertCircle, CheckCircle
} from '../icons';
import AdminSidebar from '../../components/AdminSidebar';

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'info'

  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: 'United Kingdom',
    editorial_email: '',
    advertising_email: '',
    support_email: '',
    general_email: '',
    business_hours: 'Mon - Fri, 9:00 AM - 6:00 PM GMT',
    twitter_link: '',
    linkedin_link: '',
    facebook_link: '',
    contact_form_message: '',
    location_description: '',
    is_active: true
  });

  // Fetch contacts from API
  useEffect(() => {
    fetchContacts();
    fetchContactMessages();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8000/contact/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      } else {
        setError('Failed to fetch contact information');
      }
    } catch (error) {
      setError('Error fetching contact information');
      console.error('Error:', error);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8000/contact-messages/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setContactMessages(data);
      } else {
        setError('Failed to fetch contact messages');
      }
    } catch (error) {
      setError('Error fetching contact messages');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const url = isEditing
      ? `http://localhost:8000/contact/${editingContact.id}/`
      : 'http://localhost:8000/contact/';

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(isEditing ? 'Contact updated successfully!' : 'Contact created successfully!');
        fetchContacts();
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to save contact information');
      }
    } catch (error) {
      setError('Error saving contact information');
      console.error('Error:', error);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      company_name: contact.company_name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      address_line1: contact.address_line1 || '',
      address_line2: contact.address_line2 || '',
      city: contact.city || '',
      postal_code: contact.postal_code || '',
      country: contact.country || 'United Kingdom',
      editorial_email: contact.editorial_email || '',
      advertising_email: contact.advertising_email || '',
      support_email: contact.support_email || '',
      general_email: contact.general_email || '',
      business_hours: contact.business_hours || 'Mon - Fri, 9:00 AM - 6:00 PM GMT',
      twitter_link: contact.twitter_link || '',
      linkedin_link: contact.linkedin_link || '',
      facebook_link: contact.facebook_link || '',
      contact_form_message: contact.contact_form_message || '',
      location_description: contact.location_description || '',
      is_active: contact.is_active !== undefined ? contact.is_active : true
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact information?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8000/contact/${contactId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Contact deleted successfully!');
        fetchContacts();
      } else {
        setError('Failed to delete contact information');
      }
    } catch (error) {
      setError('Error deleting contact information');
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      email: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      postal_code: '',
      country: 'United Kingdom',
      editorial_email: '',
      advertising_email: '',
      support_email: '',
      general_email: '',
      business_hours: 'Mon - Fri, 9:00 AM - 6:00 PM GMT',
      twitter_link: '',
      linkedin_link: '',
      facebook_link: '',
      contact_form_message: '',
      location_description: '',
      is_active: true
    });
    setIsEditing(false);
    setEditingContact(null);
    setShowForm(false);
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8000/contact-messages/${messageId}/mark_as_read/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchContactMessages();
        setSuccess('Message marked as read');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Error marking message as read');
      console.error('Error:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8000/contact-messages/${messageId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchContactMessages();
        setSuccess('Message deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete message');
      }
    } catch (error) {
      setError('Error deleting message');
      console.error('Error:', error);
    }
  };

  const handleArchiveMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8000/contact-messages/${messageId}/archive/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchContactMessages();
        setSuccess('Message archived');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Error archiving message');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading contact information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
                  <p className="text-sm text-gray-600 mt-1">Manage contact messages and website information</p>
                </div>
                {activeTab === 'info' && (
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all"
                  >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showForm ? 'Cancel' : 'Add Contact'}
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'messages'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Messages
                    {contactMessages.filter(m => !m.is_read).length > 0 && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        {contactMessages.filter(m => !m.is_read).length}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'info'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Contact Information
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"
            >
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"
            >
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {success}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'messages' ? (
            /* Contact Messages */
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Contact Messages</h2>
                <p className="text-sm text-gray-600 mt-1">View and manage messages from the contact form</p>
              </div>

              {contactMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <MessageSquare className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-500">Messages submitted through the contact form will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {contactMessages.map((message) => (
                    <div key={message.id} className={`p-6 ${!message.is_read ? 'bg-blue-50' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-lg font-medium text-gray-900">{message.subject}</h3>
                            {!message.is_read && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                                New
                              </span>
                            )}
                            {message.is_archived && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                Archived
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{message.name} ({message.email})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">
                                {new Date(message.created_at).toLocaleDateString()} {new Date(message.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>

                          <div className="text-gray-700 mb-4">
                            <p className="whitespace-pre-wrap">{message.message}</p>
                          </div>

                          {message.ip_address && (
                            <div className="text-xs text-gray-500">
                              IP: {message.ip_address}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {!message.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(message.id)}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {!message.is_archived && (
                            <button
                              onClick={() => handleArchiveMessage(message.id)}
                              className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Archive"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Contact Information */
            <>
              {/* Form */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden"
                  >
                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        {isEditing ? 'Edit Contact Information' : 'Add New Contact Information'}
                      </h2>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Company Information */}
                          <div className="lg:col-span-3">
                            <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              Company Information
                            </h3>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input
                              type="text"
                              name="company_name"
                              value={formData.company_name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Main Email</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          {/* Address Information */}
                          <div className="lg:col-span-3">
                            <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Address Information
                            </h3>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                            <input
                              type="text"
                              name="address_line1"
                              value={formData.address_line1}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                            <input
                              type="text"
                              name="address_line2"
                              value={formData.address_line2}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                            <input
                              type="text"
                              name="postal_code"
                              value={formData.postal_code}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          {/* Department Emails */}
                          <div className="lg:col-span-3">
                            <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Department Emails
                            </h3>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Editorial Email</label>
                            <input
                              type="email"
                              name="editorial_email"
                              value={formData.editorial_email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Advertising Email</label>
                            <input
                              type="email"
                              name="advertising_email"
                              value={formData.advertising_email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                            <input
                              type="email"
                              name="support_email"
                              value={formData.support_email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">General Email</label>
                            <input
                              type="email"
                              name="general_email"
                              value={formData.general_email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                            <input
                              type="text"
                              name="business_hours"
                              value={formData.business_hours}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          {/* Social Media */}
                          <div className="lg:col-span-3">
                            <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              Social Media Links
                            </h3>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X Link</label>
                            <input
                              type="url"
                              name="twitter_link"
                              value={formData.twitter_link}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Link</label>
                            <input
                              type="url"
                              name="linkedin_link"
                              value={formData.linkedin_link}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Link</label>
                            <input
                              type="url"
                              name="facebook_link"
                              value={formData.facebook_link}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>

                          {/* Additional Information */}
                          <div className="lg:col-span-3">
                            <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Additional Information
                            </h3>
                          </div>

                          <div className="lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Form Message</label>
                            <textarea
                              name="contact_form_message"
                              value={formData.contact_form_message}
                              onChange={handleInputChange}
                              rows="3"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                              placeholder="Message displayed above the contact form"
                            />
                          </div>

                          <div className="lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location Description</label>
                            <textarea
                              name="location_description"
                              value={formData.location_description}
                              onChange={handleInputChange}
                              rows="3"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                              placeholder="Description of office location"
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="is_active"
                              id="is_active"
                              checked={formData.is_active}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                              Active
                            </label>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                          <button
                            type="submit"
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-lg hover:shadow-md transition-all"
                          >
                            <Save className="w-4 h-4" />
                            {isEditing ? 'Update Contact' : 'Save Contact'}
                          </button>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contact List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage your website's contact details</p>
                </div>

                {contacts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Mail className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No contact information</h3>
                    <p className="text-gray-500 mb-4">Get started by adding your first contact information</p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Contact Information
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <h3 className="text-lg font-medium text-gray-900">{contact.company_name}</h3>
                              {contact.is_active ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 border border-gray-300">
                                  Inactive
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{contact.email}</span>
                              </div>

                              {contact.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">{contact.phone}</span>
                                </div>
                              )}

                              {contact.business_hours && (
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">{contact.business_hours}</span>
                                </div>
                              )}

                              {(contact.address_line1 || contact.city) && (
                                <div className="flex items-center gap-2 md:col-span-2 lg:col-span-3">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">
                                    {[contact.address_line1, contact.address_line2, contact.city, contact.postal_code, contact.country]
                                      .filter(Boolean)
                                      .join(', ')}
                                  </span>
                                </div>
                              )}

                              {contact.editorial_email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">Editorial: {contact.editorial_email}</span>
                                </div>
                              )}

                              {contact.advertising_email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">Advertising: {contact.advertising_email}</span>
                                </div>
                              )}

                              {contact.support_email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">Support: {contact.support_email}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEdit(contact)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(contact.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
