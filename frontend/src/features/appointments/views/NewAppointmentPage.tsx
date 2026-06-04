import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PatientStep } from '../components/wizard/PatientStep';

export interface NewAppointmentState {
  patientId?: number;
  professionalId?: number;
  coverageId?: number;
  date?: string;
  time?: string;
  notes?: string;
}

const STEPS = ['Paciente', 'Especialista', 'Fecha y Hora', 'Confirmar'];

export const NewAppointmentPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<NewAppointmentState>({});

  const handleNext = (data: Partial<NewAppointmentState>) => {
    setAppointmentData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/dashboard');
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabecera */}
      <div className="flex items-center gap-4">
        <button 
          onClick={handleBack}
          className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agendar Nuevo Turno</h1>
          <p className="text-slate-500 text-sm">Completa los pasos para registrar una nueva consulta.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
          
          {STEPS.map((stepName, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;

            return (
              <div key={stepName} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                  isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {stepNumber}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                  {stepName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
        {currentStep === 1 && (
          <PatientStep 
            onNext={(patientId) => handleNext({ patientId })} 
            defaultSelected={appointmentData.patientId}
          />
        )}
        {currentStep === 2 && <div>(Pronto) Paso 2: Seleccionar Profesional</div>}
        {currentStep === 3 && <div>(Pronto) Paso 3: Selector de Días y Horarios Libres</div>}
        {currentStep === 4 && <div>(Pronto) Paso 4: Resumen y Confirmación</div>}
      </div>
    </div>
  );
};