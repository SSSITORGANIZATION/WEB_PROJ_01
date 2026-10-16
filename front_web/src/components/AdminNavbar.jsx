import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  BarChart3,
  MessageSquare,
  Calendar,
  Shield,
  Home,
  MapPin,
  Phone,
  Globe,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuSections = [
    {
      title: 'Main',
      icon: LayoutDashboard,
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Briefcase, label: 'Projects', path: '/admin/projects' },
        { icon: Users, label: 'Developers', path: '/admin/developers' },
        { icon: BookOpen, label: 'Resources', path: '/admin/resources' },
      ]
    },
    {
      title: 'Content',
      icon: FileText,
      items: [
        { icon: FileText, label: 'Documentation', path: '/admin/documentation' },
        { icon: MessageSquare, label: 'Manage Reviews', path: '/admin/reviews' },
        { icon: Calendar, label: 'Demos', path: '/admin/demos' },
      ]
    },
    {
      title: 'Management',
      icon: Settings,
      items: [
        { icon: Briefcase, label: 'Hiring', path: '/admin/hiring' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        { icon: Shield, label: 'Security', path: '/admin/security' },
        { icon: Globe, label: 'Globe Settings', path: '/admin/globe-settings' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
        { icon: MapPin, label: 'Footer', path: '/admin/footer' },
        { icon: Phone, label: 'Contact', path: '/admin/contact' },
      ]
    }
  ];

  const handleSignOut = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="admin-navbar sticky top-0 z-50 w-full border-b border-blue-500/30 bg-blue-950 text-white shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/admin"
          className="group flex shrink-0 items-center gap-3"
          onClick={() => setIsMobileOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-950/40 transition-transform group-hover:scale-110">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="hidden leading-tight sm:block">
            <span className="block text-base font-bold tracking-tight">ADMIN</span>
            <span className="block text-[10px] font-medium uppercase tracking-wide text-blue-200">
              Control Panel
            </span>
          </div>
        </Link>
        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {menuSections.map((section) => {
            const sectionActive = section.items.some((item) => isActive(item.path));
            return (
              <div key={section.title} className="group relative">
                <button
                  type="button"
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                    sectionActive
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <section.icon className="h-4 w-4" />
                  {section.title}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </button>

                <div className="invisible absolute left-0 top-full z-50 w-60 origin-top scale-95 rounded-xl border border-blue-500/30 bg-blue-950 p-2 opacity-0 shadow-2xl transition-all duration-150 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-blue-600 text-white'
                          : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/"
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-blue-100 transition-colors hover:bg-blue-800 hover:text-white md:flex"
          >
            <Home className="h-4 w-4" />
            Back to Site
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20 hover:text-red-100"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
          <button
            type="button"
            onClick={() => setIsMobileOpen((open) => !open)}
            aria-label="Toggle admin navigation"
            aria-expanded={isMobileOpen}
            className="rounded-xl p-2 text-blue-100 transition-colors hover:bg-blue-800 hover:text-white lg:hidden"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>


      {/* Mobile navigation */}
      {isMobileOpen && (
        <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-blue-500/30 bg-blue-950 px-4 py-4 lg:hidden">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-4 last:mb-0">
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-blue-200/70">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'border border-blue-400/40 bg-blue-600 text-white'
                        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="border-t border-blue-500/30 pt-4">
            <Link
              to="/"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-blue-100 transition-colors hover:bg-blue-800 hover:text-white"
            >
              <Home className="h-4 w-4" />
              Back to Site
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default AdminNavbar;

