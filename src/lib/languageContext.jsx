import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    home: 'Home', catalog: 'Fingerling Catalog', fishCare: 'Fish Care & Guides',
    location: 'Farm Location', order: 'Order Inquiry', blog: 'Blog & News',
    about: 'About Us', contact: 'Contact', operatingHours: 'Operating Hours',
    getDirections: 'Get Directions', submitInquiry: 'Submit Inquiry',
    readMore: 'Read More', search: 'Search...', allArticles: 'All Articles',
    archived: 'Archived', calculator: 'Fish-to-Tank Calculator',
    darkMode: 'Dark Mode', language: 'Language'
  },
  filipino: {
    home: 'Home', catalog: 'Katalogo ng Fingerling', fishCare: 'Pangangalaga sa Isda',
    location: 'Lokasyon ng Bukid', order: 'Pagtatanong ng Order', blog: 'Blog at Balita',
    about: 'Tungkol sa Amin', contact: 'Makipag-ugnayan', operatingHours: 'Oras ng Operasyon',
    getDirections: 'Kumuha ng Direksyon', submitInquiry: 'Magpadala ng Tanong',
    readMore: 'Magbasa ng Higit Pa', search: 'Maghanap...', allArticles: 'Lahat ng Artikulo',
    archived: 'Naka-archive', calculator: 'Calculator ng Isda sa Tangke',
    darkMode: 'Dark Mode', language: 'Wika'
  },
  cebuano: {
    home: 'Balay', catalog: 'Katalogo sa Fingerling', fishCare: 'Pag-atiman sa Isda',
    location: 'Lokasyon sa Uma', order: 'Pangutana sa Order', blog: 'Blog ug Balita',
    about: 'Mahitungod sa Amon', contact: 'Makontak', operatingHours: 'Oras sa Operasyon',
    getDirections: 'Kuha sa Direksyon', submitInquiry: 'Padala og Pangutana',
    readMore: 'Magbasa pa', search: 'Pangita...', allArticles: 'Tanan nga Artikulo',
    archived: 'Gi-archive', calculator: 'Calculator sa Isda sa Tangke',
    darkMode: 'Dark Mode', language: 'Pinulongan'
  },
  hiligaynon: {
    home: 'Balay', catalog: 'Katalogo sang Fingerling', fishCare: 'Pag-atiman sang Isda',
    location: 'Lokasyon sang Uma', order: 'Pangutana sang Order', blog: 'Blog kag Balita',
    about: 'Bahin sa Amon', contact: 'Makontak', operatingHours: 'Oras sang Operasyon',
    getDirections: 'Kuha sang Direksyon', submitInquiry: 'Padala sang Pangutana',
    readMore: 'Magbasa pa', search: 'Pangita...', allArticles: 'Tanang Artikulo',
    archived: 'Naka-archive', calculator: 'Calculator sang Isda sa Tangke',
    darkMode: 'Dark Mode', language: 'Lengwahe'
  },
  karay_a: {
    home: 'Balay', catalog: 'Katalogo sang Fingerling', fishCare: 'Pag-atipan sang Isda',
    location: 'Lokasyon sang Uma', order: 'Pangutana sang Order', blog: 'Blog kag Balita',
    about: 'Bahin sa Amon', contact: 'Makontak', operatingHours: 'Oras sang Operasyon',
    getDirections: 'Kuha sang Direksyon', submitInquiry: 'Padala sang Pangutana',
    readMore: 'Magbasa pa', search: 'Pangita...', allArticles: 'Tanang Artikulo',
    archived: 'Naka-archive', calculator: 'Calculator sang Isda sa Tangke',
    darkMode: 'Dark Mode', language: 'Lengwahe'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('mesina_lang') || 'en');

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('mesina_lang', newLang);
  };

  const t = (key) => (translations[lang] && translations[lang][key]) || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t, availableLanguages: Object.keys(translations) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);