import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { useAvailableSlots } from '../../hooks/useAppointments';

interface DateTimeStepProps {
  professionalId: number;
  onNext: (data: { date: string; time: string; dateTime: string }) => void;
  defaultDate?: string;
  defaultTime?: string;
}

export const DateTimeStep = ({ professionalId, onNext, defaultDate, defaultTime }: DateTimeStepProps) => {
  const [selectedDate, setSelectedDate] = useState<string>(defaultDate || dayjs().format('YYYY-MM-DD'));
  const [selectedTime, setSelectedTime] = useState<string | undefined>(defaultTime);

  const { data: slots = [], isLoading, isError, isFetching } = useAvailableSlots(professionalId, selectedDate);

  useEffect(() => {
    if (defaultDate !== selectedDate) {
      setSelectedTime(undefined);
    }
  }, [selectedDate, defaultDate]);

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      const dateTimeISO = dayjs(`${selectedDate}T${selectedTime}:00-03:00`).toISOString();
      onNext({ date: selectedDate, time: selectedTime, dateTime: dateTimeISO });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800">3. Selecciona fecha y hora</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-1 space-y-4">
          <label className="block text-sm font-bold text-slate-700">Día del turno</label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="date" 
              min={dayjs().format('YYYY-MM-DD')}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium bg-white shadow-sm"
            />
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <AlertCircle size={14} /> Selecciona un día para ver disponibilidad.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-4">Horarios disponibles</label>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[200px] flex flex-col relative">
            
            {isFetching && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex justify-center items-center rounded-xl z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {isError ? (
              <div className="text-center text-red-500 m-auto">
                <p>Error al cargar la disponibilidad.</p>
              </div>
            ) : slots.length === 0 && !isLoading ? (
              <div className="text-center text-slate-500 m-auto flex flex-col items-center gap-2">
                <Clock size={32} className="text-slate-300" />
                <p>El profesional no atiende este día o ya no hay turnos libres.</p>
                <p className="text-xs">Por favor, selecciona otra fecha.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {slots.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-3 rounded-lg font-medium text-sm transition-all border ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600 shadow-sm'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button 
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-sm"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};