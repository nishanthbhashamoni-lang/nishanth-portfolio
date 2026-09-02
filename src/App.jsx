import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import BeyondCode from './components/sections/BeyondCode';
import CurrentlyLearning from './components/sections/CurrentlyLearning';
import ResumeCTA from './components/sections/ResumeCTA';
import Contact from './components/sections/Contact';
import Toast from './components/ui/Toast';

export default function App() {
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 3500);
  };

  return (
    <div className="relative min-h-screen bg-background text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      <Navbar onShowToast={showToast} />

      <main className="flex-grow">
        <Hero onShowToast={showToast} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <BeyondCode />
        <CurrentlyLearning />
        <ResumeCTA onShowToast={showToast} />
        <Contact onShowToast={showToast} />
      </main>

      <Footer />

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}
    </div>
  );
}