import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen, Plus, Search, Filter,
  MoreHorizontal, Edit2, Trash2,
  FileText, Lightbulb, Tag,
  X as CloseIcon, Save, AlertCircle, ChevronRight,
  ArrowLeft, Calendar, Clock, CheckCircle, ChevronLeft
} from 'lucide-react';
import { apiService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    thumbnail: '',
    content: '',
    category: 'BLOG',
    author: '',
    is_featured: false,
    published_on: new Date().toISOString().split('T')[0]
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const resourcesPerPage = 10;

  const categories = ['BLOG', 'GUIDE', 'GLOSSARY'];

  useEffect(() => {
    fetchResources();
  }, [currentPage]); // Refetch when page changes

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await apiService.getResources(null, currentPage, resourcesPerPage);
      const data = response.data;
      // Handle paginated response
      const resourcesData = data.results || data;
      setResources(resourcesData);
      setTotalResources(data.count || resourcesData.length);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResourcesWithCache = async () => {
    setLoading(true);
    try {
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const response = await apiService.getResources(null, currentPage, resourcesPerPage);
      const data = response.data;
      // Handle paginated response
      const resourcesData = data.results || data;
      setResources(resourcesData);
      setTotalResources(data.count || resourcesData.length);
      console.log('Resources refreshed:', resourcesData);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Always use FormData for consistency with backend
    let dataToSend = new FormData();

    // Handle thumbnail removal
    if (formData.thumbnail === null) {
      // If thumbnail is null (removed), try multiple removal signals
      dataToSend.append('thumbnail', '');
      dataToSend.append('clear_thumbnail', 'true');
      dataToSend.append('remove_thumbnail', 'true');
      console.log('Removing thumbnail - sending FormData with removal flags');
    } else if (formData.thumbnail && typeof formData.thumbnail === 'object') {
      // If it's a file, create FormData
      dataToSend.append('thumbnail', formData.thumbnail);
      console.log('Uploading new thumbnail - sending FormData with file');
    } else {
      // Keep existing thumbnail - don't send thumbnail field at all
      console.log('Keeping existing thumbnail - sending FormData without thumbnail field');
    }

    // Add all other form fields
    Object.keys(formData).forEach(key => {
      if (key !== 'thumbnail' && formData[key] !== null && formData[key] !== undefined) {
        if (typeof formData[key] === 'boolean') {
          dataToSend.append(key, formData[key].toString());
        } else {
          dataToSend.append(key, formData[key]);
        }
      }
    });

    console.log('Submitting data:', dataToSend); // Debug log

    try {
      if (editingResource) {
        console.log('Updating resource:', editingResource.id);
        await apiService.updateResource(editingResource.id, dataToSend);
      } else {
        console.log('Creating new resource');
        await apiService.createResource(dataToSend);
      }
      setIsModalOpen(false);
      setEditingResource(null);
      setFormData({
        title: '', thumbnail: '', content: '', category: 'BLOG',
        author: '', is_featured: false,
        published_on: new Date().toISOString().split('T')[0]
      });
      // Force refresh after a short delay
      setTimeout(() => {
        fetchResourcesWithCache();
      }, 500);
    } catch (error) {
      console.error("Error saving resource:", error);
    }
  };

  const handleDelete = (resource) => {
    setResourceToDelete(resource);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (resourceToDelete) {
      try {
        await apiService.deleteResource(resourceToDelete.id);
        fetchResources();
        setDeleteModalOpen(false);
        setResourceToDelete(null);
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setResourceToDelete(null);
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      thumbnail: resource.thumbnail || '',
      content: resource.content,
      category: resource.category || 'BLOG',
      author: resource.author_id || '',
      is_featured: resource.is_featured || false,
      published_on: resource.published_on || new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const filteredResources = useMemo(() => {
    return resources.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.content.toLowerCase().includes(search.toLowerCase())
    );
  }, [resources, search]);

  const totalPages = Math.ceil(totalResources / resourcesPerPage);

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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Knowledge Assets</h1>
              <p className="text-gray-600 text-sm">Manage blogs, guides, tools, and technical documentation.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Total Resources</p>
                <p className="text-lg font-bold text-gray-900 leading-none">{totalResources}</p>
              </div>
              <button
                onClick={() => {
                  setEditingResource(null);
                  setFormData({
                    title: '', thumbnail: '', content: '', category: 'BLOG',
                    author: '', is_featured: false,
                    published_on: new Date().toISOString().split('T')[0]
                  });
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Resource
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between gap-4 mb-6 p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search resources..."
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold">Resource Title</th>
                  <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold">Thumbnail</th>
                  <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold">Category</th>
                  <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold">Published</th>
                  <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold">Featured</th>
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
                ) : filteredResources.map((resource) => (
                  <tr key={resource.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          {resource.category === 'BLOG' && <FileText className="w-4 h-4 text-blue-600" />}
                          {resource.category === 'GUIDE' && <BookOpen className="w-4 h-4 text-blue-600" />}
                          {resource.category === 'GLOSSARY' && <Tag className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div>
                          <p className="text-gray-900 text-sm font-semibold">{resource.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{resource.content?.substring(0, 100)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <img src={resource.thumbnail} alt={resource.title} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wide rounded-full">
                        {resource.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-900 font-semibold">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {new Date(resource.published_on).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      {resource.is_featured ? (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEditModal(resource)} className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(resource)} className="p-1 text-gray-500 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && filteredResources.length > 0 && totalPages > 1 && (
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
              className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl shadow-xl p-6 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{editingResource ? 'Edit Resource' : 'Create Resource'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-500 hover:text-gray-900"><CloseIcon className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Resource Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Thumbnail</label>
                    <div className="relative">
                      <div className="flex items-center gap-3">
                        {/* Custom file input */}
                        <div className="relative flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                thumbnail: e.target.files[0]
                              })
                            }
                            className="sr-only"
                            id="thumbnail-upload"
                          />
                          <label
                            htmlFor="thumbnail-upload"
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-blue-500 transition-all text-sm text-gray-700 group"
                          >
                            <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                              {formData.thumbnail && typeof formData.thumbnail === 'object'
                                ? formData.thumbnail.name
                                : 'Choose Image File'
                              }
                            </span>
                          </label>
                        </div>

                        {/* Cancel button */}
                        {formData.thumbnail && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, thumbnail: null })}
                            className="px-3 py-2.5 bg-red-100 border border-red-200 rounded-lg text-red-600 hover:bg-red-200 hover:border-red-300 transition-all flex items-center gap-2 text-sm font-semibold group"
                            title="Remove image"
                          >
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      {/* Image preview */}
                      {formData.thumbnail && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          {typeof formData.thumbnail === 'object' ? (
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={URL.createObjectURL(formData.thumbnail)}
                                  alt="Selected thumbnail"
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-lg"
                                />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-600 font-semibold">New Image Selected</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {formData.thumbnail.name} • {(formData.thumbnail.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={formData.thumbnail}
                                  alt="Current thumbnail"
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-lg"
                                />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-600 rounded-full"></div>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-600 font-semibold">Current Image</p>
                                <p className="text-xs text-gray-500 mt-0.5">Click "Remove" to delete this image</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Content (Markdown supported)</label>
                  <textarea
                    rows={10}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-mono"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Publication Date</label>
                    <input
                      type="date"
                      value={formData.published_on}
                      onChange={(e) => setFormData({ ...formData, published_on: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 mt-4">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded bg-gray-200 border-gray-300 text-blue-600 focus:ring-blue-500/20"
                    />
                    <label htmlFor="is_featured" className="text-sm font-semibold text-gray-900 cursor-pointer">Feature this resource</label>
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
                    <Save className="w-4 h-4" /> {editingResource ? 'Update Resource' : 'Publish Resource'}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Resource</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete "{resourceToDelete?.title}"? This action cannot be undone.
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
                  Delete Resource
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

export default AdminResources;

