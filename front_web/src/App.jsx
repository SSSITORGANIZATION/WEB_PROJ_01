import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';

import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, X, ChevronDown, User, LogOut,
  Github, Linkedin, Twitter, ArrowRight,
  Layout as LayoutIcon, Users, BookOpen, Briefcase,
  Search, Globe, Shield, HelpCircle,
  FileText, MessageSquare, Star, Calendar,
  Settings, Database, Clock, HardDrive,
  CheckCircle, AlertCircle, TrendingUp,
  Mail, Phone, MapPin, Facebook, Instagram, ExternalLink
} from 'lucide-react';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const Developers = React.lazy(() => import('./pages/Developers'));
const DeveloperDetail = React.lazy(() => import('./pages/DeveloperDetail'));
const Resources = React.lazy(() => import('./pages/Resources'));
const ResourceDetail = React.lazy(() => import('./pages/ResourceDetail'));
const Hiring = React.lazy(() => import('./pages/Hiring'));
const ApplyForJob = React.lazy(() => import('./pages/ApplyForJob'));
const Documentation = React.lazy(() => import('./pages/Documentation'));
const DocumentationDetail = React.lazy(() => import('./pages/DocumentationDetail'));
const BookDemo = React.lazy(() => import('./pages/BookDemo'));
const ReviewPage = React.lazy(() => import('./pages/ReviewPage'));
const PublicReviews = React.lazy(() => import('./pages/PublicReviews'));
const CustomerLogin = React.lazy(() => import('./pages/auth/CustomerLogin'));
const CustomerRegister = React.lazy(() => import('./pages/auth/CustomerRegister'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'));
const JoinCommunity = React.lazy(() => import('./pages/JoinCommunity'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjects = React.lazy(() => import('./pages/admin/AdminProjects'));
const AdminDevelopers = React.lazy(() => import('./pages/admin/AdminDevelopers'));
const AdminResources = React.lazy(() => import('./pages/admin/AdminResources'));
const AdminDocumentation = React.lazy(() => import('./pages/admin/AdminDocumentation'));
const AdminDemos = React.lazy(() => import('./pages/admin/AdminDemos'));
const ManageReviews = React.lazy(() => import('./pages/admin/ManageReviews'));
const AdminHiring = React.lazy(() => import('./pages/admin/AdminHiring'));
const AdminAnalytics = React.lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminSecurity = React.lazy(() => import('./pages/admin/AdminSecurity'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const AdminFooter = React.lazy(() => import('./pages/admin/AdminFooter'));
const AdminContact = React.lazy(() => import('./pages/admin/AdminContact'));
const AdminGlobeSettings = React.lazy(() => import('./pages/admin/AdminGlobeSettings'));

// Developer Pages
const DeveloperOnboarding = React.lazy(() => import('./pages/DeveloperOnboarding'));

import AdminLogin from './pages/admin/AdminLogin';
import KonamiCodeDetector from './components/KonamiCodeDetector';
import { Layout } from './components/Layout';
import { authService } from './services/authService';
import { apiService } from './services/api';
import { AuthProvider } from './auth/authContext.jsx';
import { useAuth } from './auth/authContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute';
import PublicRoute from './auth/PublicRoute';


const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(undefined);

  useEffect(() => {
    const checkAdmin = () => {
      const adminToken = localStorage.getItem('adminToken');
      const adminUser = localStorage.getItem('adminUser');
      setIsAdmin(!!adminToken && !!adminUser);
    };
    checkAdmin();
  }, []);

  if (isAdmin === undefined) return null;
  return isAdmin ? <>{children}</> : <Navigate to="/admin-login" replace />;
};

// Components
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, clearAuth } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await apiService.getSiteSettings();
        if (response.data && response.data.length > 0) {
          setSiteSettings(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSiteSettings();
  }, []);

  const handleLogout = async () => {
    clearAuth();
    authService.signOut();
    navigate('/');
  };

  const userRole = isAuthenticated ? 'customer' : null;

  const NavItem = ({ title, links }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white hover:text-white transition-colors">
          {title}
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 top-full w-64 p-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <div className="flex flex-col gap-1">
                {links?.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.to}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-gray-50 rounded-lg transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-gradient-to-r from-blue-700 to-indigo-800 backdrop-blur-xl border-b border-white/10 py-2' : 'bg-gradient-to-r from-blue-600 to-indigo-700 py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group -ml-2 md:-ml-3">
          {siteSettings?.logo && (
            <img
              src={siteSettings.logo}
              alt="Site Logo"
              className="w-22 h-10 object-contain rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <span className="text-lg font-bold tracking-tighter serif text-white">{siteSettings?.heading || 'Sai Software Solutions'}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2">
          <NavItem
            title="PROJECTS"
            links={[
              { label: "Project Showcase", to: "/projects" },
              { label: "Documentation", to: "/documentation" }
            ]}
          />
          <NavItem
            title="DEVELOPERS"
            links={[
              { label: "Developer Directory", to: "/developers" }
            ]}
          />
          <NavItem
            title="RESOURCES"
            links={[
              { label: "Blogs", to: "/resources?category=BLOG" },
              { label: "Guides", to: "/resources?category=GUIDE" },
              { label: "Tools", to: "/resources?category=TOOL" },
              { label: "Glossary", to: "/resources?category=GLOSSARY" },
              { label: "All Resources", to: "/resources" }
            ]}
          />

          <Link
            to="/reviews"
            className="px-4 py-2 text-sm font-medium text-white hover:text-white transition-colors"
          >
            REVIEWS
          </Link>

          <Link
            to="/hiring"
            className="px-4 py-2 text-sm font-medium text-white hover:text-white transition-colors"
          >
            HIRING
          </Link>

          <NavItem
            title="COMPANY"
            links={[
              { label: "About Us", to: "/about" },
              { label: "Contact", to: "/contact" }
            ]}
          />
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-1 pl-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all">
                <span className="text-sm font-medium text-white">
                  {user.name ? user.name.split(' ')[0] : user.email?.split('@')[0]}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 overflow-hidden">
                  {user.avatar_url || user.photoURL ? <img src={user.avatar_url || user.photoURL} alt="" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-white" />}
                </div>
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 p-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="px-4 py-2 border-b border-gray-200 mb-1">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Account</p>
                  <p className="text-sm text-gray-900 truncate">{user.email}</p>
                </div>
                {userRole === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-gray-50 rounded-lg transition-all">
                    <Shield className="w-4 h-4" /> Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="px-6 py-2 text-sm font-semibold text-white hover:text-white/90 transition-colors"
            >
              Login
            </Link>
          )}

          <Link
            to="/book-demo"
            className="hidden sm:flex items-center gap-2 px-5 py-2 bg-white text-blue-600 rounded-full text-xs font-bold shadow-lg hover:bg-white/90 hover:scale-105 transition-all"
          >
            Book Demo
          </Link>

          <button className="lg:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gradient-to-r from-blue-600 to-indigo-700 border-b border-white/10 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              <Link to="/projects" className="text-white font-bold">PROJECTS</Link>
              <Link to="/developers" className="text-white font-bold">DEVELOPERS</Link>
              <Link to="/resources" className="text-white font-bold">RESOURCES</Link>
              <Link to="/reviews" className="text-white font-bold">REVIEWS</Link>
              <Link to="/hiring" className="text-white font-bold">HIRING</Link>
              <div className="space-y-2">
                <div className="text-white font-bold">COMPANY</div>
                <div className="pl-4 space-y-2">
                  <Link to="/about" className="text-white font-medium">About Us</Link>
                  <Link to="/contact" className="text-white font-medium">Contact</Link>
                </div>
              </div>
              <Link to="/documentation" className="text-white font-bold">DOCUMENTATION</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [siteSettings, setSiteSettings] = useState(null);
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await apiService.getSiteSettings();
        if (response.data && response.data.length > 0) {
          setSiteSettings(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    const fetchFooterData = async () => {
      try {
        const response = await apiService.getFooter();
        if (response.data && response.data.length > 0) {
          setFooterData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchSiteSettings();
    fetchFooterData();
  }, []);

  return (
    <footer className="bg-[#1a237e] pt-10 pb-5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              {siteSettings?.logo && (
                <img
                  src={siteSettings.logo}
                  alt="Site Logo"
                  className="w-10 h-10 object-contain rounded-lg bg-white/10 backdrop-blur-sm p-1.5"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <span className="text-xl font-bold tracking-tight text-white">{siteSettings?.heading || 'Sai Software Solutions'}</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-4 max-w-md">
              {footerData?.company_description || 'Professional software development company delivering innovative digital solutions for modern businesses. Specializing in custom web applications, enterprise software, and mobile app development.'}
            </p>

            {/* Contact Information */}
            {footerData && (
              <div className="space-y-3">
                {footerData.email && (
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <a href={`mailto:${footerData.email}`} className="hover:text-white transition-colors">
                      {footerData.email}
                    </a>
                  </div>
                )}
                {footerData.phone && (
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <a href={`tel:${footerData.phone}`} className="hover:text-white transition-colors">
                      {footerData.phone}
                    </a>
                  </div>
                )}
                {footerData.address && (
                  <div className="flex items-start gap-2 text-white/80 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span>{footerData.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/projects" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Project Showcase</Link></li>
              <li><Link to="/documentation" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Documentation</Link></li>
              <li><Link to="/developers" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Developer Directory</Link></li>
              <li><Link to="/reviews" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Client Reviews</Link></li>
              <li><Link to="/book-demo" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Book a Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/resources?category=BLOG" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Blogs</Link></li>
              <li><Link to="/resources?category=GUIDE" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Guides</Link></li>
              <li><Link to="/resources?category=TOOL" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Tools</Link></li>
              <li><Link to="/resources?category=GLOSSARY" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Glossary</Link></li>
              <li><Link to="/resources" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">All Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/hiring" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Hiring</Link></li>
              <li><Link to="/auth/login" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Login</Link></li>
              <li><Link to="/join-community" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Join Community</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-5 border-t border-white/10 gap-4">
          <p className="text-white/60 text-sm">
            {footerData?.copyright_text || `© ${currentYear} Sai Software Solutions. Built for businesses who refuse to compromise on quality.`}
          </p>

          {/* Social Links */}
          {footerData?.social_links && Object.keys(footerData.social_links).length > 0 && (
            <div className="flex items-center gap-3">
              {Object.entries(footerData.social_links).map(([platform, url]) => {
                const socialIcons = {
                  facebook: Facebook,
                  twitter: Twitter,
                  linkedin: Linkedin,
                  instagram: Instagram,
                  website: Globe
                };
                const Icon = socialIcons[platform] || ExternalLink;

                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:bg-white hover:text-[#1a237e] transition-all duration-300 transform hover:scale-105"
                    aria-label={platform}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <KonamiCodeDetector />
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const authPages = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
  const shouldShowNavbar = !isAdminPage;
  const shouldShowFooter = !isAdminPage && !authPages.includes(location.pathname) && !['/book-demo'].includes(location.pathname);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={
          <div className="h-screen w-full flex items-center justify-center bg-black">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
            />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/projects" element={<Layout><Projects /></Layout>} />
            <Route path="/project/:id" element={<ProtectedRoute><Layout><ProjectDetail /></Layout></ProtectedRoute>} />
            <Route path="/developers" element={<Layout><Developers /></Layout>} />
            <Route path="/developer/:id" element={<ProtectedRoute><Layout><DeveloperDetail /></Layout></ProtectedRoute>} />
            <Route path="/resources" element={<Layout><Resources /></Layout>} />
            <Route path="/resources/:id" element={<ProtectedRoute><Layout><ResourceDetail /></Layout></ProtectedRoute>} />
            <Route path="/hiring" element={<Layout><Hiring /></Layout>} />
            <Route path="/apply/:id" element={<ProtectedRoute><Layout><ApplyForJob /></Layout></ProtectedRoute>} />
            <Route path="/documentation" element={<Layout><Documentation /></Layout>} />
            <Route path="/documentation/:id" element={<Layout><DocumentationDetail /></Layout>} />
            <Route path="/book-demo/:projectTitle?" element={<BookDemo />} />
            <Route path="/review/:projectId" element={<Layout><ReviewPage /></Layout>} />
            <Route path="/reviews" element={<Layout><PublicReviews /></Layout>} />
            <Route path="/join-community" element={<Layout><JoinCommunity /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/auth/login" element={<PublicRoute><CustomerLogin /></PublicRoute>} />
            <Route path="/auth/register" element={<PublicRoute><CustomerRegister /></PublicRoute>} />
            <Route path="/auth/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/auth/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/developer/onboarding" element={<Layout><DeveloperOnboarding /></Layout>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
            <Route path="/admin/developers" element={<AdminRoute><AdminDevelopers /></AdminRoute>} />
            <Route path="/admin/resources" element={<AdminRoute><AdminResources /></AdminRoute>} />
            <Route path="/admin/documentation" element={<AdminRoute><AdminDocumentation /></AdminRoute>} />
            <Route path="/admin/demos" element={<AdminRoute><AdminDemos /></AdminRoute>} />
            <Route path="/admin/reviews" element={<AdminRoute><ManageReviews /></AdminRoute>} />
            <Route path="/admin/hiring" element={<AdminRoute><AdminHiring /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
            <Route path="/admin/security" element={<AdminRoute><AdminSecurity /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/footer" element={<AdminRoute><AdminFooter /></AdminRoute>} />
            <Route path="/admin/contact" element={<AdminRoute><AdminContact /></AdminRoute>} />
            <Route path="/admin/globe-settings" element={<AdminRoute><AdminGlobeSettings /></AdminRoute>} />
          </Routes>
        </Suspense>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default App;
