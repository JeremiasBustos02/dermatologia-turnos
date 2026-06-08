import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PatientStep } from '../components/wizard/PatientStep';
import { ProfessionalStep } from '../components/wizard/ProfessionalStep';
import { DateTimeStep } from '../components/wizard/DateTimeStep';
import { SummaryStep } from '../components/wizard/SummaryStep';
import { WizardStepper } from '../components/wizard/WizardStepper';
import { WizardNavigation } from '../components/wizard/WizardNavigation';
import { WizardSidebar } from '../components/wizard/WizardSidebar';
import { useWizard, STEPS } from '../hooks/useWizard';
import { useCreateAppointment } from '../hooks/useAppointments';

export const NewAppointmentPage = () => {
  const navigate = useNavigate();
  const wizard = useWizard();
  const createMutation = useCreateAppointment();

  const handleFinalSubmit = () => {
    wizard.setLocalError(null);
    if (!wizard.appointmentData.patientId || !wizard.appointmentData.professionalId || !wizard.appointmentData.coverageId || !wizard.appointmentData.dateTime) {
      wizard.setLocalError('Faltan datos estructurales para poder dar de alta el turno médico.');
      return;
    }

    createMutation.mutate({
      patientId: wizard.appointmentData.patientId,
      professionalId: wizard.appointmentData.professionalId,
      coverageId: wizard.appointmentData.coverageId,
      dateTime: wizard.appointmentData.dateTime,
      notes: wizard.appointmentData.notes || 'Turno generado desde el panel operativo.'
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
        wizard.setLocalError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
      }
    });
  };

  const handleNext = () => {
    if (wizard.isLastStep) {
      handleFinalSubmit();
    } else {
      wizard.goToNext();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
        <button
          onClick={wizard.isFirstStep ? () => navigate('/dashboard') : wizard.goToBack}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 shadow-xs"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agendar Turno</h1>
          <p className="text-slate-500 text-sm">Registra una nueva cita médica en el flujo operativo de la clínica.</p>
        </div>
      </div>

      <WizardStepper steps={STEPS} currentStep={wizard.currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-xs min-h-[420px] flex flex-col justify-between">
          <div className="flex-1">
            {wizard.localError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs font-medium">
                {wizard.localError}
              </div>
            )}

            {wizard.currentStep === 1 && (
              <PatientStep
                onNext={(patientId) => wizard.updateAppointmentData({ patientId })}
                defaultSelected={wizard.appointmentData.patientId}
              />
            )}
            {wizard.currentStep === 2 && (
              <ProfessionalStep
                onNext={(data) => wizard.updateAppointmentData(data)}
                defaultProfessionalId={wizard.appointmentData.professionalId}
                defaultCoverageId={wizard.appointmentData.coverageId}
              />
            )}
            {wizard.currentStep === 3 && wizard.appointmentData.professionalId && (
              <DateTimeStep
                professionalId={wizard.appointmentData.professionalId}
                onNext={(data) => wizard.updateAppointmentData(data)}
                defaultDate={wizard.appointmentData.date}
                defaultTime={wizard.appointmentData.time}
              />
            )}
            {wizard.currentStep === 4 && (
              <SummaryStep appointmentData={wizard.appointmentData} />
            )}
          </div>

          <WizardNavigation
            isFirstStep={wizard.isFirstStep}
            isLastStep={wizard.isLastStep}
            isNextValid={wizard.isCurrentStepValid()}
            isPending={createMutation.isPending}
            onNext={handleNext}
            onBack={wizard.goToBack}
            onCancel={() => navigate('/dashboard')}
          />
        </div>

        <WizardSidebar appointmentData={wizard.appointmentData} />
      </div>
    </div>
  );
};