import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Github, Linkedin, Mail, ArrowUp, Shield } from 'lucide-react';

export default function Footer({ onAdminClick }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-slate-950/80 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Brand & Tagline */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1">
            <span className="text-lg font-bold text-white tracking-tight">
              {portfolioData.personal.name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          </div>
          <p className="text-xs text-slate-500">
            Building, learning, and exploring technology.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          <a
            href={portfolioData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/40 hover:bg-white/10 transition-all"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={portfolioData.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/40 hover:bg-white/10 transition-all"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${portfolioData.personal.email}`}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/40 hover:bg-white/10 transition-all"
            aria-label="Send Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-400/40 hover:bg-white/10 transition-all ml-2"
            aria-label="Back to Top"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Copyright & Admin Link */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© 2026 {portfolioData.personal.name}. All rights reserved.</p>

        {onAdminClick && (
          <button
            onClick={onAdminClick}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 hover:text-slate-400 transition-colors"
            title="Admin Portal Login"
          >
            <Shield className="w-3 h-3" />
            <span>Admin Portal</span>
          </button>
        )}
      </div>
    </footer>
  );
}