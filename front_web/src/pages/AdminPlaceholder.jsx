import React from 'react';
import { Terminal, AlertCircle, Cpu, Zap, Shield, Activity } from 'lucide-react';
import { motion } from 'motion/react';


const AdminPlaceholder = ({ title, subtitle }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-lg">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 relative group"
        >
          <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <Terminal className="w-10 h-10 text-white/20 group-hover:text-white transition-colors" />
        </motion.div>
        
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Module_Status: Under_Construction</span>
        </div>
        
        <h1 className="text-4xl font-display font-bold text-white tracking-tighter italic serif mb-4">
          {title.toUpperCase()}<span className="text-blue-500">_</span>
        </h1>
        
        <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed mb-12">
          {subtitle || "This operational module is currently being initialized. Please check back after the next system synchronization."}
        </p>

        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Cpu, label: 'Core_Sync' },
            { icon: Zap, label: 'Power_Grid' },
            { icon: Shield, label: 'Sec_Layer' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
              <item.icon className="w-4 h-4 text-white/20" />
              <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPlaceholder;

