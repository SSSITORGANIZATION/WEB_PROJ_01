import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, MapPin, Clock, Video, Phone, MessageSquare, X, Briefcase
} from 'lucide-react';
import { apiService } from '../services/api';

const ProjectCard = ({ project, onBook }) => {
  const projectImage = project.project_image || project.featured_image;

  return (
    <motion.div
      whileHover={{
        y: -12,
        rotateX: 8,
        rotateY: 8,
        scale: 1.05,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform preserve-3d"
      style={{ perspective: '1000px' }}
    >
      {/* Project Image */}
      <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        {projectImage ? (
          <img
            src={projectImage}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${projectImage ? 'hidden' : 'flex'}`}>
          <Briefcase className="w-12 h-12 text-blue-300" />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {project.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            30 minutes
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MapPin className="w-3 h-3" />
            Online
          </div>
        </div>

        <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        <button
          onClick={() => onBook(project)}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-md hover:shadow-lg"
        >
          Book Demo
        </button>
      </div>
    </motion.div>
  );
};

const BookingForm = ({ project, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_date: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, project: project.id });
  };

  const projectImage = project?.project_image || project?.featured_image;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        {/* Header with Project Image */}
        <div className="relative h-40 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
          {projectImage ? (
            <img
              src={projectImage}
              alt={project?.title}
              className="w-full h-full object-cover opacity-50"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90" />
          <div className="absolute inset-0 flex items-center justify-between p-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                Book Demo
              </h3>
              <p className="text-blue-100 text-sm">{project?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-blue-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-blue-600 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-blue-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-blue-600 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-blue-600 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-blue-600 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-blue-600 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.preferred_date}
                  onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-blue-600 bg-white/80 backdrop-blur-sm shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-blue-600 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your requirements..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-blue-600 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm shadow-sm"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Submit Booking
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const BookDemo = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiService.getProjects();
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleBook = (project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleSubmitBooking = async (formData) => {
    try {
      await apiService.createDemoBooking(formData);
      setShowForm(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Error booking demo:", error);
      alert("Failed to book demo. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:px-8 lg:px-12">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Book a Demo
              </h1>
              <p className="text-base md:text-xl text-blue-100 leading-relaxed mb-6">
                Schedule a personalized demo with our team. See our platform in action
                and discover how it can transform your workflow.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <Video className="w-5 h-5" />
                <span>Live Demos Available</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <Calendar className="w-5 h-5" />
                <span>Flexible Scheduling</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Message */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            Demo booked successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Section - Horizontal Scroll */}
      <section id="projects" className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Choose a Project</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Select a project to book a demo.
            </p>
          </div>

          {loading ? (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-80 h-48 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {projects.length > 0 ? projects.map(project => (
                <div key={project.id} className="w-80 flex-shrink-0">
                  <ProjectCard project={project} onBook={handleBook} />
                </div>
              )) : (
                <div className="w-full py-12 text-center">
                  <div className="max-w-md mx-auto">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Projects Available
                    </h3>
                    <p className="text-sm text-gray-600">
                      There are no projects available for demo booking at the moment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* General Booking Demo Card */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Book a Demo</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Fill in your details below to schedule a personalized demo with our team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            {/* Left Side - Related Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Why Book a Demo?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Experience our platform firsthand and discover how it can transform your workflow. Our experts will guide you through features tailored to your needs.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Live Demonstration</h4>
                    <p className="text-xs text-gray-600">See real-time usage and features in action</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Flexible Scheduling</h4>
                    <p className="text-xs text-gray-600">Choose a time that works best for you</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Expert Guidance</h4>
                    <p className="text-xs text-gray-600">Get answers from our experienced team</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Booking Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-xl"
              whileHover={{
                y: -8,
                rotateX: 5,
                rotateY: 5,
                scale: 1.02,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              style={{ perspective: '1000px' }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = {
                  name: e.target.name.value,
                  email: e.target.email.value,
                  phone: e.target.phone.value,
                  preferred_date: e.target.preferred_date.value,
                  message: e.target.message.value
                };
                handleSubmitBooking(formData);
              }} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-blue-600 mb-1">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-blue-600 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-blue-600 mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-blue-600 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-blue-600 mb-1">
                      Phone
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-blue-600 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-blue-600 mb-1">
                      Preferred Date
                    </label>
                    <input
                      name="preferred_date"
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-blue-600 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Tell us about your requirements..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-blue-600 placeholder:text-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  Submit Booking
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Need Help Choosing?</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Our team is here to help you find the perfect demo for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
              <Phone className="w-6 h-6 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Call Us</h3>
              <p className="text-gray-600 text-xs">+1 (555) 123-4567</p>
            </div>
            <div className="text-center p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
              <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Live Chat</h3>
              <p className="text-gray-600 text-xs">Available 24/7</p>
            </div>
            <div className="text-center p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
              <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Email Us</h3>
              <p className="text-gray-600 text-xs">demo@example.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showForm && selectedProject && (
        <BookingForm
          project={selectedProject}
          onClose={() => {
            setShowForm(false);
            setSelectedProject(null);
          }}
          onSubmit={handleSubmitBooking}
        />
      )}
    </div>
  );
};

export default BookDemo;

