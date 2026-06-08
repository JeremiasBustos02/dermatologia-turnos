import { useState } from 'react';
import type { Appointment } from '../types';
import { useUpdateAppointmentStatus } from '../hooks/useAppointments';
import { MedicalRecordModal } from './MedicalRecordModal';
import { PatientHistoryDrawer } from './PatientHistoryDrawer';
import { AppointmentRow } from './AppointmentRow';
import { AppointmentsTableSkeleton } from './AppointmentsTableSkeleton';
import { EmptyAppointments } from './EmptyAppointments';
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog';

interface AppointmentsDailyListProps {
  appointments: Appointment[];
  isLoading?: boolean;
}

export const AppointmentsDailyList = ({ appointments, isLoading }: AppointmentsDailyListProps) => {
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
    return <AppointmentsTableSkeleton />;
  }

  if (appointments.length === 0) {
    return <EmptyAppointments />;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <MedicalRecordModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />

      <PatientHistoryDrawer
        isOpen={!!historyPatient}
        onClose={() => setHistoryPatient(null)}
        patient={historyPatient}
      />

      <ConfirmDialog
        isOpen={cancelModal.open}
        title="¿Deseas cancelar el turno médico?"
        description="Esta operación liberará la banda horaria en el calendario de consultas de la clínica."
        confirmLabel="Confirmar Baja"
        cancelLabel="Cerrar"
        onConfirm={confirmCancellation}
        onCancel={() => setCancelModal({ open: false, id: null })}
      />

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
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  isPastOrClosed={isPastOrClosed}
                  isPending={updateStatusMutation.isPending}
                  onConfirm={(id) => handleUpdateStatus(id, 'CONFIRMED')}
                  onComplete={(appt) => setSelectedAppointment(appt)}
                  onCancel={(id) => handleUpdateStatus(id, 'CANCELLED')}
                  onHistory={(patient) => setHistoryPatient(patient)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};