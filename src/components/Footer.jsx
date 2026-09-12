import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Fish } from 'lucide-react';
import { useSettings } from '@/lib/settingsContext';
import { useLanguage } from '@/lib/languageContext';

export default function Footer() {
  const { settings } = useSettings();
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={settings.logo_url} alt="Mesina Farms" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h3 className="text-xl font-bold text-white">{settings.farm_name}</h3>
                <p className="text-sm text-blue-400">Hito Hatchery & Grower</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {settings.about_content?.substring(0, 180)}...
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog" className="hover:text-blue-400 transition">{t('catalog')}</Link></li>
              <li><Link to="/fish-care" className="hover:text-blue-400 transition">{t('fishCare')}</Link></li>
              <li><Link to="/location" className="hover:text-blue-400 transition">{t('location')}</Link></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition">{t('blog')}</Link></li>
              <li><Link to="/order" className="hover:text-blue-400 transition">{t('order')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-blue-400 transition">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-blue-400 transition">{settings.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Mon–Fri: {settings.operating_hours?.mon_fri}</p>
                  <p>Sat: {settings.operating_hours?.sat}</p>
                  <p>Sun: {settings.operating_hours?.sun}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} {settings.farm_name}. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Fish className="w-4 h-4 text-blue-400" />
            <span>Premium Clarias batrachus aquaculture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}