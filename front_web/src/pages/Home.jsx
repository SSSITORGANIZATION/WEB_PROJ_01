import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { motion } from 'motion/react';

import Navbar from '../components/Navbar';

import {
  ArrowRight, Code, Cpu, Globe as GlobeIcon, Zap,
  Users, BookOpen, Star, Shield,
  TrendingUp, Layers, MousePointer2,
  Github, Linkedin, Twitter, ExternalLink,
  Lightbulb, Calendar, Crown, UserCheck,
  FileText, Tag
} from 'lucide-react';

import { apiService } from '../services/api';

import { ProjectImageCarousel } from '../components/ImageComponents';

import Reviews from '../components/Reviews';

import ScrollingReviews from '../components/ScrollingReviews';

import Logo3D from '../components/Logo3D';
import Globe from '../components/Globe/Globe';
import { getGlobeSettings, subscribeToGlobeSettings } from '../utils/globeSettings';





const StatCounter = ({ value, label, icon: Icon }) => (

  <motion.div

    initial={{ opacity: 0, y: 20 }}

    whileInView={{ opacity: 1, y: 0 }}

    viewport={{ once: true }}

    className="flex flex-col items-center p-6 rounded-xl neu-card-light shadow-lg"

  >

    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">

      <Icon className="h-6 w-6 text-blue-600" />

    </div>

    <span className="mb-1 text-3xl font-bold text-gray-900">{value}</span>

    <span className="text-xs font-medium uppercase tracking-widest text-gray-500">{label}</span>

  </motion.div>

);



const ProjectCard = ({ project }) => (

  <motion.div

    whileHover={{ y: -8, scale: 1.02 }}

    className="group relative flex h-full flex-col overflow-hidden rounded-xl neu-card-light transition-all hover:shadow-xl"

  >

    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-700" />

    <div className="h-44 overflow-hidden relative">

      <ProjectImageCarousel

        project={project}

        className="w-full h-full"

        autoScroll={true}

        scrollInterval={5000}

      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {project.is_featured && (

        <div className="absolute top-3 right-3 px-2 py-0.5 bg-blue-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">

          Featured

        </div>

      )}

    </div>

    <div className="flex-grow flex flex-col p-4">

      <div className="mb-2 flex items-center gap-2">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">

          <Code className="h-6 w-6 text-blue-600" />

        </div>

        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>

      </div>

      <p className="mb-3 line-clamp-3 text-base leading-relaxed text-gray-600">

        {project.description}

      </p>

      <div className="mb-4 flex flex-wrap gap-2">

        {project.technologies_used?.split(',').slice(0, 3).map((tech, i) => (

          <span key={i} className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-sm font-medium uppercase tracking-wider text-gray-600">

            {tech.trim()}

          </span>

        ))}

      </div>

      <Link

        to={`/project/${project.id}`}

        className="mt-auto flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-all hover:bg-gray-50 group/btn"

      >

        View Project

        <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />

      </Link>

    </div>

  </motion.div>

);



