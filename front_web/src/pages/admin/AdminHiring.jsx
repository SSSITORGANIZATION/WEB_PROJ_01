import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase, Users, Search, Filter,
  Plus, MoreHorizontal, CheckCircle,
  Clock, AlertCircle, X, Mail,
  FileText, Link as LinkIcon, Github,
  Linkedin, MessageSquare, Trash2, Edit
} from 'lucide-react';
import { apiService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import axios from "axios";

const AdminHiring = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [jobFormData, setJobFormData] = useState({
    title: '',
    description: '',
    experience_required: '0',
    skills_required: '',
    location: ''
  });

  useEffect(() => {
    fetchData();
  }, []);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [rounds, setRounds] = useState([
    { round_number: 1, title: "", description: "" }
  ]);
  const fetchData = async () => {
    setLoading(true);

    try {
      const [jobsResponse, appsResponse, interviewRes] = await Promise.all([
        apiService.getJobs(),
        apiService.getJobApplications(),
        axios.get("http://127.0.0.1:8000/interview-process/")
      ]);

      const jobsData = Array.isArray(jobsResponse.data)
        ? jobsResponse.data
        : (jobsResponse.data.results || jobsResponse.data);

      const appsData = Array.isArray(appsResponse.data)
        ? appsResponse.data
        : (appsResponse.data.results || appsResponse.data);

      setJobs(jobsData);
      setApplications(appsData);
      setInterviews(interviewRes.data);

    } catch (error) {
      console.error("Error fetching hiring data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [interviews, setInterviews] = useState([]);
  const addRound = () => {
    setRounds(prev => [
      ...prev,
      { round_number: prev.length + 1, title: "", description: "" }
    ]);
  };

  const removeRound = (index) => {
    const updated = rounds
      .filter((_, i) => i !== index)
      .map((r, i) => ({ ...r, round_number: i + 1 }));

    setRounds(updated);
  };

  const handleRoundChange = (index, field, value) => {
    const updated = [...rounds];
    updated[index][field] = value;
    setRounds(updated);
  };

  const handleInterviewProcessSubmit = async (e) => {
    e.preventDefault();

    try {
      for (let round of rounds) {
        await axios.post("http://127.0.0.1:8000/interview-process/", {
          job: selectedJob,
          round_number: round.round_number,
          title: round.title,
          description: round.description
        });
      }

      // ✅ reset
      setRounds([{ round_number: 1, title: "", description: "" }]);
      setSelectedJob("");
      setShowInterviewModal(false);

      fetchData();

    } catch (err) {
      console.error("Error saving interview process:", err);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await apiService.updateJob(editingJob.id, jobFormData);
      } else {
        await apiService.createJob(jobFormData);
      }
      setShowJobModal(false);
      setEditingJob(null);
      setJobFormData({ title: '', description: '', experience_required: '', skills_required: '', location: '' });
      fetchData();
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    console.log(appId, newStatus); // 👈 check values
    try {
      await apiService.updateJobApplication(appId, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await apiService.deleteJob(jobId);
        fetchData();
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const filteredApps = applications.filter(app =>
    app.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    app.email?.toLowerCase().includes(search.toLowerCase())
  );

  const groupedInterviews = {};

  interviews.forEach(i => {
    if (!groupedInterviews[i.job]) {
      groupedInterviews[i.job] = [];
    }
    groupedInterviews[i.job].push(i);
  });
  const handleDeleteInterview = async (jobId) => {
    const related = interviews.filter(i => i.job == jobId);

    for (let r of related) {
      await axios.delete(`http://127.0.0.1:8000/interview-process/${r.id}/`);
    }

    fetchData();
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Hiring Management</h1>
              <p className="text-gray-600 text-sm">Manage job postings and review candidate applications.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'applications' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Applications
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'jobs' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Job Postings
                </button>
                <button
                  onClick={() => setActiveTab('interviews')}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'interviews'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Interview Process
                </button>

              </div>
              {activeTab === 'jobs' && (
                <button
                  onClick={() => {
                    setEditingJob(null);
                    setJobFormData({
                      title: '',
                      description: '',
                      experience_required: '',
                      skills_required: '',
                      location: ''
                    });
                    setShowJobModal(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Post New Job
                </button>
              )}
              {activeTab === 'interviews' && (
                <button
                  onClick={() => {
                    setEditingJob(null);
                    setJobFormData({
                      title: '',
                      description: '',
                      experience_required: '',
                      skills_required: '',
                      location: ''
                    });
                    setShowInterviewModal(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Interview Round
                </button>
              )}
            </div>
          </div>
          <div className="relative mb-6 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder={activeTab === 'applications' ? "Search candidates..." : "Search jobs..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
            />
          </div>

          {/* Replace your current ternary block with this: */}
          {loading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white border border-gray-200 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <>
              {activeTab === 'applications' && (
                <div className="space-y-3">
                  {filteredApps.map((app) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm group hover:border-blue-300 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:scale-110 transition-transform">
                            <Users className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 leading-tight">{app.full_name}</h3>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {app.email}</span>
                              <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={
                              app.resume.startsWith("http")
                                ? app.resume
                                : `http://127.0.0.1:8000${app.resume}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors rounded-lg"
                            title="Resume"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                          {app.portfolio_url && <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="p-1.5 bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors rounded-lg" title="Portfolio"><LinkIcon className="w-4 h-4" /></a>}
                          {app.github_url && <a href={app.github_url} target="_blank" rel="noreferrer" className="p-1.5 bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors rounded-lg" title="GitHub"><Github className="w-4 h-4" /></a>}
                          {app.linkedin_url && <a href={app.linkedin_url} target="_blank" rel="noreferrer" className="p-1.5 bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors rounded-lg" title="LinkedIn"><Linkedin className="w-4 h-4" /></a>}

                          <div className="h-6 w-px bg-gray-200 mx-1 hidden lg:block" />

                          <select
                            value={app.status}
                            onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide focus:outline-none transition-all ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                              app.status === 'reviewing' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                app.status === 'shortlisted' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                  app.status === 'hired' ? 'bg-green-100 text-green-700 border border-green-200' :
                                    'bg-red-100 text-red-700 border border-red-200'
                              }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
                        </div>
                      </div>
                      {app.cover_letter && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> Cover Letter</p>
                          <p className="text-gray-700 text-sm leading-relaxed italic">"{app.cover_letter}"</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {filteredApps.length === 0 && (
                    <div className="py-16 text-center bg-white border border-gray-200 border-dashed rounded-xl">
                      <Users className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">No applications found</h3>
                      <p className="text-gray-500 text-sm">Try adjusting your search criteria.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm group hover:border-blue-300 transition-all relative"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-200 group-hover:scale-110 transition-transform">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingJob(job);
                              setJobFormData({
                                title: job.title,
                                description: job.description,
                                experience_required: job.experience_required || '',
                                skills_required: job.skills_required || '',
                                location: job.location || ''
                              });
                              setShowJobModal(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1.5">{job.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{job.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-xs font-semibold text-gray-900">{job.salary_range || 'Competitive'}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${job.status === 'open' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                          {job.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                </div>
              )}

              {activeTab === 'interviews' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.keys(groupedInterviews).length > 0 ? (
                    Object.keys(groupedInterviews).map(jobId => {
                      const job = jobs.find(j => j.id == jobId);
                      return (
                        <div key={jobId} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                          <h3 className="text-gray-900 font-semibold mb-3">{job?.title || "Unknown Job"}</h3>
                          <div className="space-y-2">
                            {groupedInterviews[jobId].map(round => (
                              <div key={round.id} className="text-gray-600 text-sm">
                                <span className="font-semibold text-blue-600">Round {round.round_number}:</span> {round.title}
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => handleDeleteInterview(jobId)}
                            className="mt-4 text-xs text-red-600 hover:text-red-700 font-semibold"
                          >
                            Delete Process
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-500 text-sm italic">No interview processes configured.</div>
                  )}
                </div>
              )}
            </>
          )}

        </div>

      </main>


      {/* Job Modal */}
      <AnimatePresence>
        {showJobModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJobModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-xl p-6 relative z-10"
            >
              <button
                onClick={() => setShowJobModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingJob ? 'Edit' : 'Create'} <span className="text-blue-600">Job Posting</span>
              </h2>

              <form onSubmit={handleJobSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1.5">Job Title</label>
                    <input
                      type="text"
                      required
                      value={jobFormData.title}
                      onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                      placeholder="Senior Full Stack Engineer"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1.5">Skills Required</label>
                    <input
                      type="text"
                      value={jobFormData.skills_required}
                      onChange={(e) => setJobFormData({ ...jobFormData, skills_required: e.target.value })}
                      placeholder="Skills Required"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                    placeholder="Briefly describe the role and its impact..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1.5">Location</label>
                  <input
                    type="text"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    placeholder="Location"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1.5">Experience Required</label>
                  <select
                    value={jobFormData.experience_required}
                    onChange={(e) => setJobFormData({ ...jobFormData, experience_required: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                  >
                    <option value="0">0 years</option>
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="4">4 years</option>
                    <option value="5">5 years</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                >
                  {editingJob ? 'Update Posting' : 'Publish Job Posting'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interview Process Modal */}
      <AnimatePresence>
        {showInterviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInterviewModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-xl p-6 relative z-10"
            >
              <button
                onClick={() => setShowInterviewModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Add <span className="text-blue-600">Interview Process</span>
              </h2>

              <form onSubmit={handleInterviewProcessSubmit} className="space-y-4">

                {/* JOB SELECT */}
                <div>
                  <label className="block text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                    Select Job
                  </label>
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  >
                    <option value="">Select Job</option>
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 🔥 ROUNDS */}
                {rounds.map((round, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">

                    <div className="flex justify-between mb-2">
                      <span className="text-gray-900 text-sm font-semibold">
                        Round {round.round_number}
                      </span>

                      {rounds.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRound(index)}
                          className="text-red-600 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Round Title"
                      value={round.title}
                      onChange={(e) =>
                        handleRoundChange(index, "title", e.target.value)
                      }
                      className="w-full mb-2 bg-white border border-gray-200 rounded px-2 py-1 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                      required
                    />

                    <textarea
                      placeholder="Description"
                      value={round.description}
                      onChange={(e) =>
                        handleRoundChange(index, "description", e.target.value)
                      }
                      className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addRound}
                  className="text-blue-600 text-sm font-semibold"
                >
                  + Add Round
                </button>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                >
                  Save Interview Process
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHiring;

