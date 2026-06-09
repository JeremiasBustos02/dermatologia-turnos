import { useState } from 'react';

export interface NewAppointmentState {
  patientId?: number;
  professionalId?: number;
  coverageId?: number;
  date?: string;
  time?: string;
  dateTime?: string;
  notes?: string;
}

export const STEPS = ['Paciente', 'Especialista', 'Fecha y Hora', 'Confirmación'];

export function useWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<NewAppointmentState>({});
  const [localError, setLocalError] = useState<string | null>(null);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === STEPS.length;

  const updateAppointmentData = (data: Partial<NewAppointmentState>) => {
    setAppointmentData(prev => ({ ...prev, ...data }));
  };

  const isCurrentStepValid = () => {
    if (currentStep === 1) return !!appointmentData.patientId;
    if (currentStep === 2) return !!appointmentData.professionalId && !!appointmentData.coverageId;
    if (currentStep === 3) return !!appointmentData.date && !!appointmentData.time && !!appointmentData.dateTime;
    return true;
  };

  const goToNext = () => {
    setLocalError(null);
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToBack = () => {
    setLocalError(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return {
    currentStep,
    appointmentData,
    localError,
    isFirstStep,
    isLastStep,
    updateAppointmentData,
    setAppointmentData,
    setLocalError,
    isCurrentStepValid,
    goToNext,
    goToBack,
    setCurrentStep,
  };
}
