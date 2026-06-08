interface WizardStepperProps {
  steps: string[];
  currentStep: number;
}

export const WizardStepper = ({ steps, currentStep }: WizardStepperProps) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
    <div className="flex justify-between items-center relative max-w-3xl mx-auto">
      <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 z-0" />

      {steps.map((stepName, index) => {
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
);
