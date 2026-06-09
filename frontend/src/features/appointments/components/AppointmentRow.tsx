import dayjs from 'dayjs';
import { CheckCircle, XCircle, CalendarCheck, History as HistoryIcon } from 'lucide-react';
import type { Appointment } from '../types';
import { StatusBadge } from '../../../components/shared/StatusBadge';

interface AppointmentRowProps {
  appointment: Appointment;
  isPastOrClosed: boolean;
  isPending: boolean;
  onConfirm: (id: number) => void;
  onComplete: (appointment: Appointment) => void;
  onCancel: (id: number) => void;
  onHistory: (patient: Appointment['patient']) => void;
}

export const AppointmentRow = ({
  appointment,
  isPastOrClosed,
  isPending,
  onConfirm,
  onComplete,
  onCancel,
  onHistory,
}: AppointmentRowProps) => (
  <tr className="hover:bg-slate-50/30 transition-colors">
    <td className="px-6 py-4 font-bold text-slate-900 text-sm tracking-tight">
      {dayjs(appointment.dateTime).format('HH:mm')} hs
    </td>

    <td className="px-6 py-4">
      <div className="flex items-center justify-between group">
        <div>
          <span className="font-semibold text-slate-800 block text-xs">
            {appointment.patient.firstName} {appointment.patient.lastName}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
            DNI: {appointment.patient.dni}
          </span>
        </div>
        <button
          onClick={() => onHistory(appointment.patient)}
          className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
          title="Ver Historial Clínico"
        >
          <HistoryIcon size={16} />
        </button>
      </div>
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
      <StatusBadge status={appointment.status} />
    </td>

    <td className="px-6 py-4">
      <div className="flex justify-center gap-1">
        <button
          onClick={() => onConfirm(appointment.id)}
          disabled={appointment.status === 'CONFIRMED' || isPastOrClosed || isPending}
          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-20 transition-all"
          title="Confirmar Asistencia"
        >
          <CalendarCheck size={14} />
        </button>

        <button
          onClick={() => onComplete(appointment)}
          disabled={isPastOrClosed || isPending}
          className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 disabled:opacity-20 transition-all"
          title="Escribir Evolución y Marcar Atendido"
        >
          <CheckCircle size={14} />
        </button>

        <button
          onClick={() => onCancel(appointment.id)}
          disabled={isPastOrClosed || isPending}
          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 disabled:opacity-20 transition-all"
          title="Cancelar Turno"
        >
          <XCircle size={14} />
        </button>
      </div>
    </td>
  </tr>
);
