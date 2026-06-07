import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { CheckCircle, XCircle, CalendarCheck, CalendarDays, AlertTriangle, History as HistoryIcon } from 'lucide-react';
import type { Appointment } from '../types';
import { useUpdateAppointmentStatus } from '../hooks/useAppointments';
import { MedicalRecordModal } from './MedicalRecordModal';
import { PatientHistoryDrawer } from './PatientHistoryDrawer';

interface AppointmentsDailyListProps {
  appointments: Appointment[];
  isLoading?: boolean;
}

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

export const AppointmentsDailyList = ({ appointments, isLoading }: AppointmentsDailyListProps) => {
  const navigate = useNavigate();
  const updateStatusMutation = useUpdateAppointmentStatus();
  
  const [cancelModal, setCancelModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [historyPatient, setHistoryPatient] = useState<Appointment['patient'] | null>(null);

  const handleUpdateStatus = (id: number, newStatus: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    if (newStatus === 'CANCELLED') {
      setCancelModal({ open: true, id });
      return;
    }
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const confirmCancellation = () => {
    if (cancelModal.id) {
      updateStatusMutation.mutate(
        { id: cancelModal.id, status: 'CANCELLED' },
        { onSuccess: () => setCancelModal({ open: false, id: null }) }
      );
    }
  };

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

  if (appointments.length === 0) {
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
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* MODAL DE EVOLUCIÓN CLÍNICA */}
      <MedicalRecordModal 
        isOpen={!!selectedAppointment} 
        onClose={() => setSelectedAppointment(null)} 
        appointment={selectedAppointment} 
      />

      {/* DRAWER DE HISTORIAL DEL PACIENTE */}
      <PatientHistoryDrawer 
        isOpen={!!historyPatient}
        onClose={() => setHistoryPatient(null)}
        patient={historyPatient}
      />

      {/* Modal de Cancelación Integrado */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white p-5 rounded-xl shadow-xl max-w-sm w-full mx-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2 bg-rose-50 rounded-lg"><AlertTriangle size={18} /></div>
              <h3 className="text-xs font-bold text-slate-900">¿Deseas cancelar el turno médico?</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
              Esta operación liberará la banda horaria en el calendario de consultas de la clínica.
            </p>
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCancelModal({ open: false, id: null })}
                className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={confirmCancellation}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs"
              >
                Confirmar Baja
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <th className="px-6 py-3.5">Hora</th>
              <th className="px-6 py-3.5">Ficha Paciente</th>
              <th className="px-6 py-3.5">Especialista</th>
              <th className="px-6 py-3.5">Cobertura</th>
              <th className="px-6 py-3.5">Estado</th>
              <th className="px-6 py-3.5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
            {appointments.map((appointment) => {
              const isPastOrClosed = appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED';

              return (
                <tr key={appointment.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm tracking-tight">
                    {dayjs(appointment.dateTime).format('HH:mm')} hs
                  </td>
                  
                  {/* Celda del Paciente con Botón de Historial */}
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
                        onClick={() => setHistoryPatient(appointment.patient)}
                        className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                        title="Ver Historial Clínico"
                      >
                        {/* Usamos el alias HistoryIcon aquí */}
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
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wider uppercase ${statusStyles[appointment.status]}`}>
                      {statusTranslations[appointment.status]}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-1">
                      <button 
                        onClick={() => handleUpdateStatus(appointment.id, 'CONFIRMED')}
                        disabled={appointment.status === 'CONFIRMED' || isPastOrClosed || updateStatusMutation.isPending}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-20 transition-all" 
                        title="Confirmar Asistencia"
                      >
                        <CalendarCheck size={14} />
                      </button>

                      <button 
                        onClick={() => setSelectedAppointment(appointment)}
                        disabled={isPastOrClosed || updateStatusMutation.isPending}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 disabled:opacity-20 transition-all" 
                        title="Escribir Evolución y Marcar Atendido"
                      >
                        <CheckCircle size={14} />
                      </button>
                      
                      <button 
                        onClick={() => handleUpdateStatus(appointment.id, 'CANCELLED')}
                        disabled={isPastOrClosed || updateStatusMutation.isPending}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 disabled:opacity-20 transition-all" 
                        title="Cancelar Turno"
                      >
                        <XCircle size={14} />
                      </button>
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