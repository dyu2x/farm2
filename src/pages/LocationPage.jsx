import React from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, Apple, Globe, Map as MapIcon } from 'lucide-react';
import { useSettings } from '@/lib/settingsContext';
import OperatingHoursCalendar from '@/components/OperatingHoursCalendar';
import { useLanguage } from '@/lib/languageContext';

export default function LocationPage() {
  const { settings } = useSettings();
  const { t } = useLanguage();

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${settings.latitude},${settings.longitude}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${settings.latitude},${settings.longitude}`;
  const mapQuestUrl = `https://www.mapquest.com/directions?destination=${settings.latitude},${settings.longitude}`;
  const googleEmbed = `https://www.google.com/maps?q=${settings.latitude},${settings.longitude}&z=14&output=embed`;

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <div className="relative h-[35vh] min-h-[250px] overflow-hidden">
        <img src="https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/5807f8952_generated_image.png" alt="Farm Location" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <MapPin className="w-12 h-12 text-cyan-400 mb-3" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{t('location')}</h1>
          <p className="text-slate-200 max-w-xl">Find us and get real-time directions to our farm</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
              <iframe
                src={googleEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                title="Farm Location Map"
              />
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[180px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                <Globe className="w-5 h-5" /> Google Maps Directions
              </a>
              <a
                href={appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[180px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold transition"
              >
                <Apple className="w-5 h-5" /> Apple Maps Directions
              </a>
              <a
                href={mapQuestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[180px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
              >
                <MapIcon className="w-5 h-5" /> MapQuest Directions
              </a>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-cyan-400" /> Address
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{settings.address}</p>
              <p className="text-xs text-slate-400">Coordinates: {settings.latitude}, {settings.longitude}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-cyan-400" /> {t('operatingHours')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Monday – Friday</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{settings.operating_hours?.mon_fri}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Saturday</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{settings.operating_hours?.sat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Sunday</span>
                  <span className="font-semibold text-red-500">{settings.operating_hours?.sun}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600 dark:text-cyan-400" /> Contact
              </h3>
              <div className="space-y-3 text-sm">
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  <Phone className="w-4 h-4" /> {settings.phone}
                </a>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  <Mail className="w-4 h-4" /> {settings.email}
                </a>
              </div>
            </div>

            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      const url = `https://www.google.com/maps/dir/?api=1&origin=${pos.coords.latitude},${pos.coords.longitude}&destination=${settings.latitude},${settings.longitude}`;
                      window.open(url, '_blank');
                    },
                    () => window.open(googleMapsUrl, '_blank')
                  );
                } else {
                  window.open(googleMapsUrl, '_blank');
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
            >
              <Navigation className="w-5 h-5" /> Use My Location & Navigate
            </button>
          </div>
        </div>

        <div className="mt-8">
          <OperatingHoursCalendar operatingHours={settings.operating_hours} holidays={settings.holidays || []} />
        </div>
      </div>
    </div>
  );
}