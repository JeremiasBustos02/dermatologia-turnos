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

  // Arrays para renderizar
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden select-none">
      
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <button 
          onClick={handlePrevMonth}
          className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-500"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold text-slate-800 capitalize">
          {currentMonth.format('MMMM YYYY')}
        </span>
        <button 
          onClick={handleNextMonth}
          className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-500"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {blanks.map((blank) => (
            <div key={`blank-${blank}`} className="w-10 h-10" />
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
                disabled={isPast}
                onClick={() => onChange(dateString)}
                className={`
                  relative w-10 h-10 rounded-lg flex flex-col items-center justify-center text-sm transition-all
                  ${isPast ? 'text-slate-300 cursor-not-allowed' : ''}
                  
                  ${isSelected ? 'bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md transform scale-105 z-10' : ''}
                  
                  ${!isPast && !isSelected && !isAvailable ? 'text-slate-700 hover:bg-slate-100 font-medium' : ''}
                  
                  ${!isPast && !isSelected && isAvailable ? 'text-emerald-800 font-bold bg-emerald-100 hover:bg-emerald-200 border border-emerald-200 shadow-sm' : ''}
                `}
              >
                <span className={isAvailable && !isSelected ? 'mb-1' : ''}>{day}</span>
                
                {/* Puntito verde más grande y centrado */}
                {isAvailable && !isSelected && (
                  <span className="absolute bottom-1.5 w-1.5 h-1.5 bg-emerald-600 rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};