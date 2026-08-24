import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Search, Filter,
  MoreHorizontal, Trash2,
  CheckCircle, Clock, AlertCircle,
  User, Mail, Phone, Briefcase,
  MessageSquare, ChevronRight, X as CloseIcon,
  ChevronLeft
} from 'lucide-react';
import { apiService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDemos = () => {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [demoToDelete, setDemoToDelete] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDemos, setTotalDemos] = useState(0);
  const demosPerPage = 10;

  useEffect(() => {
    fetchDemos();
  }, [currentPage]); // Refetch when page changes

  const fetchDemos = async () => {
    setLoading(true);
    try {
      const response = await apiService.getDemoBookings(null, currentPage, demosPerPage);
      const data = response.data;
      // Handle paginated response
      const demosData = data.results || data;
      // Sort newest first by created_at or id if no created_at
      const sortedDemos = Array.isArray(demosData) ? demosData.sort((a, b) => {
        const dateA = new Date(a.created_at || a.id || 0);
        const dateB = new Date(b.created_at || b.id || 0);
        return dateB - dateA;
      }) : [];
      setDemos(sortedDemos);
      setTotalDemos(data.count || sortedDemos.length);
    } catch (error) {
      console.error("Error fetching demos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      if (status === "scheduled") {
        setSelectedDemoId(id);
        setScheduleModalOpen(true);
        return;
      }

      await apiService.updateDemoBooking(id, { status });
      fetchDemos();

    } catch (error) {
      console.error("Error updating demo status:", error);
    }
  };

  const handleDelete = (demo) => {
    setDemoToDelete(demo);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (demoToDelete) {
      try {
        await apiService.deleteDemoBooking(demoToDelete.id);
        fetchDemos();
        setDeleteModalOpen(false);
        setDemoToDelete(null);
      } catch (error) {
        console.error("Error deleting demo:", error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDemoToDelete(null);
  };

  const confirmSchedule = async () => {
    try {
      await apiService.updateDemoBooking(selectedDemoId, {
        status: "scheduled",
        scheduled_date: scheduleDate,
        scheduled_time: scheduleTime
      });

      setScheduleModalOpen(false);
      setScheduleDate('');
      setScheduleTime('');
      fetchDemos();

    } catch (error) {
      console.error("Error scheduling demo:", error);
    }
  };
  const filteredDemos = useMemo(() => {
    return demos.filter(d =>
      (d.name || d.full_name || '')?.toLowerCase().includes(search.toLowerCase()) ||
      (d.company || '')?.toLowerCase().includes(search.toLowerCase()) ||
      (d.email || '')?.toLowerCase().includes(search.toLowerCase())
    );
  }, [demos, search]);

  const totalPages = Math.ceil(totalDemos / demosPerPage);

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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Demo Requests</h1>
              <p className="text-gray-600 text-sm">Manage and schedule consultations with potential clients.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Total Requests</p>
                <p className="text-lg font-bold text-gray-900 leading-tight">{totalDemos}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between gap-4 mb-6 p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold">Client Info</th>
                  <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold">Project Interest</th>
                  <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold">Status</th>
                  <th className="p-4 text-xs text-gray-600 uppercase tracking-wide font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="p-8 bg-gray-50" />
                    </tr>
                  ))
                ) : filteredDemos.map((demo) => (
                  <tr key={demo.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-gray-900 text-sm font-semibold">{demo.name || demo.full_name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{demo.email || 'N/A'} • {demo.company || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-900 font-semibold">{demo.project_interest || demo.project_name || 'General Inquiry'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={demo.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(demo.id, e.target.value)}
                        className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border focus:outline-none transition-all ${demo.status === 'completed'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : demo.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {demo.email && (
                          <a href={`mailto:${demo.email}`} className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors">
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => handleDelete(demo)} className="p-1.5 text-gray-500 hover:text-red-600 transition-colors">
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
          {!loading && filteredDemos.length > 0 && totalPages > 1 && (
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {scheduleModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl w-full max-w-md">
              <h2 className="text-gray-900 text-lg font-semibold mb-4">Schedule Demo</h2>

              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full mb-3 p-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:border-blue-500"
              />

              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full mb-4 p-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:border-blue-500"
              />

              <div className="flex gap-3">
                <button onClick={() => setScheduleModalOpen(false)} className="flex-1 bg-gray-200 text-gray-900 p-2 rounded-lg font-semibold hover:bg-gray-300">
                  Cancel
                </button>
                <button onClick={confirmSchedule} className="flex-1 bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Demo Request</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete the demo request from "{demoToDelete?.name || demoToDelete?.full_name}"? This action cannot be undone.
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
                  Delete Request
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

export default AdminDemos;

