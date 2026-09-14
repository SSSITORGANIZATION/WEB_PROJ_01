import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Rocket,
  Users,
  Code2,
  BookOpen,
  LogIn,
  Menu,
  X,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Terminal,
  ArrowRight,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/api';
import '../styles/components/Layout.css';

const Footer = ({ siteSettings, footerData }) => {
  // Use dynamic footer data if available, otherwise fallback to hardcoded values
  const socialLinks = footerData?.social_links || {};
  const productLinks = ['Projects', 'Developers', 'Hiring', 'Resources', 'Reviews'];
  const companyLinks = ['About Us', 'Hiring', 'Press', 'Contact'];
  const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

  return (
    <footer className="layout-footer">
      <div className="layout-footer-container">
        <div className="layout-footer-grid">
          {/* Brand Section - Expanded */}
          <div className="layout-footer-brand">
            <Link to="/" className="layout-footer-logo-link">
              {siteSettings?.logo && (
                <img
                  src={siteSettings.logo}
                  alt="Site Logo"
                  className="layout-footer-logo-image-inline"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <span className="layout-footer-logo-text">{siteSettings?.heading || 'Sai Software Solutions'}</span>
            </Link>
            <p className="layout-footer-description">
              {footerData?.company_description || 'Professional software development company delivering innovative digital solutions for modern businesses. Specializing in custom web applications, enterprise software, and mobile app development.'}
            </p>
            <div className="layout-footer-social-links">
              {Object.entries(socialLinks).map(([platform, url], i) => {
                const Icon = platform.toLowerCase().includes('github') ? Github :
                  platform.toLowerCase().includes('twitter') ? Twitter :
                    platform.toLowerCase().includes('linkedin') ? Linkedin :
                      Github; // Default fallback
                return (
                  <a key={i} href={url} className="layout-footer-social-link" target="_blank" rel="noopener noreferrer">
                    <Icon className="layout-footer-social-icon" />
                  </a>
                );
              })}
              {/* Fallback social links if none exist */}
              {Object.keys(socialLinks).length === 0 && (
                <>
                  <a href="https://linkedin.com" className="layout-footer-social-link" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="layout-footer-social-icon" />
                  </a>
                  <a href="https://twitter.com" className="layout-footer-social-link" target="_blank" rel="noopener noreferrer">
                    <Twitter className="layout-footer-social-icon" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="layout-footer-section">
            <h4 className="layout-footer-section-title">Quick Links</h4>
            <ul className="layout-footer-links">
              {productLinks.slice(0, 4).map(item => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="layout-footer-link">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div className="layout-footer-section">
            <h4 className="layout-footer-section-title">Company</h4>
            <ul className="layout-footer-links">
              {companyLinks.map(item => {
                if (item === 'About Us') {
                  return (
                    <li key={item}>
                      <Link to="/about" className="layout-footer-link">{item}</Link>
                    </li>
                  );
                }
                return (
                  <li key={item}>
                    <a href="#" className="layout-footer-link">{item}</a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="layout-footer-section">
            <h4 className="layout-footer-section-title">Stay Updated</h4>
            <p className="layout-footer-newsletter-text">Get the latest updates on software solutions and technology trends.</p>
            <div className="layout-footer-newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="layout-footer-newsletter-input"
              />
              <button className="layout-footer-newsletter-button">
                <ArrowRight className="layout-footer-newsletter-icon" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="layout-footer-bottom">
          <p className="layout-footer-copyright">
            {footerData?.copyright_text || '© 2026 Sai Software Solutions. All rights reserved.'}
          </p>
          <div className="layout-footer-legal-links">
            {legalLinks.map(item => (
              <a key={item} href="#" className="layout-footer-legal-link">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer >
  );
};

export const Layout = ({ children }) => {
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState(null);
  const [navbarLinks, setNavbarLinks] = useState([]);
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch site settings
        const settingsResponse = await apiService.getSiteSettings();
        if (settingsResponse.data && settingsResponse.data.length > 0) {
          setSiteSettings(settingsResponse.data[0]);
        }

        // Fetch navbar links
        const navbarResponse = await apiService.getNavbarLinks();
        if (navbarResponse.data) {
          setNavbarLinks(navbarResponse.data);
        }

        // Fetch footer data
        const footerResponse = await apiService.getFooter();
        if (footerResponse.data && footerResponse.data.length > 0) {
          setFooterData(footerResponse.data[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="layout">
      <main className="layout-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="layout-main-content"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const HeaderWithSettings = ({ siteSettings, navbarLinks }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Convert navbar links to navItems format, fallback to default if no links
  const navItems = navbarLinks && navbarLinks.length > 0
    ? navbarLinks.map(link => ({
      name: link.title,
      path: link.url,
      icon: link.title.toLowerCase().includes('project') ? Rocket :
        link.title.toLowerCase().includes('developer') ? Users :
          link.title.toLowerCase().includes('resource') ? BookOpen :
            link.title.toLowerCase().includes('review') ? Star :
              link.title.toLowerCase().includes('hire') ? Code2 :
                Terminal, // Default icon
      hasDropdown: false,
      openInNewTab: link.open_in_new_tab
    }))
    : [
      { name: 'Projects', path: '/projects', icon: Rocket },
      {
        name: 'Developers', path: '/developers', icon: Users, hasDropdown: true, dropdownItems: [
          { label: 'Developer Directory', path: '/developers' },
          { label: 'Public Reviews', path: '/reviews' }
        ]
      },
      { name: 'Resources', path: '/resources', icon: BookOpen },
      { name: 'Reviews', path: '/reviews', icon: Star },
      { name: 'Hiring', path: '/hiring', icon: Code2 },
      { name: 'Contact', path: '/contact', icon: Mail },
    ];

  return (
    <header className={`layout-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="layout-header-container">
        <motion.div
          className="layout-logo-wrapper"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link to="/" className="layout-logo-link">
            <div className="layout-logo-container">
              <Terminal className="layout-logo-icon" />
            </div>
            <span className="layout-logo-text">{siteSettings?.heading || 'Sai Software Solutions'}</span>
          </Link>
        </motion.div>

        <nav className="layout-desktop-nav">
          <div className="layout-nav-items-wrapper">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = item.hasDropdown
                ? item.dropdownItems?.some(dropdownItem => location.pathname === dropdownItem.path)
                : location.pathname === item.path;
              return (
                <motion.div
                  key={item.name}
                  className="layout-nav-item-wrapper"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.hasDropdown ? (
                    <div className="relative group">
                      <button
                        className={`layout-desktop-nav-link ${isActive ? 'active' : ''}`}
                      >
                        <div className="layout-nav-content">
                          <Icon className="layout-nav-icon" />
                          <span className="layout-nav-text">{item.name}</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                        <div className="layout-nav-indicator" />
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-48 layout-nav-dropdown rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                          <Link
                            key={dropdownIndex}
                            to={dropdownItem.path}
                            className="block px-4 py-3 text-sm layout-nav-dropdown-item transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    item.openInNewTab || item.path.startsWith('http') ? (
                      <a
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`layout-desktop-nav-link ${isActive ? 'active' : ''}`}
                      >
                        <div className="layout-nav-content">
                          <Icon className="layout-nav-icon" />
                          <span className="layout-nav-text">{item.name}</span>
                        </div>
                        <div className="layout-nav-indicator" />
                      </a>
                    ) : (
                      <Link
                        to={item.path}
                        className={`layout-desktop-nav-link ${isActive ? 'active' : ''}`}
                      >
                        <div className="layout-nav-content">
                          <Icon className="layout-nav-icon" />
                          <span className="layout-nav-text">{item.name}</span>
                        </div>
                        <div className="layout-nav-indicator" />
                      </Link>
                    )
                  )}
                </motion.div>
              );
            })}
          </div>
        </nav>

        <div className="layout-header-actions">
          <motion.button
            className="layout-cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogIn size={16} />
            <span>Login</span>
          </motion.button>

          <button
            className="layout-mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="layout-mobile-nav"
          >
            <div className="layout-mobile-nav-container">
              <div className="layout-mobile-nav-header">
                <div className="layout-logo-container">
                  <Terminal className="layout-logo-icon" />
                </div>
                <span className="layout-logo-text">{siteSettings?.heading || 'Sai Software Solutions'}</span>
              </div>

              <div className="layout-mobile-nav-items">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.openInNewTab || item.path.startsWith('http') ? (
                        <a
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`layout-mobile-nav-link ${isActive ? 'active' : ''}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="layout-mobile-nav-icon" />
                          <span>{item.name}</span>
                          {isActive && <div className="layout-mobile-nav-indicator" />}
                        </a>
                      ) : (
                        <Link
                          to={item.path}
                          className={`layout-mobile-nav-link ${isActive ? 'active' : ''}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="layout-mobile-nav-icon" />
                          <span>{item.name}</span>
                          {isActive && <div className="layout-mobile-nav-indicator" />}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="layout-mobile-nav-footer">
                <motion.button
                  className="layout-mobile-cta-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogIn size={16} />
                  <span>Login to Dashboard</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
