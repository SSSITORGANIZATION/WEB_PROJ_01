import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  BookOpen,
  FileText,
  ArrowRight,
  Tag,
  ChevronRight,
  Bookmark,
  ChevronLeft,
  Library,
} from 'lucide-react';
import { apiService } from '../services/api';

// Get the complete media URL
const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  return `http://localhost:8000${path.startsWith('/') ? '' : '/'}${path}`;
};

// Resource Card
const ResourceCard = ({ resource }) => {
  const categoryStyles = {
    BLOG: {
      accent: 'from-emerald-500 to-emerald-400',
      badge: 'bg-emerald-50 text-emerald-700',
      text: 'text-emerald-600',
      icon: FileText,
    },
    GUIDE: {
      accent: 'from-blue-500 to-blue-400',
      badge: 'bg-blue-50 text-blue-700',
      text: 'text-blue-600',
      icon: BookOpen,
    },
    GLOSSARY: {
      accent: 'from-rose-500 to-rose-400',
      badge: 'bg-rose-50 text-rose-700',
      text: 'text-rose-600',
      icon: Tag,
    },
  };

  const style = categoryStyles[resource.category] || {
    accent: 'from-rose-500 to-rose-400',
    badge: 'bg-rose-50 text-rose-700',
    text: 'text-gray-600',
    icon: FileText,
  };

  const CategoryIcon = style.icon;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group h-full"
    >
      <Link to={`/resources/${resource.id}`} className="block h-full">
        <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          {/* Category accent */}
          <div
            className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${style.accent}`}
          />

          <div className="flex flex-1 flex-col p-4">
            {/* Category badge */}
            <div className="mb-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${style.badge}`}
                style={{ fontFamily: 'Work Sans, sans-serif' }}
              >
                <CategoryIcon className="h-3 w-3" aria-hidden="true" />
                {resource.category || 'RESOURCE'}
              </span>
            </div>

            {/* Resource title */}
            <h3
              className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-700"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {resource.title}
            </h3>

            {/* Thumbnail */}
            {resource.thumbnail && (
              <div className="relative mb-3 h-32 overflow-hidden rounded-lg bg-gray-100 sm:h-36">
                <img
                  src={getMediaUrl(resource.thumbnail)}
                  alt={resource.title || 'Resource thumbnail'}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            {/* Resource content excerpt */}
            <p
              className="mb-3 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-600 sm:text-sm"
              style={{ fontFamily: 'Work Sans, sans-serif' }}
            >
              {resource.content
                ? `${resource.content.substring(0, 150)}${
                    resource.content.length > 150 ? '...' : ''
                  }`
                : 'Explore this resource to learn more.'}
            </p>

            {/* Card footer */}
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
              <span
                className="text-[10px] text-gray-400 sm:text-xs"
                style={{ fontFamily: 'Work Sans, sans-serif' }}
              >
                {resource.created_at
                  ? new Date(resource.created_at).toLocaleDateString()
                  : 'Resource'}
              </span>

              <span
                className={`inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold ${style.text}`}
                style={{ fontFamily: 'Work Sans, sans-serif' }}
              >
                Read More
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

const Resources = () => {
  const location = useLocation();

  const getCategoryFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category') || 'ALL';

    return ['ALL', 'BLOG', 'GUIDE', 'GLOSSARY'].includes(category)
      ? category
      : 'ALL';
  };

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(
    getCategoryFromUrl
  );
  const [currentPage, setCurrentPage] = useState(1);

  const resourcesPerPage = 9;

  const categories = [
    {
      id: 'ALL',
      label: 'All Resources',
      icon: Bookmark,
      color: 'slate',
    },
    {
      id: 'BLOG',
      label: 'Blogs',
      icon: FileText,
      color: 'emerald',
    },
    {
      id: 'GUIDE',
      label: 'Guides',
      icon: BookOpen,
      color: 'blue',
    },
    {
      id: 'GLOSSARY',
      label: 'Glossary',
      icon: Tag,
      color: 'red',
    },
  ];

  const activeBg = {
    slate: 'bg-[#4f5d8c] text-white shadow-sm',
    emerald: 'bg-emerald-600 text-white shadow-sm',
    blue: 'bg-blue-600 text-white shadow-sm',
    red: 'bg-rose-600 text-white shadow-sm',
  };

  // Keep category selection synchronized with the URL
  useEffect(() => {
    setActiveCategory(getCategoryFromUrl());
    setCurrentPage(1);
  }, [location.search]);

  // Fetch resources from the existing API
  useEffect(() => {
    let isMounted = true;

    const fetchResources = async () => {
      try {
        const response = await apiService.getResources();
        const data = response?.data ?? response;

        const resourcesData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];

        const sortedResources = [...resourcesData].sort(
          (a, b) => Number(b.id) - Number(a.id)
        );

        if (isMounted) {
          setResources(sortedResources);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);

        if (isMounted) {
          setResources([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchResources();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter resources by category and search term
  const searchTerm = search.trim().toLowerCase();

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      activeCategory === 'ALL' ||
      resource.category === activeCategory;

    const title = (resource.title || '').toLowerCase();
    const content = (resource.content || '').toLowerCase();

    const matchesSearch =
      !searchTerm ||
      title.includes(searchTerm) ||
      content.includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(
    filteredResources.length / resourcesPerPage
  );

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const indexOfFirstResource =
    (safeCurrentPage - 1) * resourcesPerPage;

  const currentResources = filteredResources.slice(
    indexOfFirstResource,
    indexOfFirstResource + resourcesPerPage
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact page header — matches the pasted project style */}
<section className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">        <div className="pointer-events-none absolute inset-0 bg-black/10" />

        <div className="relative mx-auto w-[90%] px-4 py-7 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1
              className="mb-2 text-2xl font-bold tracking-tight text-white md:text-3xl"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Insights &amp; Resources
            </h1>

            <p
              className="mx-auto max-w-2xl text-xs leading-relaxed text-blue-100 sm:text-sm"
              style={{ fontFamily: 'Work Sans, sans-serif' }}
            >
              Guides, tools, and engineering write-ups from our team — built
              to help you ship better software, faster.
            </p>

            {resources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-5 flex flex-wrap items-center justify-center gap-5"
              >
                <div className="flex items-center gap-2 text-xs text-blue-100">
                  <BookOpen className="h-4 w-4" />
                  <span>{resources.length} Resources</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-blue-100">
                  <Library className="h-4 w-4" />
                  <span>{categories.length - 1} Categories</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <main className="mx-auto w-[94%] px-3 py-8 sm:px-5 sm:py-10 lg:px-6">
        {/* Category filters and search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
            {/* Category buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {categories.map((category) => {
                const CategoryIcon = category.icon;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryChange(category.id)}
                    aria-pressed={activeCategory === category.id}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
                      activeCategory === category.id
                        ? activeBg[category.color]
                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: 'Work Sans, sans-serif' }}
                  >
                    <CategoryIcon className="h-3.5 w-3.5" />

                    <span className="hidden sm:inline">
                      {category.label}
                    </span>

                    <span className="sm:hidden">
                      {category.id === 'ALL' ? 'All' : category.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search input */}
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search resources..."
                aria-label="Search resources"
                value={search}
                onChange={handleSearchChange}
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-[#4f5d8c] focus:outline-none focus:ring-2 focus:ring-[#4f5d8c]/20"
                style={{ fontFamily: 'Work Sans, sans-serif' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        {!loading && filteredResources.length > 0 && (
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500 sm:text-sm">
              Showing {indexOfFirstResource + 1}–
              {Math.min(
                indexOfFirstResource + resourcesPerPage,
                filteredResources.length
              )}{' '}
              of {filteredResources.length} resources
            </p>

            {(search || activeCategory !== 'ALL') && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-blue-700 transition hover:text-indigo-700 sm:text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white"
              >
                <div className="h-1 bg-gray-200" />

                <div className="p-4">
                  <div className="mb-3 h-4 w-20 rounded-full bg-gray-200" />
                  <div className="mb-3 h-5 rounded bg-gray-200" />
                  <div className="mb-3 h-32 rounded-lg bg-gray-100" />
                  <div className="mb-2 h-3 rounded bg-gray-200" />
                  <div className="h-3 w-3/4 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          /* Resource cards */
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {currentResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
              <Library className="h-8 w-8 text-gray-400" />
            </div>

            <h3
              className="mb-2 text-xl font-bold text-gray-900"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Nothing matches that search
            </h3>

            <p
              className="text-sm text-gray-600"
              style={{ fontFamily: 'Work Sans, sans-serif' }}
            >
              Try a different keyword or clear your category filter.
            </p>

            {(search || activeCategory !== 'ALL') && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-lg bg-[#4f5d8c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#414d77]"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && filteredResources.length > 0 && totalPages > 1 && (
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            aria-label="Resource pagination"
            className="mt-8 flex justify-center"
          >
            <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-gray-200 bg-white p-1.5 sm:gap-2">
              {/* Previous page */}
              <button
                type="button"
                aria-label="Previous page"
                onClick={() =>
                  setCurrentPage((page) => Math.max(page - 1, 1))
                }
                disabled={safeCurrentPage === 1}
                className={`flex-shrink-0 rounded-md p-2 transition ${
                  safeCurrentPage === 1
                    ? 'cursor-not-allowed text-gray-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    type="button"
                    aria-label={`Page ${number}`}
                    aria-current={
                      safeCurrentPage === number ? 'page' : undefined
                    }
                    onClick={() => setCurrentPage(number)}
                    className={`flex-shrink-0 rounded-md px-3 py-2 text-xs font-medium transition sm:text-sm ${
                      safeCurrentPage === number
                        ? 'bg-[#4f5d8c] text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    style={{ fontFamily: 'Work Sans, sans-serif' }}
                  >
                    {number}
                  </button>
                ))}
              </div>

              {/* Next page */}
              <button
                type="button"
                aria-label="Next page"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
                disabled={safeCurrentPage === totalPages}
                className={`flex-shrink-0 rounded-md p-2 transition ${
                  safeCurrentPage === totalPages
                    ? 'cursor-not-allowed text-gray-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.nav>
        )}
      </main>
    </div>
  );
};

export default Resources;
