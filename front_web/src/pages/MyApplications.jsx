import React from 'react';
import { Search, Filter, Briefcase, CheckCircle2, Clock, Eye, XCircle } from 'lucide-react';
import { APPLICATIONS } from '../constants';
import { motion } from 'motion/react';

const MyApplications = () => {
  const stats = [
    { label: 'Total', value: 1, color: 'bg-purple-600', icon: Briefcase },
    { label: 'Submitted', value: 0, color: 'bg-orange-500', icon: Clock },
    { label: 'Viewed', value: 0, color: 'bg-blue-500', icon: Eye },
    { label: 'Selected', value: 1, color: 'bg-green-500', icon: CheckCircle2 },
  ];

  return (
    <div className="pb-10">
      <section className="py-8 bg-slate-900/50 border-b border-white/5 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-orange-900/20 rounded-xl flex items-center justify-center">
              <Briefcase className="text-orange-500 w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white">My Applications</h1>
          </div>
          <p className="text-slate-500 text-sm">Track your job application journey</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.label} className={`${stat.color} rounded-2xl p-6 relative overflow-hidden group`}>
              <div className="absolute top-3 right-3 text-white/20 group-hover:scale-110 transition-transform">
                <stat.icon className="w-10 h-10" />
              </div>
              <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search by job title or skills..."
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm text-white focus:outline-none"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {['All (1)', 'Submitted (0)', 'Viewed (0)', 'Selected (1)', 'Rejected (0)'].map(filter => (
                <button 
                  key={filter}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                    filter.includes('All') ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="grid lg:grid-cols-3 gap-6">
          {APPLICATIONS.map(app => (
            <motion.div 
              key={app.id}
              whileHover={{ y: -5 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg text-white mb-0.5">{app.title}</h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                    <Clock className="w-3 h-3" />
                    {app.date}
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {app.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-2">Skills Required</p>
                  <div className="flex flex-wrap gap-1.5">
                    {app.skills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] rounded-lg border border-blue-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative pt-2">
                  <div className="flex justify-between items-center relative z-10">
                    {[
                      { label: 'Submitted', active: true },
                      { label: 'Viewed', active: true },
                      { label: 'Action', active: true },
                      { label: 'Result', active: true },
                    ].map((step, i) => (
                      <div key={step.label} className="flex flex-col items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          step.active ? 'bg-blue-600' : 'bg-slate-800'
                        }`}>
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-[7px] text-slate-500 uppercase font-bold text-center max-w-[40px]">{step.label}</span>
                      </div>
                    ))}
                  </div>
                  {/* Connecting Line */}
                  <div className="absolute top-4.5 left-6 right-6 h-0.5 bg-blue-600/30 -z-0" />
                  <div className="absolute top-4.5 left-6 w-full h-0.5 bg-blue-600 -z-0" />
                </div>

                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                  View Details
                  <Filter className="w-3 h-3 rotate-180" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;

