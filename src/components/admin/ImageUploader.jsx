import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ onUpload, multiple = false, label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleFiles = async (files) => {
    setUploading(true);
    const urls = [];
    for (const file of Array.from(files)) {
      try {
        const result = await base44.integrations.Core.UploadPublicFile({ file });
        urls.push(result.file_url);
      } catch (e) {
        console.error('Upload failed:', e);
      }
    }
    setUploadedUrls(prev => [...prev, ...urls]);
    onUpload(multiple ? urls : urls[0]);
    setUploading(false);
  };

  const removeUrl = (url) => {
    setUploadedUrls(prev => prev.filter(u => u !== url));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-3 mb-3">
        {uploadedUrls.map(url => (
          <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeUrl(url)}
              className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <label className={`w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-blue-500 transition ${uploading ? 'opacity-50' : ''}`}>
          {uploading ? (
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          ) : (
            <div className="text-center">
              <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Upload</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={e => e.target.files.length > 0 && handleFiles(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}