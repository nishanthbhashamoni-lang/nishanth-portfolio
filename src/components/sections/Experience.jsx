import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';
import { Briefcase, Feather, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <SectionHeading 
        badge="Career & Exposure"
        title="Experience"
        subtitle="Practical internships and analytical communication experience."
      />

      <div className="relative border-l border-white/10 ml-4 md:ml-32 space-y-12">
        {experience.map((item, index) => (
          <div key={item.role} className="relative pl-8 md:pl-10 group">
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:scale-125 transition-transform" />

            {/* Floating Period Badge for larger screens */}
            <div className="md:absolute md:-left-36 md:top-1 md:w-28 md:text-right text-xs font-mono text-cyan-400 mb-2 md:mb-0">
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                {item.period}
              </span>
            </div>

            {/* Experience Card */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 group-hover:border-cyan-500/30 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {index === 0 ? (
                    <Briefcase className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Feather className="w-5 h-5 text-purple-400" />
                  )}
                  <h3 className="text-lg font-bold text-white">
                    {item.role}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded bg-white/5 border border-white/5">
                  {item.company}
                </span>
              </div>

              {/* Focus tags */}
              <div className="flex flex-wrap gap-1.5 my-3.5">
                {item.focus.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-slate-300 px-2 py-0.5 rounded bg-white/5 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bullet Highlights */}
              <ul className="space-y-2 text-sm text-slate-300/90 pt-2 border-t border-white/5">
                {item.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
