import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Filter, Code, Globe, Github,
  ExternalLink, ArrowRight, Layers,
  Cpu, Database, Layout, Smartphone, Users, RefreshCw
} from 'lucide-react';
import { apiService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useRealTimeSync } from '../hooks/useRealTimeSync';
import { ProjectImageCarousel, DeveloperImage } from '../components/ImageComponents';

const BASE_BACKEND_URL = "http://localhost:8000";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      className="group relative glass-card border-white/5 overflow-hidden flex flex-col h-full"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Project Status Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded-full border ${project.status === 'ACTIVE'
          ? 'bg-green-500/20 text-green-400 border-green-500/30'
          : project.status === 'COMPLETED'
            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
          }`}>
          {project.status || 'ACTIVE'}
        </span>
      </div>

      <div className="h-52 overflow-hidden relative">
        <ProjectImageCarousel
          project={project}
          className="w-full h-full"
          autoScroll={true}
          scrollInterval={5000}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex gap-2">
            {project.technologies_used?.split(',').slice(0, 2).map((tech, i) => (
              <span key={i} className="px-2 py-0.5 bg-white/10 backdrop-blur-md border border-white/10 rounded text-[9px] text-white uppercase tracking-widest font-bold">
                {tech.trim()}
              </span>
            ))}
          </div>
          {project.is_featured && (
            <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-bold uppercase tracking-widest rounded">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-white serif transition-colors flex-1 mr-2">
            {project.title}
          </h3>
          <span className="text-[8px] text-zinc-500 whitespace-nowrap">
            {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-white/5 rounded-lg p-2">
            <p className="text-white font-bold text-base">
              {project.project_developers ? project.project_developers.length : 0}
            </p>
            <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Team</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <p className="text-white font-bold text-base">
              {project.technologies_used ? project.technologies_used.split(',').length : 0}
            </p>
            <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Tech</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <p className="text-white font-bold text-base">
              {project.assets ? project.assets.length : 0}
            </p>
            <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Assets</p>
          </div>
        </div>

        {/* Developers Section */}
        {project.project_developers && Array.isArray(project.project_developers) && project.project_developers.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-3 h-3 text-zinc-500" />
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Team</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.project_developers.slice(0, 3).map((dev, i) => (
                <Link
                  key={i}
                  to={`/developer/${dev.developer}`}
                  className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <DeveloperImage
                    developer={{ name: dev.developer_name, profile_image: dev.developer_profile_image }}
                    size="w-4 h-4"
                  />
                  <span className="text-xs text-zinc-300 truncate max-w-[80px] hover:text-white transition-colors">
                    {dev.developer_name || 'Unknown'}
                  </span>
                  {dev.member_type === 'LEAD' && (
                    <span className="px-1 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded font-bold">
                      LEAD
                    </span>
                  )}
                </Link>
              ))}
              {project.project_developers.length > 3 && (
                <div className="flex items-center px-2 py-1 bg-white/5 border border-white/5 rounded-lg">
                  <span className="text-xs text-zinc-500">
                    +{project.project_developers.length - 3} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {project.github_repo && (
                <a href={project.github_repo} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {project.live_link && (
                <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/review/${project.id}`)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Write a Review
            </button>
            <div className="flex-1 flex items-center justify-end">
              <Link
                to={`/project/${project.id}`}
                className="flex items-center gap-2 text-sm font-bold text-white group/link"
              >
                Details <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'React', 'Python', 'Django', 'JavaScript', 'Node.js', 'TypeScript'];

  const fetchProjects = async () => {
    try {
      const response = await apiService.getProjects();
      const data = response.data;
      // Handle both array and object responses
      const projectsData = Array.isArray(data) ? data : (data.results || data);

      // Enhanced data processing to ensure all admin fields are included
      const enrichedProjects = projectsData.map(project => ({
        ...project,
        // Ensure all fields are properly formatted
        technologies_used: project.technologies_used || '',
        description: project.description || 'No description available',
        title: project.title || 'Untitled Project',
        is_featured: Boolean(project.is_featured),
        status: project.status || 'ACTIVE',
        project_developers: project.project_developers || [],
        assets: project.assets || [],
        github_repo: project.github_repo || '',
        live_link: project.live_link || '',
        created_at: project.created_at || new Date().toISOString(),
        updated_at: project.updated_at || new Date().toISOString()
      }));

      setProjects(enrichedProjects);
      setFilteredProjects(enrichedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use real-time sync hook
  const { manualRefresh } = useRealTimeSync(fetchProjects, 30000); // Refresh every 30 seconds

  useEffect(() => {
    let filtered = projects;

    if (activeCategory !== 'All') {
      filtered = filtered.filter(p =>
        p.technologies_used?.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    if (search) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [search, activeCategory, projects]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white serif mb-4 tracking-tighter">
                Project <span className="italic text-blue-500">Showcase</span>
              </h1>
              <p className="text-zinc-500 text-base leading-relaxed">
                Explore our curated gallery of high-performance software solutions, from enterprise-grade cloud architectures to innovative mobile experiences.
              </p>
            </motion.div>
            <button
              onClick={manualRefresh}
              className="flex items-center gap-2 px-4 py-2 glass-card border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
              title="Refresh projects"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 p-1.5 glass-card border-white/5 rounded-2xl">
          <div className="flex flex-wrap items-center gap-1.5 p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all ${activeCategory === cat
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 transition-colors" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[11px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] glass-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-zinc-700" />
            </div>
            <h3 className="text-2xl font-bold text-white serif mb-2">No projects found</h3>
            <p className="text-zinc-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;

