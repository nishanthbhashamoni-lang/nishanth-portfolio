import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Github, 
  ImageIcon, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  RefreshCw,
  Tag,
  Paperclip,
  FileText
} from 'lucide-react';

export default function AdminProjectsTable({ 
  projects, 
  loading, 
  onRefresh, 
  onAddProject, 
  onEditProject, 
  onDeleteProject 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.workType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(p.categories) && p.categories.some(c => (c.name || c).toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (Array.isArray(p.technologies) && p.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesStatus = statusFilter === 'all' || p.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            In Progress
          </span>
        );
      case 'coming soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
            <Clock className="w-3 h-3 text-purple-400" />
            Coming Soon
          </span>
        );
      case 'completed':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Completed
          </span>
        );
    }
  };

  const getWorkTypeBadge = (workType) => {
    switch (workType?.toLowerCase()) {
      case 'article':
        return <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">Article</span>;
      case 'script':
        return <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Script</span>;
      case 'dashboard':
        return <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">Dashboard</span>;
      case 'research':
        return <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Research</span>;
      default:
        return <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Project</span>;
    }
  };

  const completedCount = projects.filter(p => (p.status || '').toLowerCase() === 'completed').length;
  const inProgressCount = projects.filter(p => (p.status || '').toLowerCase() === 'in progress').length;
  const comingSoonCount = projects.filter(p => (p.status || '').toLowerCase() === 'coming soon').length;

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400">Total Work Items</div>
            <div className="text-2xl font-extrabold text-white mt-1">{projects.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400">Completed</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{completedCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400">In Progress</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">{inProgressCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400">Coming Soon</div>
            <div className="text-2xl font-extrabold text-purple-400 mt-1">{comingSoonCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search work, tags, or categories..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 text-xs font-mono"
          />
        </div>

        {/* Filters & Actions */}
        <div className="w-full md:w-auto flex flex-wrap items-center justify-between md:justify-end gap-2.5">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {['all', 'completed', 'in progress', 'coming soon'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={onAddProject}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Work Item</span>
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 inline-block text-slate-500">
              <Layers className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="text-base font-bold text-white">No work items found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Get started by creating your first work or project item.'}
            </p>
            <button
              onClick={onAddProject}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-semibold text-xs mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Work Item</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Title & Type</th>
                  <th className="py-3.5 px-4">Categories</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Tags</th>
                  <th className="py-3.5 px-4 text-center">Links & Media</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredProjects.map((project) => (
                  <tr 
                    key={project.id} 
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Title, Thumbnail, Type */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                          {project.image ? (
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="w-full h-full object-cover" 
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {project.title}
                            </span>
                            {getWorkTypeBadge(project.workType)}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                            {project.tagline || project.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Categories */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {Array.isArray(project.categories) && project.categories.length > 0 ? (
                          project.categories.map((c) => (
                            <span key={c.id || c} className="text-[11px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                              {c.name || c}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">Uncategorized</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {getStatusBadge(project.status)}
                    </td>

                    {/* Tags */}
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(project.technologies || []).slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] font-mono text-slate-300 px-1.5 py-0.5 rounded bg-slate-900 border border-white/5">
                            {t}
                          </span>
                        ))}
                        {(project.technologies || []).length > 3 && (
                          <span className="text-[10px] font-mono text-slate-500">
                            +{(project.technologies || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Links & Media Indicators */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
                            title="GitHub"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {project.externalUrl && (
                          <a
                            href={project.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-300 hover:text-white transition-colors"
                            title="Article / External Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {project.fileUrl && (
                          <a
                            href={project.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-purple-500/10 text-purple-300 hover:text-white transition-colors"
                            title="Sample Document Attachment"
                          >
                            <Paperclip className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {!project.github && !project.demo && !project.externalUrl && !project.fileUrl && (
                          <span className="text-slate-600 text-xs font-mono">—</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditProject(project)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/50 hover:bg-white/10 transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProject(project)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}