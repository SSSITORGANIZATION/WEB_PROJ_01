import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';

import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, Phone, MapPin, Facebook, Instagram, ExternalLink,
  Globe, Twitter, Linkedin
} from 'lucide-react';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const Developers = React.lazy(() => import('./pages/Developers'));
const DeveloperDetail = React.lazy(() => import('./pages/DeveloperDetail'));
const Resources = React.lazy(() => import('./pages/Resources'));
const ResourceDetail = React.lazy(() => import('./pages/ResourceDetail'));
const Tools = React.lazy(() => import('./pages/Tools'));
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
import Navbar from './components/Navbar';
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
              <li><Link to="/tools" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300">Tools</Link></li>
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
            <Route path="/tools" element={<Layout><Tools /></Layout>} />
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
