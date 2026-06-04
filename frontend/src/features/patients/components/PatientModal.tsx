import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import type { CreatePatientDTO, Patient } from '../../../types/index';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePatientDTO) => void;
  patientToEdit?: Patient | null;
}

export const PatientModal = ({ isOpen, onClose, onSubmit, patientToEdit }: PatientModalProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreatePatientDTO>();

  useEffect(() => {
    if (patientToEdit) {
      reset({
        dni: patientToEdit.dni,
        firstName: patientToEdit.firstName,
        lastName: patientToEdit.lastName,
        email: patientToEdit.email,
      });
    } else {
      reset({ dni: '', firstName: '', lastName: '', email: '' });
    }
  }, [patientToEdit, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {patientToEdit ? 'Editar Paciente' : 'Nuevo Paciente'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">DNI</label>
            <input
              {...register('dni', { required: 'El DNI es requerido' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.dni && <span className="text-sm text-red-500 mt-1">{errors.dni.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                {...register('firstName', { required: 'Requerido' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.firstName && <span className="text-sm text-red-500 mt-1">{errors.firstName.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
              <input
                {...register('lastName', { required: 'Requerido' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.lastName && <span className="text-sm text-red-500 mt-1">{errors.lastName.message}</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'El email es requerido' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.email && <span className="text-sm text-red-500 mt-1">{errors.email.message}</span>}
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};