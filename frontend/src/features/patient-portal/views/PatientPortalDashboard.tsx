import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Plus, AlertTriangle } from 'lucide-react';
import { useAppointments, useUpdateAppointmentStatus } from '../../appointments/hooks/useAppointments';
import { UpcomingAppointmentsCards } from '../components/UpcomingAppointmentsCards';
import { AppointmentHistoryTable } from '../components/AppointmentHistoryTable';

export const PatientPortalDashboard = () => {
  const navigate = useNavigate();
  const { data: appointments = [], isLoading, isError } = useAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const [cancelModal, setCancelModal] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });

  const handleCancelRequest = (id: number) => {
    setCancelModal({ open: true, id });
  };

  const confirmCancellation = () => {
    if (cancelModal.id) {
      updateStatusMutation.mutate(
        { id: cancelModal.id, status: 'CANCELLED' },
        { onSuccess: () => setCancelModal({ open: false, id: null }) }
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      {/* Modal de Confirmación de Cancelación */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white p-5 rounded-xl shadow-xl max-w-sm w-full mx-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">¿Confirmas la cancelación?</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              Esta acción liberará el espacio de la agenda del médico y notificará al profesional sobre la baja del turno.
            </p>
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCancelModal({ open: false, id: null })}
                className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
              >
                Ignorar
              </button>
              <button
                type="button"
                onClick={confirmCancellation}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs"
              >
                Sí, Cancelar Turno
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
            <UserCircle size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Mi Portal</h1>
            <p className="text-slate-500 text-xs">
              Gestioná tus turnos y consultá tu historial clínico.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/portal/appointments/new')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shadow-xs"
        >
          <Plus size={16} />
          Sacar nuevo turno
        </button>
      </div>

      {/* Error banner */}
      {isError && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-lg border border-rose-100 text-xs text-center font-medium">
          Ocurrió un error al sincronizar tus turnos. Intentá nuevamente.
        </div>
      )}

      {/* Próximos Turnos */}
      <section>
        <h2 className="text-sm font-bold text-slate-800 tracking-tight mb-3">Próximos Turnos</h2>
        <UpcomingAppointmentsCards
          appointments={appointments as any[]}
          isLoading={isLoading}
          onCancel={handleCancelRequest}
          isCancelling={updateStatusMutation.isPending}
        />
      </section>

      {/* Historial de Consultas */}
      <section>
        <h2 className="text-sm font-bold text-slate-800 tracking-tight mb-3">Historial de Consultas</h2>
        <AppointmentHistoryTable
          appointments={appointments as any[]}
          isLoading={isLoading}
          onCancel={handleCancelRequest}
          isCancelling={updateStatusMutation.isPending}
        />
      </section>
    </div>
  );
};
