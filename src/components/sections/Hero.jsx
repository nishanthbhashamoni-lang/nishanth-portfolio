import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';

export default function Hero({ onShowToast }) {
  const { personal } = portfolioData;

  const scrollToProjects = (e) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden tech-grid-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/15 to-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-10 -left-20 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -right-20 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide glass-pill text-cyan-300 border border-cyan-500/20 mb-6 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span>{personal.statusBadge}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
          Hi, I'm <span className="gradient-accent-text">{personal.name.split(' ')[0]}</span>.
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl md:text-2xl font-medium text-slate-300 mb-6 max-w-2xl mx-auto tracking-tight">
          {personal.role}
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {personal.tagline}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <a
            href="#projects"
            onClick={scrollToProjects}
            className="group inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-full shadow-lg shadow-cyan-500/20 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>View Featured Work</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="/api/resume/download"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-slate-200 rounded-full glass-card hover:text-white hover:border-cyan-400/40 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download Resume</span>
          </a>
        </div>

        {/* Social Links & Terminal Indicator */}
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card text-xs font-mono hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card text-xs font-mono hover:text-blue-300 hover:border-blue-500/30 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>

          <a
            href={`mailto:${personal.email}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card text-xs font-mono hover:text-purple-300 hover:border-purple-500/30 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </a>
        </div>
      </div>
    </section>
  );
}