const ResourceCard = ({ resource }) => {
  const hasImage = resource.thumbnail;

  return (
    <Link
      to={`/resources/${resource.id}`}
      className="block h-full"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group h-full"
      >
        <div className="relative flex h-[380px] flex-col overflow-hidden rounded-xl neu-card-light transition-all hover:shadow-xl">

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Category badge */}
          <div className="absolute top-3 left-3 z-10">
            <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${resource.category === 'BLOG' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
              resource.category === 'GUIDE' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                  'bg-violet-50 text-violet-600 border-violet-200'
              }`}>
              {resource.category === 'BLOG' && <FileText className="w-3 h-3" />}
              {resource.category === 'GUIDE' && <BookOpen className="w-3 h-3" />}
              {resource.category === 'GLOSSARY' && <Tag className="w-3 h-3" />}
              {resource.category}
            </div>
          </div>

          {/* Content */}
          <div className="relative flex-1 flex flex-col p-6 overflow-hidden">
            {/* Title */}
            <h3 className="font-bold text-gray-900 transition-colors line-clamp-2 leading-tight mb-4 text-lg mt-8">
              {resource.title}
            </h3>

            {/* Thumbnail and Content */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Image Container - Only show if image exists */}
              {hasImage && (
                <div className="relative mb-4 h-36 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                  <img
                    src={resource.thumbnail || `https://picsum.photos/seed/${resource.id}/800/600`}
                    alt={resource.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />
                </div>
              )}

              {/* Content excerpt - Only show if no image */}
              {!hasImage && (
                <div className="mt-2 flex-1 min-h-0">
                  <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {resource.content?.substring(0, 120)}...
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex shrink-0 items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                {new Date(resource.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-100 hover:border-blue-300">
                Read More
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};



const DeveloperCard = ({ developer, dataTimestamp }) => (

  <Link to={`/developer/${developer.id}`} className="block">

    <motion.div

      layout

      initial={{ opacity: 0, scale: 0.9 }}

      animate={{ opacity: 1, scale: 1 }}

      exit={{ opacity: 0, scale: 0.9 }}

      whileHover={{ y: -8, scale: 1.02 }}

      className="group relative flex h-full flex-col rounded-xl neu-card-light p-6 text-center transition-all hover:shadow-xl"

    >

      {developer.is_featured && (

        <div className="absolute right-4 top-4 rounded-full border border-yellow-200 bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-600">

          <Crown className="mr-1 inline h-3 w-3" />

          Featured

        </div>

      )}



      <div className="relative mx-auto mb-4 h-24 w-24">

        <div className="absolute inset-0 rounded-full bg-blue-100 blur-2xl transition-all duration-500" />

        <img

          src={developer.profile_image ? `${developer.profile_image}?t=${dataTimestamp}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`}

          alt={developer.name}

          className="relative z-10 h-full w-full rounded-full border-2 border-gray-200 object-cover transition-transform duration-300 shadow-lg"

        />

        <div className="absolute bottom-1 right-1 z-20 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-lg">

          <UserCheck className="h-2 w-2 text-white" />

        </div>

      </div>



      <div className="space-y-2">

        <h3 className="text-xl font-semibold text-gray-900 transition-colors duration-300" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

          {developer.name}

        </h3>

        <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">{developer.title}</p>



        <p className="line-clamp-2 px-1 text-sm leading-relaxed text-gray-600">

          {developer.bio}

        </p>

      </div>



      <div className="mt-2 mb-3 flex flex-wrap justify-center gap-1">

        {developer.skills?.split(',').slice(0, 4).map((skill, i) => (

          <span key={i} className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-700 transition-colors">

            {skill.trim()}

          </span>

        ))}

        {developer.skills?.split(',').length > 4 && (

          <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500">

            +{developer.skills.split(',').length - 4}

          </span>

        )}

      </div>



      <div className="flex flex-grow flex-col justify-end">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 transition-colors">
            View Full Profile →
          </span>
        </div>
      </div>

    </motion.div>

  </Link>

);

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [heroSections, setHeroSections] = useState([]);
  const [globeSettings, setGlobeSettings] = useState(getGlobeSettings);
  const [loading, setLoading] = useState(true);
  const [dataTimestamp, setDataTimestamp] = useState(Date.now());

  useEffect(() => subscribeToGlobeSettings(setGlobeSettings), []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from Django API
        const [projectsResponse, resourcesResponse, developersResponse, heroResponse] = await Promise.all([
          apiService.getProjects(),
          apiService.getResources(),
          apiService.getDevelopers(),
          apiService.getHeroSections()
        ]);



        // Handle projects data with enhanced processing

        const projectsData = Array.isArray(projectsResponse.data) ?

          projectsResponse.data : (projectsResponse.data.results || projectsResponse.data);



        const enrichedProjects = projectsData.map(project => ({

          ...project,

          technologies_used: project.technologies_used || '',

          description: project.description || 'No description available',

          title: project.title || 'Untitled Project',

          is_featured: Boolean(project.is_featured),

          status: project.status || 'ACTIVE',

          project_developers: project.project_developers || [],

          assets: project.assets || [],

          github_repo: project.github_repo || '',

          live_link: project.live_link || '',

          created_at: project.created_at || new Date().toISOString(),

          updated_at: project.updated_at || new Date().toISOString()

        }));



        const featuredProjects = enrichedProjects

          .filter(p => p.is_featured)

          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Sort by latest updates

          .slice(0, 3);



        // Handle resources data with enhanced processing

        const resourcesData = Array.isArray(resourcesResponse.data) ?

          resourcesResponse.data : (resourcesResponse.data.results || resourcesResponse.data);



        const enrichedResources = resourcesData.map(resource => ({

          ...resource,

          title: resource.title || 'Untitled Resource',

          content: resource.content || '',

          category: resource.category || 'BLOG',

          created_at: resource.created_at || new Date().toISOString(),

          updated_at: resource.updated_at || new Date().toISOString()

        }));



        const latestResources = enrichedResources

          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by newest first

          .slice(0, 3);



        // Handle developers data with enhanced processing

        const developersData = Array.isArray(developersResponse.data) ?

          developersResponse.data : (developersResponse.data.results || developersResponse.data);



        const enrichedDevelopers = developersData.map(developer => ({

          ...developer,

          name: developer.name || 'Unknown Developer',

          title: developer.title || 'Developer',

          bio: developer.bio || '',

          skills: developer.skills || '',

          experience_years: developer.experience_years || 0,

          is_active: Boolean(developer.is_active),

          created_at: developer.created_at || new Date().toISOString(),

          updated_at: developer.updated_at || new Date().toISOString()

        }));



        const activeDevelopers = enrichedDevelopers

          .filter(d => d.is_active)

          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Sort by latest updates

          .slice(0, 3);



        setProjects(featuredProjects);

        setResources(latestResources);

        setDevelopers(activeDevelopers);

        // Set hero sections
        if (heroResponse.data) {
          setHeroSections(heroResponse.data);
        }

        setDataTimestamp(Date.now()); // Update timestamp to bust cache

      } catch (error) {

        console.error("Error fetching homepage data:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchData();

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

          <div className="contents">

            <motion.div

              initial={{ opacity: 0, x: -20 }}

              animate={{ opacity: 1, x: 0 }}

              className="relative z-10 flex min-h-[28rem] max-w-none flex-col items-start justify-center px-6 py-4 sm:px-8 lg:px-12"

            >
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.6rem] leading-tight">
                <span className="text-blue-300">We Build Software That Works.</span>
              </h1>
              <p className="mb-5 text-sm leading-relaxed text-blue-100/90 md:text-base max-w-lg">
                SA Technologies partners with startups, growing businesses, and large enterprises to design, develop, and scale high-quality digital products — fast, secure, and built to last.
              </p>

              <div className="mb-6 flex flex-col gap-2">
                {[
                  { label: 'Custom Web & Mobile App Development' },
                  { label: 'Cloud Infrastructure & DevOps Automation' },
                  { label: 'AI Integration & Data-Driven Solutions' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-blue-100/90">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-400/30 text-blue-300">
                      <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </span>
                    {item.label}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">{projects.length}+</span>
                  <span className="text-white/70">Projects Delivered</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">{developers.length}+</span>
                  <span className="text-white/70">Expert Engineers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">5★</span>
                  <span className="text-white/70">Client Satisfaction</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/projects" className="rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-50 shadow-lg hover:shadow-xl tracking-wide uppercase">
                  View Our Work
                </Link>
                <Link to="/book-demo" className="rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/20 shadow-lg tracking-wide uppercase backdrop-blur-sm">
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
        </div>
      </section>



      {/* Trust Section */}









      {/* Projects Showcase */}

      <section className="py-12 px-6 bg-white section-spacing">

        <div className="max-w-7xl mx-auto">

          <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-lg w-full">

            <div className="flex items-center justify-between">

              <div className="text-center flex-1">

                <h2 className="mb-2 text-2xl font-bold">Featured Projects</h2>

                <p className="mx-auto max-w-2xl text-base text-blue-100">Discover the most innovative solutions built by our community of elite developers.</p>

              </div>

              <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-100">

                View All <ArrowRight className="w-4 h-4" />

              </Link>

            </div>

          </div>



          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {loading ? (

              [1, 2, 3].map(i => <div key={i} className="h-[400px] rounded-xl border border-gray-200 bg-white animate-pulse" />)

            ) : (

              projects.map(project => <ProjectCard key={project.id} project={project} />)

            )}

          </div>

        </div>

      </section>



      {/* Resources Section */}

      <section className="py-12 px-6 bg-gray-50 section-spacing">

        <div className="max-w-7xl mx-auto">

          <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-lg w-full">

            <div className="flex items-center justify-between">

              <div className="text-center flex-1">

                <h2 className="mb-2 text-2xl font-bold">Developer Resources</h2>

                <p className="mx-auto max-w-2xl text-base text-blue-100">Access curated collection of Blogs, guides, and development tools.</p>

              </div>

              <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-100">

                View All <ArrowRight className="w-4 h-4" />

              </Link>

            </div>

          </div>



          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {loading ? (

              [1, 2, 3].map(i => <div key={i} className="h-[350px] rounded-xl border border-gray-200 bg-white animate-pulse" />)

            ) : (

              resources.map(resource => <ResourceCard key={resource.id} resource={resource} />)

            )}

          </div>

        </div>

      </section>



      {/* Developers Section */}

      <section className="py-12 px-6 bg-white section-spacing">

        <div className="max-w-7xl mx-auto">

          <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-lg w-full">

            <div className="flex items-center justify-between">

              <div className="text-center flex-1">

                <h2 className="mb-2 text-2xl font-bold">Meet The Nexora Team</h2>

              </div>

              <Link to="/developers" className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-100">

                View All <ArrowRight className="w-4 h-4" />

              </Link>

            </div>

          </div>



          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {loading ? (

              [1, 2, 3].map(i => <div key={i} className="h-[380px] rounded-xl border border-gray-200 bg-white animate-pulse" />)

            ) : (

              developers.map(dev => <DeveloperCard key={dev.id} developer={dev} dataTimestamp={dataTimestamp} />)

            )}

          </div>

        </div>

      </section>



      {/* Reviews Section */}

      <section className="py-12 px-6 bg-white section-spacing">

        <div className="max-w-7xl mx-auto">

          <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-lg w-full">

            <div className="flex items-center justify-between">

              <div className="text-center flex-1">

                <h2 className="mb-2 text-2xl font-bold">Client Testimonials</h2>

                <p className="mx-auto max-w-2xl text-base text-blue-100">Hear what our clients say about their experience working with our team</p>

              </div>

              <Link to="/reviews" className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-100">

                View All <ArrowRight className="w-4 h-4" />

              </Link>

            </div>

          </div>

          <ScrollingReviews limit={10} />

        </div>

      </section>



    </div>

  );

};



export default Home;



