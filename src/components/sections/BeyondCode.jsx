import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';
import { Trophy, Timer, Flame, ArrowRight, Zap, Target } from 'lucide-react';

export default function BeyondCode() {
  const { achievements } = portfolioData;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <SectionHeading 
        badge="Competitive Builds"
        title="Beyond the Code"
        subtitle="Sprint-driven problem solving, rapid prototyping, and team hackathons."
      />

      <div className="grid grid-cols-1 gap-6">
        {achievements.map((item) => (
          <div
            key={item.title}
            className="glass-card relative rounded-2xl border border-white/10 p-6 sm:p-8 overflow-hidden hover:border-cyan-500/40 transition-all"
          >
            {/* Ambient accent */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-gradient-to-tl from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Icon & Sprint Details */}
              <div className="lg:col-span-4 flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <Trophy className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-mono">
                    <Timer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.organization}</span>
                  </div>
                </div>
              </div>

              {/* Description & Impact */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-300">
                    Sprint Highlight: {item.highlight}
                  </span>
                </div>
                <p className="text-sm text-slate-300/90 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-slate-300 px-2.5 py-0.5 rounded bg-white/5 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
