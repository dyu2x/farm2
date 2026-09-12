import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Trash2, Plus, Image as ImageIcon, Save } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function ContentTab({ section = 'hero' }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const entity = section === 'hero' ? base44.entities.HeroImage : base44.entities.AboutImage;

  const load = () => {
    entity.list('-created_date', 50)
      .then(r => { setImages(r || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [section]);

  const handleUpload = async (urls) => {
    const urlList = Array.isArray(urls) ? urls : [urls];
    for (const url of urlList) {
      await entity.create({ image_url: url, active: true });
    }
    load();
  };

  const toggleActive = async (img) => {
    await entity.update(img.id, { active: !img.active });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    await entity.delete(id);
    load();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-bold text-slate-900 dark:text-white mb-2">
          {section === 'hero' ? 'Homepage Hero Images' : 'About Us Images'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {section === 'hero'
            ? 'These images rotate on the homepage every 10 minutes. Upload multiple images for variety.'
            : 'These images display as a slideshow in the About Us section on the homepage.'}
        </p>
        <ImageUploader label="Upload New Images" multiple onUpload={handleUpload} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <img src={img.image_url} alt="" className="w-full h-32 object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
              <button
                onClick={() => toggleActive(img)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${img.active ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}
              >
                {img.active ? 'Active' : 'Hidden'}
              </button>
              <button onClick={() => handleDelete(img.id)} className="p-1.5 rounded-lg bg-red-500 text-white">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {!img.active && <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-700 text-white text-xs">Hidden</div>}
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-20">
          <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">No images uploaded yet.</p>
        </div>
      )}
    </div>
  );
}