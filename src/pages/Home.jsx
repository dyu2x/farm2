import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { MapPin, Clock, Phone, Navigation, ArrowRight, Fish, Leaf } from 'lucide-react';
import FishToTankCalculator from '@/components/FishToTankCalculator';
import ImageSlideshow from '@/components/ImageSlideshow';
import { base44 } from '@/api/base44Client';
import { useSettings } from '@/lib/settingsContext';
import { useLanguage } from '@/lib/languageContext';

export default function Home() {
  const { heroImages } = useOutletContext() || {};
  const { settings } = useSettings();
  const { t } = useLanguage();
  const [currentHero, setCurrentHero] = useState(0);
  const [aboutImages, setAboutImages] = useState([
    'https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/fd2e98005_generated_image.png'
  ]);

  // Rotate hero every 10 minutes
  useEffect(() => {
    if (!heroImages || heroImages.length === 0) return;
    const interval = setInterval(() => {
      const now = new Date();
      const tenMinSlot = Math.floor((now.getHours() * 60 + now.getMinutes()) / 10);
      setCurrentHero(tenMinSlot % heroImages.length);
    }, 60000);
    // Set initial
    const now = new Date();
    const tenMinSlot = Math.floor((now.getHours() * 60 + now.getMinutes()) / 10);
    setCurrentHero(tenMinSlot % heroImages.length);
    return () => clearInterval(interval);
  }, [heroImages]);

  useEffect(() => {
    base44.entities.AboutImage.list('-created_date', 20)
      .then(records => {
        const active = records?.filter(r => r.active).map(r => r.image_url);
        if (active && active.length > 0) setAboutImages(active);
      })
      .catch(() => {});
  }, []);

  const heroImg = (heroImages && heroImages.length > 0) ? heroImages[currentHero] : 'https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/5807f8952_generated_image.png';

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Mesina Farms" className="w-full h-full object-cover transition-opacity duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="animate-[fadeIn_1s_ease-out]">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-300 text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" /> Sustainable Aquaculture
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 max-w-4xl leading-tight">
              {settings.hero_title}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-8">
              {settings.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalog"
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center justify-center gap-2 group"
              >
                Browse Fingerlings <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/order"
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold transition"
              >
                Place an Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-600 dark:text-cyan-400 font-semibold text-sm uppercase tracking-wider">{t('about')}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">
              Cultivating Quality Hito Since Day One
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {settings.about_content}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 text-sm font-medium">Clarias batrachus</span>
              <span className="px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium">Sustainable</span>
              <span className="px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-sm font-medium">Disease-Free</span>
            </div>
          </div>
          <ImageSlideshow images={aboutImages} className="h-[400px] shadow-2xl" />
        </div>
      </section>

      {/* Fish-to-Tank Calculator */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">{t('calculator')}</h2>
            <p className="text-slate-500 dark:text-slate-400">Plan your stocking density before you buy</p>
          </div>
          <FishToTankCalculator />
        </div>
      </section>

      {/* Farm Location Preview */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-600 dark:text-cyan-400 font-semibold text-sm uppercase tracking-wider">{t('location')}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">
              Visit Our Farm
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-600 dark:text-slate-300">{settings.address}</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                <div className="text-slate-600 dark:text-slate-300">
                  <p>Mon–Fri: {settings.operating_hours?.mon_fri}</p>
                  <p>Saturday: {settings.operating_hours?.sat}</p>
                  <p>Sunday: {settings.operating_hours?.sun}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400">{settings.phone}</a>
              </div>
            </div>
            <Link
              to="/location"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition group"
            >
              <Navigation className="w-5 h-5" /> {t('getDirections')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl h-[350px]">
            <iframe
              src={`https://www.google.com/maps?q=${settings.latitude},${settings.longitude}&z=14&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Farm Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
}