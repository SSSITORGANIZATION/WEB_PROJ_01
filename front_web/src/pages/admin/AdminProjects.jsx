import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase, Plus, Search, Filter,
  MoreHorizontal, Edit2, Trash2,
  ExternalLink, Github, CheckCircle,
  X as CloseIcon, Layout, Code, Globe, Save,
  AlertCircle, ChevronRight, ArrowLeft, Upload,
  ChevronLeft
} from 'lucide-react';
import { apiService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_images: [],
    project_image: '',
    github_repo: '',
    live_link: '',
    technologies_used: '',
    is_featured: false,
    status: 'Active'
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [projectDevelopers, setProjectDevelopers] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const projectsPerPage = 10;

  const BASE_BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    fetchProjects();
    fetchDevelopers();
  }, [currentPage]); // Refetch when page changes

  const fetchDevelopers = async () => {
    try {
      const response = await fetch(`${BASE_BACKEND_URL}/developers/`);
      const data = await response.json();
      setDevelopers(data.filter(dev => dev.is_active));
    } catch (error) {
      console.error('Error fetching developers:', error);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await apiService.getProjects(null, currentPage, projectsPerPage);
      const data = response.data;
      // Handle paginated response
      const projectsData = data.results || data;
      // Sort newest first by created_at or id if no created_at
      const sortedProjects = Array.isArray(projectsData) ? projectsData.sort((a, b) => {
        const dateA = new Date(a.created_at || a.id || 0);
        const dateB = new Date(b.created_at || b.id || 0);
        return dateB - dateA;
      }) : projectsData;
      setProjects(sortedProjects);
      setTotalProjects(data.count || projectsData.length);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData for file upload
    const submitData = new FormData();

    // Send only fields writable by ProjectSerializer.
    const writableFields = [
      'title',
      'description',
      'github_repo',
      'live_link',
      'technologies_used',
      'is_featured'
    ];
    writableFields.forEach(key => {
      if (key === 'technologies_used') {
        submitData.append(key, formData[key].split(',').map(s => s.trim()).join(','));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Add multiple image files
    imageFiles.forEach((file, index) => {
      submitData.append(`project_images`, file);
    });

    // Add project developers
    projectDevelopers.forEach(dev => {
      if (dev.developer) {
        submitData.append('project_developers', JSON.stringify(dev));
      }
    });

    try {
      if (editingProject) {
        await apiService.updateProject(editingProject.id, submitData);
      } else {
        await apiService.createProject(submitData);
      }
      setIsModalOpen(false);
      setEditingProject(null);
      setFormData({
        title: '', description: '', project_images: [], project_image: '',
        github_repo: '', live_link: '', technologies_used: '',
        is_featured: false, status: 'Active'
      });
      setImageFiles([]);
      setImagePreviews([]);
      setProjectDevelopers([]);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error.response?.data || error);
    }
  };

  const handleDelete = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        await apiService.deleteProject(projectToDelete.id);
        fetchProjects();
        setDeleteModalOpen(false);
        setProjectToDelete(null);
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      project_images: project.project_images || [],
      project_image: project.project_image || '',
      github_repo: project.github_repo || '',
      live_link: project.live_link || '',
      technologies_used: project.technologies_used || '',
      is_featured: project.is_featured || false,
      status: project.status || 'Active'
    });
    setImageFiles([]);
    setImagePreviews(project.project_images?.map(img => img.image) || []);

    // Load existing project developers
    if (project.project_developers && project.project_developers.length > 0) {
      setProjectDevelopers(project.project_developers.map(dev => ({
        developer: dev.developer,
        role: dev.role,
        member_type: dev.member_type
      })));
    } else {
      setProjectDevelopers([]);
    }

    setIsModalOpen(true);
  };

  const handleMultipleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    // Create previews for new files
    const newPreviews = [...imagePreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const addProjectDeveloper = () => {
    setProjectDevelopers([
      ...projectDevelopers,
      {
        developer: '',
        role: '',
        member_type: 'MEMBER'
      }
    ]);
  };

  const removeProjectDeveloper = (index) => {
    const newDevelopers = projectDevelopers.filter((_, i) => i !== index);
    setProjectDevelopers(newDevelopers);
  };

  const updateProjectDeveloper = (index, field, value) => {
    const newDevelopers = [...projectDevelopers];
    newDevelopers[index][field] = value;
    setProjectDevelopers(newDevelopers);
  };

  const getProjectImage = (project) => {
    if (project.assets && project.assets.length > 0) {
      const imageAsset = project.assets.find(asset => asset.asset_type === 'IMAGE');
      if (imageAsset && imageAsset.file) {
        return imageAsset.file.startsWith('http') ? imageAsset.file : `${BASE_BACKEND_URL}${imageAsset.file}`;
      }
    }
    if (project.project_image) {
      return project.project_image.startsWith('http') ? project.project_image : `${BASE_BACKEND_URL}${project.project_image}`;
    }
    return `https://picsum.photos/seed/${project.id}/100/100`;
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  const totalPages = Math.ceil(totalProjects / projectsPerPage);

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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Projects</h1>
              <p className="text-gray-600 text-sm">Create, edit, and showcase your engineering masterpieces.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Total Projects</p>
                <p className="text-lg font-bold text-gray-900 leading-none">{totalProjects}</p>
              </div>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setFormData({
                    title: '', description: '', project_images: [], project_image: '',
                    github_repo: '', live_link: '', technologies_used: '',
                    is_featured: false, status: 'Active'
                  });
                  setImageFiles([]);
                  setImagePreviews([]);
                  setProjectDevelopers([]);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add New Project
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between gap-4 mb-6 p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search projects..."
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
            {!loading && filteredProjects.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 text-sm mb-6">Get started by creating your first project.</p>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setFormData({
                      title: '', description: '', project_images: [], project_image: '',
                      github_repo: '', live_link: '', technologies_used: '',
                      is_featured: false, status: 'Active'
                    });
                    setImageFiles([]);
                    setImagePreviews([]);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" /> Create Your First Project
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="p-3 text-xs text-gray-600 uppercase tracking-wide font-semibold">Project Info</th>
                    <th className="p-3 text-xs text-gray-600 uppercase tracking-wide font-semibold">Technologies</th>
                    <th className="p-3 text-xs text-gray-600 uppercase tracking-wide font-semibold">Status</th>
                    <th className="p-3 text-xs text-gray-600 uppercase tracking-wide font-semibold">Featured</th>
                    <th className="p-3 text-xs text-gray-600 uppercase tracking-wide font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    [1, 2, 3].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="p-6 bg-gray-50" />
                      </tr>
                    ))
                  ) : filteredProjects.map((project) => (
                    <tr key={project.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200">
                            <img src={getProjectImage(project)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-gray-900 text-sm font-semibold">{project.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{project.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {project.technologies_used?.split(',').slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600 uppercase tracking-wide">
                              {tech.trim()}
                            </span>
                          ))}
                          {project.technologies_used?.split(',').length > 3 && (
                            <span className="text-xs text-gray-500 font-semibold">+{project.technologies_used.split(',').length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${project.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' :
                          project.status === 'Completed' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            project.status === 'Inactive' ? 'bg-red-100 text-red-700 border border-red-200' :
                              'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                          {project.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-3">
                        {project.is_featured ? (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {project.github_repo && (
                            <a href={project.github_repo} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-500 hover:text-gray-900 transition-colors">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {project.live_link && (
                            <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-500 hover:text-gray-900 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button onClick={() => openEditModal(project)} className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(project)} className="p-1 text-gray-500 hover:text-red-600 transition-colors">
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
          {!loading && filteredProjects.length > 0 && totalPages > 1 && (
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
                <h2 className="text-xl font-bold text-gray-900">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-500 hover:text-gray-900"><CloseIcon className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Project Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Project Images (Multiple)</label>

                  {/* Image Previews Grid */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={preview}
                              alt={`Project preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = `https://picsum.photos/seed/preview${index}/200/200`;
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {imageFiles[index]?.name || `Image ${index + 1}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Options */}
                  <div className="space-y-4">
                    {/* Multiple File Upload */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-all text-sm text-gray-700">
                        <Upload className="w-4 h-4" />
                        <span>Add Multiple Images</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleMultipleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      {imageFiles.length > 0 && (
                        <p className="text-xs text-green-600 font-medium">
                          {imageFiles.length} image(s) selected
                        </p>
                      )}
                    </div>

                  </div>

                  <p className="text-xs text-gray-600">
                    Upload one or more images for a carousel display (auto-scrolls every 5 seconds).
                    First image will be featured on project cards.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={formData.technologies_used}
                    onChange={(e) => setFormData({ ...formData, technologies_used: e.target.value })}
                    placeholder="React, Node.js, AWS"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Development Team</label>
                    <button
                      type="button"
                      onClick={addProjectDeveloper}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Developer
                    </button>
                  </div>

                  {projectDevelopers.map((dev, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-600 uppercase tracking-wide">Developer</label>
                        <select
                          value={dev.developer}
                          onChange={(e) => updateProjectDeveloper(index, 'developer', e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        >
                          <option value="">Select Developer</option>
                          {developers.map(developer => (
                            <option key={developer.id} value={developer.id}>
                              {developer.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-gray-600 uppercase tracking-wide">Role</label>
                        <input
                          type="text"
                          value={dev.role}
                          onChange={(e) => updateProjectDeveloper(index, 'role', e.target.value)}
                          placeholder="e.g., Frontend Developer"
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-gray-600 uppercase tracking-wide">Type</label>
                        <div className="flex gap-2 items-center">
                          <select
                            value={dev.member_type}
                            onChange={(e) => updateProjectDeveloper(index, 'member_type', e.target.value)}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg py-2 px-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          >
                            <option value="MEMBER">Team Member</option>
                            <option value="LEAD">Team Lead</option>
                          </select>
                          {projectDevelopers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeProjectDeveloper(index)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {projectDevelopers.length === 0 && (
                    <p className="text-xs text-gray-600 text-center py-4">
                      No developers assigned. Click "Add Developer" to assign team members.
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">GitHub Repo</label>
                    <input
                      type="text"
                      value={formData.github_repo}
                      onChange={(e) => setFormData({ ...formData, github_repo: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Live Link</label>
                    <input
                      type="text"
                      value={formData.live_link}
                      onChange={(e) => setFormData({ ...formData, live_link: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded bg-gray-200 border-gray-300 text-blue-600 focus:ring-blue-500/20"
                  />
                  <label htmlFor="is_featured" className="text-sm font-semibold text-gray-900 cursor-pointer">Feature this project on the homepage</label>
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
                    <Save className="w-4 h-4" /> {editingProject ? 'Update Project' : 'Create Project'}
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
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md glass-card border-white/10 p-6 relative z-10"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white serif mb-2">Delete Project</h3>
                <p className="text-sm text-zinc-400">
                  Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-2.5 bg-white/5 text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Project
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

export default AdminProjects;

