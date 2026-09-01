import React, { useState, useEffect } from 'react';
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

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminProjectsTable from './components/admin/AdminProjectsTable';
import AdminCategories from './components/admin/AdminCategories';
import AdminResume from './components/admin/AdminResume';
import ProjectModal from './components/admin/ProjectModal';
import DeleteConfirmModal from './components/admin/DeleteConfirmModal';
import { api, getStoredToken } from './api/client';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState('projects'); // 'projects' | 'categories' | 'resume'

  // Admin Project Management state
  const [adminProjects, setAdminProjects] = useState([]);
  const [adminCategories, setAdminCategories] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Feedback Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 3500);
  };

  // Check URL routing for /admin
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const isAdmin = path.startsWith('/admin') || hash.startsWith('#/admin');
      setIsAdminRoute(isAdmin);
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Check Admin Authentication Status
  useEffect(() => {
    const verifyAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setAdminUser(null);
        setAdminLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setAdminUser(res.user);
        } else {
          setAdminUser(null);
        }
      } catch (err) {
        setAdminUser(null);
      } finally {
        setAdminLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Fetch admin projects list
  const fetchAdminProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await api.getProjects();
      if (res.success && Array.isArray(res.data)) {
        setAdminProjects(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load work items.', 'error');
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch admin categories list
  const fetchAdminCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await api.getCategories(true);
      if (res.success && Array.isArray(res.data)) {
        setAdminCategories(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load categories.', 'error');
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminRoute && adminUser) {
      fetchAdminProjects();
      fetchAdminCategories();
    }
  }, [isAdminRoute, adminUser]);

  // Route switch handlers
  const navigateToAdmin = (e) => {
    if (e) e.preventDefault();
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
  };

  const navigateToPortfolio = (e) => {
    if (e) e.preventDefault();
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setAdminUser(user);
    showToast(`Welcome back, ${user.username}!`, 'success');
  };

  const handleLogout = async () => {
    await api.logout();
    setAdminUser(null);
    showToast('Logged out successfully.', 'success');
  };

  // Project CRUD Handlers
  const handleAddProject = () => {
    setSelectedProject(null);
    setShowEditorModal(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowEditorModal(true);
  };

  const handleSaveProject = (savedProject) => {
    setShowEditorModal(false);
    showToast(`Work item "${savedProject.title}" saved successfully!`, 'success');
    fetchAdminProjects();
    fetchAdminCategories();
  };

  const handleDeletePrompt = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDeleted = (deletedId) => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
    setAdminProjects(prev => prev.filter(p => p.id !== deletedId));
    fetchAdminCategories();
  };

  // Category CRUD Handlers
  const handleSaveCategory = (savedCategory) => {
    showToast(`Category "${savedCategory.name}" saved!`, 'success');
    fetchAdminCategories();
    fetchAdminProjects();
  };

  const handleDeleteCategory = (deletedId) => {
    setAdminCategories(prev => prev.filter(c => c.id !== deletedId));
    fetchAdminProjects();
  };

  // RENDER: Admin Area
  if (isAdminRoute) {
    if (adminLoading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center text-slate-400 font-mono text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Loading admin interface...</span>
          </div>
        </div>
      );
    }

    if (!adminUser) {
      return (
        <>
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onBackToPortfolio={navigateToPortfolio}
          />
          {toast.message && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ message: '', type: 'success' })}
            />
          )}
        </>
      );
    }

    return (
      <AdminLayout
        user={adminUser}
        activeTab={activeAdminTab}
        onTabChange={setActiveAdminTab}
        onLogout={handleLogout}
        onBackToPortfolio={navigateToPortfolio}
        onShowToast={showToast}
      >
        {activeAdminTab === 'projects' && (
          <>
            <AdminProjectsTable
              projects={adminProjects}
              loading={projectsLoading}
              onRefresh={fetchAdminProjects}
              onAddProject={handleAddProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeletePrompt}
            />

            {showEditorModal && (
              <ProjectModal
                project={selectedProject}
                onClose={() => setShowEditorModal(false)}
                onSave={handleSaveProject}
                onShowToast={showToast}
              />
            )}

            {showDeleteModal && (
              <DeleteConfirmModal
                project={projectToDelete}
                onClose={() => setShowDeleteModal(false)}
                onDeleted={handleDeleted}
                onShowToast={showToast}
              />
            )}
          </>
        )}

        {activeAdminTab === 'categories' && (
          <AdminCategories
            categories={adminCategories}
            loading={categoriesLoading}
            onRefresh={fetchAdminCategories}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
            onShowToast={showToast}
          />
        )}

        {activeAdminTab === 'resume' && (
          <AdminResume onShowToast={showToast} />
        )}

        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: 'success' })}
          />
        )}
      </AdminLayout>
    );
  }

  // RENDER: Public Portfolio
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

      <Footer onAdminClick={navigateToAdmin} />

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