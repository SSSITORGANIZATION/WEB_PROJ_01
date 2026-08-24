import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, MessageSquare, Calendar, Briefcase, Send } from 'lucide-react';
import { apiService } from '../services/api';

const ReviewForm = ({ projectId = null, onClose, onSubmit }) => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project: projectId || '',
    reviewer_name: '',
    rating: 5,
    feedback: '',
    review_period: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!projectId) {
      fetchProjects();
    }
  }, [projectId]);

  const fetchProjects = async () => {
    try {
      const response = await apiService.getProjects();
      const data = response.data;
      const projectsData = Array.isArray(data) ? data : (data.results || data);
      setProjects(projectsData.filter(project => project.is_featured));
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.reviewer_name.trim()) {
      newErrors.reviewer_name = 'Name is required';
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Review content is required';
    } else if (formData.feedback.trim().length < 10) {
      newErrors.feedback = 'Review must be at least 10 characters';
    }

    // Project validation - only required if not on project page and projects exist
    if (!projectId && projects.length > 0 && !formData.project) {
      newErrors.project = 'Please select a project or leave empty for general review';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Ensure project is properly set
      const submissionData = {
        ...formData,
        project: projectId || formData.project || null
      };

      console.log('Submitting review data:', submissionData);
      await apiService.createPerformanceReview(submissionData);

      // Reset form
      setFormData({
        project: projectId || '',
        reviewer_name: '',
        rating: 5,
        feedback: '',
        review_period: ''
      });

      // Notify parent component
      if (onSubmit) {
        onSubmit();
      }

      // Close form
      onClose();

      // Show success message (you could add a toast notification here)
      alert('Thank you for your review! It will be visible after approval.');

    } catch (error) {
      console.error("Error submitting review:", error);
      console.error("Error response:", error.response?.data);
      if (error.response?.status === 400) {
        const errorData = error.response?.data;
        const errorMessage = typeof errorData === 'object'
          ? Object.values(errorData).flat().join(', ')
          : 'Please ensure all required fields are filled correctly.';
        alert(`Invalid data: ${errorMessage}`);
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (interactive = false) => {
    return (
      <div className="flex items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => interactive && handleRatingChange(i + 1)}
            className={`transition-all ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
              }`}
            disabled={!interactive}
          >
            <Star
              className={`w-6 h-6 ${i < formData.rating
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-zinc-600'
                }`}
            />
          </button>
        ))}
        {interactive && (
          <span className="text-zinc-400 text-sm ml-2">
            {formData.rating} out of 5
          </span>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-zinc-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white serif">
                  Share Your <span className="italic text-blue-500">Experience</span>
                </h3>
                <p className="text-zinc-400 text-sm">
                  We value your feedback
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Project Selection */}
            {!projectId && (
              <div>
                <label className="block text-white font-bold mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Project (Optional)
                </label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all ${errors.project ? 'border-red-500/50' : ''
                    }`}
                >
                  <option value="">General Review (no specific project)</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
                {errors.project && (
                  <p className="text-red-500 text-sm mt-1">{errors.project}</p>
                )}
                <p className="text-zinc-500 text-xs mt-1">
                  Leave empty for a general review about our services
                </p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-white font-bold mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="reviewer_name"
                value={formData.reviewer_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all ${errors.reviewer_name ? 'border-red-500/50' : ''
                  }`}
              />
              {errors.reviewer_name && (
                <p className="text-red-500 text-sm mt-1">{errors.reviewer_name}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-white font-bold mb-2">
                Rating *
              </label>
              {renderStars(true)}
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
              )}
            </div>

            {/* Review Period (Optional) */}
            <div>
              <label className="block text-white font-bold mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Review Period (Optional)
              </label>
              <input
                type="text"
                name="review_period"
                value={formData.review_period}
                onChange={handleInputChange}
                placeholder="e.g., Q1 2024, January 2024"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-white font-bold mb-2">
                Your Review *
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                placeholder="Share your experience working with us..."
                rows={5}
                className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none ${errors.feedback ? 'border-red-500/50' : ''
                  }`}
              />
              {errors.feedback && (
                <p className="text-red-500 text-sm mt-1">{errors.feedback}</p>
              )}
              <p className="text-zinc-500 text-xs mt-1">
                Minimum 10 characters. Be detailed and constructive.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-bold hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewForm;
