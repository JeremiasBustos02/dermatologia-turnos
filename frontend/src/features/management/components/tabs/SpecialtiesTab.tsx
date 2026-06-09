import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useSpecialties, useCreateSpecialty } from '../../hooks/useEspecialties';
import { SpecialtyModal } from '../SpecialtyModal';

interface SpecialtiesTabProps {
  clinicId?: number;
  onDeleteRequest: (id: number, type: 'spec') => void;
}

export const SpecialtiesTab = ({ clinicId, onDeleteRequest }: SpecialtiesTabProps) => {
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const { data: specialties = [], isLoading: isLoadingSpecs } = useSpecialties(clinicId);
  const createSpecialtyMutation = useCreateSpecialty();

  const handleSpecSubmit = (data: { name: string; description: string }) => {
    createSpecialtyMutation.mutate({ ...data, clinicId: clinicId! }, { onSuccess: () => setIsSpecModalOpen(false) });
  };

  const specialtiesList = Array.isArray(specialties) ? specialties : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Especialidades Médicas</h3>
          <p className="text-slate-400 text-[11px] font-medium">Ramas de la medicina activas para la asignación de profesionales.</p>
        </div>
        <button
          onClick={() => setIsSpecModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-3xs"
        >
          + Nueva Especialidad
        </button>
      </div>

      {isLoadingSpecs ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="border border-slate-150 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Descripción</th>
                <th className="p-3 text-center w-20">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              {specialtiesList.map((spec) => (
                <tr key={spec.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-800 text-xs">{spec.name}</td>
                  <td className="p-3 text-slate-400 text-[11px] font-normal">{spec.description || 'Sin descripción asignada'}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onDeleteRequest(spec.id, 'spec')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {specialtiesList.length === 0 && (
                <tr><td colSpan={3} className="p-8 text-center text-slate-400 text-[11px] font-normal">No hay especialidades dadas de alta.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <SpecialtyModal isOpen={isSpecModalOpen} onClose={() => setIsSpecModalOpen(false)} onSubmit={handleSpecSubmit} />
    </div>
  );
};
