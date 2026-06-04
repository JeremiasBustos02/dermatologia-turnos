import dayjs from 'dayjs';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Appointment } from '../types';

interface AppointmentsDailyListProps {
  appointments: Appointment[];
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusTranslations = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

export const AppointmentsDailyList = ({ appointments }: AppointmentsDailyListProps) => {
  if (appointments.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4">
          <Clock size={24} />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">Agenda libre</h3>
        <p className="text-slate-500">No hay turnos registrados para este día.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
          <tr>
            <th className="px-6 py-4 font-medium">Hora</th>
            <th className="px-6 py-4 font-medium">Paciente</th>
            <th className="px-6 py-4 font-medium">Profesional</th>
            <th className="px-6 py-4 font-medium">Cobertura</th>
            <th className="px-6 py-4 font-medium">Estado</th>
            <th className="px-6 py-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-900">
                {dayjs(appointment.dateTime).format('HH:mm')}
              </td>
              <td className="px-6 py-4">
                <p className="font-medium text-slate-900">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </p>
                <p className="text-xs text-slate-500">DNI: {appointment.patient.dni}</p>
              </td>
              <td className="px-6 py-4">
                {appointment.professional.firstName} {appointment.professional.lastName}
              </td>
              <td className="px-6 py-4">
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                  {appointment.coverage.name}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[appointment.status]}`}>
                  {statusTranslations[appointment.status]}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50" title="Confirmar">
                    <CheckCircle size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Cancelar">
                    <XCircle size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};