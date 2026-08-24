import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase, MapPin, Clock, DollarSign, CheckCircle, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';



const JobCard = ({ job, applications, setSelectedJob, setShowForm }) => {
  const isApplied = applications.some(
    (app) =>
      app.job === job.id ||
      app.job_id === job.id ||
      app.job?.id === job.id
  );

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-blue-600" />
        </div>
        {job.is_new && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            New
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {job.title}
      </h3>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          {job.location || 'Remote'}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          {job.type || 'Full-time'}
        </div>
        {job.salary && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            {job.salary}
          </div>
        )}
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
        {job.description}
      </p>

      <div className="flex items-center justify-between">
        {isApplied ? (
          <span className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-700">
            ✓ Applied
          </span>
        ) : (
          <button
            onClick={() => {
              setSelectedJob(job);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Apply Now
          </button>
        )}
      </div>
    </motion.div>
  );
};

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

  // ✅ NOW useEffect AFTER state
  useEffect(() => {
    if (selectedJob) {
      setForm(prev => ({
        ...prev,
        position: selectedJob.title
      }));
    }
  }, [selectedJob]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await apiService.getJobs();
        const appsRes = await apiService.getJobApplications();

        setJobs(jobsRes.data);
        setApplications(appsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;

    const matchesSearch =
      (app.job_title || app.position || app.job?.title || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (app.skill_set || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const toggleDetails = (id) => {
    setOpenId(openId === id ? null : id);
  };
  const handleSubmit = async () => {
    if (!resume) {
      alert("Upload resume");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "linkedin_id") {
          let link = value.trim();
          if (link && !link.startsWith("http")) {
            link = "https://" + link;
          }
          data.append("linkedin_id", link);
        } else {
          data.append(key, value);
        }
      });

      data.append("job", selectedJob.id);
      data.append("resume", resume);

      await apiService.createJobApplication(data);

      alert("✅ Applied Successfully");

      setShowForm(false);
      setSelectedJob(null);

    } catch (err) {
      console.error(err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:px-8 lg:px-12">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Join Our Team
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-8">
                We're looking for talented people to help us build amazing products.
                Find your next challenge and grow your career with us.
              </p>
            </motion.div>

            {jobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <div className="flex items-center gap-3 text-lg text-blue-100">
                  <Briefcase className="w-6 h-6" />
                  <span>{jobs.length} Open Positions</span>
                </div>
                <div className="flex items-center gap-3 text-lg text-blue-100">
                  <MapPin className="w-6 h-6" />
                  <span>Remote Friendly</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our current openings and find the role that matches your skills and aspirations.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.length > 0 ? jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  applications={applications}
                  setSelectedJob={setSelectedJob}
                  setShowForm={setShowForm}
                />
              )) : (
                <div className="col-span-full py-16 text-center">
                  <div className="max-w-md mx-auto">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Open Positions
                    </h3>
                    <p className="text-gray-600">
                      We're not hiring right now, but check back soon for new opportunities!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Apply for {selectedJob?.title}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    value={form.position}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      name="first_name"
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      name="last_name"
                      value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  <input
                    name="education"
                    value={form.education}
                    onChange={(e) => setForm({ ...form, education: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bachelor's in Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </label>
                  <input
                    name="skill_set"
                    value={form.skill_set}
                    onChange={(e) => setForm({ ...form, skill_set: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="React, Python, TypeScript..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3+ years of software development"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    name="linkedin_id"
                    value={form.linkedin_id}
                    onChange={(e) => setForm({ ...form, linkedin_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Hiring;

