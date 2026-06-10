import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Stethoscope, Calendar as CalendarIcon } from 'lucide-react';
import { ProfessionalStep } from '../../appointments/components/wizard/ProfessionalStep';
import { DateTimeStep } from '../../appointments/components/wizard/DateTimeStep';
import { SummaryStep } from '../../appointments/components/wizard/SummaryStep';
import { useSelfBooking } from '../../appointments/hooks/useAppointments';
import { useAuthStore } from '../../auth/auth.store';
import dayjs from 'dayjs';

export interface PatientAppointmentState {
  professionalId?: number;
  coverageId?: number;
  date?: string;
  time?: string;
  dateTime?: string;
  notes?: string;
}

const STEPS = ['Especialista', 'Fecha y Hora', 'Confirmación'];

export const PatientNewAppointment = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<PatientAppointmentState>({});
  const [localError, setLocalError] = useState<string | null>(null);

  const selfBookingMutation = useSelfBooking();

  const handleFinalSubmit = () => {
    setLocalError(null);
    if (!appointmentData.professionalId || !appointmentData.dateTime) {
      setLocalError('Faltan datos para confirmar el turno.');
      return;
    }

    selfBookingMutation.mutate({
      professionalId: appointmentData.professionalId,
      ...(appointmentData.coverageId ? { coverageId: appointmentData.coverageId } : {}),
      dateTime: appointmentData.dateTime,
      notes: 'Turno autogestionado desde el Portal del Paciente.',
    }, {
      onSuccess: () => {
        navigate('/portal/dashboard', {
          replace: true,
          state: { showSuccessToast: true, toastMessage: '¡Turno reservado con éxito! Revisa tu correo para más detalles.' },
        });
      },
      onError: (error: any) => {
        const backendError = error.response?.data;
        const errorMessage = backendError?.message || 'Error de conexión con el servidor.';
        setLocalError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
      }
    });
  };

  const handleNextStep = () => {
    setLocalError(null);
    if (currentStep === 3) {
      handleFinalSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBackStep = () => {
    setLocalError(null);
    if (currentStep === 1) {
      navigate('/portal/dashboard');
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isCurrentStepValid = () => {
    if (currentStep === 1) return !!appointmentData.professionalId;
    if (currentStep === 2) return !!appointmentData.date && !!appointmentData.time && !!appointmentData.dateTime;
    return true; 
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-4 pb-2">
        <button
          onClick={handleBackStep}
          className="p-2 text-slate-500 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 shadow-xs"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Nuevo Turno</h1>
        </div>
      </div>

      {/* Indicador de Pasos (Adaptado para 3 pasos) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex justify-between items-center relative max-w-2xl mx-auto">
          <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 z-0"></div>
          
          {STEPS.map((stepName, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;

            return (
              <div key={stepName} className="relative z-10 flex flex-col items-center gap-2 bg-white px-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
                  isActive ? 'bg-blue-600 text-white ring-4 ring-blue-50' :
                  isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span className={`text-xs font-medium tracking-tight ${isActive ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                  {stepName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-xs min-h-[420px] flex flex-col justify-between">
          
          <div className="flex-1">
            {localError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs font-medium">
                {localError}
              </div>
            )}

            {/* Inyección de componentes del Wizard ya existentes */}
            {currentStep === 1 && (
              <ProfessionalStep 
                onNext={(data) => setAppointmentData(prev => ({ ...prev, ...data }))} 
                defaultProfessionalId={appointmentData.professionalId}
                defaultCoverageId={appointmentData.coverageId}
              />
            )}
            {currentStep === 2 && appointmentData.professionalId && (
              <DateTimeStep 
                professionalId={appointmentData.professionalId} 
                onNext={(data) => setAppointmentData(prev => ({ ...prev, ...data }))}
                defaultDate={appointmentData.date}
                defaultTime={appointmentData.time}
              />
            )}
            {currentStep === 3 && user && (
              <SummaryStep 
                appointmentData={{ ...appointmentData, patientId: user.userId }}
                patientOverride={{ firstName: user.firstName, lastName: user.lastName, dni: user.dni }}
              />
            )}
          </div>

          <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={handleBackStep}
              className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {currentStep === 1 ? 'Cancelar' : 'Atrás'}
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={!isCurrentStepValid() || selfBookingMutation.isPending}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
            >
              {selfBookingMutation.isPending && (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              )}
              {currentStep === 3 ? (selfBookingMutation.isPending ? 'Confirmando...' : 'Confirmar Turno') : 'Continuar'}
            </button>
          </div>
        </div>

        {/* Sidebar Informativo simplificado para el paciente */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4 hidden sm:block">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tu Selección</h3>
          <div className="space-y-3 text-xs">
            <div className={`p-3 rounded-lg border bg-white flex items-center gap-3 ${appointmentData.professionalId ? 'border-slate-200' : 'border-dashed border-slate-300'}`}>
              <Stethoscope size={16} className={appointmentData.professionalId ? 'text-blue-500' : 'text-slate-300'} />
              <div>
                <p className="font-semibold text-slate-700">Profesional</p>
                <p className="text-slate-400 text-[11px]">{appointmentData.professionalId ? 'Seleccionado' : 'Pendiente'}</p>
              </div>
            </div>

            <div className={`p-3 rounded-lg border bg-white flex items-center gap-3 ${appointmentData.dateTime ? 'border-slate-200' : 'border-dashed border-slate-300'}`}>
              <CalendarIcon size={16} className={appointmentData.dateTime ? 'text-blue-500' : 'text-slate-300'} />
              <div>
                <p className="font-semibold text-slate-700">Fecha y Hora</p>
                <p className="text-slate-500 font-medium text-[11px]">
                  {appointmentData.date && appointmentData.time ? `${dayjs(appointmentData.date).format('DD/MM/YYYY')} - ${appointmentData.time} hs` : 'Pendiente'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};