import React, { useState } from 'react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';
import { Mail, Linkedin, Github, Send, Copy, Check } from 'lucide-react';

export default function Contact({ onShowToast }) {
  const { personal } = portfolioData;
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopied(true);
    if (onShowToast) onShowToast('Email copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      if (onShowToast) onShowToast('Please fill in all fields before sending.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Frontend interaction simulation
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onShowToast) onShowToast('Message prepared! Open your email client or copy the message.', 'success');
      
      // Construct mailto link
      const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
      window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
    }, 600);
  };

  return (
    <section id="contact" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <SectionHeading 
        badge="Get In Touch"
        title="Let's Connect"
        subtitle="I'm always open to learning, collaborating, building interesting projects, and exploring internship opportunities."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Contact Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Reach Out Directly
            </h3>

            {/* Email Card with Copy button */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Direct Email</span>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <a
                href={`mailto:${personal.email}`}
                className="text-sm font-semibold text-slate-200 hover:text-cyan-300 transition-colors flex items-center gap-2 break-all"
              >
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{personal.email}</span>
              </a>
            </div>

            {/* LinkedIn Card */}
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-blue-500/30 hover:bg-slate-900/90 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400">Professional Network</div>
                  <div className="text-sm font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">
                    LinkedIn Profile
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 group-hover:text-slate-300">
                Connect →
              </span>
            </a>

            {/* GitHub Card */}
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/20 hover:bg-slate-900/90 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400">Code & Repositories</div>
                  <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                    GitHub Profile
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 group-hover:text-slate-300">
                Explore →
              </span>
            </a>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2">
              Send a Message
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-mono">
              Fill in your details below and it will route directly to my inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5" htmlFor="name">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Smith"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5" htmlFor="email">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@company.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5" htmlFor="message">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hi Nishanth, I would love to discuss an internship / project opportunity..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-sm transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
