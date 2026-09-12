import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, XCircle } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function OperatingHoursCalendar({ operatingHours, holidays = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const formatDay = (day) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const getHoliday = (day) => {
    if (!day) return null;
    const dateStr = formatDay(day);
    const monthDay = dateStr.slice(5);
    return holidays.find(h => {
      if (!h.date) return false;
      if (h.recurring) return h.date.slice(5) === monthDay;
      return h.date === dateStr;
    });
  };

  const getHours = (day) => {
    if (!day) return null;
    const dow = new Date(year, month, day).getDay();
    if (dow === 0) return operatingHours?.sun || 'Closed';
    if (dow === 6) return operatingHours?.sat || 'By Appointment';
    return operatingHours?.mon_fri || '8:00 AM - 4:00 PM';
  };

  const isClosed = (hours) => !hours || hours.toLowerCase() === 'closed';

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-600 dark:text-cyan-400" /> Operating Hours Calendar
      </h3>

      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <span className="font-semibold text-slate-900 dark:text-white">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const holiday = getHoliday(day);
          const hours = getHours(day);
          const closed = isClosed(hours) || !!holiday;
          const isToday = isCurrentMonth && day === today.getDate();
          const isSelected = selectedDay === day;
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(day)}
              title={holiday ? `${holiday.name} — Closed` : hours}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition border ${
                holiday
                  ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400'
                  : closed
                  ? 'bg-slate-100 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500'
                  : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
              } ${isToday ? 'ring-2 ring-blue-500' : ''} ${isSelected ? 'ring-2 ring-blue-600' : ''}`}
            >
              <span className="font-medium">{day}</span>
              {holiday && <XCircle className="w-3 h-3 absolute top-1 right-1 text-red-500" />}
              {!holiday && !closed && <span className="text-[8px] leading-none mt-0.5">Open</span>}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 text-xs text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" /> Open</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600" /> Closed</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700" /> Holiday</span>
      </div>

      {selectedDay && (
        <div className="mt-4 p-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{MONTHS[month]} {selectedDay}, {year}</p>
          {(() => {
            const holiday = getHoliday(selectedDay);
            if (holiday) {
              return <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"><XCircle className="w-4 h-4" /> {holiday.name} — Closed</p>;
            }
            const hours = getHours(selectedDay);
            return <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-1"><Clock className="w-4 h-4" /> {hours}</p>;
          })()}
        </div>
      )}
    </div>
  );
}