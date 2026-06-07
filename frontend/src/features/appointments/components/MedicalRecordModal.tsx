import { useState } from 'react';
import { X, FileText, Stethoscope, Pill } from 'lucide-react';
import type { Appointment } from '../types';
import { useCreateMedicalRecord } from '../hooks/useMedicalRecords';
import { useUpdateAppointmentStatus } from '../hooks/useAppointments';

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export const MedicalRecordModal = ({ isOpen, onClose, appointment }: MedicalRecordModalProps) => {
  const [reason, setReason] = useState('');
  const [evolution, setEvolution] = useState('');
  const [prescription, setPrescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createRecordMutation = useCreateMedicalRecord();
  const updateStatusMutation = useUpdateAppointmentStatus();

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!evolution.trim()) {
      setError('La evolución clínica es un campo obligatorio.');
      return;
    }

    // 1. Guardamos la evolución clínica
    createRecordMutation.mutate(
      {
        patientId: appointment.patient.id,
        professionalId: appointment.professional.id,
        appointmentId: appointment.id,
        reason: reason.trim() || undefined,
        evolution: evolution.trim(),
        prescription: prescription.trim() || undefined,
      },
      {
        onSuccess: () => {
          // 2. Si se guardó bien, cerramos el turno (lo pasamos a COMPLETED)
          updateStatusMutation.mutate(
            { id: appointment.id, status: 'COMPLETED' },
            {
              onSuccess: () => {
                handleClose();
              },
            }
          );
        },
        onError: () => {
          setError('Ocurrió un error al guardar la historia clínica.');
        },
      }
    );
  };

  const handleClose = () => {
    setReason('');
    setEvolution('');
    setPrescription('');
    setError(null);
    onClose();
  };

  const isSubmitting = createRecordMutation.isPending || updateStatusMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Evolución Clínica</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Paciente: <span className="font-semibold text-slate-700">{appointment.patient.firstName} {appointment.patient.lastName}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario / Cuerpo */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          <form id="medical-record-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Motivo de Consulta */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileText size={16} className="text-blue-500" />
                Motivo de Consulta
              </label>
              <input
                type="text"
                placeholder="Ej: Control de rutina, Dolor abdominal..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Evolución (Obligatorio) */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Stethoscope size={16} className="text-blue-500" />
                Evolución / Diagnóstico <span className="text-rose-500">*</span>
              </label>
              <textarea
                placeholder="Redacte las observaciones, examen físico y diagnóstico..."
                value={evolution}
                onChange={(e) => setEvolution(e.target.value)}
                rows={5}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
              />
            </div>

            {/* Receta / Indicaciones */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Pill size={16} className="text-blue-500" />
                Receta e Indicaciones
              </label>
              <textarea
                placeholder="Medicamentos recetados o pasos a seguir..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                rows={3}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
              />
            </div>
          </form>
        </div>

        {/* Footer / Acciones */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="medical-record-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              'Guardar y Completar Turno'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};