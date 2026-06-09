import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import type { CreatePatientDTO, Patient } from '../../../types/index';
import { useCoverages } from '../../management/hooks/useCoverages';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  patientToEdit?: Patient | null;
}

interface PatientFormValues extends Omit<CreatePatientDTO, 'coverageId'> {
  coverageId: string | number;
}

export const PatientModal = ({ isOpen, onClose, onSubmit, patientToEdit }: PatientModalProps) => {
  const { data: coverages = [], isLoading: isLoadingCovs } = useCoverages();

  // Le pasamos el tipo al hook para que reconozca los mensajes de error como strings válidos
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PatientFormValues>({
    defaultValues: {
      dni: '',
      firstName: '',
      lastName: '',
      email: '',
      coverageId: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (patientToEdit) {
        reset({
          dni: patientToEdit.dni,
          firstName: patientToEdit.firstName,
          lastName: patientToEdit.lastName,
          email: patientToEdit.email,
          coverageId: (patientToEdit as any).coverage?.id || '',
        });
      } else {
        reset({ dni: '', firstName: '', lastName: '', email: '', coverageId: '' });
      }
    }
  }, [patientToEdit, isOpen, reset]);

  const onFormSubmit = (formValues: PatientFormValues) => {
    onSubmit({
      ...formValues,
      coverageId: formValues.coverageId === '' ? null : Number(formValues.coverageId)
    });
  };

  const coveragesList = Array.isArray(coverages) ? coverages : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {patientToEdit ? 'Editar Paciente' : 'Nuevo Paciente'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          
          {/* Campo: DNI */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">DNI</label>
            <input
              {...register('dni', { required: 'El DNI es requerido' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all text-sm"
              placeholder="Ej. 45123456"
            />
            {errors.dni && <span className="text-xs text-red-500 mt-1 block">{errors.dni.message}</span>}
          </div>

          {/* Fila: Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                {...register('firstName', { required: 'El nombre es requerido' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all text-sm"
              />
              {errors.firstName && <span className="text-xs text-red-500 mt-1 block">{errors.firstName.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
              <input
                {...register('lastName', { required: 'El apellido es requerido' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all text-sm"
              />
              {errors.lastName && <span className="text-xs text-red-500 mt-1 block">{errors.lastName.message}</span>}
            </div>
          </div>

          {/* Campo: Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'El email es requerido' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all text-sm"
              placeholder="paciente@correo.com"
            />
            {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
          </div>

          {/* Desplegable: Obra Social */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Obra Social / Prepaga</label>
            {isLoadingCovs ? (
              <div className="w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-400 rounded-lg text-sm">
                Cargando coberturas disponibles...
              </div>
            ) : (
              <select
                {...register('coverageId')}
                className="w-full px-4 py-2 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all text-sm text-slate-700"
              >
                <option value="">Particular (Sin Obra Social)</option>
                {coveragesList.map((cov) => (
                  <option key={cov.id} value={cov.id}>
                    {cov.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Botonera Inferior */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors"
            >
              Guardar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};