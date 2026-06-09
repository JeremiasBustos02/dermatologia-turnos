import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { CheckCircle, Calendar, User, Stethoscope } from 'lucide-react';
import { usePatients } from '../../../patients/hooks/usePatients';
import { useProfessionals } from '../../../professionals/hooks/useProfessionals';
import type { NewAppointmentState } from '../../hooks/useWizard';

interface SummaryStepProps {
  appointmentData: NewAppointmentState;
  patientOverride?: { firstName: string; lastName: string; dni: string };
}

export const SummaryStep = ({ appointmentData, patientOverride }: SummaryStepProps) => {
  const { data: patients = [] } = usePatients();
  const { data: professionals = [] } = useProfessionals();

  const patient = patientOverride ?? patients.find(p => p.id === appointmentData.patientId);
  const professional = professionals.find(p => p.id === appointmentData.professionalId);
  const coverageName = professional?.coverages.find(c => c.id === appointmentData.coverageId)?.name || 'N/A';   

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-2">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Resumen del Turno</h2>
        <p className="text-slate-500">Por favor, verifica que los datos sean correctos antes de confirmar.</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
          <User className="text-slate-400 mt-1" size={20} />
          <div>
            <p className="text-sm text-slate-500 font-medium">Paciente</p>
            <p className="text-lg font-semibold text-slate-900">
              {patient ? `${patient.firstName} ${patient.lastName}` : 'Cargando...'}
            </p>
            <p className="text-sm text-slate-500">DNI: {patient?.dni}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
          <Stethoscope className="text-slate-400 mt-1" size={20} />
          <div>
            <p className="text-sm text-slate-500 font-medium">Profesional</p>
            <p className="text-lg font-semibold text-slate-900">
              {professional ? `${professional.firstName} ${professional.lastName}` : 'Cargando...'}
            </p>
            <p className="text-sm text-slate-500">Cobertura seleccionada: {coverageName}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Calendar className="text-slate-400 mt-1" size={20} />
          <div>
            <p className="text-sm text-slate-500 font-medium">Fecha y Hora</p>
            <p className="text-lg font-semibold text-slate-900">
              {dayjs(appointmentData.date).format('DD/MM/YYYY')} a las {appointmentData.time} hs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};