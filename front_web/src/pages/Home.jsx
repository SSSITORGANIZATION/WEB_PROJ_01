import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import {
  ArrowRight,
  BookOpen,
  FileText,
  Tag,
  Briefcase,
  Calendar,
  Crown,
  UserCheck,
} from 'lucide-react';
import { apiService } from '../services/api';
import ScrollingReviews from '../components/ScrollingReviews';
import Globe from '../components/Globe/Globe';
import {
  getGlobeSettings,
  subscribeToGlobeSettings,
} from '../utils/globeSettings';
import WhatsAppWidget from '../components/WhatsAppWidget';

// ---------------------------------------------
// Project Card
// ---------------------------------------------
const ProjectCard = ({ project }) => {
  const projectImage = project.project_image || project.featured_image;

  const technologies =
    project.technologies_used
      ?.split(',')
      .filter((technology) => technology.trim())
      .slice(0, 3) || [];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex h-full min-h-[350px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-xl"
    >
      <div className="relative h-40 shrink-0 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 sm:h-44">
        {projectImage && (
          <img
            src={projectImage}
            alt={project.title}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        )}

        {!projectImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Briefcase className="h-12 w-12 text-blue-300" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 min-h-10 text-base font-semibold text-gray-900">
          {project.title}
        </h3>

        <div className="mb-3 flex min-h-6 flex-wrap content-start gap-1.5">
          {technologies.map((technology, index) => (
            <span
              key={`${technology}-${index}`}
              className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-600"
            >
              {technology.trim()}
            </span>
          ))}
        </div>

        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
          {project.description || 'No description available.'}
        </p>

        <Link
          to={`/project/${project.id}`}
          className="mt-auto block w-full rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          View Project
        </Link>
      </div>
    </motion.div>
  );
};

// ---------------------------------------------
// Resource Card
// ---------------------------------------------
const ResourceCard = ({ resource }) => {
  const hasImage = Boolean(resource.thumbnail);

  const categoryStyles = {
    BLOG: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    GUIDE: 'border-blue-200 bg-blue-50 text-blue-700',
    TOOL: 'border-amber-200 bg-amber-50 text-amber-700',
    GLOSSARY: 'border-violet-200 bg-violet-50 text-violet-700',
  };

  const categoryStyle =
    categoryStyles[resource.category] ||
    'border-gray-200 bg-gray-50 text-gray-700';

  const formattedDate = resource.created_at
    ? new Date(resource.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const excerpt = String(
    resource.content || resource.description || ''
  )
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[\`*_>#~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <Link
      to={`/resources/${resource.id}`}
      className="block h-full"
    >
      <motion.article
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        whileHover={{ y: -5 }}
        className="group relative flex h-full min-h-[350px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl"
      >
        <div className="relative h-36 shrink-0 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
          {hasImage ? (
            <img
              src={resource.thumbnail}
              alt={resource.title || 'Resource thumbnail'}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              {resource.category === 'GUIDE' ? (
                <BookOpen className="h-12 w-12 text-blue-300" />
              ) : resource.category === 'GLOSSARY' ? (
                <Tag className="h-12 w-12 text-violet-300" />
              ) : (
                <FileText className="h-12 w-12 text-indigo-300" />
              )}
            </div>
          )}

          <div className="absolute left-3 top-3 z-10">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${categoryStyle}`}
            >
              {resource.category === 'GUIDE' ? (
                <BookOpen className="h-3 w-3" />
              ) : resource.category === 'GLOSSARY' ? (
                <Tag className="h-3 w-3" />
              ) : (
                <FileText className="h-3 w-3" />
              )}
              {resource.category || 'BLOG'}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-2 line-clamp-2 min-h-10 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
            {resource.title || 'Untitled Resource'}
          </h3>

          <p className="mb-4 line-clamp-4 flex-1 text-sm leading-relaxed text-gray-600">
            {excerpt
              ? `${excerpt.slice(0, 220)}${excerpt.length > 220 ? '...' : ''}`
              : 'Explore this resource to learn more.'}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
            <div className="flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{formattedDate || 'Resource'}</span>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition-colors group-hover:border-blue-300 group-hover:bg-blue-100">
              Read More
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

// ---------------------------------------------
// Developer Card
// ---------------------------------------------
const DeveloperCard = ({ developer, dataTimestamp }) => {
  const skills =
    developer.skills
      ?.split(',')
      .map((skill) => skill.trim())
      .filter(Boolean) || [];

  const profileImage = developer.profile_image
    ? `${developer.profile_image}${
        developer.profile_image.includes('?') ? '&' : '?'
      }t=${dataTimestamp}`
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        developer.name || 'Developer'
      )}`;

  return (
    <Link to={`/developer/${developer.id}`} className="block h-full">
      <motion.article
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5 }}
        className="group relative flex h-full min-h-[350px] flex-col rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:shadow-xl"
      >
        {developer.is_featured && (
          <div className="absolute right-3 top-3 rounded-full border border-yellow-200 bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-600">
            <Crown className="mr-1 inline h-3 w-3" />
            Featured
          </div>
        )}

        <div className="relative mx-auto mb-4 h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-blue-100 blur-xl" />

          <img
            src={profileImage}
            alt={developer.name}
            loading="lazy"
            className="relative z-10 h-full w-full rounded-full border-2 border-gray-200 object-cover shadow-md"
          />

          <div className="absolute bottom-0 right-0 z-20 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-500">
            <UserCheck className="h-2.5 w-2.5 text-white" />
          </div>
        </div>

        <h3 className="mb-1 text-lg font-semibold text-gray-900">
          {developer.name}
        </h3>

        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-blue-600">
          {developer.title}
        </p>

        <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
          {developer.bio || 'Learn more about this team member.'}
        </p>

        <div className="mb-4 flex flex-wrap justify-center gap-1">
          {skills.slice(0, 4).map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-700"
            >
              {skill}
            </span>
          ))}

          {skills.length > 4 && (
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-500">
              +{skills.length - 4}
            </span>
          )}
        </div>

        <div className="mt-auto border-t border-gray-100 pt-3 text-xs font-bold uppercase tracking-widest text-blue-600">
          View Full Profile <span aria-hidden="true">→</span>
        </div>
      </motion.article>
    </Link>
  );
};

// ---------------------------------------------
// Homepage
// ---------------------------------------------
const Home = () => {
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [globeSettings, setGlobeSettings] = useState(getGlobeSettings);
  const [loading, setLoading] = useState(true);
  const [dataTimestamp, setDataTimestamp] = useState(Date.now());

  useEffect(() => subscribeToGlobeSettings(setGlobeSettings), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const getList = (response) => {
      const data = response?.data;

      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.results)) return data.results;

      return [];
    };

    const fetchData = async () => {
      try {
        const [
          projectsResponse,
          resourcesResponse,
          developersResponse,
        ] = await Promise.all([
          apiService.getProjects(),
          apiService.getResources(),
          apiService.getDevelopers(),
        ]);

        if (cancelled) return;

        const projectsData = getList(projectsResponse);

        const enrichedProjects = projectsData.map((project) => ({
          ...project,
          technologies_used: project.technologies_used || '',
          description: project.description || 'No description available.',
          title: project.title || 'Untitled Project',
          is_featured: Boolean(project.is_featured),
          status: project.status || 'ACTIVE',
          created_at: project.created_at || new Date().toISOString(),
          updated_at: project.updated_at || new Date().toISOString(),
        }));

        const featuredProjects = enrichedProjects
          .filter((project) => project.is_featured)
          .sort(
            (a, b) =>
              new Date(b.updated_at) - new Date(a.updated_at)
          )
          .slice(0, 3);

        const projectsToShow =
          featuredProjects.length > 0
            ? featuredProjects
            : [...enrichedProjects]
                .sort(
                  (a, b) =>
                    new Date(b.updated_at) - new Date(a.updated_at)
                )
                .slice(0, 3);

        const resourcesData = getList(resourcesResponse);

        const enrichedResources = resourcesData.map((resource) => ({
          ...resource,
          title: resource.title || 'Untitled Resource',
          content: resource.content || resource.description || '',
          category: resource.category || 'BLOG',
          thumbnail: resource.thumbnail || resource.featured_image || '',
          created_at: resource.created_at || new Date().toISOString(),
          updated_at: resource.updated_at || new Date().toISOString(),
        }));

        const latestResources = [...enrichedResources]
          .sort(
            (a, b) =>
              new Date(b.created_at) - new Date(a.created_at)
          )
          .slice(0, 3);

        const developersData = getList(developersResponse);

        const enrichedDevelopers = developersData.map((developer) => ({
          ...developer,
          name: developer.name || 'Unknown Developer',
          title: developer.title || 'Developer',
          bio: developer.bio || '',
          skills: developer.skills || '',
          experience_years: developer.experience_years || 0,
          is_active: Boolean(developer.is_active),
          created_at: developer.created_at || new Date().toISOString(),
          updated_at: developer.updated_at || new Date().toISOString(),
        }));

        const activeDevelopers = enrichedDevelopers
          .filter((developer) => developer.is_active)
          .sort(
            (a, b) =>
              new Date(b.updated_at) - new Date(a.updated_at)
          )
          .slice(0, 3);

        setProjects(projectsToShow);
        setResources(latestResources);
        setDevelopers(activeDevelopers);
        setDataTimestamp(Date.now());
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-[linear-gradient(180deg,#2563eb_0%,#1d4ed8_34%,#102654_62%,#000000_100%)] text-white lg:bg-[linear-gradient(108deg,#2563eb_0%,#1d4ed8_34%,#102654_53%,#050b16_70%,#000000_100%)]">
        <Navbar transparent />

        <div className="relative overflow-hidden">
          {globeSettings.showGlobe && (
            <div className="pointer-events-none absolute inset-0 opacity-80">
              <Globe backgroundOnly />
            </div>
          )}

          <div className="relative grid lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative z-10 flex min-h-[28rem] flex-col items-start justify-center px-6 py-10 sm:px-8 lg:px-12"
            >
              <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.8rem]">
                <span className="text-blue-300">
                  Building Products with Purpose
                </span>
              </h1>

              <p className="mb-5 max-w-xl text-sm leading-relaxed text-blue-100/90 md:text-base">
                SA Technologies partners with startups, growing businesses,
                and large enterprises to design, develop, and scale
                high-quality digital products — fast, secure, and built to last.
              </p>

              <div className="mb-6 flex flex-col gap-2">
                {[
                  { label: 'Custom Web & Mobile App Development' },
                  { label: 'Cloud Infrastructure & DevOps Automation' },
                  { label: 'AI Integration & Data-Driven Solutions' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-blue-100/90"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-400/30 text-blue-300">
                      <svg
                        className="h-2.5 w-2.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    {item.label}
                  </div>
                ))}
              </div>

              <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
                    {projects.length}+
                  </span>
                  <span className="text-white/70">Projects Delivered</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
                    {developers.length}+
                  </span>
                  <span className="text-white/70">Expert Engineers</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
                    5★
                  </span>
                  <span className="text-white/70">Client Satisfaction</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold tracking-wide text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
                >
                  View Our Work
                </Link>

                <Link
                  to="/book-demo"
                  className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  Book a Demo
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex min-h-[28rem] items-center justify-center px-6 py-6"
            >
              <div className="relative h-96 w-full max-w-lg lg:h-[32rem]">
                {globeSettings.showGlobe && <Globe {...globeSettings} />}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Work */}
      <section className="section-spacing bg-white px-6 py-12">
        <div className="mx-auto w-[90%]">
          <div className="mb-8 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-lg">
            <div className="flex-1 text-center">
              <h2 className="mb-2 text-2xl font-bold">Our Work</h2>
              <p className="mx-auto max-w-2xl text-sm text-blue-100 sm:text-base">
                A look at the products and platforms we've helped bring to life.
              </p>
            </div>

            <Link
              to="/projects"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-100"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? [1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[350px] animate-pulse rounded-xl border border-gray-200 bg-white"
                  />
                ))
              : projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
          </div>
        </div>
      </section>

      {/* Insights & Resources */}
      <section className="section-spacing bg-gray-50 px-6 py-12">
        <div className="mx-auto w-[90%]">
          <div className="mb-8 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-lg">
            <div className="flex-1 text-center">
              <h2 className="mb-2 text-2xl font-bold">
                Insights & Resources
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-blue-100 sm:text-base">
                Practical guides, engineering write-ups, and tools from our team.
              </p>
            </div>

            <Link
              to="/resources"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-100"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? [1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[350px] animate-pulse rounded-xl border border-gray-200 bg-white"
                  />
                ))
              : resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
          </div>

          {!loading && resources.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <FileText className="mx-auto mb-3 h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                No resources are available right now.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Developers */}
      <section className="section-spacing bg-white px-6 py-12">
        <div className="mx-auto w-[90%]">
          <div className="mb-8 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-lg">
            <div className="flex-1 text-center">
              <h2 className="mb-2 text-2xl font-bold">
                The People Behind the Work
              </h2>
            </div>

            <Link
              to="/developers"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-100"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? [1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[350px] animate-pulse rounded-xl border border-gray-200 bg-white"
                  />
                ))
              : developers.map((developer) => (
                  <DeveloperCard
                    key={developer.id}
                    developer={developer}
                    dataTimestamp={dataTimestamp}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* What Our Clients Say */}
      <section className="section-spacing bg-white px-6 py-12">
        <div className="mx-auto w-[90%]">
          <div className="mb-8 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-lg">
            <div className="flex-1 text-center">
              <h2 className="mb-2 text-2xl font-bold">
                What Our Clients Say
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-blue-100 sm:text-base">
                Real feedback from the teams we've partnered with.
              </p>
            </div>

            <Link
              to="/reviews"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-100"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ScrollingReviews limit={10} />
        </div>
      </section>

      {/* WhatsApp Widget */}
      <WhatsAppWidget />
    </div>
  );
};

export default Home;