import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { Appointment } from '../types';

interface DashboardStatsProps {
  appointments: Appointment[];
}

export const DashboardStats = ({ appointments }: DashboardStatsProps) => {
  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === 'COMPLETED').length;
  const confirmed = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const cancelled = appointments.filter((a) => a.status === 'CANCELLED').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Tarjeta: Total */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between transition-all hover:border-slate-300">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Citas del Día</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{total}</p>
        </div>
        <div className="p-2.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-200/60 shadow-xs">
          <Calendar size={18} />
        </div>
      </div>

      {/* Tarjeta: Confirmados */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between transition-all hover:border-slate-300">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirmados</p>
          <p className="text-2xl font-bold text-blue-600 mt-1 tracking-tight">{confirmed}</p>
        </div>
        <div className="p-2.5 bg-blue-50/50 text-blue-600 rounded-lg border border-blue-100 shadow-xs">
          <Clock size={18} />
        </div>
      </div>

      {/* Tarjeta: Atendidos */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between transition-all hover:border-slate-300">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atendidos</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1 tracking-tight">{completed}</p>
        </div>
        <div className="p-2.5 bg-emerald-50/50 text-emerald-600 rounded-lg border border-emerald-100 shadow-xs">
          <CheckCircle size={18} />
        </div>
      </div>

      {/* Tarjeta: Cancelados */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between transition-all hover:border-slate-300">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cancelados</p>
          <p className="text-2xl font-bold text-rose-600 mt-1 tracking-tight">{cancelled}</p>
        </div>
        <div className="p-2.5 bg-rose-50/50 text-rose-600 rounded-lg border border-rose-100 shadow-xs">
          <XCircle size={18} />
        </div>
      </div>
    </div>
  );
};