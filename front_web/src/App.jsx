import React, { useState, useEffect, Suspense } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation
} from 'react-router-dom';

import { motion } from 'motion/react';

import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  ExternalLink,
  Globe,
  Twitter,
  Linkedin
} from 'lucide-react';

// ======================================================
// LAZY LOAD PAGES
// ======================================================

const Home = React.lazy(
  () => import('./pages/Home')
);

const Projects = React.lazy(
  () => import('./pages/Projects')
);

const ProjectDetail = React.lazy(
  () => import('./pages/ProjectDetail')
);

const Developers = React.lazy(
  () => import('./pages/Developers')
);

const DeveloperDetail = React.lazy(
  () => import('./pages/DeveloperDetail')
);

const Resources = React.lazy(
  () => import('./pages/Resources')
);

const ResourceDetail = React.lazy(
  () => import('./pages/ResourceDetail')
);

const Hiring = React.lazy(
  () => import('./pages/Hiring')
);

const ApplyForJob = React.lazy(
  () => import('./pages/ApplyForJob')
);

const Documentation = React.lazy(
  () => import('./pages/Documentation')
);

const DocumentationDetail = React.lazy(
  () => import('./pages/DocumentationDetail')
);

const BookDemo = React.lazy(
  () => import('./pages/BookDemo')
);

const ReviewPage = React.lazy(
  () => import('./pages/ReviewPage')
);

const PublicReviews = React.lazy(
  () => import('./pages/PublicReviews')
);

// ======================================================
// AUTH PAGES
// ======================================================

const CustomerLogin = React.lazy(
  () => import('./pages/auth/CustomerLogin')
);

const CustomerRegister = React.lazy(
  () => import('./pages/auth/CustomerRegister')
);

const ForgotPassword = React.lazy(
  () => import('./pages/auth/ForgotPassword')
);

const ResetPassword = React.lazy(
  () => import('./pages/auth/ResetPassword')
);

// ======================================================
// OTHER PUBLIC PAGES
// ======================================================

const JoinCommunity = React.lazy(
  () => import('./pages/JoinCommunity')
);

const About = React.lazy(
  () => import('./pages/About')
);

const Contact = React.lazy(
  () => import('./pages/Contact')
);

// ======================================================
// ADMIN PAGES
// ======================================================

const AdminDashboard = React.lazy(
  () => import('./pages/admin/AdminDashboard')
);

const AdminProjects = React.lazy(
  () => import('./pages/admin/AdminProjects')
);

const AdminDevelopers = React.lazy(
  () => import('./pages/admin/AdminDevelopers')
);

const AdminResources = React.lazy(
  () => import('./pages/admin/AdminResources')
);

const AdminDocumentation = React.lazy(
  () => import('./pages/admin/AdminDocumentation')
);

const AdminDemos = React.lazy(
  () => import('./pages/admin/AdminDemos')
);

const ManageReviews = React.lazy(
  () => import('./pages/admin/ManageReviews')
);

const AdminHiring = React.lazy(
  () => import('./pages/admin/AdminHiring')
);

const AdminAnalytics = React.lazy(
  () => import('./pages/admin/AdminAnalytics')
);

const AdminSecurity = React.lazy(
  () => import('./pages/admin/AdminSecurity')
);

const AdminSettings = React.lazy(
  () => import('./pages/admin/AdminSettings')
);

const AdminFooter = React.lazy(
  () => import('./pages/admin/AdminFooter')
);

const AdminContact = React.lazy(
  () => import('./pages/admin/AdminContact')
);

const AdminGlobeSettings = React.lazy(
  () => import('./pages/admin/AdminGlobeSettings')
);

// ======================================================
// DEVELOPER PAGES
// ======================================================

const DeveloperOnboarding = React.lazy(
  () => import('./pages/DeveloperOnboarding')
);

// ======================================================
// NORMAL IMPORTS
// ======================================================

import AdminLogin from './pages/admin/AdminLogin';

import KonamiCodeDetector from './components/KonamiCodeDetector';

import { Layout } from './components/Layout';

import { apiService } from './services/api';

import { AuthProvider } from './auth/authContext.jsx';

import ProtectedRoute from './auth/ProtectedRoute';

import PublicRoute from './auth/PublicRoute';

// ======================================================
// ADMIN ROUTE
// ======================================================

