import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { useEffect } from 'react';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const StaffModal = ({ isOpen, onClose, onSubmit }: StaffModalProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      dni: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-800">Alta de Personal de Recepción</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:bg-slate-200 p-1 rounded-md transition-all">
            <X size={14} />
          </button>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-3.5 text-xs font-medium text-slate-700">
          
          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Documento Nacional de Identidad (DNI) *</label>
            <input
              type="text"
              {...register('dni', { required: 'El DNI es un campo obligatorio.' })}
              placeholder="Ej: 35442118"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white text-slate-800 font-medium text-xs"
            />
            {errors.dni && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.dni.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold">Nombre *</label>
              <input
                type="text"
                {...register('firstName', { required: 'El nombre es obligatorio.' })}
                placeholder="Ej: María"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white text-slate-800 font-medium text-xs"
              />
              {errors.firstName && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.firstName.message}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-semibold">Apellido *</label>
              <input
                type="text"
                {...register('lastName', { required: 'El apellido es obligatorio.' })}
                placeholder="Ej: Fernández"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white text-slate-800 font-medium text-xs"
              />
              {errors.lastName && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Correo Electrónico (Usuario de Acceso) *</label>
            <input
              type="email"
              {...register('email', { 
                required: 'El correo electrónico es obligatorio.',
                pattern: { value: /^\S+@\S+$/i, message: 'El formato de correo no es válido.' }
              })}
              placeholder="maria.f@clinica.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white text-slate-800 font-medium text-xs"
            />
            {errors.email && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.email.message}</span>}
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Contraseña Inicial *</label>
            <input
              type="password"
              {...register('password', { 
                required: 'La credencial es obligatoria.',
                minLength: { value: 6, message: 'La clave debe poseer al menos 6 caracteres.' }
              })}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white text-slate-800 font-medium text-xs"
            />
            {errors.password && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.password.message}</span>}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Save size={13} />
              Dar de Alta Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};