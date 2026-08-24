import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Users,
  BookOpen, FileText, Settings,
  LogOut, ChevronRight, BarChart3,
  MessageSquare, Calendar, Shield,
  TrendingUp, TrendingDown, ArrowUpRight,
  Plus, Search, Filter, MoreHorizontal,
  CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { apiService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {change}
      </div>
    </div>
    <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    developers: 0,
    resources: 0,
    applications: 0
  });
  const [recentDemos, setRecentDemos] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentDevelopers, setRecentDevelopers] = useState([]);
  const [recentResources, setRecentResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch real data from Django API
        const [projectsResponse, developersResponse, resourcesResponse, applicationsResponse, demosResponse] = await Promise.all([
          apiService.getProjects(),
          apiService.getDevelopers(),
          apiService.getResources(),
          apiService.getJobApplications(),
          apiService.getDemoBookings()
        ]);

        const projectsData = Array.isArray(projectsResponse.data) ? projectsResponse.data : (projectsResponse.data.results || projectsResponse.data);
        const developersData = Array.isArray(developersResponse.data) ? developersResponse.data : (developersResponse.data.results || developersResponse.data);
        const resourcesData = Array.isArray(resourcesResponse.data) ? resourcesResponse.data : (resourcesResponse.data.results || resourcesResponse.data);
        const applicationsData = Array.isArray(applicationsResponse.data) ? applicationsResponse.data : (applicationsResponse.data.results || applicationsResponse.data);
        const demosData = Array.isArray(demosResponse.data) ? demosResponse.data : (demosResponse.data.results || demosResponse.data);

        // Set real statistics
        setStats({
          projects: projectsData.length,
          developers: developersData.length,
          resources: resourcesData.length,
          applications: applicationsData.length
        });

        // Set recent demo bookings
        setRecentDemos(demosData.slice(0, 5).map(demo => ({
          id: demo.id,
          name: demo.name || demo.client_name || 'Unknown',
          company: demo.company || 'N/A',
          created_at: demo.created_at,
          scheduled_date: demo.scheduled_date,
          status: demo.status || 'pending'
        })));

        // Set recent job applications
        setRecentApps(applicationsData.slice(0, 5).map(app => ({
          id: app.id,
          full_name: app.full_name || app.name || 'Unknown',
          email: app.email,
          applied_at: app.applied_at || app.created_at,
          status: app.status || 'pending'
        })));

        // Set recent projects
        setRecentProjects(projectsData.slice(0, 3).map(project => ({
          id: project.id,
          title: project.title || project.name || 'Untitled Project',
          created_at: project.created_at,
          status: project.status || 'active'
        })));

        // Set recent developers
        setRecentDevelopers(developersData.slice(0, 3).map(dev => ({
          id: dev.id,
          name: dev.name || dev.full_name || 'Unknown',
          specialty: dev.specialty || dev.skills || 'General',
          joined_at: dev.created_at || dev.joined_at
        })));

        // Set recent resources
        setRecentResources(resourcesData.slice(0, 3).map(resource => ({
          id: resource.id,
          title: resource.title || resource.name || 'Untitled Resource',
          created_at: resource.created_at,
          type: resource.type || 'document'
        })));

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Set fallback values
        setStats({
          projects: 0,
          developers: 0,
          resources: 0,
          applications: 0
        });
        setRecentDemos([]);
        setRecentApps([]);
        setRecentProjects([]);
        setRecentDevelopers([]);
        setRecentResources([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">System Overview</h1>
              <p className="text-gray-600 text-sm">Real-time performance metrics and platform activity.</p>
            </div>

          </div>

          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl mb-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative px-6 py-12 sm:px-8 lg:px-12">
              <div className="max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                    Welcome Back, Admin
                  </h2>
                  <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                    Monitor your platform's performance, manage content, and track key metrics all in one place.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Active Projects" value={stats.projects} change="+12%" icon={Briefcase} trend="up" />
            <StatCard title="Elite Developers" value={stats.developers} change="+5%" icon={Users} trend="up" />
            <StatCard title="Knowledge Assets" value={stats.resources} change="+24%" icon={BookOpen} trend="up" />
            <StatCard title="Job Applications" value={stats.applications} change="+8%" icon={Briefcase} trend="up" />
          </div>

          {/* Recent Things Section */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-3 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" /> Recent Activity
                </h3>

              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Recent Projects */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" /> Latest Projects
                  </h4>
                  <div className="space-y-3">
                    {recentProjects.length > 0 ? recentProjects.map((project, index) => {
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
                      return (
                        <div key={project.id} className="flex items-center gap-2">
                          <div className={`w-2 h-2 ${colors[index % colors.length]} rounded-full animate-pulse`} />
                          <span className="text-sm text-gray-600">{project.title}</span>
                        </div>
                      );
                    }) : (
                      <div className="text-sm text-gray-500 italic">No recent projects</div>
                    )}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" /> New Developers
                  </h4>
                  <div className="space-y-3">
                    {recentDevelopers.length > 0 ? recentDevelopers.map((dev, index) => {
                      const colors = ['bg-purple-500', 'bg-indigo-500', 'bg-cyan-500'];
                      return (
                        <div key={dev.id} className="flex items-center gap-2">
                          <div className={`w-2 h-2 ${colors[index % colors.length]} rounded-full animate-pulse`} />
                          <span className="text-sm text-gray-600">{dev.name} - {dev.specialty}</span>
                        </div>
                      );
                    }) : (
                      <div className="text-sm text-gray-500 italic">No recent developers</div>
                    )}
                  </div>
                </div>

                {/* Recent Resources */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" /> New Resources
                  </h4>
                  <div className="space-y-3">
                    {recentResources.length > 0 ? recentResources.map((resource, index) => {
                      const colors = ['bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
                      return (
                        <div key={resource.id} className="flex items-center gap-2">
                          <div className={`w-2 h-2 ${colors[index % colors.length]} rounded-full animate-pulse`} />
                          <span className="text-sm text-gray-600">{resource.title}</span>
                        </div>
                      );
                    }) : (
                      <div className="text-sm text-gray-500 italic">No recent resources</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-1 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/admin/demos')}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" /> Recent Demo Requests
                  </h3>
                  <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide flex items-center gap-1">
                    Click to view all <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-3">
                  {recentDemos.length > 0 ? recentDemos.map((demo) => (
                    <div key={demo.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl group hover:border-blue-300 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 group-hover:scale-110 transition-transform">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold text-sm">{demo.name}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{demo.company} • {new Date(demo.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm text-gray-900 font-semibold">{demo.scheduled_date ? new Date(demo.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Scheduled</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${demo.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          demo.status === 'confirmed' ? 'bg-green-100 text-green-700 border border-green-200' :
                            'bg-gray-200 text-gray-700 border border-gray-300'
                          }`}>
                          {demo.status}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="py-6 text-center text-gray-500 italic text-sm">No recent demo requests.</div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" /> Recent Applications
                  </h3>

                </div>

                <div className="space-y-3">
                  {recentApps.length > 0 ? recentApps.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl group hover:border-blue-300 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 group-hover:scale-110 transition-transform">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold text-sm">{app.full_name}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{app.email} • {new Date(app.applied_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          app.status === 'hired' ? 'bg-green-100 text-green-700 border border-green-200' :
                            'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="py-6 text-center text-gray-500 italic text-sm">No recent applications.</div>
                  )}
                </div>
              </div>
            </div>


          </div>
        </div>
      </main>
    </div>
  );
};

const User = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

export default AdminDashboard;

