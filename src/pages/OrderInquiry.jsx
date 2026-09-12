import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Send, User, Mail, Phone, MapPin, Package, Ruler, MessageSquare, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useSettings } from '@/lib/settingsContext';

export default function OrderInquiry() {
  const [searchParams] = useSearchParams();
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    email: '',
    phone: '',
    location: '',
    product_name: searchParams.get('product') || '',
    size_preference: '',
    quantity: searchParams.get('qty') ? parseInt(searchParams.get('qty')) : 1,
    message: ''
  });

  useEffect(() => {
    base44.entities.Product.list('-created_date', 50)
      .then(records => { setProducts(records?.filter(p => p.active) || []); })
      .catch(() => {});
  }, []);

  const productSelected = !!form.product_name;
  const allFilled = form.customer_name.trim() && form.email.trim() && form.phone.trim() &&
    form.location.trim() && form.product_name && form.size_preference && form.quantity > 0 && form.message.trim();

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allFilled || submitting) return;
    setSubmitting(true);
    try {
      const product = products.find(p => p.name === form.product_name);
      await base44.entities.OrderInquiry.create({
        ...form,
        product_id: product?.id || '',
        quantity: parseInt(form.quantity)
      });
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Inquiry Submitted!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Thank you for your interest. Our team will contact you within 24 hours at the phone number or email you provided.
          </p>
          <Link to="/" className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <div className="relative h-[30vh] min-h-[220px] overflow-hidden">
        <img src="https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/1749e5533_generated_image.png" alt="Order Inquiry" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <Package className="w-12 h-12 text-cyan-400 mb-3" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Order Inquiry</h1>
          <p className="text-slate-200 max-w-xl">Fill out the form below and we'll get back to you with pricing and availability</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={e => handleChange('customer_name', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Juan Dela Cruz"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="juan@example.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="+63 9XX XXX XXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location / Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={e => handleChange('location', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="City, Province"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Product *</label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select
                required
                value={form.product_name}
                onChange={e => { handleChange('product_name', e.target.value); handleChange('size_preference', ''); }}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
              >
                <option value="">Select a product...</option>
                {products.map(p => <option key={p.id} value={p.name}>{p.name} — {p.size_label || p.category}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Size Preference *</label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <select
                  required
                  value={form.size_preference}
                  onChange={e => handleChange('size_preference', e.target.value)}
                  disabled={!productSelected}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none ${
                    !productSelected ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">{productSelected ? 'Select size...' : 'Select product first'}</option>
                  <option value="Starter Fingerlings">Starter Fingerlings</option>
                  <option value="Standard Grow-out">Standard Grow-out</option>
                  <option value="Advance Stocker">Advance Stocker</option>
                  <option value="Jumbo Stocker">Jumbo Stocker</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Quantity *</label>
              <input
                type="number"
                required
                min="1"
                value={form.quantity}
                onChange={e => handleChange('quantity', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Number of pieces"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message / Special Requests *</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                required
                rows="4"
                value={form.message}
                onChange={e => handleChange('message', e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                placeholder="Tell us about your requirements, delivery preferences, etc."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!allFilled || submitting}
            className={`w-full py-3.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
              allFilled && !submitting
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
            ) : (
              <><Send className="w-5 h-5" /> Submit Inquiry</>
            )}
          </button>
          {!allFilled && (
            <p className="text-center text-xs text-slate-400">All fields are required to submit your inquiry</p>
          )}
        </form>
      </div>
    </div>
  );
}