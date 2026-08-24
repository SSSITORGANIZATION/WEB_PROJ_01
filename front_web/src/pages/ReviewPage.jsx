import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Star, ArrowLeft, CheckCircle, AlertCircle, X } from "lucide-react";

const REVIEWS_API = "http://localhost:8000/performance-reviews/";
const PROJECTS_API = "http://localhost:8000/projects/";

const ReviewPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch recommended projects
  const fetchRecommendedProjects = async () => {
    try {
      const res = await axios.get(PROJECTS_API);
      const projects = res.data.filter(p => p.id !== parseInt(projectId)).slice(0, 2);
      setRecommendedProjects(projects);
    } catch (err) {
      console.error("Failed to fetch recommended projects:", err);
    }
  };

  const [formData, setFormData] = useState({
    reviewer_name: "",
    rating: 0,
    feedback: "",
    review_period: "Project Delivery",
  });

  // Fetch specific project
  useEffect(() => {
    if (!projectId) {
      navigate("/projects");
      return;
    }

    const fetchProject = async () => {
      try {
        const res = await axios.get(`${PROJECTS_API}${projectId}/`);
        setProject(res.data);
        setIsOpen(true); // Open modal when project is loaded
      } catch (err) {
        setError("Project not found.");
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reviewer_name || !formData.rating || !formData.feedback) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const submissionData = {
        ...formData,
        project: parseInt(projectId),
      };

      await axios.post(REVIEWS_API, submissionData);

      setSuccess(true);
      await fetchRecommendedProjects();
    } catch (err) {
      if (err.response?.data) {
        const errorMessages = Object.values(err.response.data)
          .flat()
          .join(", ");
        setError(errorMessages);
      } else {
        setError("Failed to submit review.");
      }
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  if (!isOpen) {
    return null; // Don't render anything if modal is not open
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-zinc-900 rounded-2xl border border-white/10 w-full max-w-xl h-[600px] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft width="20" height="20" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Share Your Experience
              </h1>
              <p className="text-zinc-400 text-xs">
                Review for {project?.title || "Loading..."}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X width="20" height="20" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-hidden">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col px-6 py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-green-500/25 mx-auto"
              >
                <CheckCircle className="w-6 h-6 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-bold text-white mb-2 text-center"
              >
                Thank You for Your Review!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-zinc-400 text-sm mb-6 text-center"
              >
                Your feedback helps us improve. Check out these similar projects:
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex-1 overflow-y-auto mb-4"
              >
                <div className="flex gap-3 justify-center">
                  {recommendedProjects.map((proj, index) => (
                    <motion.div
                      key={proj.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 hover:bg-zinc-800/70 hover:border-zinc-600/50 transition-all duration-200 cursor-pointer flex-1 max-w-[280px]"
                      onClick={() => navigate(`/project/${proj.id}`)}
                    >
                      <div className="flex flex-col items-center text-center">
                        {proj.project_image ? (
                          <img
                            src={proj.project_image}
                            alt={proj.title}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                          />
                        ) : (
                          <div className="w-full h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-lg">
                              {proj.title?.charAt(0)?.toUpperCase() || 'P'}
                            </span>
                          </div>
                        )}
                        <h3 className="text-white font-medium text-sm mb-1 w-full">
                          {proj.title || 'Untitled Project'}
                        </h3>
                        {proj.category && (
                          <span className="inline-block px-2 py-1 bg-zinc-700/50 text-zinc-300 text-xs rounded-full">
                            {proj.category}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={handleClose}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-all duration-200 border border-zinc-700"
              >
                Back to Previous Page
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
              <div className="space-y-3 flex-1 overflow-hidden">
                {/* Rating Section */}
                <div className="space-y-2">
                  <label className="block">
                    <span className="text-zinc-300 font-medium text-sm">Rate Your Experience</span>
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-2xl transition-all duration-200"
                        style={{
                          color:
                            star <= (hover || formData.rating)
                              ? "#facc15"
                              : "#374151",
                        }}
                        onClick={() =>
                          setFormData({ ...formData, rating: star })
                        }
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                      >
                        <Star
                          fill={star <= (hover || formData.rating) ? "currentColor" : "none"}
                          className="w-6 h-6"
                        />
                      </motion.button>
                    ))}
                  </div>
                  {formData.rating > 0 && (
                    <div className="text-center">
                      <span className="text-xs text-zinc-400">
                        {ratingLabels[formData.rating]} ({formData.rating}/5)
                      </span>
                    </div>
                  )}
                </div>

                {/* Name Input */}
                <div className="space-y-1">
                  <label className="block">
                    <span className="text-zinc-300 font-medium text-sm">Your Name / Company</span>
                  </label>
                  <input
                    type="text"
                    name="reviewer_name"
                    value={formData.reviewer_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800 transition-all text-sm"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Feedback Textarea */}
                <div className="space-y-1 flex-1 flex flex-col">
                  <label className="block">
                    <span className="text-zinc-300 font-medium text-sm">Your Review</span>
                  </label>
                  <textarea
                    name="feedback"
                    maxLength="1000"
                    value={formData.feedback}
                    onChange={handleChange}
                    className="flex-1 w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800 transition-all resize-none text-sm"
                    placeholder="Share your experience..."
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-zinc-500 text-xs">
                      {formData.feedback.length}/1000
                    </p>
                    <span className="text-zinc-400 text-xs">Min 10 chars</span>
                  </div>
                </div>

                {/* Review Period */}
                <div className="space-y-1">
                  <label className="block">
                    <span className="text-zinc-300 font-medium text-sm">Review Period</span>
                  </label>
                  <input
                    type="text"
                    name="review_period"
                    value={formData.review_period}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800 transition-all text-sm"
                    placeholder="e.g., Q1 2024"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Review"
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewPage;
