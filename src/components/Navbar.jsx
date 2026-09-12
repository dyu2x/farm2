import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Globe, ChevronDown } from 'lucide-react';
import { useTheme } from '@/lib/themeContext';
import { useLanguage } from '@/lib/languageContext';
import { useSettings } from '@/lib/settingsContext';

const languageLabels = {
  en: 'English', filipino: 'Filipino', cebuano: 'Cebuano/Bisaya', hiligaynon: 'Hiligaynon', karay_a: 'Karay-a'
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { lang, changeLanguage, t, availableLanguages } = useLanguage();
  const { settings } = useSettings();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/catalog', label: t('catalog') },
    { to: '/fish-care', label: t('fishCare') },
    { to: '/location', label: t('location') },
    { to: '/blog', label: t('blog') },
    { to: '/order', label: t('order') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={settings.logo_url}
              alt="Mesina Farms"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-blue-600/30 group-hover:ring-blue-600/60 transition"
            />
            <div>
              <span className="block text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">{settings.farm_name}</span>
              <span className="block text-xs text-blue-600 dark:text-cyan-400 font-medium">Hito Hatchery & Grower</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(link.to)
                    ? 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1"
                title={t('language')}
              >
                <Globe className="w-5 h-5" />
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50">
                  {availableLanguages.map(l => (
                    <button
                      key={l}
                      onClick={() => { changeLanguage(l); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition ${
                        lang === l ? 'text-blue-600 dark:text-cyan-400 font-semibold bg-blue-50 dark:bg-blue-900/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {languageLabels[l] || l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={t('darkMode')}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-4 space-y-1 animate-[accordion-down_0.2s_ease-out]">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.to)
                    ? 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}