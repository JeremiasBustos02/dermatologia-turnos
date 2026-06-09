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

interface UpcomingAppointmentsCardsProps {
  appointments: Appointment[];
  isLoading: boolean;
  onCancel: (id: number) => void;
  isCancelling: boolean;
}

export const UpcomingAppointmentsCards = ({
  appointments,
  isLoading,
  onCancel,
  isCancelling,
}: UpcomingAppointmentsCardsProps) => {
  const now = dayjs();

  const upcoming = appointments
    .filter(
      (a) =>
        dayjs(a.dateTime).isAfter(now) &&
        (a.status === 'PENDING' || a.status === 'CONFIRMED')
    )
    .sort((a, b) => dayjs(a.dateTime).unix() - dayjs(b.dateTime).unix())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
            <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />
            <div className="h-3 bg-slate-200 rounded w-1/4 mb-4" />
            <div className="h-6 bg-slate-200 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (upcoming.length === 0) {
    return (
      <div className="p-16 text-center bg-white rounded-xl border border-slate-200 shadow-xs max-w-xl mx-auto flex flex-col items-center justify-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-400 mb-4 border border-slate-200 shadow-inner">
          <CalendarDays size={22} />
        </div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1">
          Sin Turnos Próximos
        </h3>
        <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
          No tenés turnos próximos. ¡Reservá tu próxima consulta!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {upcoming.map((appointment) => (
        <div
          key={appointment.id}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-slate-900 text-sm">
              {dayjs(appointment.dateTime).format('DD/MM/YYYY - HH:mm')}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${statusStyles[appointment.status]}`}
            >
              {statusTranslations[appointment.status]}
            </span>
          </div>

          <p className="text-slate-600 text-xs mb-1">
            <span className="font-semibold">Dr/a.</span>{' '}
            {appointment.professional.firstName} {appointment.professional.lastName}
          </p>
          <p className="text-slate-400 text-[11px] mb-4">
            {appointment.coverage?.name || 'Particular'}
          </p>

          <button
            type="button"
            onClick={() => onCancel(appointment.id)}
            disabled={isCancelling}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors disabled:opacity-40"
          >
            <XCircle size={13} />
            Cancelar turno
          </button>
        </div>
      ))}
    </div>
  );
};
