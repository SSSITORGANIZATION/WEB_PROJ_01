import React, { useState, useEffect } from 'react';
import {
  Search,
  Github,
  ExternalLink,
  ArrowRight,
  Code,
  Users,
  CalendarDays,
  FolderOpen,
  MessageSquare,
} from 'lucide-react';
import { apiService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  ProjectImageCarousel,
  DeveloperImage,
} from '../components/ImageComponents';

// ------------------------------------------
// Project Card
// ------------------------------------------

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const technologies = (project.technologies_used || '')
    .split(',')
    .map((tech) => tech.trim())
    .filter(Boolean);

  const developers = Array.isArray(project.project_developers)
    ? project.project_developers
    : [];

  const assets = Array.isArray(project.assets) ? project.assets : [];

  const status = String(project.status || 'ACTIVE')
    .toUpperCase()
    .replace(/[_-]/g, ' ');

  const statusClasses = {
    ACTIVE: 'bg-green-50 text-green-700 border-green-200',
    COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
    'IN PROGRESS': 'bg-amber-50 text-amber-700 border-amber-200',
    PLANNING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    INACTIVE: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const createdDate = project.created_at
    ? new Date(project.created_at)
    : null;

  const formattedDate =
    createdDate && !Number.isNaN(createdDate.getTime())
      ? createdDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '';

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      {/* Top accent */}
      <div className="absolute left-0 right-0 top-0 z-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-700" />

      {/* Project image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 sm:h-52">
        <span
          className={`absolute left-3 top-3 z-10 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
            statusClasses[status] ||
            'border-gray-200 bg-gray-50 text-gray-600'
          }`}
        >
          {status}
        </span>

        <ProjectImageCarousel
          project={project}
          className="h-full w-full"
          autoScroll={true}
          scrollInterval={5000}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {technologies.slice(0, 2).map((tech, index) => (
              <span
                key={`${tech}-${index}`}
                className="rounded-md border border-white/30 bg-white/90 px-2 py-1 text-[10px] font-bold text-gray-800"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.is_featured && (
            <span className="rounded-md bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Title and date */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 text-lg font-semibold leading-6 text-gray-900 transition-colors group-hover:text-blue-700 sm:text-xl">
            {project.title || 'Untitled Project'}
          </h3>

          {formattedDate && (
            <span className="shrink-0 pt-1 text-[10px] text-gray-500">
              {formattedDate}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-3 min-h-[4.5rem] text-sm leading-relaxed text-gray-600">
          {project.description || 'No description available.'}
        </p>

        {/* Technology badges */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {technologies.slice(0, 4).map((tech, index) => (
            <span
              key={`${tech}-${index}`}
              className="max-w-full truncate rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-700"
            >
              {tech}
            </span>
          ))}

          {technologies.length > 4 && (
            <span className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
              +{technologies.length - 4}
            </span>
          )}
        </div>

        {/* Project statistics */}
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-gray-50 p-3">
            <Users className="mx-auto mb-1 h-4 w-4 text-gray-500" />
            <p className="text-base font-bold text-gray-900">
              {developers.length}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Team
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-3">
            <Code className="mx-auto mb-1 h-4 w-4 text-gray-500" />
            <p className="text-base font-bold text-gray-900">
              {technologies.length}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Tech
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-3">
            <FolderOpen className="mx-auto mb-1 h-4 w-4 text-gray-500" />
            <p className="text-base font-bold text-gray-900">
              {assets.length}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Assets
            </p>
          </div>
        </div>

        {/* Team members */}
        {developers.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Team Members
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {developers.slice(0, 3).map((dev, index) => (
                <Link
                  key={dev.id ?? dev.developer ?? index}
                  to={`/developer/${dev.developer}`}
                  title={dev.developer_name || 'Team member'}
                  className="flex max-w-full items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 transition-colors hover:bg-blue-50"
                >
                  <DeveloperImage
                    developer={{
                      name: dev.developer_name,
                      profile_image: dev.developer_profile_image,
                    }}
                    size="h-5 w-5"
                  />

                  <span className="max-w-[100px] truncate text-xs font-medium text-gray-700">
                    {dev.developer_name || 'Unknown'}
                  </span>

                  {dev.member_type === 'LEAD' && (
                    <span className="rounded bg-blue-50 px-1 py-0.5 text-[9px] font-bold text-blue-600">
                      LEAD
                    </span>
                  )}
                </Link>
              ))}

              {developers.length > 3 && (
                <span className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500">
                  +{developers.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto border-t border-gray-200 pt-3">
          <div className="mb-3 flex items-center gap-3">
            {project.github_repo && (
              <a
                href={project.github_repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                title="GitHub repository"
                className="text-gray-500 transition-colors hover:text-gray-900"
              >
                <Github className="h-4 w-4" />
              </a>
            )}

            {project.live_link && (
              <a
                href={project.live_link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live project"
                title="Live project"
                className="text-gray-500 transition-colors hover:text-blue-600"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/review/${project.id}`}
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:text-sm"
            >
              <MessageSquare className="h-4 w-4" />
              Write a Review
            </Link>

            <button
              type="button"
              onClick={() => navigate(`/project/${project.id}`)}
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-800 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:text-sm"
            >
              Details
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {formattedDate && (
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-400">
              <CalendarDays className="h-3.5 w-3.5" />
              Created {formattedDate}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

// ------------------------------------------
// Loading skeleton
// ------------------------------------------

const ProjectSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
    <div className="h-48 animate-pulse bg-gray-100 sm:h-52" />

    <div className="space-y-4 p-4 sm:p-5">
      <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-4/6 animate-pulse rounded bg-gray-100" />
      </div>

      <div className="flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-6 w-20 animate-pulse rounded-lg bg-gray-100" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="h-16 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-16 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-16 animate-pulse rounded-lg bg-gray-100" />
      </div>

      <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
    </div>
  </div>
);

// ------------------------------------------
// Main Projects Page
// ------------------------------------------

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'React',
    'Python',
    'Django',
    'JavaScript',
    'Node.js',
    'TypeScript',
  ];

  // Fetch projects
  useEffect(() => {
    let cancelled = false;

    const fetchProjects = async () => {
      try {
        const response = await apiService.getProjects();
        const data = response?.data ?? response;

        const projectsData = Array.isArray(data)
          ? data
          : data?.results ?? data?.projects ?? data?.data ?? [];

        if (!Array.isArray(projectsData)) {
          throw new Error('Unexpected response from projects API.');
        }

        const enrichedProjects = projectsData.map((project) => ({
          ...project,
          technologies_used: project.technologies_used || '',
          description: project.description || 'No description available.',
          title: project.title || 'Untitled Project',
          is_featured: Boolean(project.is_featured),
          status: project.status || 'ACTIVE',
          project_developers: Array.isArray(project.project_developers)
            ? project.project_developers
            : [],
          assets: Array.isArray(project.assets) ? project.assets : [],
          github_repo: project.github_repo || '',
          live_link: project.live_link || '',
        }));

        if (!cancelled) {
          setProjects(enrichedProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);

        if (!cancelled) {
          setProjects([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  // Search and category filtering
  useEffect(() => {
    let filtered = [...projects];

    if (activeCategory !== 'All') {
      filtered = filtered.filter((project) =>
        (project.technologies_used || '')
          .toLowerCase()
          .includes(activeCategory.toLowerCase())
      );
    }

    const query = search.trim().toLowerCase();

    if (query) {
      filtered = filtered.filter((project) =>
        [
          project.title || '',
          project.description || '',
          project.technologies_used || '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }

    setFilteredProjects(filtered);
  }, [search, activeCategory, projects]);

  return (
    <main className="min-h-screen bg-gray-50">
{/* Page header */}
<section className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
  <div className="absolute inset-0 bg-black/10" />

  <div className="relative mx-auto w-[90%] px-6 py-8 sm:px-8 lg:px-12">
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="mb-3 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
        Our <span className="text-blue-100">Work</span>
      </h1>

      <p className="mx-auto max-w-3xl text-base leading-relaxed text-blue-100 md:text-lg">
        Explore the platforms, products, and systems we've built for
        clients, from enterprise-grade architectures to modern consumer
        applications.
      </p>
    </div>
  </div>
</section>

      {/* Main content */}
      <section className="mx-auto w-[94%] max-w-7xl px-2 py-8 sm:px-4 sm:py-10 lg:px-6">
        {/* Filters and search */}
        <div className="mb-8 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full shrink-0 lg:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="search"
              placeholder="Search our work..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* Project count */}
        {!loading && filteredProjects.length > 0 && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-semibold text-gray-800">
                {filteredProjects.length}
              </span>{' '}
              {filteredProjects.length === 1 ? 'project' : 'projects'}
            </p>

            {(search || activeCategory !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setActiveCategory('All');
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Project grid */}
        {loading ? (
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectSkeleton key={index} />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center sm:py-20">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Search className="h-8 w-8 text-blue-500" />
            </div>

            <h3 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">
              Nothing matches that search
            </h3>

            <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-600 sm:text-base">
              Try a different keyword or clear your filters to see everything
              we've built.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setActiveCategory('All');
              }}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Projects;
