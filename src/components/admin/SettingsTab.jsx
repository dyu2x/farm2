import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Save, Plus, Trash2, MapPin, Phone, Mail, Clock, Building, Calendar } from 'lucide-react';
import { useSettings } from '@/lib/settingsContext';
import { DEFAULT_SETTINGS } from '@/lib/settingsContext';

export default function SettingsTab() {
  const { settings, refreshSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

  useEffect(() => {
    base44.entities.SiteSettings.list().then(records => {
      if (records && records.length > 0) {
        setForm({ ...DEFAULT_SETTINGS, ...records[0] });
        setSettingsId(records[0].id);
      }
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (settingsId) {
        await base44.entities.SiteSettings.update(settingsId, form);
      } else {
        const created = await base44.entities.SiteSettings.create(form);
        setSettingsId(created.id);
      }
      await refreshSettings();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert('Failed to save settings.');
    }
    setSaving(false);
  };

  const addWhyChoose = () => setForm(f => ({ ...f, why_choose_us: [...(f.why_choose_us || []), { title: '', description: '', icon: 'Award' }] }));
  const updateWhyChoose = (i, field, val) => setForm(f => {
    const wcu = [...(f.why_choose_us || [])];
    wcu[i] = { ...wcu[i], [field]: val };
    return { ...f, why_choose_us: wcu };
  });
  const removeWhyChoose = (i) => setForm(f => ({ ...f, why_choose_us: (f.why_choose_us || []).filter((_, idx) => idx !== i) }));

  const addHoliday = () => setForm(f => ({ ...f, holidays: [...(f.holidays || []), { date: '', name: '', recurring: false }] }));
  const updateHoliday = (i, field, val) => setForm(f => {
    const holidays = [...(f.holidays || [])];
    holidays[i] = { ...holidays[i], [field]: val };
    return { ...f, holidays };
  });
  const removeHoliday = (i) => setForm(f => ({ ...f, holidays: (f.holidays || []).filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-6 max-w-3xl">
      {saved && <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 text-sm">Settings saved successfully!</div>}

      {/* Company Info */}
      <Section title="Company Information" icon={Building}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Farm Name" value={form.farm_name} onChange={v => setForm(f => ({ ...f, farm_name: v }))} />
          <Field label="Logo URL" value={form.logo_url || ''} onChange={v => setForm(f => ({ ...f, logo_url: v }))} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Hero Title" value={form.hero_title || ''} onChange={v => setForm(f => ({ ...f, hero_title: v }))} />
          <Field label="Hero Subtitle" value={form.hero_subtitle || ''} onChange={v => setForm(f => ({ ...f, hero_subtitle: v }))} />
        </div>
      </Section>

      {/* Contact & Address */}
      <Section title="Farm Address & Contact" icon={MapPin}>
        <Field label="Address" value={form.address || ''} onChange={v => setForm(f => ({ ...f, address: v }))} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitude" type="number" value={form.latitude} onChange={v => setForm(f => ({ ...f, latitude: parseFloat(v) || 0 }))} />
          <Field label="Longitude" type="number" value={form.longitude} onChange={v => setForm(f => ({ ...f, longitude: parseFloat(v) || 0 }))} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Phone" value={form.phone || ''} onChange={v => setForm(f => ({ ...f, phone: v }))} icon={Phone} />
          <Field label="Email" value={form.email || ''} onChange={v => setForm(f => ({ ...f, email: v }))} icon={Mail} />
        </div>
      </Section>

      {/* Operating Hours */}
      <Section title="Operating Hours" icon={Clock}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Mon – Fri" value={form.operating_hours?.mon_fri || ''} onChange={v => setForm(f => ({ ...f, operating_hours: { ...f.operating_hours, mon_fri: v } }))} />
          <Field label="Saturday" value={form.operating_hours?.sat || ''} onChange={v => setForm(f => ({ ...f, operating_hours: { ...f.operating_hours, sat: v } }))} />
          <Field label="Sunday" value={form.operating_hours?.sun || ''} onChange={v => setForm(f => ({ ...f, operating_hours: { ...f.operating_hours, sun: v } }))} />
        </div>
      </Section>

      {/* Holidays */}
      <Section title="Holidays & Non-Operating Days" icon={Calendar}>
        {(form.holidays || []).map((holiday, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-2 items-start md:items-center">
            <input type="text" placeholder="Holiday name (e.g., Christmas)" value={holiday.name || ''} onChange={e => updateHoliday(i, 'name', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" value={holiday.date || ''} onChange={e => updateHoliday(i, 'date', e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <label className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" checked={holiday.recurring || false} onChange={e => updateHoliday(i, 'recurring', e.target.checked)} className="rounded" />
              Recurring
            </label>
            <button onClick={() => removeHoliday(i)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={addHoliday} className="text-sm px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 hover:bg-blue-100 transition flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Holiday
        </button>
      </Section>

      {/* About Content */}
      <Section title="About Us Content" icon={Building}>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">About Content</label>
          <textarea rows="5" value={form.about_content || ''} onChange={e => setForm(f => ({ ...f, about_content: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section title="Why Choose Us" icon={Plus}>
        {(form.why_choose_us || []).map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input type="text" placeholder="Title" value={item.title} onChange={e => updateWhyChoose(i, 'title', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Description" value={item.description} onChange={e => updateWhyChoose(i, 'description', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={() => removeWhyChoose(i)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={addWhyChoose} className="text-sm px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 hover:bg-blue-100 transition flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </Section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center gap-2 disabled:opacity-50"
      >
        <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save All Settings'}
      </button>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-blue-600 dark:text-cyan-400" /> {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', icon: Icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}