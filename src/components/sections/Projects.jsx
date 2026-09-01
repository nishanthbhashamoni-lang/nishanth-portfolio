import React, { useState, useEffect } from 'react';
import SectionHeading from '../ui/SectionHeading';
import ProjectIllustration from '../ui/ProjectIllustration';
import { 
  Github, 
  ExternalLink, 
  Clock, 
  FileText, 
  Download, 
  Layers, 
  Feather, 
  BarChart3, 
  Sparkles, 
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../api/client';
import { portfolioData } from '../../data/portfolioData';

export default function Projects() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories and projects on load
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [catRes, projRes] = await Promise.all([
          api.getCategories(),
          api.getProjects()
        ]);

        if (isMounted) {
          if (catRes.success && Array.isArray(catRes.data)) {
            setCategories(catRes.data);
          }
          if (projRes.success && Array.isArray(projRes.data)) {
            setProjectsList(projRes.data);
          } else {
            setProjectsList(portfolioData.projects || []);
          }
        }
      } catch (err) {
        console.warn('Using offline portfolio projects fallback:', err.message);
        if (isMounted) {
          setProjectsList(portfolioData.projects || []);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  // Filter projects by selected category
  const filteredProjects = projectsList.filter((p) => {
    if (selectedCategory === 'all') return true;
    if (Array.isArray(p.categories)) {
      return p.categories.some(c => (c.slug || c.id || c) === selectedCategory);
    }
    return (p.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            In Progress
          </span>
        );
      case 'coming soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/30">
            <Clock className="w-3 h-3 text-purple-400" />
            Coming Soon
          </span>
        );
      case 'completed':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Completed
          </span>
        );
    }
  };

  const getWorkTypeBadge = (workType) => {
    switch (workType?.toLowerCase()) {
      case 'article':
        return <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">Article</span>;
      case 'script':
        return <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Script</span>;
      case 'dashboard':
        return <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">Dashboard</span>;
      case 'research':
        return <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">Research</span>;
      default:
        return <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">Project</span>;
    }
  };

  return (
    <section id="projects" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <SectionHeading 
        badge="Portfolio & Work"
        title="Featured Work & Engineering"
        subtitle="Practical projects, data analytics models, research publications, and technical writing."
      />

      {/* Dynamic Category Tabs */}
      {categories.length > 0 && (
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-md shadow-cyan-500/10'
                : 'glass-pill text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            All Work ({projectsList.length})
          </button>

          {categories.map((cat) => {
            const count = projectsList.filter(p => 
              Array.isArray(p.categories) && p.categories.some(c => (c.slug || c.id || c) === cat.slug || (c.slug || c.id || c) === cat.id)
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug || cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                  selectedCategory === (cat.slug || cat.id)
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-md shadow-cyan-500/10'
                    : 'glass-pill text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Projects / Work Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-white/10 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No work items in this category yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            New projects, case studies, and content samples will be published here soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card group rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Top Visual Graphic or Image */}
              <div>
                {project.image ? (
                  <div className="relative w-full h-48 sm:h-52 bg-slate-900 overflow-hidden border-b border-white/10 group-hover:border-cyan-500/30 transition-colors">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <ProjectIllustration 
                    type={project.iconType} 
                    title={project.title} 
                    category={project.category || (project.categories?.[0]?.name) || 'Project'} 
                  />
                )}

                {/* Card Body */}
                <div className="p-6 sm:p-7">
                  {/* Category & Status Header */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {getWorkTypeBadge(project.workType)}
                      {Array.isArray(project.categories) && project.categories.length > 0 ? (
                        project.categories.slice(0, 2).map((c) => (
                          <span key={c.id || c} className="text-[10px] font-mono text-slate-300 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                            {c.name || c}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] font-mono text-slate-300 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                          {project.category || 'Work'}
                        </span>
                      )}
                    </div>
                    {getStatusBadge(project.status)}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>

                  {project.tagline && (
                    <p className="text-xs font-medium text-slate-400 mb-3">
                      {project.tagline}
                    </p>
                  )}

                  <p className="text-sm text-slate-300/90 leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Tech Stack / Tags */}
                  {(project.technologies || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(Array.isArray(project.technologies) ? project.technologies : []).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono text-slate-300 px-2.5 py-1 rounded-md bg-slate-900/80 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 pb-6 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                {/* Left Action: Source Code or Attachment */}
                <div className="flex items-center gap-2">
                  {project.github && project.github !== '#' && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <Github className="w-3.5 h-3.5 text-slate-400" />
                      <span>Source Code</span>
                    </a>
                  )}

                  {project.fileUrl && (
                    <a
                      href={project.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-white px-3.5 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>View Sample</span>
                    </a>
                  )}
                </div>

                {/* Right Action: External Article / Live Demo */}
                <div className="flex items-center gap-2">
                  {project.externalUrl && (
                    <a
                      href={project.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-950 px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 transition-colors font-semibold shadow-sm"
                    >
                      <span>Read Publication</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.demo && project.demo !== '#' && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-950 px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 transition-colors font-semibold shadow-sm"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {!project.demo && !project.externalUrl && !project.github && !project.fileUrl && (
                    <span className="text-[11px] font-mono text-slate-500 italic">
                      {project.status === 'In Progress' ? 'Work in progress' : 'Internal case study'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}