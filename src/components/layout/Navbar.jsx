import React, { useState, useEffect } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Menu, X, FileText, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onShowToast }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resumeUrl = portfolioData.personal.resumeUrl || '/resume.pdf';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'py-3.5 glass-nav shadow-lg shadow-black/20' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, '#home')}
          className="group flex items-center gap-1.5 text-xl font-bold tracking-tight text-white focus:outline-none"
        >
          <span className="font-extrabold tracking-tighter text-2xl group-hover:text-cyan-400 transition-colors">
            Nishanth
          </span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform"></span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 glass-pill px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
          {portfolioData.navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-3.5 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm border border-white/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Resume Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-full bg-slate-900 border border-white/15 hover:border-cyan-400/50 hover:bg-slate-800 transition-all duration-200 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Resume</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-white/10 px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {portfolioData.navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <div className="pt-2 border-t border-white/10 mt-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="Nishanth_Bhashamoni_Resume.pdf"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Download Resume</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}