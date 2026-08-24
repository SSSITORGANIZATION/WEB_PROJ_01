import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Calendar, Clock, Tag,
  ArrowRight, BookOpen, FileText,
  Lightbulb, Shield
} from 'lucide-react';
import { apiService } from '../services/api';
import ReactMarkdown from 'react-markdown';

// Helper function to get full media URL
const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://localhost:8000${path}`;
};

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [relatedResources, setRelatedResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResourceData = async () => {
      if (!id) {
        return;
      }
      try {
        // Fetch the specific resource
        const response = await apiService.getResource(id);
        const foundResource = response.data;

        if (foundResource) {
          setResource(foundResource);

          // Fetch related resources in same category
          const allResourcesResponse = await apiService.getResources(); // No pagination for public
          const allResourcesData = allResourcesResponse.data;
          const allResources = Array.isArray(allResourcesData) ? allResourcesData : (allResourcesData.results || allResourcesData);
          const related = allResources
            .filter(r => r.category === foundResource.category && r.id !== parseInt(id))
            .slice(0, 3);
          setRelatedResources(related);
        } else {
          navigate('/resources');
        }
      } catch (error) {
        navigate('/resources');
      } finally {
        setLoading(false);
      }
    };
    fetchResourceData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-[#faf8fe]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-200 border-t-[#4f5d8c] rounded-full"
        />
      </div>
    );
  }

  if (!resource) return null;

  return (
    <div className="min-h-screen bg-[#faf8fe] pt-24 pb-16 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto">
        {/* Breadcrumb & Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 p-4 bg-white border border-gray-200 rounded-2xl"
        >
          <Link
            to="/resources"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300 group"
            style={{ fontFamily: 'Work Sans, sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-xs font-semibold uppercase tracking-wider">Back to Resources</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-6 bg-white border border-gray-200 rounded-3xl relative overflow-hidden"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${resource.category === 'BLOG' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  resource.category === 'GUIDE' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    resource.category === 'TOOL' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                }`} style={{ fontFamily: 'Work Sans, sans-serif' }}>
                {resource.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wider font-semibold" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                <Calendar className="w-3 h-3" />
                {new Date(resource.published_on || resource.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wider font-semibold" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                <Clock className="w-3 h-3" />
                8 min read
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {resource.title}
                </h1>
              </div>

              {/* Thumbnail Image */}
              {resource.thumbnail && (
                <div className="lg:w-48 w-full rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src={getMediaUrl(resource.thumbnail)}
                    alt={resource.title}
                    className="w-full h-auto object-cover rounded-2xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-6 bg-white border border-gray-200 rounded-3xl relative overflow-hidden"
        >
          <div className="text-gray-700 text-base md:text-lg lg:text-xl leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Work Sans, sans-serif' }}>
            {resource.content}
          </div>
        </motion.div>


        {/* Related Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-white border border-gray-200 rounded-3xl"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <BookOpen className="w-6 h-6 text-[#4f5d8c]" />
              <span className="text-[#4f5d8c]">
                Related Insights
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedResources.map((rel, index) => (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link
                    to={`/resources/${rel.id}`}
                    className="group p-6 bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 flex flex-col rounded-2xl"
                  >
                    {/* Thumbnail Image */}
                    {rel.thumbnail && (
                      <div className="relative h-40 overflow-hidden rounded-xl mb-4 bg-gray-100">
                        <img
                          src={getMediaUrl(rel.thumbnail)}
                          alt={rel.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${rel.category === 'BLOG' ? 'bg-emerald-50 border-emerald-200' :
                          rel.category === 'GUIDE' ? 'bg-blue-50 border-blue-200' :
                            rel.category === 'TOOL' ? 'bg-amber-50 border-amber-200' :
                              'bg-rose-50 border-rose-200'
                        }`}>
                        {rel.category === 'BLOG' && <FileText className="w-5 h-5 text-emerald-600" />}
                        {rel.category === 'GUIDE' && <BookOpen className="w-5 h-5 text-blue-600" />}
                        {rel.category === 'TOOL' && <Lightbulb className="w-5 h-5 text-amber-600" />}
                        {rel.category === 'GLOSSARY' && <Tag className="w-5 h-5 text-rose-600" />}
                      </div>
                      <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${rel.category === 'BLOG' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          rel.category === 'GUIDE' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            rel.category === 'TOOL' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-rose-50 text-rose-700 border border-rose-200'
                        }`} style={{ fontFamily: 'Work Sans, sans-serif' }}>
                        {rel.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#4f5d8c] transition-colors duration-300 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {rel.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 group-hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                      {rel.content?.substring(0, 100)}...
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-[#4f5d8c] uppercase tracking-wider group-hover:text-[#3d4a6f] transition-colors duration-300" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                      Read Article
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ResourceDetail;

