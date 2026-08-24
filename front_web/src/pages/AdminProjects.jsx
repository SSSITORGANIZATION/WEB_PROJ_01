import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  X,
  Layers,
  Cpu,
  Globe,
  Zap,
  Shield,
  Layout,
  Terminal,
  AlertTriangle,
  Users,
  Github,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/api';
import '../styles/components/AdminProjects.css';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const BASE_BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiService.getProjects();
        const data = response.data;
        // Handle both array and object responses
        const projectsData = Array.isArray(data) ? data : (data.results || data);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
        showNotification('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        await apiService.deleteProject(deletingId);
        setProjects(projects.filter(p => p.id !== deletingId));
        setDeletingId(null);
        showNotification('Project deleted successfully');
      } catch (error) {
        console.error("Error deleting project:", error);
        showNotification('Failed to delete project');
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject({ ...project });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateProject(editingProject.id, editingProject);
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
      setEditingProject(null);
      showNotification('Project updated successfully');
    } catch (error) {
      console.error("Error updating project:", error);
      showNotification('Failed to update project');
    }
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
    return `https://picsum.photos/seed/${project.id}/800/600`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30';
      case 'completed':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'inactive':
      case 'deprecated':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-zinc-400 bg-zinc-500/20 border-zinc-500/30';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-16 relative pb-40 bg-black min-h-screen">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-12 right-12 z-50 px-8 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <Terminal className="w-4 h-4" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-card p-12 rounded-[40px] border-red-500/10"
            >
              <div className="w-20 h-20 bg-red-500/5 rounded-3xl flex items-center justify-center mb-10 mx-auto border border-red-500/10">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-4xl font-display font-light text-white text-center mb-6 tracking-tight">Delete Project?</h2>
              <p className="text-zinc-500 text-center mb-12 text-base font-light leading-relaxed">
                This action is irreversible. The selected project and all associated data will be permanently removed from the system.
              </p>
              <div className="flex gap-6">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-5 rounded-2xl bg-white/[0.03] border border-white/10 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-5 rounded-2xl bg-red-600 text-white font-bold uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-red-500/20 hover:bg-red-500 transition-all"
                >
                  Delete Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProject(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card p-12 rounded-[50px] border-white/5"
            >
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-4xl font-display font-light text-white tracking-tight">Edit Project</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold mt-4">Project ID: {editingProject.id}</p>
                </div>
                <button onClick={() => setEditingProject(null)} className="p-3 rounded-2xl bg-white/[0.03] text-zinc-500 hover:text-white transition-colors border border-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={saveEdit} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold ml-1">Project Title</label>
                  <input
                    type="text"
                    value={editingProject.title || ''}
                    onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] px-6 py-4 text-white text-sm focus:border-white/20 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold ml-1">Description</label>
                  <textarea
                    value={editingProject.description || ''}
                    onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] px-6 py-4 text-white text-sm focus:border-white/20 outline-none transition-all resize-none h-32"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold ml-1">Technologies</label>
                    <input
                      type="text"
                      value={editingProject.technologies_used || ''}
                      onChange={e => setEditingProject({ ...editingProject, technologies_used: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] px-6 py-4 text-white text-sm focus:border-white/20 outline-none transition-all"
                      placeholder="React, Django, PostgreSQL..."
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold ml-1">Status</label>
                    <select
                      value={editingProject.status || 'Active'}
                      onChange={e => setEditingProject({ ...editingProject, status: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] px-6 py-4 text-white text-sm focus:border-white/20 outline-none transition-all appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold ml-1">GitHub Repository</label>
                    <input
                      type="url"
                      value={editingProject.github_repo || ''}
                      onChange={e => setEditingProject({ ...editingProject, github_repo: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] px-6 py-4 text-white text-sm focus:border-white/20 outline-none transition-all"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold ml-1">Live Demo</label>
                    <input
                      type="url"
                      value={editingProject.live_link || ''}
                      onChange={e => setEditingProject({ ...editingProject, live_link: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] px-6 py-4 text-white text-sm focus:border-white/20 outline-none transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingProject.is_featured || false}
                    onChange={e => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/20"
                  />
                  <label htmlFor="featured" className="text-[10px] text-zinc-400 uppercase tracking-[0.3em] font-bold">
                    Featured Project
                  </label>
                </div>

                <button type="submit" className="btn-primary w-full">
                  Update Project
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-[20px] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl">
              <Layers className="w-7 h-7 text-indigo-500" />
            </div>
            <div className="h-px w-16 bg-white/10" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Project Management</span>
          </div>
          <h1 className="text-7xl font-display font-light text-white tracking-tight leading-none">
            Projects<span className="text-indigo-500">.</span>
          </h1>
          <p className="text-zinc-500 text-lg font-light mt-8 max-w-lg leading-relaxed">
            Manage and monitor all development projects, team assignments, and deployment status.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex p-2 bg-white/[0.03] rounded-[24px] border border-white/5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-4 rounded-[18px] transition-all ${viewMode === 'grid' ? 'bg-white text-black shadow-2xl' : 'text-zinc-500 hover:text-white'}`}
            >
              <Layout className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-4 rounded-[18px] transition-all ${viewMode === 'list' ? 'bg-white text-black shadow-2xl' : 'text-zinc-500 hover:text-white'}`}
            >
              <Terminal className="w-5 h-5" />
            </button>
          </div>
          <button className="btn-primary">
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-6 flex flex-col md:flex-row gap-6 rounded-[40px]">
        <div className="relative flex-1 group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] pl-20 pr-10 py-5 text-white text-sm focus:border-white/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-10 py-5 bg-white/[0.02] border border-white/5 rounded-[24px] text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="flex items-center gap-4 px-10 py-5 bg-white/[0.02] border border-white/5 rounded-[24px]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">{filteredProjects.length} Projects</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-12">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card h-[400px] rounded-[50px] animate-pulse" />
          ))}
        </div>
      )}

      {/* Projects Display */}
      {!loading && viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card group overflow-hidden rounded-[50px] border-white/[0.02] hover:border-white/10 transition-all duration-700 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={getProjectImage(project)}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                  <div className="absolute top-8 right-8 flex gap-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button
                      onClick={() => handleEdit(project)}
                      className="w-14 h-14 rounded-[20px] bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white hover:text-black transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(project.id)}
                      className="w-14 h-14 rounded-[20px] bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="absolute bottom-8 left-8">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[9px] font-bold uppercase tracking-[0.2em] ${getStatusColor(project.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'Active' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' :
                        project.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                          'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                        }`} />
                      {project.status || 'Active'}
                    </div>
                  </div>
                </div>

                <div className="p-12 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] mb-3">
                        {project.technologies_used?.split(',')[0] || 'Web Development'}
                      </p>
                      <h3 className="text-4xl font-display font-light text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      {project.github_repo && (
                        <a href={project.github_repo} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white/[0.03] text-zinc-600 hover:text-white transition-all border border-white/5">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {project.live_link && (
                        <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white/[0.03] text-zinc-600 hover:text-white transition-all border border-white/5">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-12 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-12">
                    {project.technologies_used?.split(',').slice(0, 3).map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg text-[9px] text-zinc-400 uppercase tracking-widest">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Team Members */}
                  {project.project_developers && project.project_developers.length > 0 && (
                    <div className="mb-12">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-4 h-4 text-zinc-600" />
                        <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Team</span>
                      </div>
                      <div className="flex -space-x-3">
                        {project.project_developers.slice(0, 4).map((dev, i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-[3px] border-black bg-zinc-900 overflow-hidden shadow-2xl">
                            <img
                              src={dev.developer_profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.developer_name}`}
                              alt={dev.developer_name || 'Developer'}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))}
                        {project.project_developers.length > 4 && (
                          <div className="w-10 h-10 rounded-full border-[3px] border-black bg-zinc-800 flex items-center justify-center shadow-2xl">
                            <span className="text-[8px] text-zinc-400 font-bold">
                              +{project.project_developers.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-10 border-t border-white/[0.03] flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
                      <Clock className="w-4 h-4" />
                      {new Date(project.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
                    </div>
                    {project.is_featured && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                        <Star className="w-3 h-3 text-blue-500" />
                        <span className="text-[8px] text-blue-400 font-bold uppercase tracking-widest">Featured</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        !loading && (
          <div className="glass-card overflow-hidden rounded-[50px] p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.03] bg-white/[0.01]">
                  <th className="p-10 text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Project</th>
                  <th className="p-10 text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Technologies</th>
                  <th className="p-10 text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Status</th>
                  <th className="p-10 text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Team</th>
                  <th className="p-10 text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="p-10">
                      <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-[24px] overflow-hidden border border-white/5 shadow-2xl">
                          <img src={getProjectImage(project)} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div>
                          <p className="text-xl font-display font-light text-white group-hover:text-indigo-400 transition-colors">{project.title}</p>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] mt-2">
                            {new Date(project.created_at || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-10">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies_used?.split(',').slice(0, 2).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-white/[0.05] border border-white/10 rounded text-[8px] text-zinc-400 uppercase tracking-widest">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-10">
                      <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 text-[9px] font-bold uppercase tracking-[0.2em] ${getStatusColor(project.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'Active' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' :
                          project.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                            'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                          }`} />
                        {project.status || 'Active'}
                      </div>
                    </td>
                    <td className="p-10">
                      <div className="flex -space-x-2">
                        {project.project_developers?.slice(0, 3).map((dev, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-[2px] border-black bg-zinc-900 overflow-hidden shadow-2xl">
                            <img
                              src={dev.developer_profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.developer_name}`}
                              alt={dev.developer_name || 'Developer'}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))}
                        {project.project_developers?.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-[2px] border-black bg-zinc-800 flex items-center justify-center shadow-2xl">
                            <span className="text-[6px] text-zinc-400 font-bold">
                              +{project.project_developers.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-10">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-4 rounded-2xl hover:bg-white/[0.03] text-zinc-600 hover:text-white transition-all border border-transparent hover:border-white/5"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(project.id)}
                          className="p-4 rounded-2xl hover:bg-white/[0.03] text-zinc-600 hover:text-red-500 transition-all border border-transparent hover:border-white/5"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Empty State */}
      {!loading && filteredProjects.length === 0 && (
        <div className="py-32 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-zinc-700" />
          </div>
          <h3 className="text-2xl font-bold text-white serif mb-2">No projects found</h3>
          <p className="text-zinc-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;

