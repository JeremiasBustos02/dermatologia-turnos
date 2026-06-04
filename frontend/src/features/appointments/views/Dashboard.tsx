import { useState } from 'react';
import dayjs from 'dayjs';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { AppointmentsDailyList } from '../components/AppointmentsDailyList';
import type { Appointment } from '../types';

export const Dashboard = () => {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

  const { data: appointments = [], isLoading, isError } = useAppointments({ dateFrom: date });
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Agenda del Día</h1>
            <p className="text-slate-500 text-sm">Visualiza y gestiona los turnos diarios.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 w-full sm:w-auto"
          />
          
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
            <Plus size={20} />
            Nuevo Turno
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-center">
          Ocurrió un error al cargar la agenda.
        </div>
      ) : (
        <AppointmentsDailyList appointments={appointments as Appointment[]} />
      )}
    </div>
  );
};