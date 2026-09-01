import React, { useState } from 'react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';
import { 
  Code2, 
  BarChart3, 
  Sparkles, 
  Globe, 
  Wrench, 
  Terminal, 
  Database, 
  Cpu, 
  Table2, 
  Binary, 
  LineChart, 
  PieChart, 
  LayoutDashboard, 
  BrainCircuit, 
  Bot, 
  FileSearch, 
  Link2, 
  FileCode, 
  Palette, 
  FileJson, 
  Server, 
  Wand2, 
  GitBranch, 
  Github, 
  AppWindow, 
  BookOpen, 
  CloudUpload,
  Code
} from 'lucide-react';

export default function Skills() {
  const { skills } = portfolioData;
  const [activeCategory, setActiveCategory] = useState("all");

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-4 h-4 text-cyan-400" />;
      case 'BarChart3': return <BarChart3 className="w-4 h-4 text-blue-400" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'Globe': return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-amber-400" />;
      default: return <Code2 className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getSkillIcon = (iconName) => {
    switch (iconName) {
      case 'Code': return <Code className="w-4 h-4 text-cyan-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-indigo-400" />;
      case 'Database': return <Database className="w-4 h-4 text-blue-400" />;
      case 'Table2': return <Table2 className="w-4 h-4 text-sky-400" />;
      case 'Binary': return <Binary className="w-4 h-4 text-cyan-400" />;
      case 'LineChart': return <LineChart className="w-4 h-4 text-emerald-400" />;
      case 'PieChart': return <PieChart className="w-4 h-4 text-teal-400" />;
      case 'LayoutDashboard': return <LayoutDashboard className="w-4 h-4 text-blue-400" />;
      case 'BrainCircuit': return <BrainCircuit className="w-4 h-4 text-purple-400" />;
      case 'Bot': return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'FileSearch': return <FileSearch className="w-4 h-4 text-cyan-400" />;
      case 'Link2': return <Link2 className="w-4 h-4 text-purple-400" />;
      case 'Terminal': return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'FileCode': return <FileCode className="w-4 h-4 text-orange-400" />;
      case 'Palette': return <Palette className="w-4 h-4 text-blue-400" />;
      case 'FileJson': return <FileJson className="w-4 h-4 text-yellow-400" />;
      case 'Server': return <Server className="w-4 h-4 text-emerald-400" />;
      case 'Wand2': return <Wand2 className="w-4 h-4 text-sky-400" />;
      case 'GitBranch': return <GitBranch className="w-4 h-4 text-orange-400" />;
      case 'Github': return <Github className="w-4 h-4 text-slate-300" />;
      case 'AppWindow': return <AppWindow className="w-4 h-4 text-blue-400" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-orange-400" />;
      case 'CloudUpload': return <CloudUpload className="w-4 h-4 text-slate-100" />;
      default: return <Code className="w-4 h-4 text-cyan-400" />;
    }
  };

  const filteredCategories = activeCategory === 'all' 
    ? skills.categories 
    : skills.categories.filter(c => c.title.toLowerCase().replace(/[^a-z]/g, '') === activeCategory);

  return (
    <section id="skills" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <SectionHeading 
        badge="Technical Arsenal"
        title="Skills & Technologies"
        subtitle="Practical competencies across data science, AI engineering, and web development."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
            activeCategory === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          All Domains
        </button>
        {skills.categories.map((cat) => {
          const key = cat.title.toLowerCase().replace(/[^a-z]/g, '');
          return (
            <button
              key={cat.title}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeCategory === key
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'glass-card text-slate-400 hover:text-white'
              }`}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* Categorized Skills Grid */}
      <div className={`grid gap-6 ${
        filteredCategories.length === 1 
          ? 'grid-cols-1 max-w-2xl mx-auto' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {filteredCategories.map((category) => (
          <div 
            key={category.title}
            className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300"
          >
            <div>
              {/* Category Header */}
              <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/10">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  {getCategoryIcon(category.icon)}
                </div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  {category.title}
                </h3>
              </div>

              {/* Skills List */}
              <div className={`grid gap-2.5 ${filteredCategories.length === 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/15 hover:bg-slate-900/80 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded bg-white/5 shrink-0">
                        {getSkillIcon(skill.icon)}
                      </div>
                      <span className="text-sm font-medium text-slate-200">
                        {skill.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                      {skill.highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
