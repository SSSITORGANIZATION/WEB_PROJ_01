import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Filter, Users, Github, Linkedin,
  Twitter, Star, Crown, Briefcase,
  Code, Globe, ArrowRight, UserCheck
} from 'lucide-react';
import { apiService } from '../services/api';
import { Link } from 'react-router-dom';

const DeveloperCard = ({ developer }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)" }}
    className="group relative bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center flex flex-col h-full transition-all duration-300 hover:border-white/20"
  >
    {developer.is_featured && (
      <div className="absolute top-4 right-4 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold">
        <Crown className="w-3 h-3 inline mr-1" />
        Featured
      </div>
    )}

    <div className="relative w-36 h-36 mx-auto mb-6">
      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
      <img
        src={developer.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`}
        alt={developer.name}
        className="w-full h-full rounded-full object-cover border-2 border-white/20 relative z-10 group-hover:scale-105 transition-transform duration-300 shadow-2xl"
      />
      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center z-20 shadow-lg">
        <UserCheck className="w-3 h-3 text-white" />
      </div>
    </div>

    <div className="space-y-3">
      <h3 className="text-xl font-bold text-white transition-colors duration-300" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {developer.name}
      </h3>
      <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">{developer.title}</p>
      
      <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 px-2">
        {developer.bio}
      </p>
    </div>

    <div className="flex flex-wrap justify-center gap-2 mb-4 mt-4">
      {developer.skills?.split(',').slice(0, 3).map((skill, i) => (
        <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-zinc-300 font-medium hover:bg-white/15 transition-colors">
          {skill.trim()}
        </span>
      ))}
      {developer.skills?.split(',').length > 3 && (
        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-500 font-medium">
          +{developer.skills.split(',').length - 3}
        </span>
      )}
    </div>

    <div className="flex-grow flex flex-col justify-end">
      <div className="flex items-center justify-center gap-3 mb-6">
        {developer.github_link && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(developer.github_link, '_blank', 'noopener,noreferrer');
            }}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110 border border-white/10"
          >
            <Github className="w-5 h-5" />
          </button>
        )}
        {developer.linkedin_link && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(developer.linkedin_link, '_blank', 'noopener,noreferrer');
            }}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110 border border-white/10"
          >
            <Linkedin className="w-5 h-5" />
          </button>
        )}
        {developer.twitter_link && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(developer.twitter_link, '_blank', 'noopener,noreferrer');
            }}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110 border border-white/10"
          >
            <Twitter className="w-5 h-5" />
          </button>
        )}
      </div>

      <Link
        to={`/developer/${developer.id}`}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300"
      >
        View Full Profile
      </Link>
    </div>
  </motion.div>
);

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [filteredDevs, setFilteredDevs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSkill, setActiveSkill] = useState('All');

  const topSkills = ['All', 'React', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker'];

  useEffect(() => {
    const fetchDevs = async () => {
      try {
        const response = await apiService.getDevelopers();
        const data = response.data;
        setDevelopers(data);
        setFilteredDevs(data);
      } catch (error) {
        console.error("Error fetching developers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevs();
  }, []);

  useEffect(() => {
    let filtered = developers;

    if (activeSkill !== 'All') {
      filtered = filtered.filter(dev =>
        dev.skills?.toLowerCase().includes(activeSkill.toLowerCase())
      );
    }

    if (search) {
      filtered = filtered.filter(dev =>
        dev.name.toLowerCase().includes(search.toLowerCase()) ||
        dev.title.toLowerCase().includes(search.toLowerCase()) ||
        dev.bio.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredDevs(filtered);
  }, [search, activeSkill, developers]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Meet The <span className="italic text-blue-500">DevForge</span> Team
            </h1>
          </motion.div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[450px] glass-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredDevs.map((dev) => (
                <DeveloperCard key={dev.id} developer={dev} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredDevs.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-zinc-700" />
            </div>
            <h3 className="text-xl font-bold text-white serif mb-1.5">No developers found</h3>
            <p className="text-zinc-500 text-sm">Try adjusting your search or filters to find the right talent.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Developers;

