import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Trash2, X, Save, Newspaper, Youtube } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function BlogTab() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    base44.entities.BlogArticle.list('-published_date', 100)
      .then(r => { setArticles(r || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    if (editing?.id) {
      await base44.entities.BlogArticle.update(editing.id, data);
    } else {
      await base44.entities.BlogArticle.create({ ...data, published_date: data.published_date || new Date().toISOString() });
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    await base44.entities.BlogArticle.delete(id);
    load();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  const statusColors = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    archived: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{articles.length} articles</p>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Article
        </button>
      </div>

      <div className="space-y-3">
        {articles.map(a => (
          <div key={a.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex gap-4">
            <img src={a.images?.[0] || 'https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/fe3d03beb_generated_image.png'} alt={a.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{a.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[a.status] || statusColors.active}`}>{a.status}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{a.excerpt || a.content?.substring(0, 100)}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                <span>{new Date(a.published_date || a.created_date).toLocaleDateString()}</span>
                {a.video_url && <span className="flex items-center gap-1 text-red-500"><Youtube className="w-3 h-3" /> Video</span>}
                <span>{a.images?.length || 0} images</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => { setEditing(a); setShowForm(true); }} className="text-xs px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition flex items-center gap-1">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => handleDelete(a.id)} className="text-xs px-3 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-20">
          <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">No articles yet.</p>
        </div>
      )}

      {showForm && <ArticleForm article={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

function ArticleForm({ article, onSave, onClose }) {
  const [form, setForm] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    images: article?.images || [],
    video_url: article?.video_url || '',
    status: article?.status || 'active',
    published_date: article?.published_date || new Date().toISOString(),
    author: article?.author || 'Mesina Farms',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{article ? 'Edit Article' : 'Add Article'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
            <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Excerpt</label>
            <input type="text" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Short summary..." className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content *</label>
            <textarea rows="5" required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Video URL (YouTube/Social Media)</label>
            <input type="url" value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://youtube.com/..." className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <ImageUploader label="Article Images (slideshow)" multiple onUpload={(urls) => setForm(f => ({ ...f, images: [...(f.images || []), ...(Array.isArray(urls) ? urls : [urls])] }))} />

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Article'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}