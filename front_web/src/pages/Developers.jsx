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
    whileHover={{ y: -4 }}
    className="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
  >
    {developer.is_featured && (
      <div className="absolute right-4 top-4 rounded-full border border-yellow-200 bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-600">
        <Crown className="mr-1 inline h-3 w-3" />
        Featured
      </div>
    )}

    <div className="relative w-36 h-36 mx-auto mb-6">
      <div className="absolute inset-0 rounded-full bg-blue-100 blur-2xl group-hover:blur-3xl transition-all duration-500" />
      <img
        src={developer.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`}
        alt={developer.name}
        className="relative z-10 h-full w-full rounded-full border-2 border-gray-200 object-cover transition-transform duration-300 group-hover:scale-105 shadow-lg"
      />
      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center z-20 shadow-lg">
        <UserCheck className="w-3 h-3 text-white" />
      </div>
    </div>

    <div className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900 transition-colors duration-300" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {developer.name}
      </h3>
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{developer.title}</p>

      <p className="line-clamp-2 px-2 text-sm leading-relaxed text-gray-600">
        {developer.bio}
      </p>
    </div>

    <div className="flex flex-wrap justify-center gap-2 mb-4 mt-4">
      {developer.skills?.split(',').slice(0, 3).map((skill, i) => (
        <span key={i} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          {skill.trim()}
        </span>
      ))}
      {developer.skills?.split(',').length > 3 && (
        <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
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
            className="h-10 w-10 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110"
          >
            <Github className="h-5 w-5" />
          </button>
        )}
        {developer.linkedin_link && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(developer.linkedin_link, '_blank', 'noopener,noreferrer');
            }}
            className="h-10 w-10 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110"
          >
            <Linkedin className="h-5 w-5" />
          </button>
        )}
        {developer.twitter_link && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(developer.twitter_link, '_blank', 'noopener,noreferrer');
            }}
            className="h-10 w-10 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110"
          >
            <Twitter className="h-5 w-5" />
          </button>
        )}
      </div>

      <Link
        to={`/developer/${developer.id}`}
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all duration-300"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white w-full">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Meet The <span className="text-blue-100">DevForge</span> Team
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-blue-100">
              Discover talented developers contributing to innovative projects and shaping the future of technology.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 pb-12">

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[450px] rounded-xl border border-gray-200 bg-white animate-pulse" />
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
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1.5">No developers found</h3>
            <p className="text-gray-600 text-sm">Try adjusting your search or filters to find the right talent.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Developers;

