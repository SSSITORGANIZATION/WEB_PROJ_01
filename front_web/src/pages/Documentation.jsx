import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Book, Code, Globe,
  ArrowRight, ChevronRight, FileText,
  Terminal, Layers, Shield, Zap,
  Cpu, Database, Layout, Smartphone,
  Menu, X, Bookmark, ExternalLink, Clock, UserCheck
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

  const categories = ['All', 'Saved', 'Getting Started', 'API Reference', 'Frontend', 'Backend', 'Deployment', 'Security'];

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

  const shareDoc = async (doc) => {
    const shareUrl = `${window.location.origin}/documentation/${doc.id}`;
    const shareText = `Check out "${doc.title}" on DevForge.`;

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
      console.error('Share failed:', error);
      window.alert('Unable to share this documentation right now.');
    }
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Mock documentation data
        const mockDocs = [
          {
            id: '1',
            title: 'Getting Started with DevHub',
            content: 'Learn the basics of DevHub platform, including setup, configuration, and your first project. This comprehensive guide covers everything from account creation to deploying your first application.',
            category: 'Getting Started'
          },
          {
            id: '2',
            title: 'API Reference Overview',
            content: 'Complete API documentation including endpoints, authentication, request/response formats, rate limiting, and best practices for integration with external services.',
            category: 'API Reference'
          },
          {
            id: '3',
            title: 'Frontend Development Guidelines',
            content: 'Standards and best practices for frontend development including React patterns, styling guidelines, component architecture, and performance optimization techniques.',
            category: 'Frontend'
          },
          {
            id: '4',
            title: 'Backend Architecture',
            content: 'Understanding the backend architecture including microservices, database design, API gateway patterns, and scalability considerations for enterprise applications.',
            category: 'Backend'
          },
          {
            id: '5',
            title: 'Deployment Strategies',
            content: 'Learn about different deployment strategies including CI/CD pipelines, container orchestration, blue-green deployments, and monitoring best practices.',
            category: 'Deployment'
          },
          {
            id: '6',
            title: 'Security Best Practices',
            content: 'Comprehensive security guide covering authentication, authorization, data encryption, vulnerability scanning, and compliance requirements for modern applications.',
            category: 'Security'
          }
        ];

        setDocs(mockDocs);
      } catch (error) {
        console.error("Error fetching documentation:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const savedDocs = docs.filter(doc => bookmarkedDocs.includes(doc.id));

  const filteredDocs = (savedView ? savedDocs : docs).filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = savedView || activeCategory === 'All' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSavedView(category === 'Saved');
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Technical <span className="text-blue-100">Repository</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-blue-100">
              Comprehensive guides and API references to help you integrate and build on the DevForge platform.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`lg:w-60 flex-shrink-0 lg:block ${isSidebarOpen ? 'fixed inset-0 z-50 bg-white p-6' : 'hidden'}`}>
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <span className="text-base font-semibold text-gray-900">Documentation</span>
              <button onClick={() => setIsSidebarOpen(false)}><X className="h-5 w-5 text-gray-900" /></button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="mb-3 text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500">Categories</h4>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-[10px] font-medium transition-all ${(savedView && cat === 'Saved') || (!savedView && activeCategory === cat)
                          ? 'border-blue-200 bg-blue-50 text-blue-600'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {cat}
                      {((savedView && cat === 'Saved') || (!savedView && activeCategory === cat)) && <ChevronRight className="h-2.5 w-2.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <Shield className="mb-2 h-5 w-5 text-blue-600" />
                <h5 className="mb-1 text-[11px] font-bold text-gray-900">Need Help?</h5>
                <p className="mb-2 text-[9px] leading-relaxed text-gray-600">Our engineering team is available 24/7 for enterprise support.</p>
                <Link to="/book-demo" className="flex items-center gap-1 text-[9px] font-bold text-blue-600 hover:text-blue-700">
                  Contact Support <ArrowRight className="h-2 w-2" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3 lg:hidden">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-900"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-gray-900">Docs</span>
              </div>

              <div className="relative w-full lg:max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-[11px] text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-xl border border-gray-200 bg-white animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {savedView && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    {savedDocs.length} saved document{savedDocs.length === 1 ? '' : 's'}
                  </div>
                )}
                {filteredDocs.length === 0 ? (
                  <div className="py-24 text-center rounded-xl border border-dashed border-gray-200 bg-white">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <Book className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-1.5 text-xl font-semibold text-gray-900">
                      {savedView ? 'No saved documents yet' : 'No documentation found'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {savedView ? 'Click the bookmark icon on any guide to save it here.' : 'Try searching for something else or browse categories.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {filteredDocs.map((doc) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-blue-50 group-hover:scale-110 transition-transform">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <span className="mb-0.5 block text-[8px] font-bold uppercase tracking-widest text-gray-500">{doc.category || 'General'}</span>
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{doc.title}</h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleBookmark(doc.id);
                              }}
                              className={`p-1 transition-colors ${bookmarkedDocs.includes(doc.id) ? 'text-blue-600 hover:text-blue-700' : 'text-gray-500 hover:text-gray-900'}`}
                              aria-label={bookmarkedDocs.includes(doc.id) ? 'Remove bookmark' : 'Save document'}
                            >
                              <Bookmark className={`h-3.5 w-3.5 ${bookmarkedDocs.includes(doc.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                shareDoc(doc);
                              }}
                              className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                              aria-label="Share documentation"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                          {doc.content?.substring(0, 200)}...
                        </p>

                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-gray-500">
                              <Clock className="h-2 w-2" /> Updated 2 days ago
                            </div>
                            <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-gray-500">
                              <UserCheck className="h-2 w-2" /> Verified
                            </div>
                          </div>
                          <Link
                            to={`/documentation/${doc.id}`}
                            className="flex items-center gap-1 text-[10px] font-medium text-blue-600 group/link"
                          >
                            Read Guide <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
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

