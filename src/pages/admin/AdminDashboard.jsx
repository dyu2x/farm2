import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { ThemeProvider } from '@/lib/themeContext';
import { LanguageProvider } from '@/lib/languageContext';
import { SettingsProvider } from '@/lib/settingsContext';
import {
  LayoutDashboard, Package, Newspaper, ShoppingCart, Image,
  Settings as SettingsIcon, User, LogOut, Fish, Menu, X,
  Moon, Sun, FileText, MapPin
} from 'lucide-react';
import { useTheme } from '@/lib/themeContext';
import OverviewTab from '@/components/admin/OverviewTab';
import CatalogTab from '@/components/admin/CatalogTab';
import BlogTab from '@/components/admin/BlogTab';
import InquiriesTab from '@/components/admin/InquiriesTab';
import SettingsTab from '@/components/admin/SettingsTab';
import ContentTab from '@/components/admin/ContentTab';
import ProfileTab from '@/components/admin/ProfileTab';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'catalog', label: 'Inventory & Catalog', icon: Package },
  { id: 'blog', label: 'Blog & Articles', icon: Newspaper },
  { id: 'inquiries', label: 'Buyer Inquiries', icon: ShoppingCart },
  { id: 'hero', label: 'Hero Images', icon: Image },
  { id: 'about', label: 'About Us', icon: FileText },
  { id: 'settings', label: 'Site Settings', icon: SettingsIcon },
  { id: 'profile', label: 'Admin Profile', icon: User },
];

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(false);
    navigate('/admin/login', { replace: true });
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'catalog': return <CatalogTab />;
      case 'blog': return <BlogTab />;
      case 'inquiries': return <InquiriesTab />;
      case 'hero': return <ContentTab section="hero" />;
      case 'about': return <ContentTab section="about" />;
      case 'settings': return <SettingsTab />;
      case 'profile': return <ProfileTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 dark:bg-black text-white transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
              <Fish className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm">Mesina Farms</h2>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-800">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-slate-400 truncate">{user?.email || 'Admin'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a href="/" target="_blank" className="px-3 py-2 rounded-lg text-sm text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center gap-1">
              <MapPin className="w-4 h-4" /> View Site
            </a>
          </div>
        </header>

        <div className="p-4 md:p-6 lg:p-8">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SettingsProvider>
          <DashboardContent />
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}