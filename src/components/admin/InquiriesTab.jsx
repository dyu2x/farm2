import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Download, Search, Phone, Mail, MapPin, User, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function InquiriesTab() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  const load = () => {
    base44.entities.OrderInquiry.list('-created_date', 200)
      .then(r => { setInquiries(r || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = inquiries.filter(i => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (filterDate && !new Date(i.created_date).toISOString().startsWith(filterDate)) return false;
    if (filterLocation && !i.location?.toLowerCase().includes(filterLocation.toLowerCase())) return false;
    if (search && !i.customer_name?.toLowerCase().includes(search.toLowerCase()) && !i.email?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const exportCSV = () => {
    const headers = ['Customer Name', 'Email', 'Phone', 'Location', 'Product', 'Size', 'Quantity', 'Message', 'Status', 'Contacted By', 'Contacted Date', 'Date Submitted'];
    const rows = filtered.map(i => [
      i.customer_name, i.email, i.phone, i.location, i.product_name, i.size_preference, i.quantity,
      (i.message || '').replace(/,/g, ';'), i.status, i.contacted_by || '',
      i.contacted_date ? new Date(i.contacted_date).toLocaleString() : '',
      new Date(i.created_date).toLocaleString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const markContacted = async (id) => {
    await base44.entities.OrderInquiry.update(id, {
      status: 'contacted',
      contacted_by: user?.email || 'Admin',
      contacted_date: new Date().toISOString()
    });
    load();
  };

  const updateStatus = async (id, status) => {
    await base44.entities.OrderInquiry.update(id, { status });
    load();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text" value={filterLocation} onChange={e => setFilterLocation(e.target.value)} placeholder="Filter location..." className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={exportCSV} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map(i => (
          <div key={i.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">{i.customer_name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    i.status === 'new' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                    i.status === 'contacted' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}>{i.status}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {i.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {i.phone}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {i.location}</span>
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> {i.product_name} ({i.size_preference}) × {i.quantity}</span>
                </div>
                {i.message && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 italic">"{i.message}"</p>}
                {i.contacted_by && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Contacted by {i.contacted_by} on {new Date(i.contacted_date).toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Submitted: {new Date(i.created_date).toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                {i.status === 'new' && (
                  <button onClick={() => markContacted(i.id)} className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition">
                    Mark Contacted
                  </button>
                )}
                <select value={i.status} onChange={e => updateStatus(i.id, e.target.value)} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-slate-400">No inquiries found.</p>
        </div>
      )}
    </div>
  );
}