import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  BriefcaseBusiness,
  BookOpen,
  ChevronDown,
  Compass,
  FileText,
  FolderKanban,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  ReceiptText,
  Shield,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';

import { useAuth } from '../auth/authContext.jsx';
import { authService } from '../services/authService';
import { apiService } from '../services/api';
import { AnimatedText } from './AnimatedText';

const navigationGroups = [
  {
    title: 'Explore',
    icon: Compass,
    links: [
      {
        label: 'Projects',
        description: 'Explore our work',
        to: '/projects',
        icon: FolderKanban,
      },
      {
        label: 'Developers',
        description: 'Meet the team',
        to: '/developers',
        icon: Users,
      },
      {
        label: 'Documentation',
        description: 'Technical guides',
        to: '/documentation',
        icon: BookOpen,
      },
    ],
  },
  {
    title: 'Community',
    icon: Users,
    links: [
      {
        label: 'Reviews',
        description: 'Client experiences',
        to: '/reviews',
        icon: MessageSquareQuote,
      },
      {
        label: 'Careers',
        description: 'Join our team',
        to: '/hiring',
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    title: 'Company',
    icon: BriefcaseBusiness,
    links: [
      {
        label: 'About us',
        description: 'Who we are',
        to: '/about',
        icon: Users,
      },
      {
        label: 'Contact',
        description: 'Talk to our team',
        to: '/contact',
        icon: Mail,
      },
    ],
  },
];

const getLinkPath = (to) => to.split('?')[0];

const isLinkActive = (to, location) => {
  if (location.pathname !== getLinkPath(to)) return false;

  const query = to.split('?')[1];

  return query
    ? location.search.includes(query)
    : !location.search;
};

const isGroupActive = (group, location) =>
  group.links.some((link) => isLinkActive(link.to, location));

const NavGroup = ({
  group,
  location,
  open,
  onToggle,
  onNavigate,
  transparent = false,
}) => {
  const Icon = group.icon;
  const active = isGroupActive(group, location);

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onToggle(false);
        }}
        className={
          transparent
            ? `inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold uppercase tracking-[0.15em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                active || open
                  ? 'text-white'
                  : 'text-white hover:text-blue-100'
              }`
            : `inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                active || open
                  ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-inner'
                  : 'border-transparent text-gray-700 hover:border-gray-200 hover:bg-gray-50 hover:text-blue-700'
              }`
        }
      >
        <Icon className="h-4 w-4" aria-hidden="true" />

        {group.title}

        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={`absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border p-1.5 shadow-xl ${
              transparent
                ? 'border-white/20 bg-blue-950/90 text-white shadow-blue-950/25 backdrop-blur-xl'
                : 'border-gray-200 bg-white text-gray-900 shadow-gray-900/10'
            }`}
          >
            {group.links.map((link) => {
              const LinkIcon = link.icon;
              const linkActive = isLinkActive(link.to, location);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onNavigate}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors ${
                    transparent
                      ? linkActive
                        ? 'bg-white/20 text-white'
                        : 'text-white hover:bg-white/10 hover:text-blue-100'
                      : linkActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                      transparent
                        ? 'border-white/15 bg-white/10'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <LinkIcon
                      className={`h-4 w-4 ${
                        transparent ? 'text-sky-200' : 'text-blue-600'
                      }`}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">
                      {link.label}
                    </span>
                    <span
                      className={`block truncate text-[11px] ${
                        transparent ? 'text-white/60' : 'text-gray-500'
                      }`}
                    >
                      {link.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = ({ transparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [openMobileGroup, setOpenMobileGroup] = useState(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  const { user, isAuthenticated, clearAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setOpenGroup(null);
    setOpenMobileGroup(null);
    setIsAccountOpen(false);
  }, [location]);

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
    await authService.signOut();
    navigate('/');
  };

  const toggleGroup = (title, nextOpen) => {
    setOpenGroup((current) => {
      if (typeof nextOpen === 'boolean') {
        return nextOpen ? title : null;
      }

      return current === title ? null : title;
    });
  };

  const userRole = isAuthenticated ? 'customer' : null;

  const mobileLinkClass = (to) =>
    `flex items-center justify-between rounded-lg border px-2.5 py-2 text-sm font-semibold transition-colors ${
      transparent
        ? `border-white/15 text-white ${
            isLinkActive(to, location)
              ? 'bg-white/20'
              : 'bg-white/5 hover:bg-white/15'
          }`
        : `border-gray-200 text-gray-700 ${
            isLinkActive(to, location)
              ? 'bg-blue-50 text-blue-700'
              : 'bg-white hover:bg-gray-50 hover:text-blue-700'
          }`
    }`;

  // Resources is now a direct link, not a dropdown.
  const resourcesActive =
    location.pathname === '/resources';

  const directLinkClass = (active) =>
    transparent
      ? `inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold uppercase tracking-[0.15em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
          active ? 'text-white' : 'text-white hover:text-blue-100'
        }`
      : `inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          active
            ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-inner'
            : 'border-transparent text-gray-700 hover:border-gray-200 hover:bg-gray-50 hover:text-blue-700'
        }`;

  return (
    <nav
      aria-label="Main navigation"
      className={`relative z-50 w-full ${transparent ? '' : 'pb-2'}`}
      style={
        transparent
          ? { fontFamily: "'Open Sans', sans-serif" }
          : undefined
      }
    >
      <motion.div
        {...(!transparent && {
          animate: {
            boxShadow: [
              '0 8px 24px rgba(29, 78, 216, 0.30), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -2px 0 rgba(30,64,175,0.18)',
              '0 12px 34px rgba(37, 99, 235, 0.48), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 0 rgba(30,64,175,0.22)',
              '0 8px 24px rgba(29, 78, 216, 0.30), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -2px 0 rgba(30,64,175,0.18)',
            ],
            y: [0, -1, 0],
          },
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        })}
        className={
          transparent
            ? 'w-full'
            : 'w-full border-b border-gray-200 bg-white'
        }
      >
        <div
          className={`mx-auto flex w-full max-w-none items-center justify-between gap-3 px-6 sm:px-8 lg:px-12 ${
            transparent
              ? 'min-h-[64px] py-4'
              : 'min-h-[56px] px-4 sm:px-6 lg:px-8'
          }`}
        >
          {/* Brand */}
          <Link
            to="/"
            className={`flex min-w-0 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 ${
              transparent
                ? 'focus-visible:ring-white/80'
                : 'focus-visible:ring-blue-500'
            }`}
          >
            {siteSettings?.logo && (
              <img
                src={siteSettings.logo}
                alt=""
                className="h-8 w-8 shrink-0 rounded-lg object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            )}

            <AnimatedText
              text={siteSettings?.heading || 'SA Technologies'}
              className={`max-w-[150px] sm:max-w-none ${
                transparent ? 'text-white' : 'text-gray-900'
              }`}
              fontFamily="'Inter', sans-serif"
              fontWeight={700}
              delay={0.04}
            />
          </Link>

          {/* Desktop navigation */}
          <div
            className={`hidden items-center lg:flex ${
              transparent
                ? 'gap-1'
                : 'gap-0.5 rounded-full border border-gray-200 bg-gray-50 p-1'
            }`}
          >
            {navigationGroups.slice(0, 1).map((group) => (
              <NavGroup
                key={group.title}
                group={group}
                location={location}
                open={openGroup === group.title}
                onToggle={(nextOpen) =>
                  toggleGroup(group.title, nextOpen)
                }
                onNavigate={() => setOpenGroup(null)}
                transparent={transparent}
              />
            ))}

            {/* Resources: direct navigation to All Resources */}
            <Link
              to="/resources"
              aria-current={resourcesActive ? 'page' : undefined}
              className={directLinkClass(resourcesActive)}
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Resources
            </Link>

            {navigationGroups.slice(1).map((group) => (
              <NavGroup
                key={group.title}
                group={group}
                location={location}
                open={openGroup === group.title}
                onToggle={(nextOpen) =>
                  toggleGroup(group.title, nextOpen)
                }
                onNavigate={() => setOpenGroup(null)}
                transparent={transparent}
              />
            ))}
          </div>

          {/* Login, account and mobile menu */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={isAccountOpen}
                  onClick={() =>
                    setIsAccountOpen((open) => !open)
                  }
                  className={`flex items-center gap-2 rounded-full border py-0.5 pl-2.5 pr-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                    transparent
                      ? 'border-white/25 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20 focus-visible:ring-white/80'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-blue-500'
                  }`}
                >
                  <span className="hidden max-w-24 truncate text-xs font-medium sm:block">
                    {user.name
                      ? user.name.split(' ')[0]
                      : user.email?.split('@')[0]}
                  </span>

                  <span
                    className={`flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border ${
                      transparent
                        ? 'border-white/20 bg-white/15'
                        : 'border-gray-200 bg-gray-100'
                    }`}
                  >
                    {user.avatar_url || user.photoURL ? (
                      <img
                        src={user.avatar_url || user.photoURL}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                </button>

                <AnimatePresence>
                  {isAccountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className={`absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border p-1.5 shadow-xl ${
                        transparent
                          ? 'border-white/20 bg-blue-950/90 text-white shadow-blue-950/25 backdrop-blur-xl'
                          : 'border-gray-200 bg-white text-gray-900 shadow-gray-900/10'
                      }`}
                    >
                      <div
                        className={`mb-1 border-b px-3 py-2 ${
                          transparent
                            ? 'border-white/10'
                            : 'border-gray-100'
                        }`}
                      >
                        <p
                          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                            transparent
                              ? 'text-white/55'
                              : 'text-gray-500'
                          }`}
                        >
                          Account
                        </p>
                        <p
                          className={`truncate text-xs ${
                            transparent
                              ? 'text-white/90'
                              : 'text-gray-700'
                          }`}
                        >
                          {user.email}
                        </p>
                      </div>

                      {userRole === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsAccountOpen(false)}
                          className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors ${
                            transparent
                              ? 'text-white/85 hover:bg-white/10 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                          }`}
                        >
                          <Shield
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                          Admin dashboard
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                          transparent
                            ? 'text-rose-200 hover:bg-rose-400/10'
                            : 'text-rose-600 hover:bg-rose-50'
                        }`}
                      >
                        <LogOut
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                        Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className={`flex items-center gap-1.5 px-2.5 py-2 text-sm font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 sm:px-3.5 ${
                  transparent
                    ? 'text-white hover:text-blue-100 focus-visible:ring-white/80'
                    : 'text-gray-700 hover:text-blue-700 focus-visible:ring-blue-500'
                }`}
              >
                <User className="h-4 w-4" aria-hidden="true" />
                Log in
              </Link>
            )}

            <Link
              to="/book-demo"
              className={`hidden items-center gap-1.5 px-2.5 py-2 text-sm font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 sm:px-3.5 sm:inline-flex ${
                transparent
                  ? 'text-white hover:text-blue-100 focus-visible:ring-white/80'
                  : 'text-gray-700 hover:text-blue-700 focus-visible:ring-blue-500'
              }`}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Book a demo
            </Link>

            <button
              type="button"
              aria-label={
                isOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen((open) => !open)}
              className={`rounded-lg border p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 lg:hidden ${
                transparent
                  ? 'border-white/70 bg-white/15 text-white backdrop-blur-xl hover:bg-white/25 focus-visible:ring-white/80'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-blue-500'
              }`}
            >
              {isOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`overflow-hidden border-t lg:hidden ${
                transparent
                  ? 'border-white/20 bg-blue-800/80 backdrop-blur-xl'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="max-h-[calc(100vh-5rem)] space-y-1.5 overflow-y-auto p-2.5 sm:p-3">
                {navigationGroups.slice(0, 1).map((group) => {
                  const Icon = group.icon;
                  const expanded = openMobileGroup === group.title;

                  return (
                    <section
                      className={`rounded-lg border p-1 ${
                        transparent
                          ? 'border-white/20 bg-white/10'
                          : 'border-gray-200 bg-white'
                      }`}
                      key={group.title}
                    >
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() =>
                          setOpenMobileGroup(
                            expanded ? null : group.title
                          )
                        }
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm font-semibold transition-colors ${
                          transparent
                            ? `text-white ${
                                isGroupActive(group, location) || expanded
                                  ? 'bg-white/20'
                                  : 'hover:bg-white/10'
                              }`
                            : `text-gray-700 ${
                                isGroupActive(group, location) || expanded
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'hover:bg-gray-50 hover:text-blue-700'
                              }`
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon
                            className={`h-4 w-4 ${
                              transparent
                                ? 'text-sky-200'
                                : 'text-blue-600'
                            }`}
                            aria-hidden="true"
                          />
                          {group.title}
                        </span>

                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            transparent
                              ? 'text-sky-200'
                              : 'text-blue-600'
                          } ${expanded ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 px-1 pb-1">
                              {group.links.map((link) => {
                                const LinkIcon = link.icon;

                                return (
                                  <Link
                                    key={link.to}
                                    to={link.to}
                                    className={mobileLinkClass(link.to)}
                                  >
                                    <span className="flex items-center gap-2.5">
                                      <LinkIcon
                                        className={`h-4 w-4 ${
                                          transparent
                                            ? 'text-sky-200'
                                            : 'text-blue-600'
                                        }`}
                                        aria-hidden="true"
                                      />
                                      {link.label}
                                    </span>

                                    {isLinkActive(link.to, location) && (
                                      <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>
                  );
                })}

                {/* Resources: direct link on mobile too */}
                <Link
                  to="/resources"
                  aria-current={resourcesActive ? 'page' : undefined}
                  className={mobileLinkClass('/resources')}
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen
                      className={`h-4 w-4 ${
                        transparent ? 'text-sky-200' : 'text-blue-600'
                      }`}
                      aria-hidden="true"
                    />
                    Resources
                  </span>

                  {resourcesActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                  )}
                </Link>

                {navigationGroups.slice(1).map((group) => {
                  const Icon = group.icon;
                  const expanded = openMobileGroup === group.title;

                  return (
                    <section
                      className={`rounded-lg border p-1 ${
                        transparent
                          ? 'border-white/20 bg-white/10'
                          : 'border-gray-200 bg-white'
                      }`}
                      key={group.title}
                    >
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() =>
                          setOpenMobileGroup(
                            expanded ? null : group.title
                          )
                        }
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm font-semibold transition-colors ${
                          transparent
                            ? `text-white ${
                                isGroupActive(group, location) || expanded
                                  ? 'bg-white/20'
                                  : 'hover:bg-white/10'
                              }`
                            : `text-gray-700 ${
                                isGroupActive(group, location) || expanded
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'hover:bg-gray-50 hover:text-blue-700'
                              }`
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon
                            className={`h-4 w-4 ${
                              transparent
                                ? 'text-sky-200'
                                : 'text-blue-600'
                            }`}
                            aria-hidden="true"
                          />
                          {group.title}
                        </span>

                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            transparent
                              ? 'text-sky-200'
                              : 'text-blue-600'
                          } ${expanded ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 px-1 pb-1">
                              {group.links.map((link) => {
                                const LinkIcon = link.icon;

                                return (
                                  <Link
                                    key={link.to}
                                    to={link.to}
                                    className={mobileLinkClass(link.to)}
                                  >
                                    <span className="flex items-center gap-2.5">
                                      <LinkIcon
                                        className={`h-4 w-4 ${
                                          transparent
                                            ? 'text-sky-200'
                                            : 'text-blue-600'
                                        }`}
                                        aria-hidden="true"
                                      />
                                      {link.label}
                                    </span>

                                    {isLinkActive(link.to, location) && (
                                      <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>
                  );
                })}

                <Link
                  to="/book-demo"
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-bold transition-colors sm:hidden ${
                    transparent
                      ? 'border-white/15 bg-white/5 text-white hover:bg-white/15 hover:text-blue-100'
                      : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Book a demo
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
};

export default Navbar;
