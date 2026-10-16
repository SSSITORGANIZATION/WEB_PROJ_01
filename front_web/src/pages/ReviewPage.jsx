import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Star,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

const REVIEWS_API = "http://localhost:8000/performance-reviews/";
const PROJECTS_API = "http://localhost:8000/projects/";

const ReviewPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [recommendedProjects, setRecommendedProjects] = useState([]);

  const [formData, setFormData] = useState({
    reviewer_name: "",
    rating: 0,
    feedback: "",
    review_period: "Project Delivery",
  });

  const ratingLabels = [
    "",
    "Poor",
    "Fair",
    "Good",
    "Very Good",
    "Excellent",
  ];

  useEffect(() => {
    if (!projectId) {
      navigate("/projects");
      return;
    }

    const fetchProject = async () => {
      try {
        setProjectLoading(true);
        const response = await axios.get(
          `${PROJECTS_API}${projectId}/`
        );
        setProject(response.data);
      } catch (err) {
        setError("Project not found. Please select a valid project.");
      } finally {
        setProjectLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  const fetchRecommendedProjects = async () => {
    try {
      const response = await axios.get(PROJECTS_API);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      setRecommendedProjects(
        data.filter((item) => String(item.id) !== String(projectId)).slice(0, 2)
      );
    } catch (err) {
      console.error("Failed to fetch recommended projects:", err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.reviewer_name.trim()) {
      setError("Please enter your name or company name.");
      return;
    }

    if (!formData.rating) {
      setError("Please select a star rating.");
      return;
    }

    if (formData.feedback.trim().length < 10) {
      setError("Your review must contain at least 10 characters.");
      return;
    }

    try {
      setLoading(true);

      const submissionData = {
        ...formData,
        reviewer_name: formData.reviewer_name.trim(),
        feedback: formData.feedback.trim(),
        project: Number(projectId),
      };

      await axios.post(REVIEWS_API, submissionData);

      setSuccess(true);
      await fetchRecommendedProjects();
    } catch (err) {
      if (err.response?.data) {
        const details = Object.values(err.response.data)
          .flat()
          .join(", ");

        setError(details || "Failed to submit your review.");
      } else {
        setError("Unable to submit your review. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  if (projectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <LoaderCircle className="h-5 w-5 animate-spin text-blue-600" />
          Loading project details...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-3 h-9 w-9 text-red-500" />
          <h1 className="text-xl font-semibold text-slate-900">
            Project unavailable
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {error || "We couldn't find the selected project."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
          >
            {success ? (
              <div className="py-5">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>

                <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
                  Thank You for Your Review!
                </h1>

                <p className="mx-auto mt-2 max-w-md text-center text-sm leading-6 text-slate-500">
                  Your feedback helps SA Technologies improve its services
                  and deliver better project experiences.
                </p>

                {recommendedProjects.length > 0 && (
                  <div className="mt-7">
                    <h2 className="mb-3 text-base font-semibold text-slate-900">
                      Explore Other Projects
                    </h2>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {recommendedProjects.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => navigate(`/project/${item.id}`)}
                          className="overflow-hidden rounded-xl border border-slate-200 text-left transition hover:border-blue-300 hover:shadow-sm"
                        >
                          {item.project_image ? (
                            <img
                              src={item.project_image}
                              alt={item.title || "Project"}
                              className="h-32 w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-24 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-bold text-white">
                              {item.title?.charAt(0)?.toUpperCase() || "P"}
                            </div>
                          )}

                          <div className="p-3">
                            <h3 className="text-sm font-semibold text-slate-800">
                              {item.title || "Untitled Project"}
                            </h3>
                            {item.category && (
                              <p className="mt-1 text-xs text-slate-500">
                                {item.category}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/projects")}
                  className="mt-7 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Explore All Projects
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    SA Technologies
                  </span>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Share Your Experience
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Tell us about your experience with our work. Your feedback
                    helps us improve our services.
                  </p>

                  <div className="mt-4 rounded-lg bg-blue-50 px-3 py-3">
                    <p className="text-xs font-medium text-blue-700">
                      Reviewing project
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {project.title || "Selected Project"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Rate Your Experience
                    </label>

                    <div
                      className="flex items-center gap-2"
                      role="group"
                      aria-label="Rate your experience"
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = star <= (hover || formData.rating);

                        return (
                          <motion.button
                            key={star}
                            type="button"
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`${star} star${star > 1 ? "s" : ""}`}
                            aria-pressed={formData.rating === star}
                            onClick={() => {
                              setFormData((previous) => ({
                                ...previous,
                                rating: star,
                              }));
                              setError("");
                            }}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          >
                            <Star
                              className={`h-7 w-7 transition ${
                                active
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          </motion.button>
                        );
                      })}

                      {formData.rating > 0 && (
                        <span className="ml-2 text-sm font-medium text-slate-600">
                          {ratingLabels[formData.rating]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reviewer_name"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Your Name / Company
                    </label>
                    <input
                      id="reviewer_name"
                      type="text"
                      name="reviewer_name"
                      value={formData.reviewer_name}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter your name or company"
                      required
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label
                        htmlFor="feedback"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Your Review
                      </label>
                      <span className="text-xs text-slate-400">
                        {formData.feedback.length}/1000
                      </span>
                    </div>

                    <textarea
                      id="feedback"
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleChange}
                      maxLength={1000}
                      rows={5}
                      className={`${inputClass} resize-y`}
                      placeholder="Share your experience with our project..."
                      required
                    />

                    <p className="mt-1 text-xs text-slate-400">
                      Please enter at least 10 characters.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="review_period"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Review Period
                    </label>
                    <input
                      id="review_period"
                      type="text"
                      name="review_period"
                      value={formData.review_period}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. Project Delivery"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Submitting Review...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Why Your Feedback Matters
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your review helps our team understand what worked well and where
              we can improve.
            </p>

            <div className="mt-5 space-y-4">
              {[
                ["01", "Help us improve", "Share what went well and what could be better."],
                ["02", "Support future clients", "Help others understand our project experience."],
                ["03", "Recognize our team", "Let us know how our work made a difference."],
              ].map(([number, title, description]) => (
                <div key={number} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
                    {number}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-800">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ReviewPage;
