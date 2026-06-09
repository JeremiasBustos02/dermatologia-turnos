import dayjs from 'dayjs';
import { CalendarDays, XCircle } from 'lucide-react';
import type { Appointment } from '../../appointments/types';

const statusStyles = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
};

const statusTranslations = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

interface AppointmentHistoryTableProps {
  appointments: Appointment[];
  isLoading: boolean;
  onCancel: (id: number) => void;
  isCancelling: boolean;
}

export const AppointmentHistoryTable = ({
  appointments,
  isLoading,
  onCancel,
  isCancelling,
}: AppointmentHistoryTableProps) => {
  const now = dayjs();

  const history = appointments.filter(
    (a) =>
      dayjs(a.dateTime).isBefore(now) ||
      a.status === 'COMPLETED' ||
      a.status === 'CANCELLED'
  );

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="w-full animate-pulse divide-y divide-slate-100">
          {[1, 2, 3].map((row) => (
            <div key={row} className="p-5 flex items-center gap-4">
              <div className="h-5 bg-slate-200 rounded w-12" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-1/4" />
              </div>
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-6 bg-slate-200 rounded w-16" />
              <div className="h-7 bg-slate-200 rounded w-20 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-16 text-center bg-white rounded-xl border border-slate-200 shadow-xs max-w-xl mx-auto flex flex-col items-center justify-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-400 mb-4 border border-slate-200 shadow-inner">
          <CalendarDays size={22} />
        </div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1">
          Historial Vacío
        </h3>
        <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
          Aún no tenés consultas en tu historial.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold tracking-wide uppercase text-[10px]">
            <tr>
              <th className="px-6 py-3.5">Fecha y Hora</th>
              <th className="px-6 py-3.5">Especialista</th>
              <th className="px-6 py-3.5">Cobertura</th>
              <th className="px-6 py-3.5">Estado</th>
              <th className="px-6 py-3.5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
            {history.map((appointment) => {
              const canCancel =
                (appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') &&
                dayjs(appointment.dateTime).isAfter(now);

              return (
                <tr key={appointment.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 block text-sm">
                      {dayjs(appointment.dateTime).format('DD/MM/YYYY')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal block mt-0.5">
                      {dayjs(appointment.dateTime).format('HH:mm')} hs
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-semibold">
                    Dr/a. {appointment.professional.firstName} {appointment.professional.lastName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase">
                      {appointment.coverage?.name || 'Particular'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${statusStyles[appointment.status]}`}
                    >
                      {statusTranslations[appointment.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => onCancel(appointment.id)}
                          disabled={isCancelling}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 border border-transparent hover:border-rose-100 disabled:opacity-20 transition-all"
                          title="Cancelar Turno"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
