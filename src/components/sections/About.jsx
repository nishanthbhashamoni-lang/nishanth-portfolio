import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';
import { Compass, Sparkles, CheckCircle, Database, BrainCircuit, Code, Terminal } from 'lucide-react';

export default function About() {
  const { about } = portfolioData;

  const getIconForExploring = (index) => {
    switch (index) {
      case 0: return <BrainCircuit className="w-4 h-4 text-cyan-400" />;
      case 1: return <Database className="w-4 h-4 text-blue-400" />;
      case 2: return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 3: return <Terminal className="w-4 h-4 text-indigo-400" />;
      case 4: return <Code className="w-4 h-4 text-emerald-400" />;
      default: return <Compass className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <section id="about" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <SectionHeading 
        badge="Background & Focus"
        title="About Me"
        subtitle="Bridging data science methodologies with clean software engineering."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Narrative Summary */}
        <div className="lg:col-span-7 space-y-5 text-slate-300 text-sm sm:text-base leading-relaxed">
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            {about.intro.map((paragraph, idx) => (
              <p key={idx} className="text-slate-300/90">
                {paragraph}
              </p>
            ))}

            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>BSc Computer Science 1st Year</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Python & Data Stack</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Practical Real-World Focus</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Internship Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Currently Exploring Card */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-semibold text-white tracking-wide">
                  Currently Exploring
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                Active Learning
              </span>
            </div>

            <div className="space-y-3">
              {about.exploring.map((item, idx) => (
                <div 
                  key={item.name}
                  className="p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 transition-all hover:bg-slate-900/90 group"
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    {getIconForExploring(idx)}
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 pl-6">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
