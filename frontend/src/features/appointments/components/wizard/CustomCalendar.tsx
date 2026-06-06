import { useState } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomCalendarProps {
  selectedDate: string;
  onChange: (date: string) => void;
  availableDaysOfWeek?: number[];
}

const WEEKDAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

export const CustomCalendar = ({
  selectedDate,
  onChange,
  availableDaysOfWeek = [3, 5]
}: CustomCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs(selectedDate).startOf('month'));

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.day();
  const today = dayjs().startOf('day');

  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden select-none w-full max-w-sm">
      {/* Header del Calendario */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-200">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 hover:bg-slate-200/70 rounded-lg transition-colors text-slate-500 focus:outline-hidden"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-bold text-xs text-slate-700 uppercase tracking-wider capitalize">
          {currentMonth.format('MMMM YYYY')}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 hover:bg-slate-200/70 rounded-lg transition-colors text-slate-500 focus:outline-hidden"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="p-3">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wide py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Grilla de días */}
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((blank) => (
            <div key={`blank-${blank}`} className="aspect-square" />
          ))}

          {days.map((day) => {
            const dateObj = currentMonth.date(day);
            const dateString = dateObj.format('YYYY-MM-DD');
            const isSelected = selectedDate === dateString;
            const isPast = dateObj.isBefore(today, 'day');
            const isAvailable = !isPast && availableDaysOfWeek.includes(dateObj.day());

            return (
              <button
                key={day}
                type="button"
                disabled={isPast}
                onClick={() => onChange(dateString)}
                className={`
                  relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all focus:outline-hidden
                  ${isPast ? 'text-slate-300 cursor-not-allowed bg-slate-50/30' : 'text-slate-700'}
                  ${isSelected ? 'bg-blue-600 text-white font-bold shadow-xs border border-blue-600 scale-102 z-10 hover:bg-blue-700' : ''}
                  ${!isPast && !isSelected && !isAvailable ? 'hover:bg-slate-100/80 text-slate-400 font-normal' : ''}
                  ${!isPast && !isSelected && isAvailable ? 'text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100' : ''}
                `}
              >
                <span className={isAvailable && !isSelected ? 'translate-y-[-1px]' : ''}>{day}</span>
                {isAvailable && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};