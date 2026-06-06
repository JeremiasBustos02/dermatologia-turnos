import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import type { Professional } from '../../../types/index';
import { useSpecialties } from '../../management/hooks/useEspecialties';
import { useCoverages } from '../../management/hooks/useCoverages'; 

interface ProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  professionalToEdit: Professional | null;
}

export const ProfessionalModal = ({ isOpen, onClose, onSubmit, professionalToEdit }: ProfessionalModalProps) => {
  const { data: specialties = [], isLoading: isLoadingSpecs } = useSpecialties();
  const { data: coverages = [], isLoading: isLoadingCovs } = useCoverages();
  
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([]);
  const [selectedCoverages, setSelectedCoverages] = useState<number[]>([]); 

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      licenseNumber: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (professionalToEdit) {
        reset({
          firstName: professionalToEdit.firstName,
          lastName: professionalToEdit.lastName,
          licenseNumber: professionalToEdit.licenseNumber || '',
        });
        setSelectedSpecialties(professionalToEdit.specialties?.map((s: any) => s.id) || []);
        setSelectedCoverages(professionalToEdit.coverages?.map((c: any) => c.id) || []);
        reset({ firstName: '', lastName: '', licenseNumber: '' });
        setSelectedSpecialties([]);
        setSelectedCoverages([]);
      }
    }
  }, [professionalToEdit, isOpen, reset]);

  const handleSpecCheckboxChange = (id: number) => {
    setSelectedSpecialties(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCovCheckboxChange = (id: number) => {
    setSelectedCoverages(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const onFormSubmit = (formValues: any) => {
    onSubmit({
      ...formValues,
      specialtyIds: selectedSpecialties,
      coverageIds: selectedCoverages
    });
  };

  const specialtiesList = Array.isArray(specialties) ? specialties : [];
  const coveragesList = Array.isArray(coverages) ? coverages : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">
            {professionalToEdit ? 'Editar Profesional' : 'Nuevo Profesional'}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input
              {...register('firstName', { required: 'El nombre es requerido' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all text-sm"
              placeholder="Ej. Carlos"
            />
            {errors.firstName && <span className="text-xs text-red-500 mt-1 block">{errors.firstName.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
            <input
              {...register('lastName', { required: 'El apellido es requerido' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all text-sm"
              placeholder="Ej. Dermato"
            />
            {errors.lastName && <span className="text-xs text-red-500 mt-1 block">{errors.lastName.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Matrícula (MN/MP)</label>
            <input
              {...register('licenseNumber', { required: 'La matrícula es requerida' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all text-sm"
              placeholder="Ej. MN12345"
            />
            {errors.licenseNumber && <span className="text-xs text-red-500 mt-1 block">{errors.licenseNumber.message}</span>}
          </div>

          {/* Bloque: Especialidades */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Especialidades Médicas</label>
            {isLoadingSpecs ? (
              <p className="text-xs text-slate-400">Cargando especialidades...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-28 overflow-y-auto border border-slate-200 p-3 rounded-lg bg-slate-50/50">
                {specialtiesList.map(spec => (
                  <label key={spec.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                    <input
                      type="checkbox"
                      checked={selectedSpecialties.includes(spec.id)}
                      onChange={() => handleSpecCheckboxChange(spec.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    {spec.name}
                  </label>
                ))}
                {specialtiesList.length === 0 && (
                  <p className="text-xs text-slate-400 col-span-2 text-center py-1">No hay especialidades cargadas.</p>
                )}
              </div>
            )}
          </div>

          {/* NUEVO BLOQUE: Coberturas / Obras Sociales */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Coberturas que Acepta</label>
            {isLoadingCovs ? (
              <p className="text-xs text-slate-400">Cargando coberturas...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-28 overflow-y-auto border border-slate-200 p-3 rounded-lg bg-slate-50/50">
                {coveragesList.map(cov => (
                  <label key={cov.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                    <input
                      type="checkbox"
                      checked={selectedCoverages.includes(cov.id)}
                      onChange={() => handleCovCheckboxChange(cov.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    {cov.name}
                  </label>
                ))}
                {coveragesList.length === 0 && (
                  <p className="text-xs text-slate-400 col-span-2 text-center py-1">No hay coberturas cargadas.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};