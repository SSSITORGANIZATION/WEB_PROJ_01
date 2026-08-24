import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Briefcase, MapPin, Clock,
  DollarSign, CheckCircle, Shield,
  ArrowRight, User, Mail, Link as LinkIcon,
  FileText, Send, AlertCircle, Globe,
  Zap, Users, Star, Github, MessageSquare
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
    full_name: '',
    email: '',
    resume_url: '',
    portfolio_url: '',
    github_url: '',
    linkedin_url: '',
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

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setError(null);

  try {
    await apiService.createJobApplication({
      first_name: formData.full_name.split(" ")[0],
      last_name: formData.full_name.split(" ")[1] || "",
      email: formData.email,
      contact: "9999999999", // temporary
      resume: formData.resume_url,
      experience: "2 years", // temporary
      skill_set: "React",
      education: "B.Tech",
      position: job.title,
      job: id
    });

    setSubmitted(true);
  } catch (err) {
    console.error(err);
    setError("Failed to submit application");
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-black">
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
      <div className="min-h-screen flex items-center justify-center bg-black px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card border-white/5 p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white serif mb-3">Application Sent</h2>
          <p className="text-zinc-500 mb-8 leading-relaxed text-sm">
            Your application for the <span className="text-white font-bold">{job.title}</span> position has been successfully submitted. Our talent team will review it and get back to you soon.
          </p>
          <button
            onClick={() => navigate('/hiring')}
            className="w-full py-3.5 accent-gradient rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
          >
            Back to Careers
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Job Info */}
          <div className="lg:col-span-1 space-y-6">
            <Link
              to="/hiring"
              className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-1"
            >
              <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Back to Careers</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card border-white/5 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <Briefcase className="w-5 h-5 text-white" />
              </div>

              <h1 className="text-xl font-bold text-white serif mb-3 leading-tight">{job.title}</h1>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Location</p>
                    <p className="text-white text-xs font-bold serif">Remote / Global</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Type</p>
                    <p className="text-white text-xs font-bold serif">Full-time Role</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Salary Range</p>
                    <p className="text-white text-xs font-bold serif">{job.location || 'Remote'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <h4 className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Core Requirements</h4>
                <ul className="space-y-2">
                  {["5+ years experience", "Expertise in React/Node", "System Architecture", "Team Leadership"].map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-zinc-400 text-[10px]">
                      <CheckCircle className="w-3 h-3 text-green-500" /> {req}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <div className="p-6 accent-gradient rounded-2xl text-center">
              <Shield className="w-8 h-8 text-white mx-auto mb-3 opacity-50" />
              <h3 className="text-base font-bold text-white serif mb-2">Secure Application</h3>
              <p className="text-blue-100 text-[10px] mb-4 opacity-80">Your data is encrypted and handled with the highest level of privacy and security.</p>
              <div className="flex items-center justify-center gap-2.5">
                <Zap className="w-3.5 h-3.5 text-white opacity-50" />
                <Users className="w-3.5 h-3.5 text-white opacity-50" />
                <Star className="w-3.5 h-3.5 text-white opacity-50" />
              </div>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white serif mb-4 tracking-tighter">Submit Your <span className="italic text-blue-500">Application</span></h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                Tell us about your professional journey and why you're the right fit for the DevForge team.
              </p>

              <form onSubmit={handleSubmit} className="glass-card border-white/5 p-6 space-y-6 shadow-2xl">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <User className="w-2.5 h-2.5" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-[11px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <Mail className="w-2.5 h-2.5" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-[11px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <FileText className="w-2.5 h-2.5" /> Resume URL (PDF/Drive)
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.resume_url}
                      onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-[11px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <Globe className="w-2.5 h-2.5" /> Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={formData.portfolio_url}
                      onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                      placeholder="https://johndoe.dev"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-[11px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <Github className="w-2.5 h-2.5" /> GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      placeholder="https://github.com/johndoe"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-[11px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
                      <LinkIcon className="w-2.5 h-2.5" /> LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/johndoe"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-[11px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
                    <MessageSquare className="w-2.5 h-2.5" /> Cover Letter / Introduction
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.cover_letter}
                    onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                    placeholder="Tell us why you're excited about DevForge..."
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-[11px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px]"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 accent-gradient rounded-xl text-sm font-bold text-white shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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

