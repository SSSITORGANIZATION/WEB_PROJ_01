import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Rocket,
  Users,
  Code2,
  BookOpen,
  LogIn,
  LogOut,
  Menu,
  X,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Terminal,
  ArrowRight,
  Star,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/api';
import { useAuth } from '../auth/authContext.jsx';
import Navbar from './Navbar';
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
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch site settings
        const settingsResponse = await apiService.getSiteSettings();
        if (settingsResponse.data && settingsResponse.data.length > 0) {
          setSiteSettings(settingsResponse.data[0]);
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
      <Navbar />
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
      <Footer siteSettings={siteSettings} footerData={footerData} />
    </div>
  );
};
