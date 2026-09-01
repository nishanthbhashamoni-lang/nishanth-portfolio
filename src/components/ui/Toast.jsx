import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 border border-white/10 text-white shadow-2xl backdrop-blur-md animate-bounce">
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
      )}
      <span className="text-sm font-medium text-slate-200">{message}</span>
      <button 
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors"
        aria-label="Close Notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
