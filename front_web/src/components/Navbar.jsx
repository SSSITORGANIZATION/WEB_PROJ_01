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
  Wrench,
  X,
} from 'lucide-react';
import { useAuth } from '../auth/authContext.jsx';
import { authService } from '../services/authService';
import { apiService } from '../services/api';

const navigationGroups = [
  {
    title: 'Explore',
    icon: Compass,
    links: [
      { label: 'Projects', description: 'Explore our work', to: '/projects', icon: FolderKanban },
      { label: 'Developers', description: 'Meet the team', to: '/developers', icon: Users },
      { label: 'Documentation', description: 'Technical guides', to: '/documentation', icon: BookOpen },
    ],
  },
  {
    title: 'Resources',
    icon: BookOpen,
    links: [
      { label: 'All resources', description: 'Browse the library', to: '/resources', icon: FileText },
      { label: 'Blogs', description: 'News and insights', to: '/resources?category=BLOG', icon: FileText },
      { label: 'Guides', description: 'Helpful how-tos', to: '/resources?category=GUIDE', icon: BookOpen },
      { label: 'Tools', description: 'Calculators and utilities', to: '/tools', icon: Wrench },
      { label: 'Glossary', description: 'Technical terminology', to: '/resources?category=GLOSSARY', icon: ReceiptText },
    ],
  },
  {
    title: 'Community',
    icon: Users,
    links: [
      { label: 'Reviews', description: 'Client experiences', to: '/reviews', icon: MessageSquareQuote },
      { label: 'Careers', description: 'Join our team', to: '/hiring', icon: BriefcaseBusiness },
    ],
  },
  {
    title: 'Company',
    icon: BriefcaseBusiness,
    links: [
      { label: 'About us', description: 'Who we are', to: '/about', icon: Users },
      { label: 'Contact', description: 'Talk to our team', to: '/contact', icon: Mail },
    ],
  },
];

const getLinkPath = (to) => to.split('?')[0];

const isLinkActive = (to, location) => {
  if (location.pathname !== getLinkPath(to)) return false;
  const query = to.split('?')[1];
  return query ? location.search.includes(query) : !location.search;
};

const isGroupActive = (group, location) =>
  group.links.some((link) => isLinkActive(link.to, location));

