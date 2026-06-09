import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useCoverages, useCreateCoverage } from '../../hooks/useCoverages';
import { CoverageModal } from '../CoverageModal';

interface CoveragesTabProps {
  clinicId?: number;
  onDeleteRequest: (id: number, type: 'cov') => void;
}

export const CoveragesTab = ({ clinicId, onDeleteRequest }: CoveragesTabProps) => {
  const [isCovModalOpen, setIsCovModalOpen] = useState(false);
  const { data: coverages = [], isLoading: isLoadingCovs } = useCoverages(clinicId);
  const createCoverageMutation = useCreateCoverage();

  const handleCovSubmit = (data: { name: string; description: string }) => {
    createCoverageMutation.mutate({ ...data, clinicId: clinicId! }, { onSuccess: () => setIsCovModalOpen(false) });
  };

  const coveragesList = Array.isArray(coverages) ? coverages : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Obras Sociales y Prepagas</h3>
          <p className="text-slate-400 text-[11px] font-medium">Nomenclador de coberturas autorizadas para la validación de turnos.</p>
        </div>
        <button
          onClick={() => setIsCovModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-3xs"
        >
          + Nueva Cobertura
        </button>
      </div>

      {isLoadingCovs ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="border border-slate-150 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Obra Social / Prepaga</th>
                <th className="p-3">Observaciones Operativas</th>
                <th className="p-3 text-center w-20">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              {coveragesList.map((cov) => (
                <tr key={cov.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-800 text-xs">{cov.name}</td>
                  <td className="p-3 text-slate-400 text-[11px] font-normal">{cov.description || 'Sin especificaciones reglamentarias'}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onDeleteRequest(cov.id, 'cov')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {coveragesList.length === 0 && (
                <tr><td colSpan={3} className="p-8 text-center text-slate-400 text-[11px] font-normal">No hay coberturas dadas de alta.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <CoverageModal isOpen={isCovModalOpen} onClose={() => setIsCovModalOpen(false)} onSubmit={handleCovSubmit} />
    </div>
  );
};
