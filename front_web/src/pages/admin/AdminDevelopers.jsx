import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Plus, Search, Filter,
  MoreHorizontal, Edit2, Trash2,
  Github, Linkedin, CheckCircle,
  X as CloseIcon, User, Code, Globe, Save,
  AlertCircle, ChevronRight, ArrowLeft,
  Mail, Phone, Briefcase, Star,
  Crown, UserCheck, Shield, Upload,
  ChevronLeft
} from 'lucide-react';
import { apiService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDevelopers = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDev, setEditingDev] = useState(null);
  const [dataTimestamp, setDataTimestamp] = useState(Date.now());
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    profile_image: '',
    github_link: '',
    linkedin_link: '',
    skills: '',
    is_active: true,
    experience_years: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [developerToDelete, setDeveloperToDelete] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDevelopers, setTotalDevelopers] = useState(0);
  const developersPerPage = 10;

  useEffect(() => {
    fetchDevs();
  }, [currentPage]); // Refetch when page changes

  const fetchDevs = async () => {
    setLoading(true);
    try {
      const response = await apiService.getDevelopers(null, currentPage, developersPerPage);
      const data = response.data;
      // Handle paginated response
      const developersData = data.results || data;
      // Sort newest first by created_at or id if no created_at
      const sortedDevelopers = Array.isArray(developersData) ? developersData.sort((a, b) => {
        const dateA = new Date(a.created_at || a.id || 0);
        const dateB = new Date(b.created_at || b.id || 0);
        return dateB - dateA;
      }) : [];
      setDevelopers(sortedDevelopers);
      setTotalDevelopers(data.count || sortedDevelopers.length);
    } catch (error) {
      console.error("Error fetching developers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData for file upload
    const submitData = new FormData();

    // Send only fields writable by DeveloperSerializer.
    const writableFields = [
      'name',
      'title',
      'bio',
      'github_link',
      'linkedin_link',
      'skills',
      'is_active',
      'experience_years'
    ];
    writableFields.forEach(key => {
      if (key === 'skills') {
        submitData.append(key, formData[key].split(',').map(s => s.trim()).join(','));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Add image file if selected
    if (imageFile) {
      submitData.append('profile_image_file', imageFile);
    }

    try {
      if (editingDev) {
        await apiService.updateDeveloper(editingDev.id, submitData);
      } else {
        await apiService.createDeveloper(submitData);
      }
      setIsModalOpen(false);
      setEditingDev(null);
      setFormData({
        name: '', title: '', bio: '', profile_image: '',
        github_link: '', linkedin_link: '', skills: '',
        is_active: true, experience_years: 0
      });
      setImageFile(null);
      setImagePreview('');
      fetchDevs();
    } catch (error) {
      console.error("Error saving developer:", error.response?.data || error);
    }
  };

  const handleDelete = (developer) => {
    setDeveloperToDelete(developer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (developerToDelete) {
      try {
        await apiService.deleteDeveloper(developerToDelete.id);
        fetchDevs();
        setDeleteModalOpen(false);
        setDeveloperToDelete(null);
      } catch (error) {
        console.error("Error deleting developer:", error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDeveloperToDelete(null);
  };

  const openEditModal = (dev) => {
    setEditingDev(dev);
    setFormData({
      name: dev.name,
      title: dev.title,
      bio: dev.bio,
      profile_image: dev.profile_image || '',
      github_link: dev.github_link || '',
      linkedin_link: dev.linkedin_link || '',
      skills: dev.skills || '',
      is_active: dev.is_active !== undefined ? dev.is_active : true,
      experience_years: dev.experience_years || 0
    });
    setImageFile(null);
    setImagePreview(dev.profile_image || '');
    setIsModalOpen(true);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredDevs = useMemo(() => {
    return developers.filter(dev =>
      dev.name?.toLowerCase().includes(search.toLowerCase()) ||
      dev.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [developers, search]);

  const totalPages = Math.ceil(totalDevelopers / developersPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Talent</h1>
              <p className="text-gray-600 text-sm">Curate and showcase your elite engineering team.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Total Developers</p>
                <p className="text-lg font-bold text-gray-900 leading-none">{totalDevelopers}</p>
              </div>
              <button
                onClick={() => {
                  setEditingDev(null);
                  setFormData({
                    name: '', title: '', bio: '', profile_image: '',
                    github_link: '', linkedin_link: '', skills: '',
                    is_active: true, experience_years: 0
                  });
                  setImageFile(null);
                  setImagePreview('');
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Developer
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between gap-4 mb-6 p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search developers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all rounded-lg">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {!loading && filteredDevs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No developers found</h3>
                <p className="text-gray-600 text-sm mb-6">Get started by adding your first team member.</p>
                <button
                  onClick={() => {
                    setEditingDev(null);
                    setFormData({
                      name: '', title: '', bio: '', profile_image: '',
                      github_link: '', linkedin_link: '', skills: '',
                      is_featured: false, is_active: true, experience_years: 0
                    });
                    setImageFile(null);
                    setImagePreview('');
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Your First Developer
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold">Developer</th>
                    <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold">Skills</th>
                    <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold">Experience</th>
                    <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold">Status</th>
                    <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    [1, 2, 3].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="p-8 bg-gray-50" />
                      </tr>
                    ))
                  ) : filteredDevs.map((dev) => (
                    <tr key={dev.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 relative">
                            <img src={dev.profile_image ? `${dev.profile_image}?t=${dataTimestamp}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.name}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-gray-900 text-sm font-semibold">{dev.name}</p>
                            <p className="text-xs text-gray-500">{dev.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {dev.skills?.split(',').slice(0, 3).map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600 uppercase tracking-wide">
                              {skill.trim()}
                            </span>
                          ))}
                          {dev.skills?.split(',').length > 3 && (
                            <span className="text-xs text-gray-500 font-semibold">+{dev.skills.split(',').length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-900 text-sm font-semibold">{dev.experience_years || 0} years</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${dev.is_active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                          {dev.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {dev.github_link && (
                            <a href={dev.github_link} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-500 hover:text-gray-900 transition-colors">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {dev.linkedin_link && (
                            <a href={dev.linkedin_link} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-500 hover:text-gray-900 transition-colors">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          <button onClick={() => openEditModal(dev)} className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(dev)} className="p-1 text-gray-500 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && filteredDevs.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 text-xs font-medium rounded-lg transition-all ${currentPage === page
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-xl p-6 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{editingDev ? 'Edit Developer' : 'Add New Developer'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-500 hover:text-gray-900"><CloseIcon className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Professional Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Senior Full Stack Architect"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Bio</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Profile Image</label>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 mx-auto">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=preview`;
                        }}
                      />
                    </div>
                  )}

                  {/* Upload Options */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* File Upload */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-all text-sm text-gray-700">
                        <Upload className="w-4 h-4" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      {imageFile && (
                        <p className="text-xs text-green-600 font-medium">
                          Selected: {imageFile.name}
                        </p>
                      )}
                    </div>

                  </div>

                  <p className="text-xs text-gray-600 text-center">Upload a profile photo.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Experience (Years)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Skills (comma separated)</label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="React, Python, AWS, Docker"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">GitHub Profile</label>
                    <input
                      type="text"
                      value={formData.github_link}
                      onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={formData.linkedin_link}
                      onChange={(e) => setFormData({ ...formData, linkedin_link: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded bg-gray-200 border-gray-300 text-blue-600 focus:ring-blue-500/20"
                    />
                    <label htmlFor="is_active" className="text-sm font-semibold text-gray-900 cursor-pointer">Active Developer</label>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-grow py-2.5 bg-gray-200 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-grow py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> {editingDev ? 'Update Developer' : 'Create Developer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelDelete}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-xl p-6 relative z-10"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Developer</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete "{developerToDelete?.name}"? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-2.5 bg-gray-200 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Developer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const X = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default AdminDevelopers;

