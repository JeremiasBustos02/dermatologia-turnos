import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import type { Professional } from '../../../types/index';
import { useSpecialties } from '../../management/hooks/useEspecialties';
import { useCoverages } from '../../management/hooks/useCoverages'; 
import { useAuthStore } from '../../auth/auth.store';

interface ProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  professionalToEdit: Professional | null;
}

export const ProfessionalModal = ({ isOpen, onClose, onSubmit, professionalToEdit }: ProfessionalModalProps) => {
  const clinicId = useAuthStore((state) => state.user?.clinicId);
  const { data: specialties = [], isLoading: isLoadingSpecs } = useSpecialties(clinicId);
  const { data: coverages = [], isLoading: isLoadingCovs } = useCoverages(clinicId);
  
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([]);
  const [selectedCoverages, setSelectedCoverages] = useState<number[]>([]); 

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      licenseNumber: '',
    }
  });

  // 🌟 Sincronización limpia de estados e inputs
  useEffect(() => {
    if (isOpen) {
      if (professionalToEdit) {
        // Modo Edición: Cargamos los datos reales del backend sin pisarlos
        reset({
          firstName: professionalToEdit.firstName,
          lastName: professionalToEdit.lastName,
          licenseNumber: professionalToEdit.licenseNumber || '',
        });
        setSelectedSpecialties(professionalToEdit.specialties?.map((s: any) => s.id) || []);
        setSelectedCoverages(professionalToEdit.coverages?.map((c: any) => c.id) || []);
      } else {
        // Modo Creación: Limpiamos todo el formulario por completo
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 bg-slate-50 border-b border-slate-200 shrink-0">
          <h2 className="text-sm font-bold text-slate-800">
            {professionalToEdit ? 'Editar Profesional Médico' : 'Registrar Nuevo Profesional'}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:bg-slate-200 p-1 rounded-md transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs font-medium text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold">Nombre *</label>
              <input
                {...register('firstName', { required: 'El nombre es obligatorio' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white text-slate-800 font-medium text-xs"
                placeholder="Ej. Carlos"
              />
              {errors.firstName && <span className="text-[10px] text-red-500 mt-1 block">{errors.firstName.message}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-semibold">Apellido *</label>
              <input
                {...register('lastName', { required: 'El apellido es obligatorio' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white text-slate-800 font-medium text-xs"
                placeholder="Ej. Dermato"
              />
              {errors.lastName && <span className="text-[10px] text-red-500 mt-1 block">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Matrícula (MN/MP) *</label>
            <input
              {...register('licenseNumber', { required: 'La matrícula es obligatoria' })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white text-slate-800 font-medium text-xs"
              placeholder="Ej. MN12345"
            />
            {errors.licenseNumber && <span className="text-[10px] text-red-500 mt-1 block">{errors.licenseNumber.message}</span>}
          </div>

          {/* Especialidades */}
          <div className="space-y-1.5">
            <label className="text-slate-500 font-semibold">Especialidades Médicas</label>
            {isLoadingSpecs ? (
              <p className="text-[10px] text-slate-400">Cargando catálogo...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto border border-slate-200 p-2.5 rounded-lg bg-slate-50/50">
                {specialtiesList.map(spec => (
                  <label key={spec.id} className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-slate-900 select-none text-[11px]">
                    <input
                      type="checkbox"
                      checked={selectedSpecialties.includes(spec.id)}
                      onChange={() => handleSpecCheckboxChange(spec.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                    />
                    {spec.name}
                  </label>
                ))}
                {specialtiesList.length === 0 && (
                  <p className="text-[10px] text-slate-400 col-span-2 text-center py-1">No hay especialidades cargadas.</p>
                )}
              </div>
            )}
          </div>

          {/* Coberturas */}
          <div className="space-y-1.5">
            <label className="text-slate-500 font-semibold">Obras Sociales / Coberturas</label>
            {isLoadingCovs ? (
              <p className="text-[10px] text-slate-400">Cargando coberturas...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto border border-slate-200 p-2.5 rounded-lg bg-slate-50/50">
                {coveragesList.map(cov => (
                  <label key={cov.id} className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-slate-900 select-none text-[11px]">
                    <input
                      type="checkbox"
                      checked={selectedCoverages.includes(cov.id)}
                      onChange={() => handleCovCheckboxChange(cov.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                    />
                    {cov.name}
                  </label>
                ))}
                {coveragesList.length === 0 && (
                  <p className="text-[10px] text-slate-400 col-span-2 text-center py-1">No hay coberturas cargadas.</p>
                )}
              </div>
            )}
          </div>

          {/* Footer Acciones */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 shrink-0 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs">
              <Save size={14} />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};