import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectImageCarousel, DeveloperImage } from '../components/ImageComponents';
import Reviews from '../components/Reviews';

const API_URL = "http://localhost:8000/projects/";
const BASE_BACKEND_URL = "http://localhost:8000";

const ProjectDetailPage = () => {
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch project
  useEffect(() => {
    let cancelled = false;
    axios.get(`${API_URL}${id}/`)
      .then(res => {
        if (cancelled) return;
        // Enhanced data processing to ensure all admin fields are included
        const enrichedProject = {
          ...res.data,
          technologies_used: res.data.technologies_used || '',
          description: res.data.description || 'No description available',
          title: res.data.title || 'Untitled Project',
          is_featured: Boolean(res.data.is_featured),
          status: res.data.status || 'ACTIVE',
          project_developers: res.data.project_developers || [],
          assets: res.data.assets || [],
          github_repo: res.data.github_repo || '',
          live_link: res.data.live_link || '',
          created_at: res.data.created_at || new Date().toISOString(),
          updated_at: res.data.updated_at || new Date().toISOString()
        };
        setProject(enrichedProject);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching project:', err);
        if (err.response?.status === 404) {
          setProject(null);
        }
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  // Fetch reviews AFTER project loads
  useEffect(() => {
    if (!project?.id) return;
    axios
      .get(`http://localhost:8000/performance-reviews/?project=${project.id}`)
      .then(res => setReviews(res.data))
      .catch(err => {
        console.error('Error fetching reviews:', err);
      });
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="ml-4 text-white">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-4xl font-light text-white mb-8 italic serif">Project Not Found</h2>
          <button onClick={() => navigate('/projects')} className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 pb-12 px-1 bg-gray-50">
      <div className="max-w-1xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-1">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mt-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back 
          </button>
        </div>

        {/* Hero Section with Blue Header */}
        <div className="mb-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center text-white shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-blue-100 font-mono text-sm">#{project.id}</span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${project.status === 'ACTIVE'
              ? 'bg-green-500/20 text-green-300 border-green-500/30'
              : project.status === 'COMPLETED'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
              }`}>
              {project.status || 'ACTIVE'}
            </span>
            {project.is_featured && (
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full border border-white/30">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            {project.title}
          </h1>

          <p className="text-base text-blue-100 leading-relaxed max-w-3xl mx-auto">
            {project.description}
          </p>
        </div>

        {/* Project Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            {/* Project Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Created</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(project.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Last Updated</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(project.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              {project.live_link && (
                <a
                  href={project.live_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Live Demo
                </a>
              )}

              {project.github_repo && (
                <a
                  href={project.github_repo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  View Code
                </a>
              )}
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {project.project_developers ? project.project_developers.length : 0}
                </p>
                <p className="text-gray-500 text-sm">Developers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {project.technologies_used ? project.technologies_used.split(',').length : 0}
                </p>
                <p className="text-gray-500 text-sm">Technologies</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {project.assets ? project.assets.length : 0}
                </p>
                <p className="text-gray-500 text-sm">Assets</p>
              </div>
            </div>

            {/* Technology Stack */}
            {project.technologies_used && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies_used.split(',').map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            {(project.project_image || (project.assets && project.assets.length > 0) || (project.project_images && project.project_images.length > 0)) && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <ProjectImageCarousel
                  project={project}
                  className="w-full h-96"
                  autoScroll={true}
                  scrollInterval={5000}
                />
              </div>
            )}
          </div>
        </div>

        {/* Development Team */}
        {project.project_developers && project.project_developers.length > 0 && (
          <section className="mb-12">
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-center text-white shadow-lg mb-6">
              <h2 className="text-2xl font-bold mb-1">Development Team</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.project_developers
                .sort((a, b) => {
                  if (a.member_type === 'LEAD' && b.member_type !== 'LEAD') return -1;
                  if (a.member_type !== 'LEAD' && b.member_type === 'LEAD') return 1;
                  return a.developer_name.localeCompare(b.developer_name);
                })
                .map((dev, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <DeveloperImage
                        developer={{ name: dev.developer_name, profile_image: dev.developer_profile_image }}
                        size="w-12 h-12"
                      />
                      <div>
                        <h4 className="text-gray-900 font-semibold">{dev.developer_name}</h4>
                        <p className="text-gray-500 text-sm">{dev.role}</p>
                      </div>
                    </div>
                    {dev.member_type === 'LEAD' && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded">
                        Team Lead
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Project Reviews */}
        <section className="mt-12">
          <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-center text-white shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-1">Project Reviews</h2>
          </div>
          <Reviews projectId={id} showForm={false} limit={5} />
        </section>

        {/* Actions */}
        <section className="mt-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate(`/review/${project.id}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </button>
            <button
              onClick={() => navigate(`/book-demo/${encodeURIComponent(project.title)}`)}
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Book Demo
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
