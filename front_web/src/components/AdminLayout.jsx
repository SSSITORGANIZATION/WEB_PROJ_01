import React, { useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Palette,
  MessageSquare,
  FileText,
  Clock,
  UserPlus,
  Calendar,
  Terminal,
  Cpu,
  Shield,
  Zap,
  HelpCircle,
  FolderKanban,
  Star,
  BookOpen,
  Image as ImageIcon,
  Search,
  Bell
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import '../styles/components/AdminLayout.css';

export const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: ImageIcon, label: 'Branding', path: '/admin/headings' },
    { icon: FolderKanban, label: 'Projects', path: '/admin/add-project' },
    { icon: Users, label: 'Developers', path: '/admin/developers' },
    { icon: Star, label: 'Reviews', path: '/admin/reviews' },
    { icon: BookOpen, label: 'Resources', path: '/admin/resources' },
    { icon: Briefcase, label: 'Clients', path: '/admin/clients' },
    { icon: Clock, label: 'Time Track', path: '/admin/time' },
    { icon: UserPlus, label: 'Hiring', path: '/admin/hiring' },
    { icon: MessageSquare, label: 'Interviews', path: '/admin/interview' },
    { icon: HelpCircle, label: 'Demos', path: '/admin/demo' },
  ];

  return (
    <div className="admin-layout-container">
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? '80px' : '260px' }}
        className="admin-layout-sidebar no-scrollbar"
      >
        <div className="admin-layout-logo-section">
          <div className="admin-layout-logo-container">
            <div className="admin-layout-logo-icon">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="admin-layout-logo-text"
              >
                DevForge
              </motion.span>
            )}
          </div>
        </div>

        <nav className="admin-layout-navigation no-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-layout-nav-item ${isActive
                  ? 'admin-layout-nav-item-active'
                  : 'admin-layout-nav-item-inactive'
                  }`}
              >
                <item.icon className={`admin-layout-nav-icon ${isActive ? 'admin-layout-nav-icon-active' : 'admin-layout-nav-icon-inactive'
                  }`} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="admin-layout-nav-text"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && isCollapsed && (
                  <div className="admin-layout-nav-indicator" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="admin-layout-footer-actions">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="admin-layout-footer-button"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!isCollapsed && <span className="text-[12px] font-bold">Collapse</span>}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminUser');
              navigate('/admin-login');
            }}
            className="admin-layout-footer-button admin-layout-footer-button-logout"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="text-[12px] font-bold">Logout</span>}
          </button>
        </div>
      </motion.aside>

      <main
        className="admin-layout-main-content no-scrollbar"
        style={{ marginLeft: isCollapsed ? '80px' : '260px' }}
      >
        <header className="admin-layout-top-bar">
          <div className="admin-layout-top-bar-left">
            <div className="admin-layout-search-container">
              <Search className="admin-layout-search-icon" />
              <input
                type="text"
                placeholder="Search command center..."
                className="admin-layout-search-input"
              />
            </div>

            <div className="h-6 w-px bg-white/10 hidden md:block" />

            <div className="admin-layout-status-container">
              <div className="admin-layout-status-dot" />
              <span className="admin-layout-status-text">System Active</span>
            </div>
          </div>

          <div className="admin-layout-top-bar-right">
            <button className="admin-layout-notification-button">
              <Bell className="w-5 h-5" />
              <span className="admin-layout-notification-dot" />
            </button>

            <div className="admin-layout-user-container">
              <div className="admin-layout-user-info">
                <span className="admin-layout-user-name">Sudarsan Babu</span>
                <span className="admin-layout-user-role">Root Access</span>
              </div>
              <div className="admin-layout-user-avatar">
                <img src="https://i.pravatar.cc/100?u=admin" alt="Admin" className="admin-layout-user-avatar-img" />
              </div>
            </div>
          </div>
        </header>

        <div className="admin-layout-page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="admin-layout-page-content-wrapper"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
