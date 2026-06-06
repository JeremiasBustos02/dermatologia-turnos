import { useState } from 'react';
import dayjs from 'dayjs';
import { CalendarDays, Search, CheckCircle, XCircle, CalendarCheck, AlertTriangle } from 'lucide-react';
import { useAppointments, useUpdateAppointmentStatus } from '../hooks/useAppointments';
import type { Appointment } from '../types';

const statusColors = {
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

export const AppointmentsHistoryPage = () => {
  const { data: appointments = [], isLoading, isError } = useAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para el modal de confirmación de cancelación (UX SaaS Premium)
  const [cancelModal, setCancelModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

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

  const filteredAppointments = (appointments as Appointment[]).filter((app) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      app.patient.dni.includes(searchLower) ||
      app.patient.lastName.toLowerCase().includes(searchLower) ||
      app.professional.lastName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      
      {/* Modal Controlado de Cancelación Seguro */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white p-5 rounded-xl shadow-xl max-w-sm w-full mx-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="p-2 bg-amber-50 rounded-lg"><AlertTriangle size={20} /></div>
              <h3 className="text-sm font-bold text-slate-900">¿Confirmas la cancelación?</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              Esta acción liberará el espacio de la agenda del médico y notificará al paciente sobre la baja del turno.
            </p>
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setCancelModal({ open: false, id: null })}
                className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
              >
                Ignorar
              </button>
              <button
                onClick={confirmCancellation}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs"
              >
                Sí, Cancelar Turno
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra superior de herramientas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
            <CalendarDays size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Historial de Turnos</h1>
            <p className="text-slate-500 text-xs">Registro y auditoría de consultas dadas de alta en el sistema.</p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input 
            type="text" 
            placeholder="Buscar por DNI o apellido..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs bg-slate-50/50 outline-hidden focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600"></div>
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-xs font-medium text-rose-600">Error al sincronizar el historial clínico.</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 font-medium">
            No se encontraron consultas registradas con esos criterios.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold tracking-wide uppercase text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Fecha y Hora</th>
                  <th className="px-6 py-3.5">Paciente</th>
                  <th className="px-6 py-3.5">Médico Especialista</th>
                  <th className="px-6 py-3.5">Estado</th>
                  <th className="px-6 py-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                {filteredAppointments.map((appointment) => {
                  const isPastOrClosed = appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED';
                  
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
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800 block">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal block mt-0.5">DNI {appointment.patient.dni}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-semibold">
                        {appointment.professional.firstName} {appointment.professional.lastName}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${statusColors[appointment.status]}`}>
                          {statusTranslations[appointment.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-1.5">
                          <button 
                            onClick={() => handleUpdateStatus(appointment.id, 'CONFIRMED')}
                            disabled={appointment.status === 'CONFIRMED' || isPastOrClosed || updateStatusMutation.isPending}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 border border-transparent hover:border-blue-100 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all" 
                            title="Confirmar Presencia"
                          >
                            <CalendarCheck size={15} />
                          </button>

                          <button 
                            onClick={() => handleUpdateStatus(appointment.id, 'COMPLETED')}
                            disabled={isPastOrClosed || updateStatusMutation.isPending}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 border border-transparent hover:border-emerald-100 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all" 
                            title="Cerrar Consulta"
                          >
                            <CheckCircle size={15} />
                          </button>
                          
                          <button 
                            onClick={() => handleUpdateStatus(appointment.id, 'CANCELLED')}
                            disabled={isPastOrClosed || updateStatusMutation.isPending}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 border border-transparent hover:border-rose-100 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all" 
                            title="Cancelar Turno"
                          >
                            <XCircle size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};