import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  ExternalLink, 
  Download, 
  Clock, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { api } from '../../api/client';

export default function AdminResume({ onShowToast }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getResumeStatus();
      if (res.success) {
        setStatus(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch resume status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Resume PDF size must be under 10MB.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const res = await api.uploadResume(file);
      if (res.success) {
        if (onShowToast) onShowToast('Resume uploaded and published successfully!', 'success');
        fetchStatus();
      }
    } catch (err) {
      setError(err.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteResume = async () => {
    setDeleting(true);
    setError('');
    try {
      const res = await api.deleteResume();
      if (res.success) {
        setShowDeleteConfirm(false);
        if (onShowToast) onShowToast('Resume removed successfully.', 'success');
        fetchStatus();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete resume.');
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Resume Management</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Upload, update, and manage the official resume PDF served on your public portfolio.
          </p>
        </div>

        <button
          onClick={fetchStatus}
          className="self-start p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Refresh Resume Status"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Status & Current Resume Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Active Resume Details Card */}
        <div className="md:col-span-7 glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Current Live Resume
            </h3>
            {status?.available ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Active & Published
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                No Resume Uploaded
              </span>
            )}
          </div>

          {status?.available ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white truncate">
                      {status.originalName || status.filename || 'Nishanth_Bhashamoni_Resume.pdf'}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatFileSize(status.size)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{status.updatedAt ? new Date(status.updatedAt).toLocaleDateString() : 'Active'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <a
                  href="/api/resume/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Open in Browser</span>
                </a>

                <a
                  href="/api/resume/download"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </a>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium transition-colors ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-white/5 space-y-2">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">No Resume File Active</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload your resume PDF on the right to immediately activate the "Resume" and "Download Resume" buttons on the public website.
              </p>
            </div>
          )}
        </div>

        {/* Right: Upload / Replace Card */}
        <div className="md:col-span-5 glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            {status?.available ? 'Replace Resume PDF' : 'Upload New Resume PDF'}
          </h3>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/15 hover:border-cyan-400/50 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-950/50 hover:bg-slate-950/80 group"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <span className="text-xs font-mono text-slate-300">Uploading and publishing PDF...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3.5 rounded-full bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Click to select resume PDF
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-1">
                    Accepts PDF files up to 10MB
                  </div>
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          <p className="text-[11px] text-slate-500 font-mono leading-relaxed">
            Uploading a new PDF instantly updates the resume across all public website buttons with proper MIME serving.
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-card rounded-3xl border border-red-500/20 p-6 sm:p-7 shadow-2xl bg-slate-900/95 space-y-4">
            <h3 className="text-base font-bold text-white">Delete Resume?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to remove the current resume PDF? Public visitors will see a clean "Resume unavailable" notification until a new file is uploaded.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteResume}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}