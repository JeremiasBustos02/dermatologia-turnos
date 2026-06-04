import dayjs from 'dayjs';
import { CheckCircle, XCircle, Clock, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Appointment } from '../types';
import { UI } from '../../../layouts/ui/styles';

interface AppointmentsDailyListProps {
  appointments: Appointment[];
  isLoading?: boolean;
}

const statusStyles = {
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-800 border-blue-200',
  COMPLETED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-800 border-red-200',
};

const statusTranslations = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

export const AppointmentsDailyList = ({ appointments, isLoading }: AppointmentsDailyListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className={UI.table.wrapper}>
        <div className="w-full animate-pulse divide-y divide-slate-100">
          <div className="bg-slate-50 h-12 w-full flex items-center px-6 gap-4">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-4 bg-slate-200 rounded flex-1" />)}
          </div>
          {[1, 2, 3].map((row) => (
            <div key={row} className="p-6 w-full flex items-center gap-4">
              <div className="h-5 bg-slate-200 rounded w-16" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
              <div className="h-4 bg-slate-200 rounded flex-1" />
              <div className="h-6 bg-slate-200 rounded w-20" />
              <div className="h-8 bg-slate-200 rounded w-24 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="p-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm max-w-xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 text-slate-400 mb-4 border border-slate-100 shadow-inner">
          <CalendarDays size={26} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1">Agenda libre</h3>
        <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
          No hay turnos registrados para este día en la agenda de atención.
        </p>
        <button 
          onClick={() => navigate('/appointments/new')}
          className={UI.button.secondary}
        >
          Agendar primer turno
        </button>
      </div>
    );
  }

  return (
    <div className={UI.table.wrapper}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className={UI.table.th}>Hora</th>
              <th className={UI.table.th}>Paciente</th>
              <th className={UI.table.th}>Profesional</th>
              <th className={UI.table.th}>Cobertura</th>
              <th className={UI.table.th}>Estado</th>
              <th className={`${UI.table.th} text-right`}>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className={UI.table.tr}>
                <td className={`${UI.table.td} font-bold text-slate-900 text-base`}>
                  {dayjs(appointment.dateTime).format('HH:mm')}
                </td>
                <td className={UI.table.td}>
                  <p className="font-semibold text-slate-900">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">DNI: {appointment.patient.dni}</p>
                </td>
                <td className={`${UI.table.td} font-medium text-slate-800`}>
                  {appointment.professional.firstName} {appointment.professional.lastName}
                </td>
                <td className={UI.table.td}>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded text-xs font-semibold tracking-wide">
                    {appointment.coverage.name}
                  </span>
                </td>
                <td className={UI.table.td}>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${statusStyles[appointment.status]}`}>
                    {statusTranslations[appointment.status]}
                  </span>
                </td>
                <td className={`${UI.table.td} text-right`}>
                  <div className="flex justify-end gap-1.5">
                    <button 
                      className={`${UI.button.icon} text-slate-400 bg-white hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 border-slate-200`} 
                      title="Confirmar"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button 
                      className={`${UI.button.icon} text-slate-400 bg-white hover:text-red-600 hover:bg-red-50 hover:border-red-200 border-slate-200`} 
                      title="Cancelar"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};