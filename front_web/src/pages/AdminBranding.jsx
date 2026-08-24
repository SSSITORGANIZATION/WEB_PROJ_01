import React from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Type, 
  Palette, 
  Globe, 
  Layout, 
  Terminal,
  Cpu,
  Zap,
  Shield,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

const AdminBranding = () => {
  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-1 bg-white rounded-full" />
            <span className="text-[10px] font-medium text-white/40 uppercase tracking-[0.3em]">Identity System</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-white italic serif">
            Brand Configuration
          </h1>
          <p className="text-white/30 text-[11px] mt-2 uppercase tracking-[0.2em] max-w-md">
            Define the visual parameters and global messaging for the platform interface.
          </p>
        </div>
        <button className="btn-primary">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-10">
          {/* Hero Section Config */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Layout className="w-4 h-4 text-white/20" />
              <h3 className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">Hero Parameters</h3>
            </div>
            
            <div className="glass-card p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Main Headline</label>
                <input 
                  type="text" 
                  defaultValue="BUILDING THE FUTURE OF DIGITAL INFRASTRUCTURE"
                  className="input-field font-light text-lg"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Sub Headline</label>
                <textarea 
                  rows={3}
                  defaultValue="A decentralized infrastructure for the next generation of digital operatives. Secure, scalable, and fully autonomous."
                  className="input-field font-light text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Primary CTA</label>
                  <input type="text" defaultValue="Initialize System" className="input-field" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Secondary CTA</label>
                  <input type="text" defaultValue="View Documentation" className="input-field" />
                </div>
              </div>
            </div>
          </section>

          {/* Visual Assets */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <ImageIcon className="w-4 h-4 text-white/20" />
              <h3 className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">Asset Management</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8 space-y-6">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">System Logo</label>
                <div className="aspect-video rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center group cursor-pointer hover:bg-white/[0.04] transition-all duration-500">
                  <div className="w-12 h-12 bg-black border border-white/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                    <Terminal className="w-5 h-5 text-white/40" />
                  </div>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Upload SVG / PNG</span>
                </div>
              </div>
              
              <div className="glass-card p-8 space-y-6">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Favicon Package</label>
                <div className="aspect-video rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center group cursor-pointer hover:bg-white/[0.04] transition-all duration-500">
                  <div className="w-12 h-12 bg-black border border-white/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                    <Zap className="w-5 h-5 text-white/40" />
                  </div>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Update Package</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info & Preview */}
        <div className="space-y-10">
          {/* Real-time Preview */}
          <section className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-white/20" />
                <h3 className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">Interface Preview</h3>
              </div>
              <div className="flex gap-3">
                <Monitor className="w-3 h-3 text-white" />
                <Tablet className="w-3 h-3 text-white/20" />
                <Smartphone className="w-3 h-3 text-white/20" />
              </div>
            </div>
            
            <div className="glass-card p-1 overflow-hidden group">
              <div className="aspect-[4/3] rounded-xl bg-black p-8 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="w-12 h-1 bg-white/10 rounded-full" />
                  <div className="h-6 w-3/4 bg-white/5 rounded" />
                  <div className="h-3 w-1/2 bg-white/5 rounded" />
                  <div className="pt-6 flex gap-3">
                    <div className="h-8 w-24 bg-white/10 rounded-full" />
                    <div className="h-8 w-24 border border-white/5 rounded-full" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <button className="btn-secondary scale-90">
                    <ExternalLink className="w-4 h-4" />
                    Full Preview
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* System Info */}
          <div className="glass-card p-8 bg-white/[0.01]">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-4 h-4 text-white/40" />
              <h3 className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">Deployment Protocol</h3>
            </div>
            <p className="text-[11px] font-light text-white/40 leading-relaxed italic serif">
              Branding changes are propagated globally across all edge nodes. Deployment may take up to 120 seconds to fully synchronize with the production environment.
            </p>
            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/20 uppercase tracking-widest">Last Sync</span>
                <span className="text-white/60 font-mono">2026.03.28 05:29:38</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/20 uppercase tracking-widest">Operator</span>
                <span className="text-white/60 font-mono">SUDARSAN_ROOT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBranding;

