import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Trash2, X, Save, Package, AlertTriangle } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

const categoryOptions = [
  { value: 'starter_fingerlings', label: 'Starter Fingerlings' },
  { value: 'standard_growout', label: 'Standard Grow-out' },
  { value: 'advance_stocker', label: 'Advance Stocker' },
  { value: 'jumbo_stocker', label: 'Jumbo Stocker' },
];

const defaultImages = {
  starter_fingerlings: 'https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/f10074aee_generated_image.png',
  standard_growout: 'https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/1749e5533_generated_image.png',
  advance_stocker: 'https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/7ef824960_generated_image.png',
  jumbo_stocker: 'https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/7ef824960_generated_image.png'
};

export default function CatalogTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    base44.entities.Product.list('-created_date', 50)
      .then(r => { setProducts(r || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    if (editing?.id) {
      await base44.entities.Product.update(editing.id, data);
    } else {
      await base44.entities.Product.create(data);
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await base44.entities.Product.delete(id);
    load();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{products.length} products in catalog</p>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(p => {
          const img = p.images?.[0] || defaultImages[p.category];
          const isLow = p.stock_count <= (p.low_stock_threshold || 50);
          return (
            <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex gap-4">
              <img src={img} alt={p.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</h3>
                <p className="text-xs text-blue-600 dark:text-cyan-400">{p.size_label || categoryOptions.find(c => c.value === p.category)?.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">₱{p.base_price}/pc</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isLow ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' : 'bg-green-100 text-green-600 dark:bg-green-900/30'}`}>
                    {p.stock_count} in stock
                  </span>
                  {isLow && <AlertTriangle className="w-3 h-3 text-orange-500" />}
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-xs px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition flex items-center gap-1">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-xs px-3 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">No products yet. Click "Add Product" to create one.</p>
        </div>
      )}

      {showForm && <ProductForm product={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'starter_fingerlings',
    size_label: product?.size_label || '',
    base_price: product?.base_price || 0,
    stock_count: product?.stock_count || 0,
    images: product?.images || [],
    tier_pricing: product?.tier_pricing || [],
    low_stock_threshold: product?.low_stock_threshold || 50,
    active: product?.active !== false,
  });
  const [saving, setSaving] = useState(false);

  const addTier = () => setForm(f => ({ ...f, tier_pricing: [...f.tier_pricing, { min_quantity: 100, price_per_unit: f.base_price }] }));
  const updateTier = (i, field, val) => setForm(f => {
    const tiers = [...f.tier_pricing];
    tiers[i] = { ...tiers[i], [field]: parseFloat(val) || 0 };
    return { ...f, tier_pricing: tiers };
  });
  const removeTier = (i) => setForm(f => ({ ...f, tier_pricing: f.tier_pricing.filter((_, idx) => idx !== i) }));

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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{product ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name *</label>
            <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea rows="2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                {categoryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Size Label</label>
              <input type="text" value={form.size_label} onChange={e => setForm(f => ({ ...f, size_label: e.target.value }))} placeholder="e.g. 2-3 inches" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Base Price (₱)</label>
              <input type="number" step="0.01" value={form.base_price} onChange={e => setForm(f => ({ ...f, base_price: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Count</label>
              <input type="number" value={form.stock_count} onChange={e => setForm(f => ({ ...f, stock_count: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Low Stock Alert</label>
              <input type="number" value={form.low_stock_threshold} onChange={e => setForm(f => ({ ...f, low_stock_threshold: parseInt(e.target.value) || 50 }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Tier Pricing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tier Pricing (qty-based)</label>
              <button type="button" onClick={addTier} className="text-xs px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 hover:bg-blue-100 transition flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Tier
              </button>
            </div>
            {form.tier_pricing.map((tier, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="number" placeholder="Min Qty" value={tier.min_quantity} onChange={e => updateTier(i, 'min_quantity', e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" step="0.01" placeholder="Price/unit" value={tier.price_per_unit} onChange={e => updateTier(i, 'price_per_unit', e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={() => removeTier(i)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          <ImageUploader label="Product Images" multiple onUpload={(urls) => setForm(f => ({ ...f, images: [...(f.images || []), ...(Array.isArray(urls) ? urls : [urls])] }))} />

          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="rounded" />
            <label htmlFor="active" className="text-sm text-slate-700 dark:text-slate-300">Active (visible on website)</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}