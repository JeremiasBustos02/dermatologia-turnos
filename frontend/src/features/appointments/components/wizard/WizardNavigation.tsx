interface WizardNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isNextValid: boolean;
  isPending: boolean;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export const WizardNavigation = ({
  isFirstStep,
  isLastStep,
  isNextValid,
  isPending,
  onNext,
  onBack,
  onCancel,
}: WizardNavigationProps) => (
  <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
    <button
      type="button"
      onClick={isFirstStep ? onCancel : onBack}
      className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
    >
      {isFirstStep ? 'Cancelar' : 'Atrás'}
    </button>

    <button
      type="button"
      onClick={onNext}
      disabled={!isNextValid || isPending}
      className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
    >
      {isPending && (
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
      )}
      {isLastStep ? (isPending ? 'Confirmando...' : 'Confirmar Turno') : 'Continuar'}
    </button>
  </div>
);