const NavGroup = ({ group, location, open, onToggle, onNavigate }) => {
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
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
          active || open
            ? 'border-white/35 bg-white/20 text-white shadow-inner'
            : 'border-transparent text-white/85 hover:border-white/20 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {group.title}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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
            className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/20 bg-blue-950/90 p-1.5 text-white shadow-xl shadow-blue-950/25 backdrop-blur-xl"
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
                    linkActive ? 'bg-white/20 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10">
                    <LinkIcon className="h-3.5 w-3.5 text-sky-200" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold">{link.label}</span>
                    <span className="block truncate text-[10px] text-white/60">{link.description}</span>
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

const Navbar = () => {
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
      if (typeof nextOpen === 'boolean') return nextOpen ? title : null;
      return current === title ? null : title;
    });
  };

  const userRole = isAuthenticated ? 'customer' : null;
  const mobileLinkClass = (to) =>
    `flex items-center justify-between rounded-lg border border-white/15 px-2.5 py-2 text-xs font-semibold text-white/90 transition-colors ${
      isLinkActive(to, location) ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/15 hover:text-white'
    }`;

  return (
    <nav
      aria-label="Main navigation"
      className="relative z-50 w-full pb-2"
    >
      <motion.div
        animate={{
          boxShadow: [
            '0 8px 24px rgba(29, 78, 216, 0.30), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -2px 0 rgba(30,64,175,0.18)',
            '0 12px 34px rgba(37, 99, 235, 0.48), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 0 rgba(30,64,175,0.22)',
            '0 8px 24px rgba(29, 78, 216, 0.30), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -2px 0 rgba(30,64,175,0.18)',
          ],
          y: [0, -1, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-full border-y border-blue-100/80 bg-gradient-to-r from-blue-500/95 via-blue-400/95 to-sky-400/95 backdrop-blur-2xl"
      >
        <div className="mx-auto flex min-h-[56px] w-full max-w-none items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
            {siteSettings?.logo && (
              <img
                src={siteSettings.logo}
                alt=""
                className="h-8 w-8 shrink-0 rounded-lg object-contain"
                onError={(event) => { event.currentTarget.style.display = 'none'; }}
              />
            )}
            <span className="max-w-[150px] truncate text-sm font-bold tracking-tight text-white sm:max-w-none">
              {siteSettings?.heading || 'Sai Software Solutions'}
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 rounded-full border border-white/65 bg-blue-500/15 p-1 shadow-[inset_0_1px_3px_rgba(30,64,175,0.18)] lg:flex">
            {navigationGroups.map((group) => (
              <NavGroup
                key={group.title}
                group={group}
                location={location}
                open={openGroup === group.title}
                onToggle={(nextOpen) => toggleGroup(group.title, nextOpen)}
                onNavigate={() => setOpenGroup(null)}
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={isAccountOpen}
                  onClick={() => setIsAccountOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 py-0.5 pl-2.5 pr-0.5 text-white backdrop-blur-xl transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  <span className="hidden max-w-24 truncate text-xs font-medium sm:block">
                    {user.name ? user.name.split(' ')[0] : user.email?.split('@')[0]}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/15">
                    {user.avatar_url || user.photoURL
                      ? <img src={user.avatar_url || user.photoURL} alt="" className="h-full w-full object-cover" />
                      : <User className="h-4 w-4" aria-hidden="true" />}
                  </span>
                </button>
                <AnimatePresence>
                  {isAccountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/20 bg-blue-950/90 p-1.5 text-white shadow-xl shadow-blue-950/25 backdrop-blur-xl"
                    >
                      <div className="mb-1 border-b border-white/10 px-3 py-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">Account</p>
                        <p className="truncate text-xs text-white/90">{user.email}</p>
                      </div>
                      {userRole === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsAccountOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Shield className="h-4 w-4" aria-hidden="true" /> Admin dashboard
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-rose-200 transition-colors hover:bg-rose-400/10"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="rounded-full border border-white/70 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50 sm:px-3.5"
              >
                Log in
              </Link>
            )}

            <Link
              to="/book-demo"
              className="hidden items-center gap-1.5 rounded-full border border-white/80 bg-white px-3.5 py-2 text-[11px] font-bold text-blue-700 shadow-sm shadow-blue-900/15 transition-all hover:bg-blue-50 sm:inline-flex"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Book a demo
            </Link>

            <button
              type="button"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen((open) => !open)}
              className="rounded-lg border border-white/70 bg-white/15 p-1.5 text-white backdrop-blur-xl transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 lg:hidden"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-white/20 bg-blue-800/80 backdrop-blur-xl lg:hidden"
            >
              <div className="max-h-[calc(100vh-5rem)] space-y-1.5 overflow-y-auto p-2.5 sm:p-3">
                {navigationGroups.map((group) => {
                  const Icon = group.icon;
                  const expanded = openMobileGroup === group.title;

                  return (
                    <section key={group.title} className="rounded-lg border border-white/20 bg-white/10 p-1">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => setOpenMobileGroup(expanded ? null : group.title)}
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-xs font-semibold text-white/90 transition-colors ${
                          isGroupActive(group, location) || expanded ? 'bg-white/20 text-white' : 'hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="h-3.5 w-3.5 text-sky-200" aria-hidden="true" />
                          {group.title}
                        </span>
                        <ChevronDown className={`h-3.5 w-3.5 text-sky-200 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
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
                                  <Link key={link.to} to={link.to} className={mobileLinkClass(link.to)}>
                                    <span className="flex items-center gap-2.5">
                                      <LinkIcon className="h-3.5 w-3.5 text-sky-200" aria-hidden="true" />
                                      {link.label}
                                    </span>
                                    {isLinkActive(link.to, location) && <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />}
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
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/80 bg-white px-3 py-2.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50 sm:hidden"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Book a demo
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
