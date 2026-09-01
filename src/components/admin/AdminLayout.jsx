import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Tag, 
  FileText, 
  Key, 
  LogOut, 
  Home, 
  User,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

export default function AdminLayout({ 
  user, 
  activeTab, 
  onTabChange, 
  onLogout, 
  onBackToPortfolio, 
  onShowToast, 
  children 
}) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const tabs = [
    { id: 'projects', label: 'Projects & Work', icon: Layers },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'resume', label: 'Resume', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      {/* Security Banner if using initial setup password */}
      {user?.mustChangePassword && (
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-orange-500/20 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-200">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Security Action Required:</strong> Your admin account is using the initial setup credentials. Update your password before production deployment.
              </span>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-[11px] hover:bg-amber-300 transition-colors shadow-sm"
            >
              <span>Change Password Now</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Admin Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 glass-nav px-4 sm:px-6 lg:px-8 py-3.5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand & Portal Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortfolio}
              className="flex items-center gap-2 group focus:outline-none"
              title="Return to Public Portfolio"
            >
              <span className="font-extrabold tracking-tighter text-xl text-white group-hover:text-cyan-400 transition-colors">
                Nishanth.
              </span>
            </button>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Management</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToPortfolio}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>View Portfolio</span>
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Change Password"
            >
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Password</span>
            </button>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-xs font-mono text-slate-300">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>{user?.username || 'admin'}</span>
            </div>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-red-300 hover:text-red-200 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Tab Switcher Sub-Navigation */}
      <div className="border-b border-white/10 bg-slate-950/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            setShowPasswordModal(false);
            if (onShowToast) onShowToast('Admin password updated successfully!', 'success');
            if (user) user.mustChangePassword = false;
          }}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}