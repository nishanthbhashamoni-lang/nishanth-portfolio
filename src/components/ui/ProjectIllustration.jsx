import React from 'react';
import { 
  TrendingUp, 
  Gauge, 
  Code2, 
  Database, 
  Sparkles, 
  LineChart, 
  Globe, 
  AppWindow,
  Cpu
} from 'lucide-react';

export default function ProjectIllustration({ type, title, category }) {
  switch (type) {
    case 'trending-up':
      return (
        <div className="relative w-full h-48 sm:h-52 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-950 flex items-center justify-center overflow-hidden border-b border-white/10 group-hover:border-emerald-500/30 transition-colors">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent"></div>
          <div className="absolute right-0 bottom-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 w-4/5 max-w-[280px] p-3 rounded-xl bg-slate-900/90 border border-emerald-500/20 shadow-2xl backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Demand_Prediction
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Hackathon Sprint
              </span>
            </div>
            <div className="flex items-end justify-between h-12 gap-1.5 px-1 pt-2">
              <div className="w-1/6 bg-slate-700/60 rounded-t h-[40%]"></div>
              <div className="w-1/6 bg-slate-700/60 rounded-t h-[60%]"></div>
              <div className="w-1/6 bg-emerald-600/70 rounded-t h-[75%]"></div>
              <div className="w-1/6 bg-emerald-500/80 rounded-t h-[90%]"></div>
              <div className="w-1/6 bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-t h-full animate-pulse"></div>
              <div className="w-1/6 bg-cyan-400/60 rounded-t border-t-2 border-dashed border-cyan-200 h-[85%]"></div>
            </div>
            <div className="text-[9px] font-mono text-slate-400 text-center pt-2">
              Auto-Reorder Trigger: <span className="text-emerald-300 font-semibold">Active</span>
            </div>
          </div>
        </div>
      );

    case 'gauge':
      return (
        <div className="relative w-full h-48 sm:h-52 bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-950 flex items-center justify-center overflow-hidden border-b border-white/10 group-hover:border-blue-500/30 transition-colors">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent"></div>
          <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 w-36 h-36 bg-blue-500/15 rounded-full blur-2xl"></div>

          <div className="relative z-10 w-4/5 max-w-[280px] p-3 rounded-xl bg-slate-900/90 border border-blue-500/20 shadow-2xl backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
              <span className="text-[10px] font-mono text-blue-400 flex items-center gap-1">
                <Gauge className="w-3 h-3" /> Telemetry BI
              </span>
              <span className="text-[9px] font-mono text-slate-400">Downtime Analysis</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 p-1.5 rounded text-center border border-white/5">
                <div className="text-[9px] text-slate-400 font-mono">Uptime Rate</div>
                <div className="text-xs font-bold text-blue-400">98.4%</div>
              </div>
              <div className="bg-white/5 p-1.5 rounded text-center border border-white/5">
                <div className="text-[9px] text-slate-400 font-mono">Anomalies</div>
                <div className="text-xs font-bold text-cyan-300">Resolved</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'database':
      return (
        <div className="relative w-full h-48 sm:h-52 bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-950 flex items-center justify-center overflow-hidden border-b border-white/10 group-hover:border-cyan-500/30 transition-colors">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/15 via-transparent to-transparent"></div>
          <div className="relative z-10 w-4/5 max-w-[280px] p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 shadow-2xl backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <Database className="w-3 h-3" /> Pipeline_Stream
              </span>
              <span className="text-[9px] font-mono text-emerald-400">Sync Active</span>
            </div>
            <div className="space-y-1.5 font-mono text-[10px] text-slate-300">
              <div className="bg-white/5 px-2 py-1 rounded flex justify-between">
                <span>ETL Batch</span>
                <span className="text-cyan-400">Processed</span>
              </div>
              <div className="bg-white/5 px-2 py-1 rounded flex justify-between">
                <span>SQL Views</span>
                <span className="text-emerald-400">Optimized</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'code':
    case 'globe':
    case 'sparkles':
    default:
      return (
        <div className="relative w-full h-48 sm:h-52 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-950 flex items-center justify-center overflow-hidden border-b border-white/10 group-hover:border-indigo-500/30 transition-colors">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent"></div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 w-4/5 max-w-[280px] p-3.5 rounded-xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-[10px] font-mono text-slate-300 truncate max-w-[150px]">
                  {title || 'Project Model'}
                </span>
              </div>
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="space-y-1 text-center py-2">
              <div className="text-xs font-bold text-white tracking-wide">
                {category || 'Software Architecture'}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Production Ready Component
              </div>
            </div>
          </div>
        </div>
      );
  }
}
