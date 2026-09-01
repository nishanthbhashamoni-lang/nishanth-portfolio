import React from 'react';

export default function SectionHeading({ badge, title, subtitle, alignment = "center" }) {
  const isCenter = alignment === "center";
  return (
    <div className={`mb-12 md:mb-16 ${isCenter ? 'text-center' : 'text-left'}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase mb-3 glass-pill text-brand-cyan border border-brand-cyan/20`}>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
          {badge}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-slate-400 text-base md:text-lg max-w-2xl ${isCenter ? 'mx-auto' : ''} leading-relaxed`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple ${isCenter ? 'mx-auto' : ''}`} />
    </div>
  );
}
