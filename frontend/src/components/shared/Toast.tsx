import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ show, type, title, message, onClose, duration = 6000 }: ToastProps) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-300 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-sm w-full mx-4 border border-slate-100 transform transition-transform animate-in zoom-in-95 duration-200">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-xs ${
            isSuccess ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
          }`}
        >
          {isSuccess ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-slate-500 text-xs mt-1.5 mb-5 leading-relaxed px-2">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          Cerrar Ventana
        </button>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
