import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import { ThemeProvider } from '@/lib/themeContext';
import { LanguageProvider } from '@/lib/languageContext';
import { SettingsProvider } from '@/lib/settingsContext';
import { base44 } from '@/api/base44Client';

export default function Layout() {
  const [heroImages, setHeroImages] = useState([
    'https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/5807f8952_generated_image.png'
  ]);

  useEffect(() => {
    // Track visitor
    const trackVisitor = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/').catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          await base44.entities.Visitor.create({
            ip_address: data.ip || 'unknown',
            location: `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`.trim(', '),
            visit_date: new Date().toISOString(),
            user_agent: navigator.userAgent
          });
        } else {
          await base44.entities.Visitor.create({
            ip_address: 'unknown',
            location: 'Unknown',
            visit_date: new Date().toISOString(),
            user_agent: navigator.userAgent
          });
        }
      } catch (e) {}
    };
    trackVisitor();

    // Load hero images
    base44.entities.HeroImage.list('-created_date', 20)
      .then(records => {
        const active = records?.filter(r => r.active).map(r => r.image_url);
        if (active && active.length > 0) setHeroImages(active);
      })
      .catch(() => {});
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <SettingsProvider>
          <CustomCursor />
          <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors">
            <Navbar />
            <main className="flex-1">
              <Outlet context={{ heroImages }} />
            </main>
            <Footer />
          </div>
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}