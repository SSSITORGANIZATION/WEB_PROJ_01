import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Briefcase, MapPin, Clock,
  DollarSign, CheckCircle, Shield,
  ArrowRight, User, Mail, Link as LinkIcon,
  FileText, Send, AlertCircle, Globe,
  Zap, Users, Star, Github, MessageSquare, Phone
} from 'lucide-react';
import { apiService } from '../services/api';

const ApplyForJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact: '',
    position: '',
    education: '',
    skill_set: '',
    certification: '',
    experience: '',
    linkedin_id: '',
    resume: null,
    cover_letter: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const res = await apiService.getJobs(); // get all jobs
        const jobData = res.data.find(j => j.id == id);

        if (jobData) {
          setJob(jobData);
          // Pre-fill position from job title
          setFormData(prev => ({
            ...prev,
            position: jobData.title
          }));
        } else {
          navigate('/hiring');
        }
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (only PDF)
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file only');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, resume: file });
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.first_name || !formData.last_name) {
        setError('Please enter your full name (first and last name)');
        setSubmitting(false);
        return;
      }
      if (!formData.email) {
        setError('Please enter your email address');
        setSubmitting(false);
        return;
      }
      if (!formData.contact) {
        setError('Please enter your contact number');
        setSubmitting(false);
        return;
      }
      if (!formData.resume) {
        setError('Please upload your resume (PDF file)');
        setSubmitting(false);
        return;
      }
      if (!formData.education) {
        setError('Please enter your education');
        setSubmitting(false);
        return;
      }
      if (!formData.skill_set) {
        setError('Please enter your skills');
        setSubmitting(false);
        return;
      }
      if (!formData.experience) {
        setError('Please enter your experience');
        setSubmitting(false);
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('contact', formData.contact);
      formDataToSend.append('resume', formData.resume);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('skill_set', formData.skill_set);
      formDataToSend.append('education', formData.education);
      formDataToSend.append('certification', formData.certification || '');
      formDataToSend.append('linkedin_id', formData.linkedin_id || '');
      formDataToSend.append('cover_letter', formData.cover_letter || '');
      formDataToSend.append('position', job.title);
      formDataToSend.append('job', id);

      // Log what we're sending for debugging
      console.log('Submitting job application with data:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
      }

      await apiService.createJobApplication(formDataToSend);

      setSubmitted(true);
    } catch (err) {
      console.error('Application submission error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);

      if (err.response?.data) {
        // Handle specific backend validation errors
        const errorData = err.response.data;
        console.log('Error data structure:', typeof errorData, errorData);

        if (typeof errorData === 'string') {
          setError(errorData);
        } else if (errorData.detail) {
          setError(errorData.detail);
        } else if (errorData.error) {
          setError(errorData.error);
        } else if (errorData.message) {
          setError(errorData.message);
        } else {
          // Try to extract field errors
          const errorMessages = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          setError(errorMessages || 'Failed to submit application. Please check your inputs.');
        }
      } else {
        setError('Failed to submit application. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Sent</h2>
          <p className="text-gray-600 mb-8 leading-relaxed text-sm">
            Your application for the <span className="text-blue-700 font-bold">{job.title}</span> position has been successfully submitted. Our talent team will review it and get back to you soon.
          </p>
          <button
            onClick={() => navigate('/hiring')}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all"
          >
            Back to Careers
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Job Info */}
          <div className="lg:col-span-1 space-y-6">
            <Link
              to="/hiring"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors group mb-1"
            >
              <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Back to Careers</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden shadow-sm"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-700" />

              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                <Briefcase className="w-5 h-5 text-blue-700" />
              </div>

              <h1 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{job.title}</h1>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                    <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Location</p>
                    <p className="text-gray-900 text-xs font-bold">Remote / Global</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Clock className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Type</p>
                    <p className="text-gray-900 text-xs font-bold">Full-time Role</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                    <DollarSign className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Salary Range</p>
                    <p className="text-gray-900 text-xs font-bold">{job.location || 'Remote'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mb-2">Core Requirements</h4>
                <ul className="space-y-2">
                  {["5+ years experience", "Expertise in React/Node", "System Architecture", "Team Leadership"].map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 text-[10px]">
                      <CheckCircle className="w-3 h-3 text-green-500" /> {req}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-center shadow-lg">
              <Shield className="w-8 h-8 text-white mx-auto mb-3 opacity-80" />
              <h3 className="text-base font-bold text-white mb-2">Secure Application</h3>
              <p className="text-blue-100 text-[10px] mb-4 opacity-90">Your data is encrypted and handled with the highest level of privacy and security.</p>
              <div className="flex items-center justify-center gap-2.5">
                <Zap className="w-3.5 h-3.5 text-white opacity-80" />
                <Users className="w-3.5 h-3.5 text-white opacity-80" />
                <Star className="w-3.5 h-3.5 text-white opacity-80" />
              </div>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tighter">Submit Your <span className="text-blue-600">Application</span></h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Tell us about your professional journey and why you're the right fit for the DevForge team.
              </p>

              <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-lg">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <User className="w-2.5 h-2.5 text-blue-600" /> First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="John"
                      className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-[11px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <User className="w-2.5 h-2.5 text-blue-600" /> Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Doe"
                      className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-[11px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <Mail className="w-2.5 h-2.5 text-blue-600" /> Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-[11px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <Phone className="w-2.5 h-2.5 text-blue-600" /> Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-[11px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <FileText className="w-2.5 h-2.5 text-blue-600" /> Resume (PDF only, max 5MB) *
                    </label>
                    <input
                      type="file"
                      required
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-[11px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.resume && (
                      <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> {formData.resume.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <Star className="w-2.5 h-2.5 text-blue-600" /> Education *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="B.Tech Computer Science"
                      className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-[11px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <Zap className="w-2.5 h-2.5 text-blue-600" /> Skills *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.skill_set}
                      onChange={(e) => setFormData({ ...formData, skill_set: e.target.value })}
                      placeholder="React, Node.js, Python, Django"
                      className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-[11px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <Clock className="w-2.5 h-2.5 text-blue-600" /> Experience *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="3 years"
                      className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-[11px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <Shield className="w-2.5 h-2.5 text-blue-600" /> Certification
                    </label>
                    <input
                      type="text"
                      value={formData.certification}
                      onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                      placeholder="AWS Certified, etc."
                      className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-[11px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <LinkIcon className="w-2.5 h-2.5 text-blue-600" /> LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin_id}
                      onChange={(e) => setFormData({ ...formData, linkedin_id: e.target.value })}
                      placeholder="https://linkedin.com/in/johndoe"
                      className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-[11px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                    <MessageSquare className="w-2.5 h-2.5 text-blue-600" /> Cover Letter / Introduction
                  </label>
                  <textarea
                    rows={5}
                    value={formData.cover_letter}
                    onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                    placeholder="Tell us why you're excited about this position..."
                    className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-[11px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[11px]"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-sm font-bold text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {submitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                    />
                  ) : (
                    <>Submit Application <Send className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyForJob;