const AdminRoute = ({ children }) => {

  const [isAdmin, setIsAdmin] = useState(undefined);

  useEffect(() => {

    const checkAdmin = () => {

      const adminToken =
        localStorage.getItem('adminToken');

      const adminUser =
        localStorage.getItem('adminUser');

      setIsAdmin(
        Boolean(adminToken && adminUser)
      );
    };

    checkAdmin();

  }, []);

  if (isAdmin === undefined) {
    return null;
  }

  return isAdmin ? (
    <>{children}</>
  ) : (
    <Navigate
      to="/admin-login"
      replace
    />
  );
};

// ======================================================
// FOOTER
// ======================================================

const Footer = () => {

  const currentYear =
    new Date().getFullYear();

  const [siteSettings, setSiteSettings] =
    useState(null);

  const [footerData, setFooterData] =
    useState(null);

  // ====================================================
  // FETCH FOOTER DATA
  // ====================================================

  useEffect(() => {

    let mounted = true;

    const fetchFooterData = async () => {

      try {

        const [
          siteSettingsResponse,
          footerResponse
        ] = await Promise.all([
          apiService.getSiteSettings(),
          apiService.getFooter()
        ]);

        if (!mounted) {
          return;
        }

        // ----------------------------------------------
        // SITE SETTINGS
        // ----------------------------------------------

        if (
          siteSettingsResponse?.data &&
          siteSettingsResponse.data.length > 0
        ) {

          setSiteSettings(
            siteSettingsResponse.data[0]
          );

        }

        // ----------------------------------------------
        // FOOTER DATA
        // ----------------------------------------------

        if (
          footerResponse?.data &&
          footerResponse.data.length > 0
        ) {

          setFooterData(
            footerResponse.data[0]
          );

        }

      } catch (error) {

        console.error(
          'Error fetching footer information:',
          error
        );

      }

    };

    fetchFooterData();

    return () => {
      mounted = false;
    };

  }, []);

  // ====================================================
  // SOCIAL ICONS
  // ====================================================

  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    instagram: Instagram,
    website: Globe
  };

  // ====================================================
  // COMPANY DESCRIPTION
  // ====================================================

  const companyDescription =
    footerData?.company_description ||
    'Professional software development company delivering innovative digital solutions for modern businesses. Specializing in custom web applications, enterprise software, and mobile app development.';

  return (

    <footer className="bg-[#1a237e] pt-6 pb-3 text-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* ==================================================
            FIVE COLUMN FOOTER
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-5 mb-5">

          {/* ==================================================
              COLUMN 1
              SA TECHNOLOGIES
          ================================================== */}

          <div className="min-w-0">

            <Link
              to="/"
              className="flex items-center gap-2 mb-3"
            >

              {siteSettings?.logo && (

                <img
                  src={siteSettings.logo}
                  alt="SA Technologies Logo"
                  className="w-9 h-9 object-contain rounded-lg bg-white/10 backdrop-blur-sm p-1.5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />

              )}

              <span className="text-lg font-bold tracking-tight text-white">
                {siteSettings?.heading ||
                  'SA Technologies'}
              </span>

            </Link>

            <p className="text-white/70 text-sm leading-relaxed max-w-xs">

              {companyDescription}

            </p>

          </div>


          {/* ==================================================
              COLUMN 2
              COMPANY
          ================================================== */}

          <div className="min-w-0">

            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Company
            </h4>

            <ul className="flex flex-col gap-2">

              <li>

                <Link
                  to="/hiring"
                  className="inline-block text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300"
                >
                  Hiring
                </Link>

              </li>

              <li>

                <Link
                  to="/auth/login"
                  className="inline-block text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300"
                >
                  Login
                </Link>

              </li>

              <li>

                <Link
                  to="/join-community"
                  className="inline-block text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300"
                >
                  Join Community
                </Link>

              </li>

            </ul>

          </div>


          {/* ==================================================
              COLUMN 3
              PRODUCT
          ================================================== */}

          <div className="min-w-0">

            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Product
            </h4>

            <ul className="flex flex-col gap-2">

              <li>

                <Link
                  to="/projects"
                  className="inline-block text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300"
                >
                  Project Showcase
                </Link>

              </li>

              <li>

                <Link
                  to="/documentation"
                  className="inline-block text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300"
                >
                  Documentation
                </Link>

              </li>

              <li>

                <Link
                  to="/developers"
                  className="inline-block text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300"
                >
                  Developer Directory
                </Link>

              </li>

              <li>

                <Link
                  to="/reviews"
                  className="inline-block text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300"
                >
                  Client Reviews
                </Link>

              </li>

              <li>

                <Link
                  to="/book-demo"
                  className="inline-block text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300"
                >
                  Book a Demo
                </Link>

              </li>

            </ul>

          </div>


          {/* ==================================================
              COLUMN 4
              RESOURCES
          ================================================== */}

          <div className="min-w-0">

            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Resources
            </h4>

            <ul className="flex flex-col gap-2">

              <li>

                <Link
                  to="/resources?category=BLOG"
                  className="inline-block text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300"
                >
                  Blogs
                </Link>

              </li>

              <li>

                <Link
                  to="/resources?category=GUIDE"
                  className="inline-block text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300"
                >
                  Guides
                </Link>

              </li>

              <li>

                <Link
                  to="/resources?category=GLOSSARY"
                  className="inline-block text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300"
                >
                  Glossary
                </Link>

              </li>

              <li>

                <Link
                  to="/resources"
                  className="inline-block text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-300"
                >
                  All Resources
                </Link>

              </li>

            </ul>

          </div>


          {/* ==================================================
              COLUMN 5
              CONTACT
          ================================================== */}

          <div className="min-w-0">

            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Contact
            </h4>

            <div className="space-y-2.5">

              {/* EMAIL */}

              {footerData?.email && (

                <div className="flex items-start gap-2">

                  <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">

                    <Mail className="w-3.5 h-3.5 text-white" />

                  </div>

                  <a
                    href={`mailto:${footerData.email}`}
                    className="text-white/70 text-sm hover:text-white transition-colors break-all pt-1"
                  >
                    {footerData.email}
                  </a>

                </div>

              )}


              {/* PHONE */}

              {footerData?.phone && (

                <div className="flex items-start gap-2">

                  <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">

                    <Phone className="w-3.5 h-3.5 text-white" />

                  </div>

                  <a
                    href={`tel:${footerData.phone}`}
                    className="text-white/70 text-sm hover:text-white transition-colors pt-1"
                  >
                    {footerData.phone}
                  </a>

                </div>

              )}


              {/* ADDRESS */}

              {footerData?.address && (

                <div className="flex items-start gap-2">

                  <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">

                    <MapPin className="w-3.5 h-3.5 text-white" />

                  </div>

                  <span className="text-white/70 text-sm leading-relaxed pt-1">
                    {footerData.address}
                  </span>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* ==================================================
            BOTTOM FOOTER
        ================================================== */}

        <div className="flex flex-col md:flex-row items-center justify-between pt-3 border-t border-white/10 gap-3">

          {/* COPYRIGHT */}

          <p className="text-white/60 text-sm text-center md:text-left">

            {footerData?.copyright_text ||
              `© ${currentYear} SA Technologies. Built for businesses who refuse to compromise on quality.`}

          </p>


          {/* SOCIAL LINKS */}

          {footerData?.social_links &&
            Object.keys(
              footerData.social_links
            ).length > 0 && (

              <div className="flex items-center gap-2">

                {Object.entries(
                  footerData.social_links
                ).map(
                  ([platform, url]) => {

                    const Icon =
                      socialIcons[platform] ||
                      ExternalLink;

                    return (

                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:bg-white hover:text-[#1a237e] transition-all duration-300 hover:scale-105"
                        aria-label={platform}
                      >

                        <Icon className="w-3.5 h-3.5" />

                      </a>

                    );

                  }
                )}

              </div>

            )}

        </div>

      </div>

    </footer>
  );
};


// ======================================================
// APP
// ======================================================

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


// ======================================================
// APP CONTENT
// ======================================================

const AppContent = () => {

  const location = useLocation();

  // ====================================================
  // ADMIN PAGE
  // ====================================================

  const isAdminPage =
    location.pathname.startsWith('/admin');

  // ====================================================
  // AUTH PAGES
  // ====================================================

  const authPages = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password'
  ];

  // ====================================================
  // FOOTER VISIBILITY
  // ====================================================

  const shouldShowFooter =
    !isAdminPage &&
    !authPages.includes(location.pathname) &&
    location.pathname !== '/book-demo';

  // ====================================================
  // SCROLL TO TOP
  // ====================================================

  useEffect(() => {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

  }, [location.pathname, location.search]);

  return (

    <div className="min-h-screen flex flex-col">

      {/* ==================================================
          HIDE OLD FOOTER FROM LAYOUT
      ================================================== */}

      <style>
        {`
          main footer {
            display: none !important;
          }
        `}
      </style>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="flex-grow">

        <Suspense

          fallback={

            <div className="min-h-screen w-full flex items-center justify-center bg-black">

              <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
              />

            </div>

          }

        >

          <Routes>

            {/* ==================================================
                HOME
            ================================================== */}

            <Route
              path="/"
              element={<Home />}
            />


            {/* ==================================================
                PROJECTS
            ================================================== */}

            <Route
              path="/projects"
              element={
                <Layout>
                  <Projects />
                </Layout>
              }
            />

            <Route
              path="/project/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />


            {/* ==================================================
                DEVELOPERS
            ================================================== */}

            <Route
              path="/developers"
              element={
                <Layout>
                  <Developers />
                </Layout>
              }
            />

            <Route
              path="/developer/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DeveloperDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />


            {/* ==================================================
                RESOURCES
            ================================================== */}

            <Route
              path="/resources"
              element={
                <Layout>
                  <Resources />
                </Layout>
              }
            />

            <Route
              path="/resources/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ResourceDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />


            {/* ==================================================
                HIRING
            ================================================== */}

            <Route
              path="/hiring"
              element={
                <Layout>
                  <Hiring />
                </Layout>
              }
            />

            <Route
              path="/apply/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ApplyForJob />
                  </Layout>
                </ProtectedRoute>
              }
            />


            {/* ==================================================
                DOCUMENTATION
            ================================================== */}

            <Route
              path="/documentation"
              element={
                <Layout>
                  <Documentation />
                </Layout>
              }
            />

            <Route
              path="/documentation/:id"
              element={
                <Layout>
                  <DocumentationDetail />
                </Layout>
              }
            />


            {/* ==================================================
                BOOK DEMO
            ================================================== */}

            <Route
              path="/book-demo/:projectTitle?"
              element={<BookDemo />}
            />


            {/* ==================================================
                REVIEWS
            ================================================== */}

            <Route
              path="/review/:projectId"
              element={
                <Layout>
                  <ReviewPage />
                </Layout>
              }
            />

            <Route
              path="/reviews"
              element={
                <Layout>
                  <PublicReviews />
                </Layout>
              }
            />


            {/* ==================================================
                COMMUNITY
            ================================================== */}

            <Route
              path="/join-community"
              element={
                <Layout>
                  <JoinCommunity />
                </Layout>
              }
            />


            {/* ==================================================
                COMPANY
            ================================================== */}

            <Route
              path="/about"
              element={
                <Layout>
                  <About />
                </Layout>
              }
            />

            <Route
              path="/contact"
              element={
                <Layout>
                  <Contact />
                </Layout>
              }
            />


            {/* ==================================================
                AUTHENTICATION
            ================================================== */}

            <Route
              path="/auth/login"
              element={
                <PublicRoute>
                  <CustomerLogin />
                </PublicRoute>
              }
            />

            <Route
              path="/auth/register"
              element={
                <PublicRoute>
                  <CustomerRegister />
                </PublicRoute>
              }
            />

            <Route
              path="/auth/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            <Route
              path="/auth/reset-password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />


            {/* ==================================================
                ADMIN LOGIN
            ================================================== */}

            <Route
              path="/admin-login"
              element={<AdminLogin />}
            />


            {/* ==================================================
                DEVELOPER ONBOARDING
            ================================================== */}

            <Route
              path="/developer/onboarding"
              element={
                <Layout>
                  <DeveloperOnboarding />
                </Layout>
              }
            />


            {/* ==================================================
                ADMIN
            ================================================== */}

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/projects"
              element={
                <AdminRoute>
                  <AdminProjects />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/developers"
              element={
                <AdminRoute>
                  <AdminDevelopers />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/resources"
              element={
                <AdminRoute>
                  <AdminResources />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/documentation"
              element={
                <AdminRoute>
                  <AdminDocumentation />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/demos"
              element={
                <AdminRoute>
                  <AdminDemos />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/reviews"
              element={
                <AdminRoute>
                  <ManageReviews />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/hiring"
              element={
                <AdminRoute>
                  <AdminHiring />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/security"
              element={
                <AdminRoute>
                  <AdminSecurity />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/footer"
              element={
                <AdminRoute>
                  <AdminFooter />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/contact"
              element={
                <AdminRoute>
                  <AdminContact />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/globe-settings"
              element={
                <AdminRoute>
                  <AdminGlobeSettings />
                </AdminRoute>
              }
            />

          </Routes>

        </Suspense>

      </main>


      {/* ==================================================
          FOOTER
      ================================================== */}

      {shouldShowFooter && <Footer />}

    </div>

  );
};

export default App;