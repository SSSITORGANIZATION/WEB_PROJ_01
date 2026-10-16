import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Book,
  ArrowRight,
  ChevronRight,
  FileText,
  Shield,
  Menu,
  X,
  Bookmark,
  ExternalLink,
  Clock,
  UserCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Documentation = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedView, setSavedView] = useState(false);

  const [bookmarkedDocs, setBookmarkedDocs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bookmarkedDocs') || '[]');
    } catch {
      return [];
    }
  });

  const categories = [
    'All',
    'Saved',
    'Getting Started',
    'API Reference',
    'Frontend',
    'Backend',
    'Deployment',
    'Security',
  ];

  // Bookmark documentation
  const toggleBookmark = (docId) => {
    setBookmarkedDocs((prev) => {
      const next = prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId];

      try {
        localStorage.setItem('bookmarkedDocs', JSON.stringify(next));
      } catch (error) {
        console.error('Failed to update bookmarks:', error);
      }

      return next;
    });
  };

  // Share documentation
  const shareDoc = async (doc) => {
    const shareUrl = `${window.location.origin}/documentation/${doc.id}`;
    const shareText = `Check out "${doc.title}" on SA Technologies.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: doc.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      }

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = `${shareText} ${shareUrl}`;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      window.alert('Documentation link copied to clipboard.');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
        window.alert('Unable to share this documentation right now.');
      }
    }
  };

  // Fetch documentation
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const mockDocs = [
          {
            id: '1',
            title: 'Getting Started with DevHub',
            content:
              'Learn the basics of DevHub platform, including setup, configuration, and your first project. This comprehensive guide covers everything from account creation to deploying your first application.',
            category: 'Getting Started',
          },
          {
            id: '2',
            title: 'API Reference Overview',
            content:
              'Complete API documentation including endpoints, authentication, request/response formats, rate limiting, and best practices for integration with external services.',
            category: 'API Reference',
          },
          {
            id: '3',
            title: 'Frontend Development Guidelines',
            content:
              'Standards and best practices for frontend development including React patterns, styling guidelines, component architecture, and performance optimization techniques.',
            category: 'Frontend',
          },
          {
            id: '4',
            title: 'Backend Architecture',
            content:
              'Understanding the backend architecture including microservices, database design, API gateway patterns, and scalability considerations for enterprise applications.',
            category: 'Backend',
          },
          {
            id: '5',
            title: 'Deployment Strategies',
            content:
              'Learn about different deployment strategies including CI/CD pipelines, container orchestration, blue-green deployments, and monitoring best practices.',
            category: 'Deployment',
          },
          {
            id: '6',
            title: 'Security Best Practices',
            content:
              'Comprehensive security guide covering authentication, authorization, data encryption, vulnerability scanning, and compliance requirements for modern applications.',
            category: 'Security',
          },
        ];

        setDocs(mockDocs);
      } catch (error) {
        console.error('Error fetching documentation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  // Filter documentation
  const savedDocs = docs.filter((doc) =>
    bookmarkedDocs.includes(doc.id)
  );

  const filteredDocs = (savedView ? savedDocs : docs).filter((doc) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      doc.title.toLowerCase().includes(query) ||
      doc.content.toLowerCase().includes(query);

    const matchesCategory =
      savedView ||
      activeCategory === 'All' ||
      doc.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Category selection
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSavedView(category === 'Saved');
    setIsSidebarOpen(false);
  };

  // Sidebar content
  const renderSidebarContent = () => (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h4 className="mb-4 px-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          Categories
        </h4>

        <div className="flex flex-col gap-1">
          {categories.map((cat) => {
            const isActive =
              (savedView && cat === 'Saved') ||
              (!savedView && activeCategory === cat);

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-transparent bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>{cat}</span>

                {isActive && (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
          <Shield className="h-5 w-5 text-blue-600" />
        </div>

        <h5 className="mb-2 text-base font-bold text-gray-900">
          Need Help?
        </h5>

        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          Our engineering team is available to help with your technical
          questions and enterprise support needs.
        </p>

        <Link
          to="/book-demo"
          onClick={() => setIsSidebarOpen(false)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Contact Support
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header - centered like the Home page */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto w-[90%] px-6 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center"
          >
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Technical{' '}
              <span className="text-blue-100">Repository</span>
            </h1>

            <p className="mx-auto max-w-3xl text-base leading-relaxed text-blue-100 sm:text-lg md:text-xl">
              Comprehensive guides, API references, and best practices
              to help your team integrate, extend, and build confidently
              on the SA Technologies platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto w-[90%] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
          {/* Desktop sidebar */}
          <aside className="sticky top-24 hidden w-64 shrink-0 self-start lg:block">
            {renderSidebarContent()}
          </aside>

          {/* Mobile sidebar overlay */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close categories menu"
                onClick={() => setIsSidebarOpen(false)}
                className="absolute inset-0 bg-black/40"
              />

              <aside className="absolute inset-y-0 left-0 w-[min(85%,340px)] overflow-y-auto bg-gray-50 p-5 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Documentation
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close sidebar"
                    className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {renderSidebarContent()}
              </aside>
            </div>
          )}

          {/* Documentation content */}
          <main className="min-w-0 flex-1">
            {/* Search and mobile categories */}
            <div className="mb-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 lg:hidden"
              >
                <Menu className="h-4 w-4" />
                Categories
              </button>

              <div className="group relative w-full">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-600" />

                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="space-y-5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-40 animate-pulse rounded-xl border border-gray-200 bg-white"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {/* Saved documents count */}
                {savedView && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-medium text-blue-700">
                    {savedDocs.length} saved document
                    {savedDocs.length === 1 ? '' : 's'}
                  </div>
                )}

                {/* Empty state */}
                {filteredDocs.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-white px-5 py-20 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <Book className="h-8 w-8 text-gray-400" />
                    </div>

                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {savedView
                        ? 'No saved documents yet'
                        : 'No documentation found'}
                    </h3>

                    <p className="text-sm leading-relaxed text-gray-600">
                      {savedView
                        ? 'Click the bookmark icon on any guide to save it here.'
                        : 'Try searching for something else or browse categories.'}
                    </p>
                  </div>
                ) : (
                  /* Documentation cards */
                  <div className="grid gap-5">
                    {filteredDocs.map((doc) => {
                      const isBookmarked = bookmarkedDocs.includes(doc.id);

                      return (
                        <motion.article
                          key={doc.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6 lg:p-7"
                        >
                          {/* Card header */}
                          <div className="mb-4 flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 transition-transform group-hover:scale-105 sm:h-12 sm:w-12">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>

                              <div className="min-w-0 pt-0.5">
                                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-blue-600 sm:text-xs">
                                  {doc.category || 'General'}
                                </span>

                                <h3 className="text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 sm:text-xl">
                                  {doc.title}
                                </h3>
                              </div>
                            </div>

                            {/* Bookmark and share */}
                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                onClick={() => toggleBookmark(doc.id)}
                                className={`rounded-lg p-2 transition-colors ${
                                  isBookmarked
                                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                                aria-label={
                                  isBookmarked
                                    ? 'Remove bookmark'
                                    : 'Save document'
                                }
                                title={
                                  isBookmarked
                                    ? 'Remove bookmark'
                                    : 'Save document'
                                }
                              >
                                <Bookmark
                                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                    isBookmarked ? 'fill-current' : ''
                                  }`}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() => shareDoc(doc)}
                                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                aria-label="Share documentation"
                                title="Share documentation"
                              >
                                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                              </button>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="mb-5 text-sm leading-7 text-gray-600 sm:text-base">
                            {doc.content}
                          </p>

                          {/* Card footer */}
                          <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs">
                                <Clock className="h-3.5 w-3.5" />
                                Updated 2 days ago
                              </div>

                              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs">
                                <UserCheck className="h-3.5 w-3.5" />
                                Verified
                              </div>
                            </div>

                            <Link
                              to={`/documentation/${doc.id}`}
                              className="group/link inline-flex items-center gap-2 self-start text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 sm:self-auto"
                            >
                              Read Guide
                              <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
