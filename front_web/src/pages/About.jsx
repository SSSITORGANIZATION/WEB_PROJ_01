import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Code,
  Users,
  Target,
  Lightbulb,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Database,
  Cpu,
  Cloud,
  Smartphone,
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Build with Purpose',
      desc: 'Technology should solve real problems and create meaningful value.',
    },
    {
      icon: Lightbulb,
      title: 'Keep It Simple',
      desc: 'We believe the best solutions are easy to understand, use, and maintain.',
    },
    {
      icon: Shield,
      title: 'Quality Matters',
      desc: 'We focus on building reliable, clean, and maintainable solutions.',
    },
    {
      icon: Users,
      title: 'Grow Together',
      desc: 'We work closely with our clients and build relationships that last.',
    },
    {
      icon: TrendingUp,
      title: 'Keep Learning',
      desc: 'We continuously learn, improve, and adapt as technology evolves.',
    },
  ];

  const services = [
    {
      icon: Code,
      title: 'Software Development',
      color: 'blue',
      items: [
        'Custom Web Application Development',
        'Enterprise Software Solutions',
        'Business Automation Systems',
        'SaaS Product Development',
      ],
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps',
      color: 'green',
      items: [
        'Cloud Application Development (AWS / Azure)',
        'Deployment & Infrastructure Automation',
        'CI/CD Pipeline Implementation',
      ],
    },
    {
      icon: Smartphone,
      title: 'Mobile Application Development',
      color: 'purple',
      items: [
        'Android & Web-based Mobile Apps',
        'Cross-platform Solutions',
      ],
    },
    {
      icon: Shield,
      title: 'Maintenance & Support',
      color: 'red',
      items: [
        'Application Maintenance',
        'Performance Optimization',
        'Technical Support',
      ],
    },
  ];

  const approach = [
    'Requirement Analysis and Planning',
    'Agile Development Methodology',
    'Clean and Scalable Code Practices',
    'Continuous Testing and Quality Assurance',
    'Timely Delivery and Client Collaboration',
  ];

  const reasons = [
    {
      icon: Shield,
      title: 'Strong focus on development quality',
      desc: 'We never compromise on code quality and follow industry best practices.',
      color: 'blue',
    },
    {
      icon: Users,
      title: 'Experienced technical team',
      desc: 'Our developers bring experience across various technologies.',
      color: 'green',
    },
    {
      icon: Zap,
      title: 'Scalable and modern technologies',
      desc: 'We use modern technologies to build future-ready solutions.',
      color: 'purple',
    },
    {
      icon: Target,
      title: 'Client-centric approach',
      desc: 'Your success is our priority. We work as your technology partner.',
      color: 'orange',
    },
    {
      icon: TrendingUp,
      title: 'Reliable support and maintenance',
      desc: 'We provide ongoing support to help your applications run smoothly.',
      color: 'red',
    },
  ];

  const trainingAreas = [
    { icon: Code, label: 'Web Development' },
    { icon: Database, label: 'Database Design' },
    { icon: Cloud, label: 'Cloud Technologies' },
    { icon: Cpu, label: 'Mobile Development' },
  ];

  const colorStyles = {
    blue: {
      icon: 'bg-blue-50 text-blue-600 ring-blue-100 group-hover:bg-blue-600 group-hover:text-white',
      check: 'text-blue-600',
    },
    green: {
      icon: 'bg-green-50 text-green-600 ring-green-100 group-hover:bg-green-600 group-hover:text-white',
      check: 'text-green-600',
    },
    purple: {
      icon: 'bg-purple-50 text-purple-600 ring-purple-100 group-hover:bg-purple-600 group-hover:text-white',
      check: 'text-purple-600',
    },
    red: {
      icon: 'bg-red-50 text-red-600 ring-red-100 group-hover:bg-red-600 group-hover:text-white',
      check: 'text-red-600',
    },
    orange: {
      icon: 'bg-orange-50 text-orange-600 ring-orange-100 group-hover:bg-orange-600 group-hover:text-white',
      check: 'text-orange-600',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section - Reduced Header Size */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              About SA
            </h1>

            <p className="mb-5 text-base leading-relaxed text-blue-100 md:text-lg">
              SA is a software solutions company focused on creating modern
              digital products that help businesses turn ideas into practical,
              reliable solutions.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="rounded-lg bg-white px-6 py-2.5 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
              >
                Let's Work Together
              </Link>

              <Link
                to="/projects"
                className="rounded-lg border border-blue-400/30 bg-blue-700 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-blue-800"
              >
                View Our Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Overview and Values */}
      <section className="py-12">
        <div className="mx-auto w-[90%] px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-3 text-2xl font-bold text-slate-900">
                Who We Are
              </h2>

              <div className="space-y-3 text-sm leading-relaxed text-gray-600">
                <p>
                  SA is a technology company focused on building digital
                  solutions for businesses and turning ideas into useful
                  products.
                </p>

                <p>
                  We work across software development, web applications,
                  digital experiences, and other technology solutions to help
                  businesses solve real problems and work more efficiently.
                </p>

                <p>
                  We believe good software is more than just code. It should
                  be simple to use, reliable, scalable, and designed around
                  the people and businesses that use it.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {values.map((value, index) => {
                const Icon = value.icon;

                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                    whileHover={{ y: -4 }}
                    className={`group rounded-xl border border-gray-200 bg-white p-4 shadow-md transition-all duration-300 hover:border-blue-200 hover:shadow-xl ${
                      index === 4 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mb-1.5 text-base font-bold text-slate-900">
                      {value.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-slate-600">
                      {value.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Vision and Mission */}
      <section className="bg-white py-12">
        <div className="mx-auto w-[90%] px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="relative z-10">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
                  <Target className="h-6 w-6" />
                </div>

                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  Our Vision
                </h3>

                <p className="text-sm leading-relaxed text-slate-600">
                  To become a trusted technology partner delivering innovative
                  software solutions to businesses worldwide.
                </p>
              </div>

              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-100/50 opacity-60 blur-2xl transition-opacity group-hover:opacity-100" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl"
            >
              <div className="relative z-10">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20">
                  <Lightbulb className="h-6 w-6" />
                </div>

                <h3 className="mb-3 text-lg font-bold text-slate-900">
                  Our Mission
                </h3>

                <ul className="space-y-2.5 text-sm text-slate-600">
                  {[
                    'Deliver high-quality software solutions',
                    'Build scalable and secure applications',
                    'Support business digital transformation',
                    'Maintain excellence through continuous innovation',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/50 opacity-60 blur-2xl transition-opacity group-hover:opacity-100" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-12">
        <div className="mx-auto w-[90%] px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Core Services
            </h2>

            <p className="mx-auto max-w-2xl text-sm text-gray-600">
              Comprehensive software development services tailored to meet
              your business needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;
              const styles = colorStyles[service.color];

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ring-1 transition-colors ${styles.icon}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mb-3 text-base font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <ul className="space-y-2 text-xs text-slate-600">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle
                          className={`mt-0.5 h-4 w-4 flex-shrink-0 ${styles.check}`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Development Approach */}
      <section className="bg-white py-12">
        <div className="mx-auto w-[90%] px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Development Approach
            </h2>

            <p className="mx-auto max-w-2xl text-sm text-gray-600">
              Our proven methodology ensures successful project delivery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {approach.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-md shadow-blue-600/20">
                  <span className="text-lg font-bold text-white">
                    {index + 1}
                  </span>
                </div>

                <p className="text-xs font-medium leading-relaxed text-slate-600">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12">
        <div className="mx-auto w-[90%] px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Why Choose Us
            </h2>

            <p className="mx-auto max-w-2xl text-sm text-gray-600">
              The perfect partner for your software development needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              const styles = colorStyles[reason.color];

              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 transition-colors ${styles.icon}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mb-2 text-base font-bold text-slate-900">
                    {reason.title}
                  </h3>

                  <p className="text-xs leading-relaxed text-slate-600">
                    {reason.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="bg-white py-12">
        <div className="mx-auto w-[90%] px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Training Programs
            </h2>

            <p className="mx-auto max-w-2xl text-sm text-gray-600">
              Industry-oriented training programs aligned with real-time
              development projects.
            </p>
          </motion.div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md md:p-8">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-lg font-bold text-slate-900">
                  Optional Training Services
                </h3>

                <p className="mb-6 text-sm leading-relaxed text-gray-600">
                  We also offer selective training programs aligned with
                  real-time development projects to help individuals gain
                  practical industry exposure.
                </p>

                <ul className="space-y-3 text-sm text-gray-600">
                  {[
                    'Hands-on experience with live projects',
                    'Mentorship from experienced developers',
                    'Industry-relevant curriculum',
                    'Certification upon completion',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {trainingAreas.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      <Icon className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12">
        <div className="mx-auto w-[90%] px-6 text-center sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-white">
              Ready to Start Your Project?
            </h2>

            <p className="mx-auto mb-6 max-w-2xl text-sm text-blue-100">
              Let's discuss how we can help transform your ideas into powerful
              digital solutions.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                to="/projects"
                className="rounded-lg border border-blue-400/30 bg-blue-700 px-8 py-4 font-semibold text-white transition-colors hover:bg-blue-800"
              >
                View Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;