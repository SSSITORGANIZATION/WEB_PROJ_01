import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Book, Code, Globe,
  ArrowRight, ChevronRight, FileText,
  Terminal, Layers, Shield, Zap,
  Cpu, Database, Layout, Smartphone,
  Menu, X, Bookmark, ExternalLink, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Documentation = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = ['All', 'Getting Started', 'API Reference', 'Frontend', 'Backend', 'Deployment', 'Security'];

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

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-16 pb-12 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`lg:w-60 flex-shrink-0 lg:block ${isSidebarOpen ? 'fixed inset-0 z-50 bg-black p-6' : 'hidden'}`}>
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <span className="text-base font-bold serif text-white">Documentation</span>
              <button onClick={() => setIsSidebarOpen(false)}><X className="w-5 h-5 text-white" /></button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-[8px] text-zinc-500 uppercase tracking-[0.3em] font-bold mb-3">Categories</h4>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setIsSidebarOpen(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${activeCategory === cat
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {cat}
                      {activeCategory === cat && <ChevronRight className="w-2.5 h-2.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 glass-card border-white/5 bg-blue-500/5">
                <Shield className="w-5 h-5 text-blue-500 mb-2" />
                <h5 className="text-white font-bold mb-1 text-[11px]">Need Help?</h5>
                <p className="text-zinc-500 text-[9px] leading-relaxed mb-2">Our engineering team is available 24/7 for enterprise support.</p>
                <Link to="/book-demo" className="text-blue-500 text-[9px] font-bold hover:text-blue-400 flex items-center gap-1">
                  Contact Support <ArrowRight className="w-2 h-2" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 lg:hidden">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-1.5 glass-card border-white/5 text-white"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold serif text-white">Docs</span>
              </div>

              <div className="relative w-full lg:max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[11px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white serif mb-3 tracking-tighter">
                Technical <span className="italic text-blue-500">Repository</span>
              </h1>
              <p className="text-zinc-500 text-base leading-relaxed max-w-2xl">
                Comprehensive guides and API references to help you integrate and build on the DevForge platform.
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-32 glass-card animate-pulse" />)}
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredDocs.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 glass-card border-white/5 group hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                          <FileText className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5 block">{doc.category || 'General'}</span>
                          <h3 className="text-lg font-bold text-white serif group-hover:text-blue-400 transition-colors">{doc.title}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-zinc-500 hover:text-white transition-colors"><Bookmark className="w-3.5 h-3.5" /></button>
                        <button className="p-1 text-zinc-500 hover:text-white transition-colors"><ExternalLink className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {doc.content?.substring(0, 200)}...
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[8px] text-zinc-500 uppercase tracking-widest font-bold">
                          <Clock className="w-2 h-2" /> Updated 2 days ago
                        </div>
                        <div className="flex items-center gap-1 text-[8px] text-zinc-500 uppercase tracking-widest font-bold">
                          <UserCheck className="w-2 h-2" /> Verified
                        </div>
                      </div>
                      <Link
                        to={`/documentation/${doc.id}`}
                        className="flex items-center gap-1 text-[10px] font-bold text-white group/link"
                      >
                        Read Guide <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && filteredDocs.length === 0 && (
              <div className="py-24 text-center glass-card border-white/5 border-dashed">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="w-8 h-8 text-zinc-700" />
                </div>
                <h3 className="text-xl font-bold text-white serif mb-1.5">No documentation found</h3>
                <p className="text-zinc-500 text-sm">Try searching for something else or browse categories.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const UserCheck = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
  </svg>
);

export default Documentation;

