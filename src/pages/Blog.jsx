import React, { useEffect, useState } from 'react';
import { Newspaper, Calendar, User, Search, Archive, ArrowRight, Youtube } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/languageContext';
import ImageSlideshow from '@/components/ImageSlideshow';

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedYear, setSelectedYear] = useState('all');
  const { t } = useLanguage();

  useEffect(() => {
    base44.entities.BlogArticle.list('-published_date', 100)
      .then(records => { setArticles(records || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const years = [...new Set(articles.map(a => new Date(a.published_date || a.created_date).getFullYear()))].sort((a, b) => b - a);
  const activeArticles = articles.filter(a => a.status === 'active');
  const archivedArticles = articles.filter(a => a.status === 'archived');
  const hasArchived = archivedArticles.length > 0;

  const filtered = (showArchived ? archivedArticles : activeArticles).filter(a => {
    const matchesSearch = !search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchesYear = selectedYear === 'all' || new Date(a.published_date || a.created_date).getFullYear() === parseInt(selectedYear);
    return matchesSearch && matchesYear;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <div className="relative h-[35vh] min-h-[250px] overflow-hidden">
        <img src="https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/fe3d03beb_generated_image.png" alt="Blog" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <Newspaper className="w-12 h-12 text-cyan-400 mb-3" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{t('blog')}</h1>
          <p className="text-slate-200 max-w-xl">Latest news, articles, and updates from Mesina Farms</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('search')}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="all">{t('allArticles')}</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {hasArchived && (
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-5 py-3 rounded-xl font-medium transition flex items-center gap-2 ${
                showArchived
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Archive className="w-4 h-4" /> {t('archived')} ({archivedArticles.length})
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map(article => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BlogCard({ article }) {
  const [expanded, setExpanded] = useState(false);
  const images = article.images?.length > 0 ? article.images : ['https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/fe3d03beb_generated_image.png'];
  const pubDate = new Date(article.published_date || article.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <ImageSlideshow images={images} className="h-48" />
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {pubDate}</span>
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {article.author || 'Mesina Farms'}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{article.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">
          {expanded ? article.content : article.excerpt || article.content?.substring(0, 150) + '...'}
        </p>
        {article.video_url && (
          <a href={article.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:underline mb-3">
            <Youtube className="w-4 h-4" /> Watch Video
          </a>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
        >
          {expanded ? 'Show Less' : 'Read More'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}