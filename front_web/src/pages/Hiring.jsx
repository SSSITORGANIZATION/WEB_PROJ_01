import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api";

/* =========================
   JOB CARD
========================= */

const JobCard = ({ job, applications = [] }) => {
  const navigate = useNavigate();

  const isApplied = applications.some((app) => {
    const applicationJobId =
      typeof app.job === "object" && app.job !== null
        ? app.job.id
        : app.job ?? app.job_id;

    return String(applicationJobId) === String(job.id);
  });

  const skills = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === "string"
      ? job.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : typeof job.skill_set === "string"
        ? job.skill_set.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [];

  const experience =
    job.experience ||
    job.experience_required ||
    job.experience_level ||
    "";

  const employmentType = job.type || job.job_type || "Full-Time";
  const location = job.location || "Remote";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              {employmentType}
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-gray-600 sm:text-sm">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {location}
            </span>

            {experience && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-600 sm:text-sm">
                <Briefcase className="h-3.5 w-3.5 shrink-0" />
                {experience}
              </span>
            )}

            {job.salary && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-600 sm:text-sm">
                <DollarSign className="h-3.5 w-3.5 shrink-0" />
                {job.salary}
              </span>
            )}

            {job.is_new && (
              <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                New
              </span>
            )}
          </div>

          <h3 className="mb-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-700 sm:text-lg">
            {job.title || "Untitled Position"}
          </h3>

          <p className="text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
            {job.description ||
              "Explore this opportunity and learn more about the role."}
          </p>

          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-md border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center sm:justify-end">
          {isApplied ? (
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-xs font-medium text-green-700 sm:w-auto sm:text-sm">
              <CheckCircle className="h-4 w-4" />
              Already Applied
            </span>
          ) : (
            <button
              type="button"
              onClick={() => navigate(`/apply/${job.id}`)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 sm:w-auto sm:text-sm"
            >
              View Job &amp; Apply
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
};

/* =========================
   HIRING PAGE
========================= */

const Hiring = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    position: "",
    education: "",
    skill_set: "",
    certification: "",
    experience: "",
    email: "",
    contact: "",
    linkedin_id: "",
  });

  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({
    type: "",
    text: "",
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (selectedJob) {
      setForm((previous) => ({
        ...previous,
        position: selectedJob.title || "",
      }));
    }
  }, [selectedJob]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          apiService.getJobs(),
          apiService.getJobApplications(),
        ]);

        const jobsData = Array.isArray(jobsRes.data)
          ? jobsRes.data
          : jobsRes.data?.results || [];

        const applicationsData = Array.isArray(appsRes.data)
          ? appsRes.data
          : appsRes.data?.results || [];

        setJobs(jobsData);
        setApplications(applicationsData);
      } catch (error) {
        console.error("Error fetching hiring data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const closeForm = () => {
    setShowForm(false);
    setSelectedJob(null);
    setResume(null);
    setFormMessage({ type: "", text: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedJob) {
      setFormMessage({
        type: "error",
        text: "Please select a job before submitting.",
      });
      return;
    }

    const requiredFields = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      contact: form.contact,
      education: form.education,
      skill_set: form.skill_set,
      experience: form.experience,
      linkedin_id: form.linkedin_id,
    };

    const missingField = Object.entries(requiredFields).find(
      ([, value]) => !String(value || "").trim()
    );

    if (missingField) {
      setFormMessage({
        type: "error",
        text: `Please enter your ${missingField[0].replaceAll("_", " ")}.`,
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    const numericPhone = form.contact.replace(/\D/g, "");

    if (numericPhone.length < 10) {
      setFormMessage({
        type: "error",
        text: "Please enter a valid phone number with at least 10 digits.",
      });
      return;
    }

    if (!resume) {
      setFormMessage({
        type: "error",
        text: "Upload your resume before submitting.",
      });
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(resume.type)) {
      setFormMessage({
        type: "error",
        text: "Please upload a PDF, DOC, or DOCX resume file.",
      });
      return;
    }

    if (resume.size > 5 * 1024 * 1024) {
      setFormMessage({
        type: "error",
        text: "Resume must be smaller than 5MB.",
      });
      return;
    }

    try {
      setSubmitting(true);
      setFormMessage({ type: "", text: "" });

      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "linkedin_id") {
          let link = value.trim();

          if (link && !/^https?:\/\//i.test(link)) {
            link = `https://${link}`;
          }

          data.append(key, link);
        } else {
          data.append(key, value.trim());
        }
      });

      data.append("job", selectedJob.id);
      data.append("resume", resume);

      await apiService.createJobApplication(data);

      setFormMessage({
        type: "success",
        text: "Application submitted successfully.",
      });

      try {
        const appsRes = await apiService.getJobApplications();
        const applicationsData = Array.isArray(appsRes.data)
          ? appsRes.data
          : appsRes.data?.results || [];

        setApplications(applicationsData);
      } catch (refreshError) {
        console.error("Could not refresh applications:", refreshError);
      }

      window.setTimeout(() => {
        closeForm();

        setForm({
          first_name: "",
          last_name: "",
          position: "",
          education: "",
          skill_set: "",
          certification: "",
          experience: "",
          email: "",
          contact: "",
          linkedin_id: "",
        });
      }, 1200);
    } catch (error) {
      console.error("Application submission error:", error.response?.data);

      const serverErrors = error.response?.data;
      const detail =
        serverErrors?.detail ||
        serverErrors?.error ||
        (serverErrors && typeof serverErrors === "object"
          ? Object.values(serverErrors).flat().join(" ")
          : "");

      setFormMessage({
        type: "error",
        text: detail || "Failed to submit application. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Compact Hero — same sizing style as the first page */}
      {/* Compact Hero */}
<section className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
  <div className="absolute inset-0 bg-black/10" />

  <div className="relative mx-auto w-[90%] px-4 py-7 sm:px-6 lg:px-10">
    <div className="mx-auto max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Careers button removed */}

        <h1 className="mb-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
          Build What's Next, With Us
        </h1>

        <p className="mx-auto max-w-3xl text-xs leading-6 text-blue-100 sm:text-sm">
          We're a team of engineers who care about craft. If you want to work
          on real products with people who'll push you to do your best work,
          we'd love to meet you.
        </p>
      </motion.div>

      {!loading && jobs.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-blue-100 sm:text-sm">
          <span className="inline-flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {jobs.length} Open Roles
          </span>

          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Remote Friendly
          </span>
        </div>
      )}
    </div>
  </div>
</section>

      {/* Open Positions */}
      <section id="open-positions" className="py-9 sm:py-12">
        <div className="mx-auto w-[90%] px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
              Open Roles
            </h2>

            <p className="max-w-2xl text-xs leading-5 text-gray-600 sm:text-sm">
              Take a look at what we're hiring for right now and find where
              you'd fit in.
            </p>
          </motion.div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-xl border border-gray-200 bg-white"
                />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  applications={applications}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm">
              <Briefcase className="mx-auto mb-3 h-12 w-12 text-gray-300" />

              <h3 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
                No Open Roles Right Now
              </h3>

              <p className="mx-auto max-w-md text-xs leading-5 text-gray-600 sm:text-sm">
                We're fully staffed at the moment, but new roles open up often.
                Check back soon for future opportunities.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl"
          >
            <form onSubmit={handleSubmit} className="p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Apply for {selectedJob?.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Complete your details to submit your application.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  aria-label="Close application form"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {formMessage.text && (
                <div
                  role="alert"
                  className={`mb-4 rounded-lg border px-3 py-2 text-xs sm:text-sm ${
                    formMessage.type === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-green-200 bg-green-50 text-green-700"
                  }`}
                >
                  {formMessage.text}
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    value={form.position}
                    readOnly
                    className={`${inputClass} bg-gray-50`}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      name="first_name"
                      value={form.first_name}
                      onChange={(e) =>
                        setForm({ ...form, first_name: e.target.value })
                      }
                      className={inputClass}
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      name="last_name"
                      value={form.last_name}
                      onChange={(e) =>
                        setForm({ ...form, last_name: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    name="contact"
                    type="tel"
                    inputMode="numeric"
                    value={form.contact}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        contact: e.target.value.replace(/[^0-9]/g, ""),
                      })
                    }
                    className={inputClass}
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Education
                  </label>
                  <input
                    name="education"
                    value={form.education}
                    onChange={(e) =>
                      setForm({ ...form, education: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Bachelor's in Computer Science"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Skills
                  </label>
                  <input
                    name="skill_set"
                    value={form.skill_set}
                    onChange={(e) =>
                      setForm({ ...form, skill_set: e.target.value })
                    }
                    className={inputClass}
                    placeholder="React, Python, TypeScript..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Experience
                  </label>
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                    className={inputClass}
                    placeholder="3+ years of software development"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    LinkedIn Profile
                  </label>
                  <input
                    name="linkedin_id"
                    value={form.linkedin_id}
                    onChange={(e) =>
                      setForm({ ...form, linkedin_id: e.target.value })
                    }
                    className={inputClass}
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Resume
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setResume(e.target.files?.[0] || null)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    PDF, DOC, or DOCX (Max 5MB)
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Hiring;
