import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Github, Linkedin, Twitter,
  Globe, Mail, MapPin, Calendar,
  Star, Crown, Briefcase, Code,
  ArrowRight, ExternalLink, Shield,
  CheckCircle, MessageSquare, Award,
  Terminal, Cpu, Database, Layout
} from 'lucide-react';
import { apiService } from '../services/api';

const DeveloperDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 2;

  useEffect(() => {
    const fetchDevData = async () => {
      if (!id) return;
      try {
        // Fetch developer details
        const devResponse = await apiService.getDeveloper(id);
        const devData = devResponse.data;
        setDeveloper(devData);

        // Fetch all projects and filter ones where this developer is involved
        const projectsResponse = await apiService.getProjects();
        const allProjects = Array.isArray(projectsResponse.data) ? projectsResponse.data : (projectsResponse.data.results || projectsResponse.data);

        // Filter projects where this developer is assigned
        const developerProjects = allProjects.filter(project =>
          project.project_developers &&
            project.project_developers.some(pd => pd.developer == id)
        );

        // Sort by creation date (newest first) or ID as fallback
        const sortedProjects = developerProjects.sort((a, b) => {
          if (a.created_at && b.created_at) {
            return new Date(b.created_at) - new Date(a.created_at);
          }
          return b.id - a.id;
        });

        setProjects(sortedProjects);
      } catch (error) {
        console.error("Error fetching developer detail:", error);
        navigate('/developers');
      } finally {
        setLoading(false);
      }
    };
    fetchDevData();
  }, [id, navigate]);

  // Pagination calculations
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  if (!developer) return null;

  return (
    <div className="min-h-screen pt-0 pb-12 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb - Only Back Button */}
        <Link
          to="/developers"
          className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors group mb-1 shadow-lg"
        >
          <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
        </Link>

        {/* Profile Header with Full Image Background */}
        <div className="mb-1 rounded-xl overflow-hidden shadow-lg relative h-96">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-full"
          >
            {/* Full Card Background Image */}
            <img
              src={developer.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`}
              alt={developer.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Light Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
            
            {/* Developer Name Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-white"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {developer.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 text-sm font-semibold uppercase tracking-wider"
              >
                {developer.title}
              </motion.p>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" /> Connect & Follow
                </h3>
                <div className="space-y-3">
                  {developer.github_link && (
                    <a href={developer.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group">
                      <Github className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                      <div>
                        <p className="text-gray-900 text-sm font-medium">GitHub</p>
                        <p className="text-gray-500 text-xs">View code repositories</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 ml-auto" />
                    </a>
                  )}
                  {developer.linkedin_link && (
                    <a href={developer.linkedin_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group">
                      <Linkedin className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                      <div>
                        <p className="text-gray-900 text-sm font-medium">LinkedIn</p>
                        <p className="text-gray-500 text-xs">Professional profile</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 ml-auto" />
                    </a>
                  )}
                  {developer.twitter_link && (
                    <a href={developer.twitter_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group">
                      <Twitter className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                      <div>
                        <p className="text-gray-900 text-sm font-medium">Twitter</p>
                        <p className="text-gray-500 text-xs">Follow for updates</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 ml-auto" />
                    </a>
                  )}
                  {developer.website_link && (
                    <a href={developer.website_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group">
                      <Globe className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                      <div>
                        <p className="text-gray-900 text-sm font-medium">Website</p>
                        <p className="text-gray-500 text-xs">Personal portfolio</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 ml-auto" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Detailed Content */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-center text-white shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-1">About the Developer</h2>
              </div>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                {developer.bio}
              </p>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-blue-600" /> Skills & Expertise
                </h3>

                <div className="flex flex-wrap gap-2">
                  {developer.skills?.split(',').map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 font-medium hover:bg-blue-100 transition-all"
                    >
                      {skill.trim()}
                    </motion.span>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-lg">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5" /> Featured Projects
                  </h2>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  <span className="text-blue-700 text-sm font-medium">
                    {projects.length} Total Projects
                  </span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {currentProjects.length > 0 ? (
                  currentProjects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/project/${project.id}`}
                      className="group bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="h-32 overflow-hidden relative">
                        <img
                          src={project.project_image || `https://picsum.photos/seed/${project.id}/800/600`}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                      </div>
                      <div className="p-4">
                        <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{project.title}</h4>
                        <p className="text-gray-500 text-[11px] line-clamp-2 mb-2">{project.description}</p>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-gray-900 uppercase tracking-widest">
                          View Details <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">No Projects Yet</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        {developer.name} hasn't been featured in any projects yet. Check back soon to see their amazing work!
                      </p>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>Projects will appear here once assigned</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                          currentPage === index + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDetail;

