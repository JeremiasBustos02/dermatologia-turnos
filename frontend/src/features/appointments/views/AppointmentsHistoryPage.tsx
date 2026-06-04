import { useState } from 'react';
import dayjs from 'dayjs';
import { CalendarDays, Search, CheckCircle, XCircle, CalendarCheck } from 'lucide-react';
import { useAppointments, useUpdateAppointmentStatus } from '../hooks/useAppointments';
import type { Appointment } from '../types';

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

export const AppointmentsHistoryPage = () => {
  const { data: appointments = [], isLoading, isError } = useAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateStatus = (id: number, newStatus: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    if (newStatus === 'CANCELLED') {
      const confirm = window.confirm('¿Estás seguro de que deseas cancelar este turno?');
      if (!confirm) return;
    }
    updateStatusMutation.mutate({ id, status: newStatus });
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <CalendarDays size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Historial de Turnos</h1>
            <p className="text-slate-500 text-sm">Registro completo de todas las citas médicas.</p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por DNI o apellido..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Error al cargar el historial.</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No se encontraron turnos con esos criterios.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Fecha y Hora</th>
                  <th className="px-6 py-4 font-medium">Paciente</th>
                  <th className="px-6 py-4 font-medium">Profesional</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">
                        {dayjs(appointment.dateTime).format('DD/MM/YYYY')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {dayjs(appointment.dateTime).format('HH:mm')} hs
                      </p>
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
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[appointment.status]}`}>
                        {statusTranslations[appointment.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => handleUpdateStatus(appointment.id, 'CONFIRMED')}
                          disabled={appointment.status === 'CONFIRMED' || appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED' || updateStatusMutation.isPending}
                          className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" 
                          title="Confirmar Asistencia"
                        >
                          <CalendarCheck size={18} />
                        </button>

                        <button 
                          onClick={() => handleUpdateStatus(appointment.id, 'COMPLETED')}
                          disabled={appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED' || updateStatusMutation.isPending}
                          className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" 
                          title="Marcar Completado"
                        >
                          <CheckCircle size={18} />
                        </button>
                        
                        <button 
                          onClick={() => handleUpdateStatus(appointment.id, 'CANCELLED')}
                          disabled={appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED' || updateStatusMutation.isPending}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" 
                          title="Cancelar Turno"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};