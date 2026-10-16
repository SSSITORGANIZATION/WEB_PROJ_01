import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  X,
  MessageSquare,
  Calendar,
  Briefcase,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { apiService } from '../services/api';

const ReviewForm = ({
  projectId = null,
  onClose,
  onSubmit,
}) => {
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    project: projectId || '',
    reviewer_name: '',
    rating: 5,
    feedback: '',
    review_period: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!projectId) {
      fetchProjects();
    }
  }, [projectId]);

  const fetchProjects = async () => {
    try {
      const response = await apiService.getProjects();
      const data = response?.data;

      const projectsData = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setProjects(projectsData.filter((project) => project.is_featured));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setNotice(null);

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: '',
      }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData((previous) => ({
      ...previous,
      rating,
    }));

    setNotice(null);

    if (errors.rating) {
      setErrors((previous) => ({
        ...previous,
        rating: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.reviewer_name.trim()) {
      newErrors.reviewer_name = 'Please enter your name.';
    } else if (formData.reviewer_name.trim().length > 150) {
      newErrors.reviewer_name = 'Name must not exceed 150 characters.';
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Please write your review.';
    } else if (formData.feedback.trim().length < 10) {
      newErrors.feedback = 'Your review must contain at least 10 characters.';
    }

    const rating = Number(formData.rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      newErrors.rating = 'Please select a rating between 1 and 5.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading || !validateForm()) return;

    setLoading(true);
    setNotice(null);

    try {
      const submissionData = {
        ...formData,
        reviewer_name: formData.reviewer_name.trim(),
        feedback: formData.feedback.trim(),
        review_period: formData.review_period.trim(),
        rating: Number(formData.rating),
        project:
          projectId !== null && projectId !== undefined
            ? projectId
            : formData.project || null,
      };

      await apiService.createPerformanceReview(submissionData);

      setNotice({
        type: 'success',
        message: 'Your review has been submitted successfully.',
      });

      // Refresh the reviews shown by the parent component.
      if (onSubmit) {
        await onSubmit();
      }

      // Close after submission and parent refresh.
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      console.error('API response:', error.response?.data);

      const responseData = error.response?.data;

      let message = 'Unable to submit your review. Please try again.';

      if (error.response?.status === 400 && responseData) {
        if (typeof responseData === 'object') {
          message = Object.entries(responseData)
            .map(([field, value]) => {
              const details = Array.isArray(value)
                ? value.join(', ')
                : String(value);

              return `${field}: ${details}`;
            })
            .join(' ');
        } else {
          message = String(responseData);
        }
      } else if (!error.response) {
        message = 'Cannot connect to the server. Please check your connection.';
      }

      setNotice({
        type: 'error',
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (field) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
      errors[field]
        ? 'border-red-400'
        : 'border-slate-200 hover:border-slate-300'
    }`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-form-title"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.22 }}
          onClick={(event) => event.stopPropagation()}
          className="my-auto flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 sm:rounded-3xl"
        >
          {/* Modal header */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <MessageSquare size={23} />
              </div>

              <div>
                <h2
                  id="review-form-title"
                  className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
                >
                  Share Your{' '}
                  <span className="text-indigo-600">Experience</span>
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your feedback helps us improve.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close review form"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            >
              <X size={21} />
            </button>
          </div>

          {/* Scrollable form content */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 overflow-y-auto px-5 py-6 sm:px-7"
          >
            {/* Status message */}
            {notice && (
              <div
                role="alert"
                className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                  notice.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {notice.type === 'success' ? (
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />
                )}

                <span>{notice.message}</span>
              </div>
            )}

            {/* Project selection */}
            {!projectId && (
              <div>
                <label
                  htmlFor="review-project"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  <Briefcase
                    size={16}
                    className="mr-2 inline text-indigo-600"
                  />
                  Project
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <select
                  id="review-project"
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  className={inputClasses('project')}
                >
                  <option value="">General review</option>

                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-slate-500">
                  Select a project or leave this blank to review our services.
                </p>

                {errors.project && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.project}
                  </p>
                )}
              </div>
            )}

            {/* Reviewer name */}
            <div>
              <label
                htmlFor="reviewer-name"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Your Name <span className="text-red-500">*</span>
              </label>

              <input
                id="reviewer-name"
                type="text"
                name="reviewer_name"
                value={formData.reviewer_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                autoComplete="name"
                maxLength={150}
                className={inputClasses('reviewer_name')}
                aria-invalid={Boolean(errors.reviewer_name)}
                required
              />

              {errors.reviewer_name && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.reviewer_name}
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-800">
                Your Rating <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div
                  className="flex items-center gap-1"
                  role="group"
                  aria-label="Choose a rating from one to five stars"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingChange(rating)}
                      aria-label={`${rating} star${rating > 1 ? 's' : ''}`}
                      aria-pressed={Number(formData.rating) === rating}
                      className="rounded-md p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <Star
                        size={27}
                        className={
                          rating <= Number(formData.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }
                      />
                    </button>
                  ))}
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  {formData.rating} out of 5
                </span>
              </div>

              {errors.rating && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Review period */}
            <div>
              <label
                htmlFor="review-period"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                <Calendar
                  size={16}
                  className="mr-2 inline text-indigo-600"
                />
                Review Period
                <span className="ml-1 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <input
                id="review-period"
                type="text"
                name="review_period"
                value={formData.review_period}
                onChange={handleInputChange}
                placeholder="e.g., January 2026"
                className={inputClasses('review_period')}
              />
            </div>

            {/* Feedback */}
            <div>
              <label
                htmlFor="review-feedback"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Your Review <span className="text-red-500">*</span>
              </label>

              <textarea
                id="review-feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                placeholder="Tell us about your experience working with us..."
                rows={5}
                maxLength={3000}
                className={`${inputClasses('feedback')} resize-y leading-6`}
                aria-invalid={Boolean(errors.feedback)}
                required
              />

              <div className="mt-2 flex items-start justify-between gap-3">
                {errors.feedback ? (
                  <p className="text-sm text-red-600">
                    {errors.feedback}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Please write at least 10 characters.
                  </p>
                )}

                <span className="shrink-0 text-xs text-slate-400">
                  {formData.feedback.length}/3000
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={17} />
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
