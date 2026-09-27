import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  CurrencyConverter,
  GstCalculator,
  EmiCalculator,
} from "../components/calculators";
import {
  Search, Filter, BookOpen, Lightbulb,
  FileText, ArrowRight, Calendar,
  Tag, Clock, ChevronRight, Bookmark,
  TrendingUp, Users, Star, Zap, ChevronLeft,
  Library
} from 'lucide-react';
import { apiService } from '../services/api';

// Helper function to get full media URL
const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://localhost:8000${path}`;
};

// Tool renderer
const renderTool = (toolType) => {
  switch (toolType) {
    case "currency":
      return <CurrencyConverter />;
    case "gst":
      return <GstCalculator />;
    case "emi":
      return <EmiCalculator />;
    default:
      return null;
  }
};

const ResourceCard = ({ resource, currentCategoryKey }) => {
  const isTool = resource.category === "TOOL";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group"
    >
      <Link to={`/resources/${resource.id}`} className="block h-full">
        <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-100">

          {/* Gradient accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${resource.category === 'BLOG' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
            resource.category === 'GUIDE' ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
              resource.category === 'TOOL' ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                'bg-gradient-to-r from-rose-500 to-rose-400'
            }`} />

          {/* Content */}
          <div className={`relative flex-1 flex flex-col ${isTool ? 'p-4' : 'p-5'}`}>
            {/* Category badge */}
            <div className="mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${resource.category === 'BLOG' ? 'bg-emerald-50 text-emerald-700' :
                resource.category === 'GUIDE' ? 'bg-blue-50 text-blue-700' :
                  resource.category === 'TOOL' ? 'bg-amber-50 text-amber-700' :
                    'bg-rose-50 text-rose-700'
                }`} style={{ fontFamily: 'Work Sans, sans-serif' }}>
                {resource.category === 'BLOG' && <FileText className="w-3 h-3" />}
                {resource.category === 'GUIDE' && <BookOpen className="w-3 h-3" />}
                {resource.category === 'TOOL' && <Lightbulb className="w-3 h-3" />}
                {resource.category === 'GLOSSARY' && <Tag className="w-3 h-3" />}
                {resource.category}
              </span>
            </div>

            {/* Title */}
            <h3 className={`font-bold text-gray-900 transition-colors line-clamp-2 mb-3 ${isTool ? 'text-base' : 'text-lg'
              }`} style={{ fontFamily: 'Manrope, sans-serif' }}>
              {resource.title}
            </h3>

            {/* Tool Display - Only show for tools in TOOL category */}
            {isTool && currentCategoryKey === "TOOL" && (
              <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                {renderTool(resource.tool_type)}
              </div>
            )}

            {/* Thumbnail and Content - Only for non-tools */}
            {!isTool && (
              <div className="flex-1 flex flex-col">
                {/* Thumbnail */}
                {resource.thumbnail && (
                  <div className="relative h-44 mb-4 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={getMediaUrl(resource.thumbnail)}
                      alt={resource.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                {/* Content excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                  {resource.content?.substring(0, 150)}...
                </p>
              </div>
            )}

            {/* Footer - Only for non-tools */}
            {!isTool && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                <span className="text-xs text-gray-400" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                  {new Date(resource.created_at).toLocaleDateString()}
                </span>
                <span className={`inline-flex items-center gap-1 text-sm font-semibold ${resource.category === 'BLOG' ? 'text-emerald-600' :
                  resource.category === 'GUIDE' ? 'text-blue-600' :
                    resource.category === 'GLOSSARY' ? 'text-rose-600' :
                      'text-gray-600'
                  }`} style={{ fontFamily: 'Work Sans, sans-serif' }}>
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Resources = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'ALL';

  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [resourcesPerPage] = useState(9);

  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;

  const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const categories = [
    { id: 'BLOG', label: 'Blogs', icon: FileText, color: 'emerald' },
    { id: 'GUIDE', label: 'Guides', icon: BookOpen, color: 'blue' },
    { id: 'TOOL', label: 'Tools', icon: Lightbulb, color: 'amber' },
    { id: 'GLOSSARY', label: 'Glossary', icon: Tag, color: 'red' },
    { id: 'ALL', label: 'All Resources', icon: Bookmark, color: 'slate' }
  ];

  useEffect(() => {
    setActiveCategory(initialCategory);
    setCurrentPage(1); // Reset to first page on category change
  }, [initialCategory]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await apiService.getResources(); // No pagination for public
        const data = response.data;
        // Handle both paginated and non-paginated responses
        const resourcesData = Array.isArray(data) ? data : (data.results || data);

        // Sort by newest first (assuming there's a created_at or id field)
        // If there's a created_at field, use: resourcesData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        // For now, we'll sort by id in descending order (higher id = newer)
        const sortedData = resourcesData.sort((a, b) => b.id - a.id);
        setResources(sortedData);
        setFilteredResources(sortedData);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    let filtered = resources;

    if (activeCategory !== 'ALL') {
      filtered = filtered.filter(r => r.category === activeCategory);
    } else {
      // Remove calculators from "All Resources" category
      filtered = filtered.filter(r => r.category !== 'TOOL');
    }

    if (search) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredResources(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [search, activeCategory, resources]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-10xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Resource Library
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-8" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                Explore our curated collection of guides, tools, and insights to help you succeed
              </p>
            </motion.div>

            {resources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <div className="flex items-center gap-3 text-lg text-blue-100">
                  <BookOpen className="w-6 h-6" />
                  <span>{resources.length} Resources</span>
                </div>
                <div className="flex items-center gap-3 text-lg text-blue-100">
                  <Library className="w-6 h-6" />
                  <span>{categories.length - 1} Categories</span>
                </div>
                <div className="flex items-center gap-3 text-lg text-blue-100">
                  <Lightbulb className="w-6 h-6" />
                  <span>3 Tools</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 lg:gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${activeCategory === cat.id
                    ? cat.color === 'emerald' ? 'bg-emerald-600 text-white shadow-md' :
                      cat.color === 'blue' ? 'bg-blue-600 text-white shadow-md' :
                        cat.color === 'amber' ? 'bg-amber-500 text-white shadow-md' :
                          cat.color === 'red' ? 'bg-rose-600 text-white shadow-md' :
                            'bg-[#4f5d8c] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  style={{ fontFamily: 'Work Sans, sans-serif' }}
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.id === 'ALL' ? 'All' : cat.id}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4f5d8c] focus:ring-2 focus:ring-[#4f5d8c]/20 transition-all text-base"
                style={{ fontFamily: 'Work Sans, sans-serif' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Resources Grid - Responsive Layout */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse h-96">
                <div className="h-1 bg-gray-200" />
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded-full w-20 mb-3" />
                  <div className="h-6 bg-gray-200 rounded mb-3" />
                  <div className="h-44 bg-gray-100 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                  <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="h-3 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            <AnimatePresence mode="popLayout">
              {currentResources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  currentCategoryKey={activeCategory}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredResources.length > 0 && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mt-8 lg:mt-12"
          >
            <div className="flex items-center gap-1 lg:gap-2 bg-white rounded-xl border border-gray-200 p-2 overflow-x-auto max-w-full">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-shrink-0 ${currentPage === number
                      ? 'bg-[#4f5d8c] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    style={{ fontFamily: 'Work Sans, sans-serif' }}
                  >
                    {number}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
              <Library className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>No resources found</h3>
            <p className="text-gray-600" style={{ fontFamily: 'Work Sans, sans-serif' }}>Try adjusting your search or category filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Resources;

