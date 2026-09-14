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
      whileHover={{ y: -4 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-700" />

      {/* Project Status Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded-full border ${project.status === 'ACTIVE'
          ? 'bg-green-50 text-green-600 border-green-200'
          : project.status === 'COMPLETED'
            ? 'bg-blue-50 text-blue-600 border-blue-200'
            : 'bg-yellow-50 text-yellow-600 border-yellow-200'
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
              <span key={i} className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-700">
                {tech.trim()}
              </span>
            ))}
          </div>
          {project.is_featured && (
            <span className="rounded-lg bg-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 flex-1 mr-2">
            {project.title}
          </h3>
          <span className="text-[8px] text-gray-500 whitespace-nowrap">
            {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="rounded-lg bg-gray-50 p-2">
            <p className="text-gray-900 font-bold text-base">
              {project.project_developers ? project.project_developers.length : 0}
            </p>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest">Team</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <p className="text-gray-900 font-bold text-base">
              {project.technologies_used ? project.technologies_used.split(',').length : 0}
            </p>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest">Tech</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <p className="text-gray-900 font-bold text-base">
              {project.assets ? project.assets.length : 0}
            </p>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest">Assets</p>
          </div>
        </div>

        {/* Developers Section */}
        {project.project_developers && Array.isArray(project.project_developers) && project.project_developers.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-3 w-3 text-gray-500" />
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Team</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.project_developers.slice(0, 3).map((dev, i) => (
                <Link
                  key={i}
                  to={`/developer/${dev.developer}`}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors px-2 py-1"
                >
                  <DeveloperImage
                    developer={{ name: dev.developer_name, profile_image: dev.developer_profile_image }}
                    size="h-4 w-4"
                  />
                  <span className="text-gray-700 text-xs truncate max-w-[80px] hover:text-gray-900 transition-colors">
                    {dev.developer_name || 'Unknown'}
                  </span>
                  {dev.member_type === 'LEAD' && (
                    <span className="rounded-lg bg-blue-50 px-1 py-0.5 text-xs font-bold text-blue-600">
                      LEAD
                    </span>
                  )}
                </Link>
              ))}
              {project.project_developers.length > 3 && (
                <div className="flex items-center px-2 py-1 rounded-lg border border-gray-200 bg-gray-50">
                  <span className="text-gray-500 text-xs">
                    +{project.project_developers.length - 3} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {project.github_repo && (
                <a href={project.github_repo} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">
                  <Github className="h-3.5 w-3.5" />
                </a>
              )}
              {project.live_link && (
                <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/review/${project.id}`)}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Write a Review
            </button>
            <div className="flex-1 flex items-center justify-end">
              <Link
                to={`/project/${project.id}`}
                className="flex items-center gap-2 text-sm font-medium text-gray-900 group/link"
              >
                Details <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Project <span className="text-blue-100">Showcase</span>
              </h1>
              <p className="text-lg leading-relaxed text-blue-100">
                Explore our curated gallery of high-performance software solutions, from enterprise-grade cloud architectures to innovative mobile experiences.
              </p>
            </motion.div>
            <button
              onClick={manualRefresh}
              className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
              title="Refresh projects"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 pb-12">

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 p-1.5 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-1.5 p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-4 py-1.5 text-[11px] font-medium transition-all ${activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 transition-colors" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-[11px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] rounded-xl border border-gray-200 bg-white animate-pulse" />
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
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;

