import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';
import { Layers, Brain, Sparkles, Cpu, Network, Code2, ArrowUpRight } from 'lucide-react';

export default function CurrentlyLearning() {
  const { currentlyLearning } = portfolioData;

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'Brain': return <Brain className="w-5 h-5 text-indigo-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-sky-400" />;
      case 'Network': return <Network className="w-5 h-5 text-emerald-400" />;
      case 'Code2': return <Code2 className="w-5 h-5 text-amber-400" />;
      default: return <Code2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <SectionHeading 
        badge="Continuous Growth"
        title="Currently Learning"
        subtitle="Exploring emerging architectures and deepening core computer science foundations."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {currentlyLearning.map((item) => (
          <div
            key={item.name}
            className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all group"
          >
            <div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 inline-block mb-3 group-hover:scale-110 transition-transform">
                {getIcon(item.icon)}
              </div>
              <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {item.name}
              </h4>
              <p className="text-[11px] text-slate-400 font-mono">
                {item.area}
              </p>
            </div>

            {/* Subtle learning indicator (without fake %) */}
            <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-400">
                {item.status}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
