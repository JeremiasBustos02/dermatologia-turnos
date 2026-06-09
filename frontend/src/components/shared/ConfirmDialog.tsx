import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: ReactNode;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  icon,
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white p-5 rounded-xl shadow-xl max-w-sm w-full mx-4 border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className={`flex items-center gap-3 mb-3 ${destructive ? 'text-rose-600' : 'text-amber-600'}`}>
          <div className={`p-2 rounded-lg ${destructive ? 'bg-rose-50' : 'bg-amber-50'}`}>
            {icon || <AlertTriangle size={18} />}
          </div>
          <h3 className="text-xs font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
          {description}
        </p>
        <div className="flex justify-end gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-3 py-1.5 text-white rounded-lg transition-colors shadow-xs ${
              destructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
