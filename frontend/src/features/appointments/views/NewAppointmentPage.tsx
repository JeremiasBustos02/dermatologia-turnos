import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Stethoscope, Calendar as CalendarIcon } from 'lucide-react';
import { PatientStep } from '../components/wizard/PatientStep';
import { ProfessionalStep } from '../components/wizard/ProfessionalStep';
import { DateTimeStep } from '../components/wizard/DateTimeStep';
import { SummaryStep } from '../components/wizard/SummaryStep';
import { useCreateAppointment } from '../hooks/useAppointments';
import dayjs from 'dayjs';

export interface NewAppointmentState {
  patientId?: number;
  professionalId?: number;
  coverageId?: number;
  date?: string;
  time?: string;
  dateTime?: string;
  notes?: string;
}

const STEPS = ['Paciente', 'Especialista', 'Fecha y Hora', 'Confirmación'];

export const NewAppointmentPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<NewAppointmentState>({});
  const [localError, setLocalError] = useState<string | null>(null);

  const createMutation = useCreateAppointment();

  const handleFinalSubmit = () => {
    setLocalError(null);
    if (!appointmentData.patientId || !appointmentData.professionalId || !appointmentData.coverageId || !appointmentData.dateTime) {
      setLocalError('Faltan datos estructurales para poder dar de alta el turno médico.');
      return;
    }

    createMutation.mutate({
      patientId: appointmentData.patientId,
      professionalId: appointmentData.professionalId,
      coverageId: appointmentData.coverageId,
      dateTime: appointmentData.dateTime,
      notes: appointmentData.notes || 'Turno generado desde el panel operativo.'
    }, {
      onSuccess: () => {
        navigate('/dashboard', {
          state: {
            showSuccessToast: true,
            toastMessage: '¡Turno reservado con éxito! Se ha enviado el comprobante por correo electrónico al paciente automáticamente.'
          }
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
    if (currentStep === 4) {
      handleFinalSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBackStep = () => {
    setLocalError(null);
    if (currentStep === 1) {
      navigate('/dashboard');
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Validación de activación del botón continuar por cada paso
  const isCurrentStepValid = () => {
    if (currentStep === 1) return !!appointmentData.patientId;
    if (currentStep === 2) return !!appointmentData.professionalId && !!appointmentData.coverageId;
    if (currentStep === 3) return !!appointmentData.date && !!appointmentData.time && !!appointmentData.dateTime;
    return true; // Paso 4 de confirmación siempre es válido para enviar
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Corporativo */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
        <button
          onClick={handleBackStep}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 shadow-xs"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agendar Turno</h1>
          <p className="text-slate-500 text-sm">Registra una nueva cita médica en el flujo operativo de la clínica.</p>
        </div>
      </div>

      {/* Indicador de Pasos */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex justify-between items-center relative max-w-3xl mx-auto">
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

      {/* Contenido Modular del Formulario */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-xs min-h-[420px] flex flex-col justify-between">
          
          <div className="flex-1">
            {localError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs font-medium">
                {localError}
              </div>
            )}

            {/* Inyecciones de pasos (Modificados para alterar el estado del padre al clickear) */}
            {currentStep === 1 && (
              <PatientStep 
                onNext={(patientId) => setAppointmentData(prev => ({ ...prev, patientId }))} 
                defaultSelected={appointmentData.patientId} 
              />
            )}
            {currentStep === 2 && (
              <ProfessionalStep 
                onNext={(data) => setAppointmentData(prev => ({ ...prev, ...data }))} 
                defaultProfessionalId={appointmentData.professionalId}
                defaultCoverageId={appointmentData.coverageId}
              />
            )}
            {currentStep === 3 && appointmentData.professionalId && (
              <DateTimeStep 
                professionalId={appointmentData.professionalId} 
                onNext={(data) => setAppointmentData(prev => ({ ...prev, ...data }))}
                defaultDate={appointmentData.date}
                defaultTime={appointmentData.time}
              />
            )}
            {currentStep === 4 && (
              <SummaryStep appointmentData={appointmentData} onConfirm={handleFinalSubmit} isSubmitting={createMutation.isPending} />
            )}
          </div>

          {/* 🌟 BARRA DE NAVEGACIÓN UNIFICADA: CONTROL TOTAL DE FLUJO */}
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
              disabled={!isCurrentStepValid() || createMutation.isPending}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
            >
              {createMutation.isPending && (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              )}
              {currentStep === 4 ? (createMutation.isPending ? 'Confirmando...' : 'Confirmar Turno') : 'Continuar'}
            </button>
          </div>
        </div>

        {/* Sidebar Informativo */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resumen de Cita</h3>
          <div className="space-y-3 text-xs">
            <div className={`p-3 rounded-lg border bg-white flex items-center gap-3 ${appointmentData.patientId ? 'border-slate-200' : 'border-dashed border-slate-300'}`}>
              <User size={16} className={appointmentData.patientId ? 'text-blue-500' : 'text-slate-300'} />
              <div>
                <p className="font-semibold text-slate-700">Paciente</p>
                <p className="text-slate-400 text-[11px]">{appointmentData.patientId ? 'Seleccionado' : 'Pendiente'}</p>
              </div>
            </div>

            <div className={`p-3 rounded-lg border bg-white flex items-center gap-3 ${appointmentData.professionalId ? 'border-slate-200' : 'border-dashed border-slate-300'}`}>
              <Stethoscope size={16} className={appointmentData.professionalId ? 'text-blue-500' : 'text-slate-300'} />
              <div>
                <p className="font-semibold text-slate-700">Médico Especialista</p>
                <p className="text-slate-400 text-[11px]">{appointmentData.professionalId ? 'Asignado' : 'Pendiente'}</p>
              </div>
            </div>

            <div className={`p-3 rounded-lg border bg-white flex items-center gap-3 ${appointmentData.dateTime ? 'border-slate-200' : 'border-dashed border-slate-300'}`}>
              <CalendarIcon size={16} className={appointmentData.dateTime ? 'text-blue-500' : 'text-slate-300'} />
              <div>
                <p className="font-semibold text-slate-700">Horario de Reserva</p>
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