import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import type { CreateProfessionalDTO, Professional } from '../../../types/index';

interface ProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProfessionalDTO) => void;
  professionalToEdit?: Professional | null;
}

export const ProfessionalModal = ({ isOpen, onClose, onSubmit, professionalToEdit }: ProfessionalModalProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProfessionalDTO>();

  useEffect(() => {
    if (professionalToEdit) {
      reset({
        firstName: professionalToEdit.firstName,
        lastName: professionalToEdit.lastName,
        licenseNumber: professionalToEdit.licenseNumber,
      });
    } else {
      reset({ firstName: '', lastName: '', licenseNumber: '' });
    }
  }, [professionalToEdit, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {professionalToEdit ? 'Editar Profesional' : 'Nuevo Profesional'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input
              {...register('firstName', { required: 'El nombre es requerido' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej. Carlos"
            />
            {errors.firstName && <span className="text-sm text-red-500 mt-1">{errors.firstName.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
            <input
              {...register('lastName', { required: 'El apellido es requerido' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej. Dermato"
            />
            {errors.lastName && <span className="text-sm text-red-500 mt-1">{errors.lastName.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Matrícula (MN/MP)</label>
            <input
              {...register('licenseNumber', { required: 'La matrícula es requerida' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej. MN12345"
            />
            {errors.licenseNumber && <span className="text-sm text-red-500 mt-1">{errors.licenseNumber.message}</span>}
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};