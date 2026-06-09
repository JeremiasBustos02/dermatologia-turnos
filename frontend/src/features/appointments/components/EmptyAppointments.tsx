import { CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmptyAppointments = () => {
  const navigate = useNavigate();

  return (
    <div className="p-16 text-center bg-white rounded-xl border border-slate-200 shadow-xs max-w-xl mx-auto flex flex-col items-center justify-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-400 mb-4 border border-slate-200 shadow-inner">
        <CalendarDays size={22} />
      </div>
      <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1">Agenda Disponible</h3>
      <p className="text-slate-500 text-xs max-w-xs mb-5 leading-relaxed">
        No se registran turnos médicos asignados para la fecha seleccionada.
      </p>
      <button
        type="button"
        onClick={() => navigate('/appointments/new')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors shadow-xs"
      >
        Asignar Primer Turno
      </button>
    </div>
  );
};
