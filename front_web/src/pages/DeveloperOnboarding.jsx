import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle, Clock, Rocket,
  BookOpen, Shield, Users,
  MessageSquare, Terminal,
  ChevronRight, Download,
  ExternalLink, Github, Slack
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeveloperOnboarding = () => {
  const [user, setUser] = useState < any > (null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock authentication - simulate logged in user
    const mockUser = {
      id: 'user123',
      name: 'John Developer',
      email: 'john.developer@example.com',
      role: 'developer'
    };

    setUser(mockUser);
    setLoading(false);
  }, [navigate]);

  const steps = [
    {
      title: "Account Setup",
      description: "Complete your profile and set up your development environment.",
      icon: Shield,
      status: "completed",
      items: [
        { label: "Verify Email Address", completed: true },
        { label: "Set up Two-Factor Authentication", completed: true },
        { label: "Complete Profile Details", completed: true }
      ]
    },
    {
      title: "Access & Tools",
      description: "Get access to our core repositories and communication channels.",
      icon: Terminal,
      status: "current",
      items: [
        { label: "Connect GitHub Account", completed: false, link: "https://github.com" },
        { label: "Join Slack Workspace", completed: false, link: "https://slack.com" },
        { label: "Install DevHub CLI", completed: false, code: "npm install -g @devhub/cli" }
      ]
    },
    {
      title: "Documentation & Training",
      description: "Review our coding standards, architecture, and security protocols.",
      icon: BookOpen,
      status: "pending",
      items: [
        { label: "Read Architecture Overview", completed: false },
        { label: "Review Coding Standards", completed: false },
        { label: "Security Best Practices Training", completed: false }
      ]
    },
    {
      title: "First Project",
      description: "Get assigned to your first project and meet your team.",
      icon: Rocket,
      status: "pending",
      items: [
        { label: "Meet your Team Lead", completed: false },
        { label: "Review Project Backlog", completed: false },
        { label: "Submit your first PR", completed: false }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[9px] font-bold uppercase tracking-widest mb-4"
          >
            <Rocket className="w-2.5 h-2.5" /> Welcome to the Team
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-white serif mb-4 tracking-tighter">
            Developer <span className="italic text-blue-500">Onboarding</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">
            Welcome, <span className="text-white font-bold">{user?.name}</span>. We're excited to have you on board.
            Follow these steps to get started with DevHub.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-5 glass-card border-white/5 relative overflow-hidden group ${step.status === 'current' ? 'border-blue-500/30 ring-1 ring-blue-500/20' : ''
                  }`}
              >
                {step.status === 'completed' && (
                  <div className="absolute top-0 right-0 p-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all group-hover:scale-110 ${step.status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                    step.status === 'current' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                      'bg-zinc-900 border-white/5 text-zinc-600'
                    }`}>
                    <step.icon className="w-5 h-5" />
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white serif mb-1">{step.title}</h3>
                    <p className="text-zinc-500 text-xs mb-4 leading-relaxed">{step.description}</p>

                    <div className="space-y-2">
                      {step.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 group/item hover:border-white/10 transition-all">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${item.completed ? 'bg-green-500 border-green-500 text-white' : 'border-white/10'
                              }`}>
                              {item.completed && <CheckCircle className="w-2.5 h-2.5" />}
                            </div>
                            <span className={`text-xs ${item.completed ? 'text-zinc-400 line-through' : 'text-white'}`}>
                              {item.label}
                            </span>
                          </div>

                          {item.link && (
                            <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {item.code && (
                            <code className="text-[9px] bg-black px-1.5 py-0.5 rounded border border-white/10 text-zinc-400 font-mono">
                              {item.code}
                            </code>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="p-5 glass-card border-white/5 sticky top-20">
              <h3 className="text-base font-bold text-white serif mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs text-zinc-300 font-bold">GitHub Org</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-all" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-2">
                    <Slack className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs text-zinc-300 font-bold">Slack Channel</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-all" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs text-zinc-300 font-bold">Handbook</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-all" />
                </a>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-1.5">Need Help?</p>
                <p className="text-zinc-400 text-[10px] leading-relaxed mb-3">
                  If you're stuck or have questions, reach out to your team lead or post in the <span className="text-white font-bold">#onboarding</span> channel.
                </p>
                <button className="w-full py-2 bg-blue-500 text-white text-[10px] font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperOnboarding;

