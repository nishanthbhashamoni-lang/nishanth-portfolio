import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { FileText, Download } from 'lucide-react';

export default function ResumeCTA({ onShowToast }) {
  const { personal } = portfolioData;

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
      <div className="relative glass-card rounded-3xl border border-white/10 p-8 sm:p-12 overflow-hidden text-center">
        {/* Subtle radial light background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-70 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 mb-2">
            <FileText className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Want to know more?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Take a look at my resume for a detailed overview of my skills, projects, and experience.
          </p>

          <div className="pt-2">
            <a
              href="/api/resume/download"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-full shadow-lg shadow-cyan-500/20 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume</span>
            </a>
          </div>

          <p className="text-xs text-slate-500 font-mono">
            Direct PDF download (Nishanth_Bhashamoni_Resume.pdf)
          </p>
        </div>
      </div>
    </section>
  );
}