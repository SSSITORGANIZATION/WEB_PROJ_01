import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Mail,
  CheckCircle2,
  X,
  Users,
  Terminal,
  Shield,
  Zap,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminDevelopers = () => {
  const [developers, setDevelopers] = useState([
    {
      id: 1,
      name: 'ALEX_RIVERA',
      role: 'SENIOR_ARCHITECT',
      status: 'ACTIVE',
      email: 'alex.r@cyber.net',
      skills: ['RUST', 'WASM', 'K8S'],
      image: 'https://picsum.photos/seed/dev1/200/200',
      clearance: 'LEVEL_5'
    },
    {
      id: 2,
      name: 'SARAH_CHEN',
      role: 'AI_ENGINEER',
      status: 'ACTIVE',
      email: 's.chen@cyber.net',
      skills: ['PYTORCH', 'CUDA', 'NLP'],
      image: 'https://picsum.photos/seed/dev2/200/200',
      clearance: 'LEVEL_4'
    },
    {
      id: 3,
      name: 'MARCUS_VOGEL',
      role: 'SECURITY_OPERATIVE',
      status: 'ON_LEAVE',
      email: 'm.vogel@cyber.net',
      skills: ['PENTEST', 'CRYPTO', 'GO'],
      image: 'https://picsum.photos/seed/dev3/200/200',
      clearance: 'LEVEL_5'
    },
    {
      id: 4,
      name: 'ELENA_KROSS',
      role: 'UI_SPECIALIST',
      status: 'ACTIVE',
      email: 'e.kross@cyber.net',
      skills: ['REACT', 'THREEJS', 'GLSL'],
      image: 'https://picsum.photos/seed/dev4/200/200',
      clearance: 'LEVEL_3'
    },
  ]);

  const [editingDev, setEditingDev] = useState < any > (null);
  const [notification, setNotification] = useState < string | null > (null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('DECOMMISSION_OPERATIVE: ARE_YOU_SURE?')) {
      setDevelopers(developers.filter(d => d.id !== id));
      showNotification('OPERATIVE_DECOMMISSIONED');
    }
  };

  const handleEdit = (dev: any) => {
    setEditingDev({ ...dev });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setDevelopers(developers.map(d => d.id === editingDev.id ? editingDev : d));
    setEditingDev(null);
    showNotification('OPERATIVE_DOSSIER_UPDATED');
  };

  return (
    <div className="space-y-8 relative pb-20">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-24 right-8 z-50 px-6 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-2xl flex items-center gap-3"
          >
            <Shield className="w-4 h-4" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingDev && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingDev(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bento-card p-10 border-white/10"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tighter italic serif">Update Dossier</h2>
                  <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold mt-1">Operative ID</p>
                </div>
                <button onClick={() => setEditingDev(null)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={saveEdit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Operative Name</label>
                  <input
                    type="text"
                    value={editingDev.name}
                    onChange={e => setEditingDev({ ...editingDev, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-blue-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Designation</label>
                  <input
                    type="text"
                    value={editingDev.role}
                    onChange={e => setEditingDev({ ...editingDev, role: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-blue-500/50 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Status</label>
                    <select
                      value={editingDev.status}
                      onChange={e => setEditingDev({ ...editingDev, status: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-blue-500/50 outline-none transition-all appearance-none"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="ON_LEAVE">ON_LEAVE</option>
                      <option value="TERMINATED">TERMINATED</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Clearance</label>
                    <select
                      value={editingDev.clearance}
                      onChange={e => setEditingDev({ ...editingDev, clearance: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-blue-500/50 outline-none transition-all appearance-none"
                    >
                      <option value="LEVEL_1">LEVEL_1</option>
                      <option value="LEVEL_2">LEVEL_2</option>
                      <option value="LEVEL_3">LEVEL_3</option>
                      <option value="LEVEL_4">LEVEL_4</option>
                      <option value="LEVEL_5">LEVEL_5</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-white text-black rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all shadow-2xl">
                  UPDATE_CENTRAL_DOSSIER
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="h-px w-12 bg-white/10" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Personnel_Management</span>
          </div>
          <h1 className="text-5xl font-display font-light text-white tracking-tight leading-none">
            ELITE_OPERATIVES<span className="text-zinc-500">.</span>
          </h1>
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-4 max-w-md">
            Human capital management for high-stakes engineering and security operations.
          </p>
        </div>
        <button className="btn-primary flex items-center gap-3">
          <Plus className="w-4 h-4" />
          Recruit_New_Operative
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-6 flex flex-col md:flex-row gap-6 border-white/5 rounded-[32px]">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="SEARCH_OPERATIVE_DATABASE..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-16 pr-8 py-5 text-white font-mono text-[10px] focus:border-white/20 outline-none transition-all tracking-widest"
          />
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-5 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all flex items-center gap-3">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="flex items-center gap-4 px-8 py-5 bg-white/5 border border-white/5 rounded-2xl">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Personnel_Synced</span>
          </div>
        </div>
      </div>

      {/* Operatives List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {developers.map((dev, i) => (
            <motion.div
              layout
              key={dev.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-8 group hover:bg-white/[0.02] transition-all duration-500 flex flex-col lg:flex-row lg:items-center gap-10 rounded-[40px] border-white/5"
            >
              <div className="flex items-center gap-8 lg:w-1/3">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[24px] overflow-hidden border border-white/10 bg-black">
                    <img
                      src={dev.image}
                      alt={dev.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md ${dev.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-display font-light text-white tracking-tight group-hover:text-zinc-300 transition-colors">{dev.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2">{dev.role}</p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-10">
                <div>
                  <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-[0.3em] mb-3">Clearance_Level</p>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-400 tracking-widest uppercase">{dev.clearance}</span>
                </div>
                <div>
                  <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-[0.3em] mb-3">Core_Specialization</p>
                  <div className="flex flex-wrap gap-3">
                    {dev.skills.map(skill => (
                      <span key={skill} className="text-[10px] text-zinc-400 font-mono tracking-tighter">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-[0.3em] mb-3">Communication_Nodes</p>
                  <div className="flex gap-5">
                    <Mail className="w-4 h-4 text-zinc-600 hover:text-white transition-all cursor-pointer" />
                    <Github className="w-4 h-4 text-zinc-600 hover:text-white transition-all cursor-pointer" />
                    <Linkedin className="w-4 h-4 text-zinc-600 hover:text-white transition-all cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 lg:border-l lg:border-white/5 lg:pl-10">
                <button
                  onClick={() => handleEdit(dev)}
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/10 transition-all duration-500"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(dev.id)}
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/10 transition-all duration-500">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDevelopers;

