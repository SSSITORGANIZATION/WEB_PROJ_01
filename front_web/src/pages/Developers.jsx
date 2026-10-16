
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Github,
  Linkedin,
  Twitter,
  Crown,
  UserCheck,
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

    <div className="relative mx-auto mb-6 h-36 w-36">
      <div className="absolute inset-0 rounded-full bg-blue-100 blur-2xl transition-all duration-500 group-hover:blur-3xl" />

      <img
        src={
          developer.profile_image ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            developer.name || 'Developer'
          )}`
        }
        alt={developer.name || 'Developer'}
        className="relative z-10 h-full w-full rounded-full border-2 border-gray-200 object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute bottom-2 right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-lg">
        <UserCheck className="h-3 w-3 text-white" />
      </div>
    </div>

    <div className="space-y-3">
      <h3
        className="text-xl font-semibold text-gray-900 transition-colors duration-300"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {developer.name}
      </h3>

      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
        {developer.title}
      </p>

      <p className="line-clamp-2 px-2 text-sm leading-relaxed text-gray-600">
        {developer.bio}
      </p>
    </div>

    <div className="mb-4 mt-4 flex flex-wrap justify-center gap-2">
      {(developer.skills || '')
        .split(',')
        .filter((skill) => skill.trim())
        .slice(0, 3)
        .map((skill, index) => (
          <span
            key={index}
            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            {skill.trim()}
          </span>
        ))}

      {(developer.skills || '').split(',').filter((skill) => skill.trim()).length > 3 && (
        <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
          +
          {(developer.skills || '')
            .split(',')
            .filter((skill) => skill.trim()).length - 3}
        </span>
      )}
    </div>

    <div className="flex flex-grow flex-col justify-end">
      <div className="mb-6 flex items-center justify-center gap-3">
        {developer.github_link && (
          <button
            type="button"
            aria-label={`${developer.name}'s GitHub profile`}
            onClick={() =>
              window.open(
                developer.github_link,
                '_blank',
                'noopener,noreferrer'
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all duration-300 hover:scale-110 hover:bg-gray-100 hover:text-gray-900"
          >
            <Github className="h-5 w-5" />
          </button>
        )}

        {developer.linkedin_link && (
          <button
            type="button"
            aria-label={`${developer.name}'s LinkedIn profile`}
            onClick={() =>
              window.open(
                developer.linkedin_link,
                '_blank',
                'noopener,noreferrer'
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all duration-300 hover:scale-110 hover:bg-gray-100 hover:text-gray-900"
          >
            <Linkedin className="h-5 w-5" />
          </button>
        )}

        {developer.twitter_link && (
          <button
            type="button"
            aria-label={`${developer.name}'s Twitter profile`}
            onClick={() =>
              window.open(
                developer.twitter_link,
                '_blank',
                'noopener,noreferrer'
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all duration-300 hover:scale-110 hover:bg-gray-100 hover:text-gray-900"
          >
            <Twitter className="h-5 w-5" />
          </button>
        )}
      </div>

      <Link
        to={`/developer/${developer.id}`}
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md"
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

  useEffect(() => {
    let isMounted = true;

    const fetchDevs = async () => {
      try {
        const response = await apiService.getDevelopers();
        const result = response?.data;
        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.results)
            ? result.results
            : [];

        if (isMounted) {
          setDevelopers(data);
          setFilteredDevs(data);
        }
      } catch (error) {
        console.error('Error fetching developers:', error);

        if (isMounted) {
          setDevelopers([]);
          setFilteredDevs([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDevs();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let filtered = [...developers];

    if (activeSkill !== 'All') {
      filtered = filtered.filter((dev) =>
        (dev.skills || '')
          .toLowerCase()
          .includes(activeSkill.toLowerCase())
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      filtered = filtered.filter((dev) =>
        [dev.name, dev.title, dev.bio].some((value) =>
          (value || '').toLowerCase().includes(query)
        )
      );
    }

    setFilteredDevs(filtered);
  }, [search, activeSkill, developers]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header — content matches the first version */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1
              className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              The People Behind <span className="text-blue-100">SA</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-blue-100">
              Meet the engineers building and shipping the products our clients
              rely on every day.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 pb-12">
        {/* Developer grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[450px] animate-pulse rounded-xl border border-gray-200 bg-white"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredDevs.map((dev) => (
                <DeveloperCard key={dev.id} developer={dev} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty state — content matches the first version */}
        {!loading && filteredDevs.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Users className="h-8 w-8 text-gray-400" />
            </div>

            <h3 className="mb-1.5 text-xl font-semibold text-gray-900">
              No developers found
            </h3>

            <p className="text-sm text-gray-600">
              Try adjusting your search or filters to find the right person for
              your project.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Developers;
