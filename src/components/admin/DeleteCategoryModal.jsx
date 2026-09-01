import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { api } from '../../api/client';

export default function DeleteCategoryModal({ category, onClose, onDeleted, onShowToast }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!category?.id) return;
    setDeleting(true);
    setError('');

    try {
      const res = await api.deleteCategory(category.id);
      if (res.success) {
        if (onShowToast) onShowToast(`Category "${category.name}" deleted.`, 'success');
        onDeleted(category.id);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete category.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-card rounded-3xl border border-red-500/20 p-6 sm:p-7 shadow-2xl bg-slate-900/95 space-y-5">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Delete Category</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Are you sure you want to delete <span className="text-white font-semibold">"{category?.name}"</span>? 
            {category?.projectCount > 0 ? (
              <span className="block mt-1 text-amber-300">
                Note: {category.projectCount} work item(s) are currently tagged with this category. Removing this category will detach it from those items without deleting the items themselves.
              </span>
            ) : (
              ' This category has no active work items assigned.'
            )}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
          >
            {deleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}