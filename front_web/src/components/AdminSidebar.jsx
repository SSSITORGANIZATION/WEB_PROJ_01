import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Users,
  BookOpen, FileText, Settings,
  LogOut, ChevronRight, ChevronLeft, BarChart3,
  MessageSquare, Calendar, Shield,
  Home, MapPin, Phone
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuSections = [
    {
      title: 'Main',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Briefcase, label: 'Projects', path: '/admin/projects' },
        { icon: Users, label: 'Developers', path: '/admin/developers' },
        { icon: BookOpen, label: 'Resources', path: '/admin/resources' },
      ]
    },
    {
      title: 'Content',
      items: [
        { icon: FileText, label: 'Documentation', path: '/admin/documentation' },
        { icon: MessageSquare, label: 'Manage Reviews', path: '/admin/reviews' },
        { icon: Calendar, label: 'Demos', path: '/admin/demos' },
      ]
    },
    {
      title: 'Management',
      items: [
        { icon: Briefcase, label: 'Hiring', path: '/admin/hiring' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        { icon: Shield, label: 'Security', path: '/admin/security' },
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

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open admin navigation"
        className="fixed left-4 top-4 z-40 rounded-lg bg-blue-700 p-2 text-white shadow-lg md:hidden"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
        />
      )}

      <aside className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-blue-500/30 bg-blue-950 text-white shadow-xl transition-all duration-300 md:sticky md:z-auto ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Header */}
        <div className={`border-b border-blue-500/30 ${isCollapsed ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center justify-between gap-2">
            <Link to="/admin" className="flex min-w-0 items-center gap-3 group transition-all" onClick={() => setIsMobileOpen(false)}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-950/40 transition-transform group-hover:scale-110">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && <div>
                <span className="text-lg font-bold tracking-tight text-white">ADMIN</span>
                <p className="text-xs font-medium uppercase tracking-wide text-blue-200">Control Panel</p>
              </div>
              }
            </Link>
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden shrink-0 rounded-lg p-2 text-blue-100 transition-colors hover:bg-blue-800 hover:text-white md:block"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto custom-scrollbar ${isCollapsed ? 'p-3' : 'p-4'}`}>
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? 'mt-8' : ''}>
              {!isCollapsed && <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-blue-200/70">{section.title}</h3>}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      title={isCollapsed ? item.label : undefined}
                      className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all ${isActive
                        ? 'border border-blue-400/40 bg-blue-600 text-white shadow-sm'
                        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-blue-200 group-hover:text-white'
                          }`} />
                        {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                      </div>
                      {isActive && !isCollapsed && (
                        <ChevronRight className="w-4 h-4 text-blue-600" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Back to Site */}
          <div className="mt-8 border-t border-blue-500/30 pt-8">
            <Link
              to="/"
              onClick={() => setIsMobileOpen(false)}
              title={isCollapsed ? 'Back to Site' : undefined}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-blue-100 transition-all hover:bg-blue-800 hover:text-white"
            >
              <Home className="h-4 w-4 text-blue-200 transition-colors group-hover:text-white" />
              {!isCollapsed && <span className="text-sm font-medium">Back to Site</span>}
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-blue-500/30 p-4">
          <button
            onClick={handleSignOut}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-blue-100 transition-all hover:bg-red-500/20 hover:text-red-200"
            title={isCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="h-4 w-4 text-blue-200 transition-colors group-hover:text-red-200" />
            {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>

        <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
      `}</style>
      </aside>
    </>
  );
};

export default AdminSidebar;
