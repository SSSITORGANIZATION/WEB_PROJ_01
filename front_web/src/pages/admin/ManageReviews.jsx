import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  Star, Search, Filter, Edit3, Trash2, Save, X,
  ChevronLeft, ChevronRight, User, Calendar, MessageSquare
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

const REVIEWS_API = "http://localhost:8000/performance-reviews/";
const ITEMS_PER_PAGE = 10;

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [editFormData, setEditFormData] = useState({
    reviewer_name: "",
    rating: 1,
    feedback: "",
    review_period: "Project Delivery",
  });

  const load = async () => {
    try {
      const res = await axios.get(REVIEWS_API);
      // Enhance reviews with project titles
      const enhancedReviews = await Promise.all(
        res.data.map(async (review) => {
          if (review.project) {
            try {
              const projectRes = await axios.get(`http://localhost:8000/projects/${review.project}/`);
              return {
                ...review,
                project_title: projectRes.data.title || `Project #${review.project}`
              };
            } catch (err) {
              return {
                ...review,
                project_title: `Project #${review.project}`
              };
            }
          }
          return review;
        })
      );
      setReviews(enhancedReviews);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= Pagination Logic ================= */

  const filteredReviews = useMemo(() => {
    return reviews.filter(review =>
      review.reviewer_name?.toLowerCase().includes(search.toLowerCase()) ||
      review.feedback?.toLowerCase().includes(search.toLowerCase()) ||
      review.project_title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [reviews, search]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  /* ================= CRUD ================= */

  const remove = async (id) => {
    // Find the review to get its details for the modal
    const review = reviews.find(r => r.id === id);
    setReviewToDelete(review);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (reviewToDelete) {
      setDeletingId(reviewToDelete.id);
      try {
        await axios.delete(`${REVIEWS_API}${reviewToDelete.id}/`);
        load();
        setDeleteModalOpen(false);
        setReviewToDelete(null);
      } catch (error) {
        console.error("Error deleting review:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  const startEdit = (review) => {
    setEditingReview(review.id);
    setEditFormData({
      reviewer_name: review.reviewer_name,
      rating: review.rating,
      feedback: review.feedback,
      review_period: review.review_period || "Project Delivery",
    });
  };

  const cancelEdit = () => {
    setEditingReview(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const saveEdit = async () => {
    try {
      const updateData = {
        ...editFormData,
        project: editingReview?.project,
      };

      await axios.put(`${REVIEWS_API}${editingReview}/`, updateData);
      load();
      cancelEdit();
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : "span"}
          onClick={interactive ? () => onRatingChange?.(star) : undefined}
          className={`${interactive ? 'hover:scale-110 transition-transform' : ''}`}
          disabled={!interactive}
        >
          <Star
            className={`w-4 h-4 ${star <= rating
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-zinc-600'
              }`}
          />
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-grow overflow-y-auto p-6">
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            <p className="ml-4 text-gray-600">Loading reviews...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-grow overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Reviews</h1>
              <p className="text-sm text-gray-600">Edit and manage client reviews and feedback.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Total Reviews</p>
                <p className="text-lg font-bold leading-none text-gray-900">{reviews.length}</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-gray-200 bg-white py-20 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Found</h3>
              <p className="text-gray-600">No reviews have been submitted yet.</p>
            </motion.div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-blue-50">
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-blue-800">Project</th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-blue-800">Reviewer</th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-blue-800">Rating</th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-blue-800">Feedback</th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-blue-800">Date</th>
                      <th className="p-4 text-right text-xs font-semibold uppercase tracking-wide text-blue-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <AnimatePresence>
                      {paginatedReviews.map((review, index) => (
                        <motion.tr
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-white/5 transition-colors"
                        >
                          {editingReview === review.id ? (
                            <>
                              <td className="p-4">
                                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium inline-block">
                                  {review.project_title || 'Unknown Project'}
                                </div>
                              </td>
                              <td className="p-4">
                                <input
                                  type="text"
                                  name="reviewer_name"
                                  value={editFormData.reviewer_name}
                                  onChange={handleEditChange}
                                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                                  placeholder="Reviewer name"
                                />
                              </td>
                              <td className="p-4">
                                {renderStars(editFormData.rating, true, (rating) =>
                                  setEditFormData(prev => ({ ...prev, rating }))
                                )}
                              </td>
                              <td className="p-4">
                                <textarea
                                  name="feedback"
                                  value={editFormData.feedback}
                                  onChange={handleEditChange}
                                  className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                                  rows={3}
                                  placeholder="Review feedback"
                                />
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(review.created_at).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={saveEdit}
                                    className="p-1.5 text-green-500 hover:text-green-400 transition-colors"
                                    title="Save"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="p-1.5 text-gray-500 transition-colors hover:text-gray-900"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-4">
                                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium inline-block">
                                  {review.project_title || 'Unknown Project'}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
                                    <User className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{review.reviewer_name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  {renderStars(review.rating)}
                                  <span className="text-sm text-gray-600">({review.rating}/5)</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="max-w-md">
                                  <p className="line-clamp-3 text-xs leading-relaxed text-gray-700">
                                    {review.feedback || 'No feedback provided'}
                                  </p>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(review.created_at).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => startEdit(review)}
                                    className="p-1.5 text-gray-500 transition-colors hover:text-blue-600"
                                    title="Edit"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => remove(review.id)}
                                    className="p-1.5 text-gray-500 transition-colors hover:text-red-600"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </motion.button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => goToPage(index + 1)}
                      className={`w-10 h-10 rounded-lg transition-colors ${currentPage === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      {index + 1}
                    </motion.button>
                  ))}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

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
              className="relative z-10 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="admin-modal-title text-lg font-bold text-gray-900 mb-2">Delete Review</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete the review from "{reviewToDelete?.reviewer_name || 'Anonymous'}" for "{reviewToDelete?.project_title || 'Unknown Project'}"? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 rounded-lg bg-gray-200 py-2.5 text-xs font-bold text-gray-900 transition-all hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId}
                  className="flex-1 py-2.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
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

export default ManageReviews;
