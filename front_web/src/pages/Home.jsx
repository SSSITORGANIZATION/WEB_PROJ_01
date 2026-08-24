import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { motion } from 'motion/react';

import {
  ArrowRight, Code, Cpu, Globe, Zap,
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

import {
  CurrencyConverter,
  GstCalculator,
  EmiCalculator,
} from "../components/calculators";



const StatCounter = ({ value, label, icon: Icon }) => (

  <motion.div

    initial={{ opacity: 0, y: 20 }}

    whileInView={{ opacity: 1, y: 0 }}

    viewport={{ once: true }}

    className="flex flex-col items-center p-4 glass-card border-white/5"

  >

    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">

      <Icon className="w-5 h-5 text-blue-500" />

    </div>

    <span className="text-3xl font-bold text-white mb-1 serif">{value}</span>

    <span className="text-zinc-500 text-xs uppercase tracking-widest font-medium">{label}</span>

  </motion.div>

);



const ProjectCard = ({ project }) => (

  <motion.div

    whileHover={{ y: -8, scale: 1.02 }}

    className="group relative glass-card border-white/5 overflow-hidden flex flex-col h-full"

  >

    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-shimmer" />

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

    <div className="p-4 flex-grow flex flex-col">

      <div className="flex items-center gap-2 mb-2">

        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">

          <Code className="w-4 h-4 text-blue-400" />

        </div>

        <h3 className="text-lg font-bold text-white serif">{project.title}</h3>

      </div>

      <p className="text-zinc-400 text-base leading-relaxed mb-3 line-clamp-3">

        {project.description}

      </p>

      <div className="flex flex-wrap gap-2 mb-4">

        {project.technologies_used?.split(',').slice(0, 3).map((tech, i) => (

          <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-full text-sm text-zinc-400 uppercase tracking-wider">

            {tech.trim()}

          </span>

        ))}

      </div>

      <Link

        to={`/project/${project.id}`}

        className="mt-auto flex items-center justify-between w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white transition-all group/btn"

      >

        View Project

        <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />

      </Link>

    </div>

  </motion.div>

);



const ResourceCard = ({ resource }) => {
  const isTool = resource.category === "TOOL";

  const hasImage = resource.thumbnail && !isTool;

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
        className="group h-full"
      >
        <div className="relative bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden hover:border-white/[0.12] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 h-[380px] flex flex-col">

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <div className="absolute top-3 left-3 z-10">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md border ${resource.category === 'BLOG' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
              resource.category === 'GUIDE' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                resource.category === 'TOOL' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  'bg-violet-500/20 text-violet-400 border-violet-500/30'
              }`}>
              {resource.category === 'BLOG' && <FileText className="w-3 h-3" />}
              {resource.category === 'GUIDE' && <BookOpen className="w-3 h-3" />}
              {resource.category === 'TOOL' && <Lightbulb className="w-3 h-3" />}
              {resource.category === 'GLOSSARY' && <Tag className="w-3 h-3" />}
              {resource.category}
            </div>
          </div>

          {/* Content */}
          <div className={`relative flex-1 flex flex-col ${isTool ? 'p-5' : 'p-6'} overflow-hidden`}>
            {/* Title */}
            <h3 className={`font-bold text-white transition-colors line-clamp-2 leading-tight ${isTool ? 'mb-4 text-base mt-8' : 'mb-4 text-lg mt-8'
              }`}>
              {resource.title}
            </h3>

            {/* Tool Display - Only for tools */}
            {isTool && (
              <div className="flex-1 bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 overflow-hidden">
                {resource.tool_type === "currency" && <CurrencyConverter />}
                {resource.tool_type === "gst" && <GstCalculator />}
                {resource.tool_type === "emi" && <EmiCalculator />}
              </div>
            )}

            {/* Thumbnail and Content - Only for non-tools */}
            {!isTool && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Image Container - Only show if image exists */}
                {hasImage && (
                  <div className="relative h-36 mb-4 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900/20 border border-slate-700/20">
                    <img
                      src={resource.thumbnail || `https://picsum.photos/seed/${resource.id}/800/600`}
                      alt={resource.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                  </div>
                )}

                {/* Content excerpt - Only show if no image */}
                {!hasImage && (
                  <div className="flex-1 min-h-0 mt-2">
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {resource.content?.substring(0, 120)}...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Footer - Only for non-tools */}
            {!isTool && (
              <div className="flex justify-between items-center pt-4 border-t border-slate-700/30 mt-4 flex-shrink-0">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(resource.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/30">
                  Read More
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}
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

      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)" }}

      className="group relative bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center flex flex-col h-full transition-all duration-300"

    >

      {developer.is_featured && (

        <div className="absolute top-4 right-4 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold">

          <Crown className="w-3 h-3 inline mr-1" />

          Featured

        </div>

      )}



      <div className="relative w-24 h-24 mx-auto mb-4">

        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl transition-all duration-500" />

        <img

          src={developer.profile_image ? `${developer.profile_image}?t=${dataTimestamp}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`}

          alt={developer.name}

          className="w-full h-full rounded-full object-cover border-2 border-white/20 relative z-10 transition-transform duration-300 shadow-2xl"

        />

        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center z-20 shadow-lg">

          <UserCheck className="w-2 h-2 text-white" />

        </div>

      </div>



      <div className="space-y-2">

        <h3 className="text-xl font-bold text-white transition-colors duration-300" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

          {developer.name}

        </h3>

        <p className="text-blue-400 text-[11px] font-semibold uppercase tracking-wider">{developer.title}</p>



        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 px-1">

          {developer.bio}

        </p>

      </div>



      <div className="flex flex-wrap justify-center gap-1 mb-3 mt-2">

        {developer.skills?.split(',').slice(0, 4).map((skill, i) => (

          <span key={i} className="px-2 py-0.5 bg-white/10 border border-white/20 rounded-full text-[11px] text-zinc-300 font-medium transition-colors">

            {skill.trim()}

          </span>

        ))}

        {developer.skills?.split(',').length > 4 && (

          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[11px] text-zinc-500 font-medium">

            +{developer.skills.split(',').length - 4}

          </span>

        )}

      </div>



      <div className="flex-grow flex flex-col justify-end">
        <div className="text-center">
          <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest transition-colors">
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
  const [loading, setLoading] = useState(true);
  const [dataTimestamp, setDataTimestamp] = useState(Date.now());

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

          .filter(resource => resource.category !== 'TOOL') // Exclude calculators/tools

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

    <div className="pt-16">



      {/* Hero Section */}

      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-6">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />

        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />



        <div className="max-w-6xl mx-auto relative z-10">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Hero Content */}

            <motion.div

              initial={{ opacity: 0, x: -50 }}

              animate={{ opacity: 1, x: 0 }}

              transition={{ duration: 0.8 }}

              className="text-center lg:text-left"

            >

              {/* Use dynamic hero section data or fallback to hardcoded values */}
              {heroSections && heroSections.length > 0 ? (
                (() => {
                  const hero = heroSections[0]; // Use first active hero section
                  return (
                    <>
                      {hero.badge_text && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 glass-card rounded-full border-white/5 mb-4">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">{hero.badge_text}</span>
                        </div>
                      )}

                      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter serif leading-[0.9] mb-4">
                        {hero.title.split('\n').map((line, index) => (
                          <span key={index}>
                            {line}
                            {index < hero.title.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </h1>

                      <p className="text-zinc-500 text-base leading-relaxed mb-6 max-w-xl">
                        {hero.subtitle}
                      </p>

                      <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                        {hero.primary_button_text && hero.primary_button_url && (
                          hero.primary_button_url.startsWith('http') ? (
                            <a
                              href={hero.primary_button_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 accent-gradient rounded-2xl text-sm font-bold text-white shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all"
                            >
                              {hero.primary_button_text}
                            </a>
                          ) : (
                            <Link
                              to={hero.primary_button_url}
                              className="px-6 py-3 accent-gradient rounded-2xl text-sm font-bold text-white shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all"
                            >
                              {hero.primary_button_text}
                            </Link>
                          )
                        )}

                        {hero.secondary_button_text && hero.secondary_button_url && (
                          hero.secondary_button_url.startsWith('http') ? (
                            <a
                              href={hero.secondary_button_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 glass-card rounded-2xl text-sm font-bold text-white hover:bg-white/5 transition-all flex items-center gap-3"
                            >
                              {hero.secondary_button_text} <ArrowRight className="w-4 h-4" />
                            </a>
                          ) : (
                            <Link
                              to={hero.secondary_button_url}
                              className="px-6 py-3 glass-card rounded-2xl text-sm font-bold text-white hover:bg-white/5 transition-all flex items-center gap-3"
                            >
                              {hero.secondary_button_text} <ArrowRight className="w-4 h-4" />
                            </Link>
                          )
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 max-w-sm lg:max-w-none mx-auto lg:mx-0">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-white serif">{hero.stat1_value}</span>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">{hero.stat1_label}</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-white serif">{hero.stat2_value}</span>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">{hero.stat2_label}</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-white serif">{hero.stat3_value}</span>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">{hero.stat3_label}</span>
                        </div>
                      </div>
                    </>
                  );
                })()
              ) : (
                /* Fallback to hardcoded values if no hero sections */
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 glass-card rounded-full border-white/5 mb-4">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                    {/* <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">V2.0 Now Architected</span> */}
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold tracking-tighter serif leading-[0.9] mb-4">
                    Innovative <br />
                    <span className="italic text-blue-500">Software Solutions</span> for <br />
                    Modern Business.
                  </h1>

                  <p className="text-zinc-500 text-base leading-relaxed mb-6 max-w-xl">
                    Sai Software Solutions transforms business challenges into innovative digital solutions. We specialize in building scalable, secure applications that drive growth and efficiency.
                  </p>

                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                    <Link to="/projects" className="px-6 py-3 accent-gradient rounded-2xl text-sm font-bold text-white shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all">
                      Explore Projects
                    </Link>

                    <Link to="/hiring" className="px-6 py-3 glass-card rounded-2xl text-sm font-bold text-white hover:bg-white/5 transition-all flex items-center gap-3">
                      Join Community <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-4 max-w-sm lg:max-w-none mx-auto lg:mx-0">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-white serif">250+</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Projects</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-white serif">1.2k</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Developers</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-white serif">45k</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Resources</span>
                    </div>
                  </div>
                </>
              )}

            </motion.div>



            {/* Right Side - 3D Logo */}

            <motion.div

              initial={{ opacity: 0, x: 50 }}

              animate={{ opacity: 1, x: 0 }}

              transition={{ duration: 0.8, delay: 0.2 }}

              className="flex justify-center lg:justify-end"

            >

              <Logo3D />

            </motion.div>

          </div>

        </div>

      </section>



      {/* Trust Section */}

      <section className="py-10 border-y border-white/5 overflow-hidden">

        <div className="max-w-7xl mx-auto px-6">

          <p className="text-center text-[9px] text-zinc-500 uppercase tracking-[0.4em] font-bold mb-6">Trusted by 250+ Engineering Departments</p>

          {/* <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">

            {['VELOCITY', 'SYNTAX', 'PIXEL_PERFECT', 'CORE_ENG', 'BINARY'].map((brand) => (

              <span key={brand} className="text-xl font-black tracking-tighter text-white mono">{brand}</span>

            ))}

          </div> */}

        </div>

      </section>



      {/* Features Section */}

      <section className="py-12 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-10">

            <h2 className="text-2xl md:text-3xl font-bold text-white serif mb-4">Your Technical Command Center</h2>

            <p className="text-zinc-500 max-w-2xl mx-auto text-sm">One source of truth for architectural decisions, project health, and developer performance metrics.</p>

          </div>



          <div className="grid md:grid-cols-3 gap-4 mb-12">

            {[

              { icon: Shield, title: "Architectural Integrity", desc: "Automated policy enforcement for system design. Ensure every commit aligns with your defined architectural vision before it hits production." },

              { icon: Zap, title: "Dev-First Experience", desc: "CLI tools and API access that integrate into your existing CI/CD pipelines. Built by developers, for developers." },

              { icon: TrendingUp, title: "Metric Deep-Dives", desc: "DORA metrics and productivity analytics without the friction. Real-time insights into team performance and project health." }

            ].map((feature, i) => (

              <motion.div

                key={i}

                initial={{ opacity: 0, y: 20 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true }}

                transition={{ delay: i * 0.1 }}

                className="p-6 glass-card border-white/5 hover:border-white/20 transition-all group"

              >

                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">

                  <feature.icon className="w-6 h-6 text-blue-500" />

                </div>

                <h3 className="text-lg font-bold text-white mb-2 serif">{feature.title}</h3>

                <p className="text-zinc-500 text-xs leading-relaxed">{feature.desc}</p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>



      {/* Projects Showcase */}

      <section className="py-12 bg-zinc-950/50 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6">

            <div className="max-w-xl">

              <h2 className="text-2xl md:text-3xl font-bold text-white serif mb-4">Featured Projects</h2>

              <p className="text-zinc-500 text-sm">Discover the most innovative solutions built by our community of elite developers.</p>

            </div>

            <Link to="/projects" className="flex items-center gap-2 text-blue-500 font-bold transition-colors uppercase tracking-widest text-[9px]">

              View All Projects <ArrowRight className="w-3 h-3" />

            </Link>

          </div>



          <div className="grid md:grid-cols-3 gap-6">

            {loading ? (

              [1, 2, 3].map(i => <div key={i} className="h-[400px] glass-card animate-pulse" />)

            ) : (

              projects.map(project => <ProjectCard key={project.id} project={project} />)

            )}

          </div>

        </div>

      </section>



      {/* Resources Section */}

      <section className="py-12 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6">

            <div className="max-w-xl">

              <h2 className="text-2xl md:text-3xl font-bold text-white serif mb-4">Developer <span className="italic text-blue-500">Resources</span></h2>

              <p className="text-zinc-500 text-sm">Access curated collection of Blogs, guides, and development tools.</p>

            </div>

            <Link to="/resources" className="flex items-center gap-3 text-blue-500 font-bold transition-colors uppercase tracking-widest text-lg">

              Explore All Resources <ArrowRight className="w-5 h-5" />

            </Link>

          </div>



          <div className="grid md:grid-cols-3 gap-4">

            {loading ? (

              [1, 2, 3].map(i => <div key={i} className="h-[350px] glass-card animate-pulse" />)

            ) : (

              resources.map(resource => <ResourceCard key={resource.id} resource={resource} />)

            )}

          </div>

        </div>

      </section>



      {/* Developers Section */}

      <section className="py-12 bg-zinc-950/50 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6">

            <div className="max-w-xl">

              <h2 className="text-2xl md:text-3xl font-bold text-white serif mb-4">Meet The <span className="italic text-blue-500">Sai Software Solutions</span> Team</h2>

            </div>

            <Link to="/developers" className="flex items-center gap-3 text-blue-500 font-bold transition-colors uppercase tracking-widest text-lg">

              View All Developers <ArrowRight className="w-5 h-5" />

            </Link>

          </div>



          <div className="grid md:grid-cols-3 gap-6">

            {loading ? (

              [1, 2, 3].map(i => <div key={i} className="h-[380px] glass-card animate-pulse" />)

            ) : (

              developers.map(dev => <DeveloperCard key={dev.id} developer={dev} dataTimestamp={dataTimestamp} />)

            )}

          </div>

        </div>

      </section>



      {/* Reviews Section */}

      <section className="py-12 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">

            <h2 className="text-2xl md:text-3xl font-bold text-white serif mb-4">Client <span className="italic text-blue-500">Testimonials</span></h2>

            <p className="text-zinc-500 text-sm max-w-2xl mx-auto">Hear what our clients say about their experience working with our team</p>

          </div>

          <ScrollingReviews limit={10} />

          <div className="text-center mt-8">

            <Link to="/reviews" className="flex items-center gap-2 text-blue-500 font-bold transition-colors uppercase tracking-widest text-[9px] justify-center">

              View All Reviews <ArrowRight className="w-3 h-3" />

            </Link>

          </div>

        </div>

      </section>



      {/* CTA Section */}

      <section className="py-12 px-6">

        <div className="max-w-7xl mx-auto">

          <motion.div

            whileHover={{ scale: 1.01 }}

            className="relative p-8 md:p-14 rounded-[2rem] overflow-hidden accent-gradient text-center"

          >

            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

            <div className="relative z-10">

              <h2 className="text-3xl md:text-5xl font-bold text-white serif mb-4 leading-tight">Ready to Transform Your Business?</h2>

              <p className="text-blue-100 text-base mb-6 max-w-2xl mx-auto opacity-80">

                Partner with Sai Software Solutions for innovative digital transformation. Start your journey or book a consultation with our expert team.

              </p>

              <div className="flex flex-wrap justify-center gap-4">

                <Link to="/contact" className="px-6 py-3 bg-white text-blue-600 rounded-2xl text-base font-bold hover:bg-zinc-100 transition-all shadow-xl">

                  Get Started Now

                </Link>

                <Link to="/contact" className="px-6 py-3 bg-blue-700 text-white rounded-2xl text-base font-bold hover:bg-blue-800 transition-all border border-blue-400/30 shadow-xl">

                  Book Consultation

                </Link>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

    </div>

  );

};



export default Home;



