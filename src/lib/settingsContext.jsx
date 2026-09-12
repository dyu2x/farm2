import React, { createContext, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const SettingsContext = createContext();

export const DEFAULT_SETTINGS = {
  farm_name: 'Mesina Farms',
  logo_url: 'https://media.base44.com/images/public/user_6a2e72adedb39f54c210b9a3/747a7fda9_round_transparent.png',
  address: 'Brgy. San Roque, Talavera, Nueva Ecija, Philippines',
  latitude: 15.5930,
  longitude: 120.8930,
  phone: '+63 962 527 9820',
  email: 'support@mesinafarms.com',
  operating_hours: { mon_fri: '8:00 AM - 4:00 PM', sat: 'By Appointment', sun: 'Closed' },
  about_content: 'Mesina Farms is a premier hito (Clarias batrachus) hatchery and grower in the Philippines. We specialize in producing high-quality catfish fingerlings and stockers for aquaculture farmers nationwide. With years of dedicated experience in sustainable fish farming, we ensure healthy, disease-free fingerlings that grow into robust, market-ready catfish.',
  why_choose_us: [
    { title: 'Premium Quality Fingerlings', description: 'Disease-free, genetically robust Clarias batrachus fingerlings bred for fast growth and high survival rates.', icon: 'Award' },
    { title: 'Sustainable Practices', description: 'Eco-friendly aquaculture methods that protect water resources and promote long-term farm productivity.', icon: 'Leaf' },
    { title: 'Expert Support', description: 'Our team provides ongoing guidance on tank setup, feeding, and water management for your success.', icon: 'Users' },
    { title: 'Reliable Supply', description: 'Consistent inventory and timely delivery to keep your grow-out operations running smoothly.', icon: 'Truck' }
  ],
  hero_title: 'Premium Hito Hatchery & Grower',
  hero_subtitle: 'Quality Clarias batrachus fingerlings and stockers for sustainable aquaculture',
  holidays: [
    { date: '2026-01-01', name: 'New Year\'s Day', recurring: true },
    { date: '2026-12-25', name: 'Christmas Day', recurring: true }
  ]
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    base44.entities.SiteSettings.list()
      .then(records => {
        if (mounted && records && records.length > 0) {
          setSettings({ ...DEFAULT_SETTINGS, ...records[0] });
        }
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const refreshSettings = async () => {
    try {
      const records = await base44.entities.SiteSettings.list();
      if (records && records.length > 0) {
        setSettings({ ...DEFAULT_SETTINGS, ...records[0] });
      }
    } catch (e) {}
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);