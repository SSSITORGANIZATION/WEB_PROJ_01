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
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Link
          to="/developers"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-6"
        >
          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back to Talent</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden"
            >
              {/* Profile Header with Image */}
              <div className="relative h-64 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <img
                  src={developer.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`}
                  alt={developer.name}
                  className="w-full h-full object-contain relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Name and Title Section */}
              <div className="text-center mb-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-white mb-2 tracking-tight"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {developer.name}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-blue-400 text-sm font-semibold uppercase tracking-wider"
                >
                  {developer.title}
                </motion.p>
              </div>
            </motion.div>

            <div className="glass-card border-white/5 p-6">
              <h3 className="text-sm font-bold text-white serif mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" /> Connect & Follow
              </h3>
              <div className="space-y-3">
                {developer.github_link && (
                  <a href={developer.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group">
                    <Github className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                    <div>
                      <p className="text-white text-sm font-medium">GitHub</p>
                      <p className="text-zinc-500 text-xs">View code repositories</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white ml-auto" />
                  </a>
                )}
                {developer.linkedin_link && (
                  <a href={developer.linkedin_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group">
                    <Linkedin className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                    <div>
                      <p className="text-white text-sm font-medium">LinkedIn</p>
                      <p className="text-zinc-500 text-xs">Professional profile</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white ml-auto" />
                  </a>
                )}
                {developer.twitter_link && (
                  <a href={developer.twitter_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group">
                    <Twitter className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                    <div>
                      <p className="text-white text-sm font-medium">Twitter</p>
                      <p className="text-zinc-500 text-xs">Follow for updates</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white ml-auto" />
                  </a>
                )}
                {developer.website_link && (
                  <a href={developer.website_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group">
                    <Globe className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                    <div>
                      <p className="text-white text-sm font-medium">Website</p>
                      <p className="text-zinc-500 text-xs">Personal portfolio</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white ml-auto" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Content */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>About <span className="italic text-blue-500">the Developer</span></h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-6">
                {developer.bio}
              </p>
              
              <div className="glass-card border-white/5 p-6">
                <h3 className="text-sm font-bold text-white serif mb-6 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-blue-500" /> Skills & Expertise
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {developer.skills?.split(',').map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="px-4 py-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg text-xs text-blue-300 font-medium hover:border-blue-500/50 transition-all"
                    >
                      {skill.trim()}
                    </motion.span>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white serif flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-500" /> Featured Projects
                </h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-blue-300 text-sm font-medium">
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
                      className="group glass-card border-white/5 overflow-hidden flex flex-col"
                    >
                      <div className="h-32 overflow-hidden relative">
                        <img
                          src={project.project_image || `https://picsum.photos/seed/${project.id}/800/600`}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      </div>
                      <div className="p-4">
                        <h4 className="text-base font-bold text-white serif mb-1 group-hover:text-blue-400 transition-colors">{project.title}</h4>
                        <p className="text-zinc-500 text-[11px] line-clamp-2 mb-2">{project.description}</p>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-white uppercase tracking-widest">
                          View Details <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <div className="glass-card border-white/5 p-8">
                      <Briefcase className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white serif mb-2">No Projects Yet</h3>
                      <p className="text-zinc-400 text-sm mb-4">
                        {developer.name} hasn't been featured in any projects yet. Check back soon to see their amazing work!
                      </p>
                      <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
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
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                            : 'bg-white/10 text-zinc-400 hover:text-white hover:bg-white/20'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

