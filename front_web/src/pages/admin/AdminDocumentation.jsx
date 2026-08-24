import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Plus, Search,
  Edit2, Trash2,
  Save, X
} from 'lucide-react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';

const API_URL = "http://localhost:8000/documentation/";
const PROJECT_API = "http://localhost:8000/projects/";

const AdminDocumentation = () => {
  const [docs, setDocs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [developers, setDevelopers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    project: '',
    category: '',
    uploaded_by: ''
  });

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchDocs();
    fetchProjects();
    fetchDevelopers();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setDocs(res.data);
    } catch (err) {
      console.error("Error fetching docs:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const DEV_API = "http://localhost:8000/developers/";

  const fetchDevelopers = async () => {
    try {
      const res = await axios.get(DEV_API);
      setDevelopers(res.data);
    } catch {
      console.log("Failed to load developers");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(PROJECT_API);
      setProjects(res.data);
    } catch {
      console.error("Failed to load projects");
    }
  };

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !editingDoc) {
      alert("Please select a PDF file");
      return;
    }

    const data = new FormData();
    data.append("project", formData.project);
    data.append("category", formData.category);
    data.append("uploaded_by", formData.uploaded_by);

    if (file) {
      data.append("file", file);
    }

    try {
      if (editingDoc) {
        await axios.patch(`${API_URL}${editingDoc.id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await axios.post(API_URL, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      // RESET
      setIsModalOpen(false);
      setEditingDoc(null);
      setFormData({ project: '', category: '' });
      setFile(null);

      // RESET INPUT FIELD (IMPORTANT)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchDocs();

    } catch (err) {
      console.error("UPLOAD ERROR ", err.response?.data || err);
      alert("Upload failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (doc) => {
    setDocToDelete(doc);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (docToDelete) {
      setDeletingId(docToDelete.id);

      try {
        await axios.delete(`${API_URL}${docToDelete.id}/`);

        setDocs(prev =>
          prev.filter(d => d.id !== docToDelete.id)
        );

        setDeleteModalOpen(false);
        setDocToDelete(null);

      } catch {
        console.error("Delete failed");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDocToDelete(null);
  };

  /* ================= EDIT ================= */
  const openEditModal = (docItem) => {
    setEditingDoc(docItem);
    setFormData({
      project: docItem.project,
      category: docItem.category,
      uploaded_by: docItem.uploaded_by
    });
    setFile(null);
    setIsModalOpen(true);
  };

  // Get unique categories for filter pills
  const categories = ['all', ...new Set(docs.map(doc => doc.category).filter(Boolean))];

  const filteredDocs = docs.filter(d => {
    const matchesSearch = search === '' ||
      d.category?.toLowerCase().includes(search.toLowerCase()) ||
      d.project_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.uploaded_by?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Manage <span className="text-blue-600">Documentation</span>
              </h1>
            </div>

            <button
              onClick={() => {
                setEditingDoc(null);
                setFormData({ project: '', category: '' });
                setFile(null);
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" /> Upload PDF
            </button>
          </div>
          {/* SEARCH BAR UI (LIKE PROJECTS) */}
          <div className="flex items-center justify-between gap-4 mb-6 p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />

              <input
                type="text"
                placeholder="Search documentation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* CATEGORY FILTER PILLS */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-600 font-medium mr-2">Filter by category:</span>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-xs rounded-full transition-all ${selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                  {category !== 'all' && (
                    <span className="ml-1 text-gray-500">
                      ({docs.filter(doc => doc.category === category).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                {filteredDocs.length} of {docs.length} results
              </span>
              {(search || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-3 text-xs text-gray-600 uppercase tracking-wide font-semibold">Project</th>
                  <th className="p-3 text-xs text-gray-600 uppercase tracking-wide font-semibold">Category</th>
                  <th className="p-3 text-xs text-gray-600 uppercase tracking-wide font-semibold">Uploaded By</th>
                  <th className="p-3 text-xs text-gray-600 uppercase tracking-wide font-semibold">File</th>
                  <th className="p-3 text-xs text-gray-600 uppercase tracking-wide font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="p-6 bg-gray-50" />
                    </tr>
                  ))
                ) : filteredDocs.map(doc => (
                  <tr key={doc.id} className="group hover:bg-gray-50 transition-colors">

                    {/* PROJECT */}
                    <td className="p-3 text-gray-900 font-medium text-sm">
                      {doc.project_name}
                    </td>

                    {/* CATEGORY */}
                    <td className="p-3 text-gray-600 text-sm">
                      {doc.category}
                    </td>

                    {/* UPLOADED BY */}
                    <td className="p-3 text-gray-600 text-sm">
                      {doc.uploaded_by}
                    </td>

                    {/* FILE */}
                    <td className="p-3 text-sm">
                      {doc.file && (
                        <a
                          href={doc.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-700"
                        >
                          {doc.file.split('/').pop()}
                        </a>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(doc)}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(doc)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">

            {/* FIXED OVERLAY */}
            <div
              className="absolute inset-0 bg-black/50 z-0"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-xl p-6 z-10">

              <div className="flex justify-between mb-6">
                <h2 className="text-gray-900 font-semibold">
                  {editingDoc ? "Edit Documentation" : "Upload Documentation"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-900">
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                <select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 p-2 text-gray-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>

                <input
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 p-2 text-gray-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                {/* uploaded_by
                <input
                placeholder="uploaded_by"
                value={formData.uploaded_by}
                onChange={(e) => setFormData({ ...formData, uploaded_by: e.target.value })}
                className="w-full bg-white/5 p-2 text-white rounded"
                required
                /> */}
                <select
                  name="uploaded_by"
                  className="w-full bg-gray-50 border border-gray-200 p-2 text-gray-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  value={formData.uploaded_by}
                  onChange={handleChange}
                  required
                >

                  <option value="">Select Developer</option>

                  {developers.map(dev => (
                    <option
                      key={dev.id}
                      value={dev.name}
                    >
                      {dev.name}
                    </option>
                  ))}
                </select>
                {/* FILE INPUT FIXED */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-gray-900 bg-gray-50 border border-gray-200 p-2 rounded-lg cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                {file && (
                  <p className="text-green-600 text-sm">
                    Selected: {file.name}
                  </p>
                )}

                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-2 rounded-lg text-white font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all">
                  <Save size={16} />
                  {editingDoc ? "Update" : "Upload"}
                </button>

              </form>
            </div>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Documentation</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete the documentation for "{docToDelete?.project_name}"? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {deletingId ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDocumentation;