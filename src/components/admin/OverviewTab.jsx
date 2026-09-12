import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, Package, AlertTriangle, TrendingUp, MapPin, Clock, Activity } from 'lucide-react';

export default function OverviewTab() {
  const [visitors, setVisitors] = useState([]);
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Visitor.list('-visit_date', 100).catch(() => []),
      base44.entities.Product.list('-created_date', 50).catch(() => []),
      base44.entities.OrderInquiry.list('-created_date', 50).catch(() => [])
    ]).then(([v, p, i]) => {
      setVisitors(v || []);
      setProducts(p || []);
      setInquiries(i || []);
      setLoading(false);
    });
  }, []);

  const lowStockProducts = products.filter(p => p.stock_count <= (p.low_stock_threshold || 50));
  const newInquiries = inquiries.filter(i => i.status === 'new');
  const uniqueLocations = [...new Set(visitors.map(v => v.location).filter(Boolean))];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Visitors" value={visitors.length} color="blue" />
        <StatCard icon={Package} label="Total Products" value={products.length} color="green" />
        <StatCard icon={AlertTriangle} label="Low Stock Alerts" value={lowStockProducts.length} color="orange" />
        <StatCard icon={Clock} label="New Inquiries" value={newInquiries.length} color="purple" />
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-5">
          <h3 className="font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Low Stock Warning
          </h3>
          <div className="space-y-2">
            {lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg px-4 py-2.5">
                <span className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</span>
                <span className="text-sm font-bold text-orange-600">{p.stock_count} left (threshold: {p.low_stock_threshold || 50})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Stock Monitor */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600 dark:text-cyan-400" /> Real-time Stock Monitor
        </h3>
        <div className="space-y-2">
          {products.map(p => {
            const pct = Math.min(100, (p.stock_count / 500) * 100);
            const color = p.stock_count <= 0 ? 'bg-red-500' : p.stock_count <= (p.low_stock_threshold || 50) ? 'bg-orange-500' : 'bg-green-500';
            return (
              <div key={p.id} className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-40 truncate">{p.name}</span>
                <div className="flex-1 h-6 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white w-16 text-right">{p.stock_count}</span>
              </div>
            );
          })}
          {products.length === 0 && <p className="text-sm text-slate-400">No products yet.</p>}
        </div>
      </div>

      {/* Visitor Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-cyan-400" /> Visitor Locations
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uniqueLocations.length > 0 ? uniqueLocations.map(loc => {
              const count = visitors.filter(v => v.location === loc).length;
              return (
                <div key={loc} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{loc}</span>
                  <span className="font-semibold text-blue-600 dark:text-cyan-400">{count} visits</span>
                </div>
              );
            }) : <p className="text-sm text-slate-400">No visitor data yet.</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-cyan-400" /> Recent Visitors
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {visitors.slice(0, 10).map(v => (
              <div key={v.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300 truncate">{v.location || 'Unknown'}</span>
                <span className="text-xs text-slate-400">{new Date(v.visit_date).toLocaleDateString()}</span>
              </div>
            ))}
            {visitors.length === 0 && <p className="text-sm text-slate-400">No visitors yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
  };
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}