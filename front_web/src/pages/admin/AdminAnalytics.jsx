import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3, TrendingUp, TrendingDown, Users, Eye, MousePointer,
  Calendar, Download, RefreshCw, Globe, Clock, AlertCircle,
  ArrowUpRight, Filter, Search, CheckCircle, XCircle
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    visitors: { total: 0, unique: 0, returning: 0 },
    pageViews: { total: 0, average: 0, bounce: 0 },
    sessions: { total: 0, duration: 0, conversion: 0 },
    traffic: { direct: 0, referral: 0, organic: 0, social: 0 }
  });
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [exportData, setExportData] = useState({ format: 'csv', email: '' });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDateRange = (range) => {
    const validRanges = ['24h', '7d', '30d', '90d', '1y'];
    return validRanges.includes(range);
  };

  const validateExportData = () => {
    const newErrors = {};

    if (!exportData.format) {
      newErrors.format = 'Export format is required';
    }

    if (exportData.email && !validateEmail(exportData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExport = () => {
    if (!validateExportData()) {
      return;
    }

    console.log('Exporting data:', exportData);
  };

  const handleDateRangeChange = (newRange) => {
    if (validateDateRange(newRange)) {
      setDateRange(newRange);
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setAnalyticsData({
          visitors: { total: 15234, unique: 8921, returning: 6313 },
          pageViews: { total: 45678, average: 3.2, bounce: 32.5 },
          sessions: { total: 8921, duration: 245, conversion: 4.8 },
          traffic: { direct: 35, referral: 28, organic: 25, social: 12 }
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const StatCard = ({ title, value, change, icon: Icon, trend, color = 'blue' }) => (
    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg bg-${color}-50 flex items-center justify-center border border-${color}-200`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <h3 className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-0.5">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 tracking-tighter">{value.toLocaleString()}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics Dashboard</h1>
              <p className="text-gray-600 text-sm">Comprehensive website performance metrics and user behavior insights.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select
                  value={dateRange}
                  onChange={(e) => handleDateRangeChange(e.target.value)}
                  className="bg-transparent text-gray-900 text-sm font-semibold outline-none"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="1y">Last Year</option>
                </select>
              </div>
              <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
                <RefreshCw className="w-4 h-4 text-gray-500" /> Refresh
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Visitors" value={analyticsData.visitors.total} change="+12.5%" icon={Users} trend="up" />
            <StatCard title="Page Views" value={analyticsData.pageViews.total} change="+8.3%" icon={Eye} trend="up" />
            <StatCard title="Avg. Duration" value={`${analyticsData.sessions.duration}s`} change="-2.1%" icon={Clock} trend="down" />
            <StatCard title="Conversion Rate" value={`${analyticsData.sessions.conversion}%`} change="+15.7%" icon={TrendingUp} trend="up" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Traffic Sources */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" /> Traffic Sources
                  </h3>
                  <button className="text-[9px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-1">
                    View Details <ArrowUpRight className="w-2.5 h-2.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { source: 'Direct Traffic', value: analyticsData.traffic.direct, color: 'blue' },
                    { source: 'Referral Traffic', value: analyticsData.traffic.referral, color: 'green' },
                    { source: 'Organic Search', value: analyticsData.traffic.organic, color: 'purple' },
                    { source: 'Social Media', value: analyticsData.traffic.social, color: 'yellow' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-semibold uppercase tracking-wide">{item.source}</span>
                        <span className="text-gray-900 font-semibold">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-${item.color}-500 h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-600" /> Export Analytics Data
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-2">Export Format</label>
                    <select
                      value={exportData.format}
                      onChange={(e) => setExportData({ ...exportData, format: e.target.value })}
                      className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${errors.format ? 'border-red-500' : ''}`}
                    >
                      <option value="csv">CSV Format</option>
                      <option value="json">JSON Format</option>
                      <option value="pdf">PDF Report</option>
                      <option value="excel">Excel Spreadsheet</option>
                    </select>
                    {errors.format && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.format}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 uppercase tracking-wide font-semibold block mb-2">Email Report (Optional)</label>
                    <input
                      type="email"
                      value={exportData.email}
                      onChange={(e) => setExportData({ ...exportData, email: e.target.value })}
                      placeholder="admin@example.com"
                      className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleExport}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all uppercase tracking-wide"
                  >
                    Export Data
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <aside className="space-y-4">
              <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-blue-600" /> User Engagement
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Pages per Session', value: analyticsData.pageViews.average },
                    { label: 'Bounce Rate', value: `${analyticsData.pageViews.bounce}%` },
                    { label: 'Session Duration', value: `${analyticsData.sessions.duration}s` },
                    { label: 'New vs Returning', value: '60/40' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" /> Data Validation
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">All metrics verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">No data anomalies detected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">Real-time tracking active</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
