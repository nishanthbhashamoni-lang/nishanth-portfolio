import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Layers, 
  Tag, 
  CheckCircle2, 
  EyeOff, 
  RefreshCw,
  Feather,
  BarChart3,
  Sparkles,
  Code2,
  Database,
  Globe,
  LineChart,
  FileText
} from 'lucide-react';
import CategoryModal from './CategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';

export default function AdminCategories({ 
  categories, 
  loading, 
  onRefresh, 
  onSaveCategory, 
  onDeleteCategory, 
  onShowToast 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const getCategoryIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'feather':
        return <Feather className="w-4 h-4 text-emerald-400" />;
      case 'barchart3':
        return <BarChart3 className="w-4 h-4 text-cyan-400" />;
      case 'linechart':
        return <LineChart className="w-4 h-4 text-blue-400" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'code2':
        return <Code2 className="w-4 h-4 text-purple-400" />;
      case 'database':
        return <Database className="w-4 h-4 text-sky-400" />;
      case 'globe':
        return <Globe className="w-4 h-4 text-teal-400" />;
      case 'filetext':
        return <FileText className="w-4 h-4 text-indigo-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredCategories = categories.filter((c) => {
    return (
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAdd = () => {
    setSelectedCategory(null);
    setShowEditorModal(true);
  };

  const handleEdit = (cat) => {
    setSelectedCategory(cat);
    setShowEditorModal(true);
  };

  const handleDeletePrompt = (cat) => {
    setCategoryToDelete(cat);
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Tag className="w-5 h-5 text-cyan-400" />
            <span>Category System</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Create and organize work disciplines (Data Analytics, Content Writing, AI/ML, Software, etc.)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Refresh categories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Category</span>
          </button>
        </div>
      </div>

      {/* Action & Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 text-xs font-mono"
          />
        </div>
        <div className="text-xs font-mono text-slate-400">
          Total Categories: <span className="text-white font-bold">{categories.length}</span>
        </div>
      </div>

      {/* Categories Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        {filteredCategories.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 inline-block text-slate-500">
              <Tag className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="text-base font-bold text-white">No categories found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first dynamic category to begin grouping your work items.
            </p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-semibold text-xs mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Category</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Category Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Work Items</th>
                  <th className="py-3.5 px-4">Sort Order</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Name & Icon */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800 border border-white/10 shrink-0">
                          {getCategoryIcon(cat.icon)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {cat.name}
                          </div>
                          {cat.description && (
                            <div className="text-xs text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                              {cat.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-4 px-4">
                      <span className="text-xs font-mono text-cyan-300/80 px-2 py-0.5 rounded bg-cyan-500/5 border border-cyan-500/20">
                        {cat.slug}
                      </span>
                    </td>

                    {/* Project Count */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 px-2.5 py-0.5 rounded-full bg-slate-800 border border-white/5">
                        <span className="font-bold text-white">{cat.projectCount || 0}</span> items
                      </span>
                    </td>

                    {/* Sort Order */}
                    <td className="py-4 px-4 font-mono text-xs text-slate-400">
                      #{cat.sortOrder || 0}
                    </td>

                    {/* Active Status */}
                    <td className="py-4 px-4 text-center">
                      {cat.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 px-2 py-0.5 rounded-full bg-slate-800 border border-white/5">
                          <EyeOff className="w-3 h-3" />
                          <span>Hidden</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/50 hover:bg-white/10 transition-all"
                          title="Edit Category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePrompt(cat)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Editor Modal */}
      {showEditorModal && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setShowEditorModal(false)}
          onSave={(saved) => {
            setShowEditorModal(false);
            onSaveCategory(saved);
          }}
          onShowToast={onShowToast}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteCategoryModal
          category={categoryToDelete}
          onClose={() => setShowDeleteModal(false)}
          onDeleted={(id) => {
            setShowDeleteModal(false);
            onDeleteCategory(id);
          }}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}