import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Github,
  Linkedin,
  Twitter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/api';
import Navbar from './Navbar';
import '../styles/components/Layout.css';

export const SiteFooter = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await apiService.getFooter();
        if (response.data && response.data.length > 0) {
          setFooterData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchFooter();
  }, []);

  const socialLinks = footerData?.social_links || {};

  return (
    <footer className="bg-[#1a237e] pt-10 pb-5 text-white">
      <div className="mx-auto w-[90%] px-6">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">SA Technologies</span>
            </Link>
            <p className="mb-4 max-w-md text-sm leading-relaxed text-white/70">
              {footerData?.company_description || 'Professional software development company delivering innovative digital solutions for modern businesses.'}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Product</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/projects" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">Project Showcase</Link></li>
              <li><Link to="/documentation" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">Documentation</Link></li>
              <li><Link to="/developers" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">Developer Directory</Link></li>
              <li><Link to="/reviews" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">Client Reviews</Link></li>
              <li><Link to="/book-demo" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">Book a Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Resources</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/resources?category=BLOG" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">Blogs</Link></li>
              <li><Link to="/resources?category=GUIDE" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">Guides</Link></li>
              <li><Link to="/resources?category=GLOSSARY" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">Glossary</Link></li>
              <li><Link to="/resources" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">All Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/about" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">Contact</Link></li>
              <li><Link to="/hiring" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">Hiring</Link></li>
              <li><Link to="/join-community" className="text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white">Join Community</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 md:flex-row">
          <p className="text-center text-sm text-white/60 md:text-left">
            {footerData?.copyright_text || `© ${new Date().getFullYear()} SA Technologies. Built for businesses who refuse to compromise on quality.`}
          </p>
          <div className="flex items-center gap-3">
            {[
              { label: 'LinkedIn', url: socialLinks.linkedin || 'https://linkedin.com', Icon: Linkedin },
              { label: 'Twitter', url: socialLinks.twitter || 'https://twitter.com', Icon: Twitter },
              { label: 'GitHub', url: socialLinks.github || 'https://github.com', Icon: Github },
            ].map(({ label, url, Icon }) => (
              <a
                key={label}
                href={url}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#1a237e]"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout = ({ children }) => {
  const location = useLocation();
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
    </div>
  );
};
