import React from 'react';
import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Shield,
  Cpu,
  Globe,
  Terminal,
  Server,
  Database,
  BarChart3,
  Plus,
  Layout
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const stats = [
    { label: 'Active Projects', value: '24', change: '+2', icon: Briefcase, color: 'text-indigo-500' },
    { label: 'System Load', value: '18.4%', change: '-2.1%', icon: Activity, color: 'text-indigo-400' },
    { label: 'Security Score', value: '98/100', change: 'Stable', icon: Shield, color: 'text-indigo-300' },
    { label: 'Active Users', value: '1,284', change: '+124', icon: Users, color: 'text-indigo-200' },
  ];

  const chartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 1100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Layout className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="h-px w-10 bg-white/10" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.3em]">System_Intelligence</span>
          </div>
          <h1 className="text-4xl font-display font-light text-white tracking-tight leading-none">
            SYSTEM_OVERVIEW<span className="text-zinc-500">.</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] mt-3">
            Real-time performance and infrastructure metrics.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" />
            History_Logs
          </button>
          <button className="px-4 py-2 rounded-xl bg-white text-black text-[9px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            Generate_Report
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 group relative overflow-hidden rounded-[32px] border-white/5 hover:border-white/10 transition-all duration-500"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all duration-500">
                <stat.icon className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform duration-500`} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-widest ${stat.change.startsWith('+') ? 'text-emerald-400' : stat.change === 'Stable' ? 'text-zinc-400' : 'text-red-400'}`}>
                {stat.change.startsWith('+') ? <ArrowUpRight className="w-2.5 h-2.5" /> : stat.change.startsWith('-') ? <ArrowDownRight className="w-2.5 h-2.5" /> : null}
                {stat.change}
              </div>
            </div>
            <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5">{stat.label}</p>
            <p className="text-3xl font-display font-light text-white tracking-tight">{stat.value}</p>

            {/* Subtle background accent */}
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-white/[0.05] transition-all duration-700" />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[40px] border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div>
              <h3 className="text-2xl font-display font-light text-white mb-1.5 tracking-tight">Network Throughput</h3>
              <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Real-time Data Flow (Gbps)</p>
            </div>
            <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
              {['1H', '24H', '7D'].map(t => (
                <button key={t} className={`px-4 py-1.5 rounded-xl text-[9px] font-bold transition-all tracking-widest ${t === '24H' ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', padding: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 700 }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Quick Actions & Status */}
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[32px] border-white/5">
            <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-white/5 text-zinc-400 border border-white/10">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              Infrastructure_Health
            </h3>
            <div className="space-y-8">
              {[
                { label: 'CPU Cluster A', value: 42, color: 'bg-white' },
                { label: 'Memory Pool', value: 68, color: 'bg-zinc-400' },
                { label: 'Storage Array', value: 24, color: 'bg-zinc-600' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-3">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.15em]">{item.label}</span>
                    <span className="text-[9px] font-bold text-white tracking-widest">{item.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${item.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 rounded-[32px] border-white/5">
            <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-white/5 text-zinc-400 border border-white/10">
                <Zap className="w-3.5 h-3.5" />
              </div>
              Quick_Protocols
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Flush Cache', icon: Terminal },
                { icon: Server, label: 'Restart Node' },
                { icon: Database, label: 'Backup DB' },
                { icon: Globe, label: 'Sync Edge' },
              ].map((action) => (
                <button key={action.label} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all group">
                  <action.icon className="w-4 h-4 text-zinc-600 group-hover:text-white mb-3 transition-all duration-500" />
                  <span className="text-[8px] font-bold text-zinc-600 group-hover:text-white uppercase tracking-[0.15em] text-center transition-colors">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 glass-card rounded-[40px] border-white/10 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xl">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-xs font-bold text-white tracking-tight">Security Protocol</p>
                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Active: Level 4</p>
              </div>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed mb-8 font-medium">
              All systems are operating under verified encryption. Next automated audit scheduled in 4 hours.
            </p>
            <button className="w-full py-3 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all">
              Run Security Audit
            </button>

            {/* Decorative element */}
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Terminal className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card p-8 rounded-[40px] border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <h3 className="text-2xl font-display font-light text-white flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-white/5 text-zinc-400 border border-white/10">
              <Activity className="w-5 h-5" />
            </div>
            Recent_Activity
          </h3>
          <button className="text-[9px] font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-[0.2em] border-b border-transparent hover:border-white/20 pb-0.5">View_All_Logs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-6 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="pb-6 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Event_Type</th>
                <th className="pb-6 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Source_Node</th>
                <th className="pb-6 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Status_Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { time: '10:24:12', event: 'Database synchronization', source: 'Node_04', status: 'Completed' },
                { time: '10:22:05', event: 'Auth token refresh', source: 'Auth_Srv', status: 'Completed' },
                { time: '10:18:45', event: 'SSL certificate renewal', source: 'Edge_Proxy', status: 'Pending' },
                { time: '10:15:30', event: 'Cache purge request', source: 'CDN_Node', status: 'Completed' },
              ].map((log, i) => (
                <tr key={i} className="group hover:bg-white/[0.01] transition-all duration-500">
                  <td className="py-6 text-[10px] text-zinc-500 font-bold font-mono tracking-widest">{log.time}</td>
                  <td className="py-6 text-xs font-bold text-white tracking-tight">{log.event}</td>
                  <td className="py-6 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.15em]">{log.source}</td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                      <span className={`text-[9px] font-bold uppercase tracking-[0.15em] ${log.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}`}>{log.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

