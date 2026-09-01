import React, { useState } from 'react';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../api/client';

export default function CategoryModal({ category, onClose, onSave, onShowToast }) {
  const isEditing = Boolean(category?.id);

  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    icon: category?.icon || 'Layers',
    sortOrder: category?.sortOrder || 0,
    isActive: category?.isActive !== undefined ? category.isActive : true
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a category name.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let result;
      if (isEditing) {
        result = await api.updateCategory(category.id, formData);
      } else {
        result = await api.createCategory(formData);
      }

      if (result.success) {
        onSave(result.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-card rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl bg-slate-900/95 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isEditing ? 'Edit Category' : 'Create New Category'}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Categories dynamically group your work items on the public portfolio
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1" htmlFor="catName">
              Category Name <span className="text-cyan-400">*</span>
            </label>
            <input
              id="catName"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Content Writing, Data Analytics, AI / ML"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1" htmlFor="catSlug">
              URL Slug (Optional, auto-generated)
            </label>
            <input
              id="catSlug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g. content-writing"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1" htmlFor="catDesc">
              Short Description
            </label>
            <textarea
              id="catDesc"
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of work samples grouped under this category..."
              className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 text-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1" htmlFor="catIcon">
                Icon Name
              </label>
              <select
                id="catIcon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400/50 cursor-pointer"
              >
                <option value="Layers">Layers (Default)</option>
                <option value="Feather">Feather (Writing)</option>
                <option value="FileText">FileText (Documents)</option>
                <option value="BarChart3">BarChart3 (Analytics)</option>
                <option value="LineChart">LineChart (BI / Charts)</option>
                <option value="Sparkles">Sparkles (AI / ML)</option>
                <option value="Code2">Code2 (Software)</option>
                <option value="Database">Database (Data Pipelines)</option>
                <option value="Globe">Globe (Web Apps)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1" htmlFor="catOrder">
                Display Order
              </label>
              <input
                id="catOrder"
                name="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="catActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400/50 cursor-pointer bg-slate-900 border-white/20"
            />
            <label htmlFor="catActive" className="text-xs font-mono text-slate-300 cursor-pointer">
              Active (Visible on public portfolio tabs)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create Category'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}