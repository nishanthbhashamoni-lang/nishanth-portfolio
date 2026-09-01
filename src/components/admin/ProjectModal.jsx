import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../api/client';
import { 
  X, 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  Check, 
  ExternalLink, 
  Github, 
  AlertCircle,
  Loader2,
  Tag,
  Paperclip
} from 'lucide-react';

export default function ProjectModal({ project, onClose, onSave, onShowToast }) {
  const isEditing = Boolean(project?.id);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [availableCategories, setAvailableCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    id: project?.id || '',
    title: project?.title || '',
    tagline: project?.tagline || '',
    description: project?.description || '',
    longDescription: project?.longDescription || '',
    workType: project?.workType || 'Project',
    category: project?.category || 'Software Project',
    status: project?.status || 'Completed',
    image: project?.image || '',
    github: project?.github || '',
    demo: project?.demo || '',
    externalUrl: project?.externalUrl || '',
    fileUrl: project?.fileUrl || '',
    date: project?.date || '',
    iconType: project?.iconType || 'code',
    sortOrder: project?.sortOrder || 0,
    featured: project?.featured || false
  });

  const [selectedCategoryIds, setSelectedCategoryIds] = useState(
    Array.isArray(project?.categories) 
      ? project.categories.map(c => c.id || c) 
      : []
  );

  const [technologies, setTechnologies] = useState(
    Array.isArray(project?.technologies) 
      ? project.technologies 
      : (project?.technologies ? JSON.parse(project.technologies) : [])
  );
  const [techInput, setTechInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch available categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.getCategories(true);
        if (res.success && Array.isArray(res.data)) {
          setAvailableCategories(res.data);
        }
      } catch (err) {
        console.warn('Failed to load categories for modal:', err.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategoryIds(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Add technology tag
  const handleAddTech = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = techInput.trim().replace(',', '');
      if (val && !technologies.includes(val)) {
        setTechnologies([...technologies, val]);
        setTechInput('');
      }
    }
  };

  const handleRemoveTech = (indexToRemove) => {
    setTechnologies(technologies.filter((_, i) => i !== indexToRemove));
  };

  // Image Upload Handling
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const res = await api.uploadFile(file);
      if (res.success && res.url) {
        setFormData(prev => ({ ...prev, image: res.url }));
        if (onShowToast) onShowToast('Thumbnail uploaded!', 'success');
      }
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  // Document / Sample PDF Upload Handling
  const handleDocFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Attachment file size must be under 10MB.');
      return;
    }

    setUploadingFile(true);
    setError('');

    try {
      const res = await api.uploadFile(file);
      if (res.success && res.url) {
        setFormData(prev => ({ ...prev, fileUrl: res.url }));
        if (onShowToast) onShowToast('File sample attached!', 'success');
      }
    } catch (err) {
      setError(err.message || 'Attachment upload failed.');
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please provide a title and description.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        technologies,
        categoryIds: selectedCategoryIds
      };

      let result;
      if (isEditing) {
        result = await api.updateProject(project.id, payload);
      } else {
        result = await api.createProject(payload);
      }

      if (result.success) {
        onSave(result.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to save work item.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 glass-card rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl bg-slate-900/95 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isEditing ? 'Edit Work Item' : 'Add New Work / Project'}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Supports software projects, content writing samples, research, scripts & dashboards
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Core Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-300 mb-1.5" htmlFor="title">
                  Title / Article Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Retail Demand Forecasting, The Future of LLMs..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5" htmlFor="workType">
                  Work Type
                </label>
                <select
                  id="workType"
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400/50 cursor-pointer"
                >
                  <option value="Project">Project (Software)</option>
                  <option value="Article">Article / Blog</option>
                  <option value="Script">Script / Copywriting</option>
                  <option value="Research">Research Paper</option>
                  <option value="Dashboard">BI Dashboard</option>
                  <option value="Case Study">Case Study</option>
                </select>
              </div>
            </div>

            {/* Category Multi-Selection */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Assigned Categories (Select one or more)
              </label>
              {loadingCategories ? (
                <div className="text-xs font-mono text-slate-500">Loading categories...</div>
              ) : availableCategories.length === 0 ? (
                <div className="text-xs font-mono text-amber-400">No categories found. Create categories in the Categories tab.</div>
              ) : (
                <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-white/10">
                  {availableCategories.map((cat) => {
                    const isSelected = selectedCategoryIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                            : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        <span>{cat.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-cyan-400 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5" htmlFor="tagline">
                  Tagline / Subtitle
                </label>
                <input
                  id="tagline"
                  name="tagline"
                  type="text"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. In-Depth Analysis on Model Alignment"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400/50 cursor-pointer"
                >
                  <option value="Completed">Completed / Published</option>
                  <option value="In Progress">In Progress / Draft</option>
                  <option value="Coming Soon">Coming Soon</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5" htmlFor="description">
                Description / Summary <span className="text-cyan-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed summary of the project or content piece..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 text-xs leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Section 2: Tags & Skills */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Technologies / Tags (e.g. Python, SQL, SEO, Technical Writing)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-white/10 min-h-[44px]">
              {technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs font-mono text-cyan-300 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(idx)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                placeholder={technologies.length === 0 ? "Type tag and press Enter..." : "Add more..."}
                className="flex-1 min-w-[120px] bg-transparent border-none text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none px-2 py-1"
              />
            </div>
          </div>

          {/* Section 3: Links & External URLs */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Links & Publications (Only filled links will be shown)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1" htmlFor="externalUrl">
                  External Publication / Medium / Article URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <input
                    id="externalUrl"
                    name="externalUrl"
                    type="url"
                    value={formData.externalUrl}
                    onChange={handleChange}
                    placeholder="https://medium.com/@yourname/article"
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1" htmlFor="demo">
                  Live Demo / Dashboard URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <input
                    id="demo"
                    name="demo"
                    type="url"
                    value={formData.demo}
                    onChange={handleChange}
                    placeholder="https://public.tableau.com/..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1" htmlFor="github">
                  GitHub Repository URL (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Github className="w-4 h-4" />
                  </div>
                  <input
                    id="github"
                    name="github"
                    type="url"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username/repo"
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1" htmlFor="date">
                  Date / Sprint Tag
                </label>
                <input
                  id="date"
                  name="date"
                  type="text"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="e.g. 2026, TakeOver'26, Aug 2026"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: File Attachments (Sample PDF/Doc & Thumbnail Image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Thumbnail Image */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300">
                Thumbnail Image (PNG, JPG, WEBP)
              </label>

              {formData.image ? (
                <div className="relative rounded-xl border border-white/10 overflow-hidden bg-slate-950 p-2">
                  <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                    <img src={formData.image} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="px-2 py-1 rounded bg-cyan-500 text-slate-950 font-bold text-[11px]"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="p-1 rounded bg-red-500 text-white text-[11px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border border-dashed border-white/15 hover:border-cyan-400/40 rounded-xl p-4 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950 transition-colors"
                >
                  {uploadingImage ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading image...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                      <span className="text-xs text-slate-300 font-semibold">Upload Image</span>
                    </div>
                  )}
                </div>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Document / Sample File Attachment */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300">
                Sample Document / PDF Attachment
              </label>

              {formData.fileUrl ? (
                <div className="relative rounded-xl border border-white/10 overflow-hidden bg-slate-950 p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span className="text-xs font-mono text-slate-200 truncate">{formData.fileUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, fileUrl: '' }))}
                    className="p-1 rounded text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-white/15 hover:border-cyan-400/40 rounded-xl p-4 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950 transition-colors"
                >
                  {uploadingFile ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Attaching document...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Paperclip className="w-5 h-5 text-slate-400" />
                      <span className="text-xs text-slate-300 font-semibold">Attach PDF / Sample Document</span>
                    </div>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleDocFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Section 5: Fallback Icon & Featured */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400/50 cursor-pointer bg-slate-900 border-white/20"
              />
              <label htmlFor="featured" className="text-xs font-mono text-slate-300 cursor-pointer">
                Mark as Featured Work Item
              </label>
            </div>
          </div>

          {/* Action Buttons */}
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create Work Item'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}