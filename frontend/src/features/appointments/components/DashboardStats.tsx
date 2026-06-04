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
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <p className="text-sm font-medium text-slate-500">Turnos del Día</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{total}</p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <Calendar size={22} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <p className="text-sm font-medium text-slate-500">Confirmados</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{confirmed}</p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <Clock size={22} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <p className="text-sm font-medium text-slate-500">Atendidos</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{completed}</p>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
          <CheckCircle size={22} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <p className="text-sm font-medium text-slate-500">Cancelados</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{cancelled}</p>
        </div>
        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
          <XCircle size={22} />
        </div>
      </div>
    </div>
  );
};