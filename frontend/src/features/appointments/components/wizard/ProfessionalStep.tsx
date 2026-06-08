import { useState, useEffect } from 'react';
import { Stethoscope, Shield } from 'lucide-react';
import { useProfessionals } from '../../../professionals/hooks/useProfessionals';
import { useCoverages } from '../../../management/hooks/useCoverages';
import { SearchablePicker } from '../../../../components/shared/SearchablePicker';
import type { Professional } from '../../../../types/index';

interface ProfessionalStepProps {
  onNext: (data: { professionalId: number; coverageId: number }) => void;
  defaultProfessionalId?: number;
  defaultCoverageId?: number;
}

export const ProfessionalStep = ({ onNext, defaultProfessionalId, defaultCoverageId }: ProfessionalStepProps) => {
  const { data: professionals = [], isLoading, isError } = useProfessionals();
  const { data: coverages = [] } = useCoverages();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedProfessional, setSelectedProfessional] = useState<number | undefined>(defaultProfessionalId);
  const [selectedCoverage, setSelectedCoverage] = useState<number | undefined>(defaultCoverageId);

  useEffect(() => {
    if (selectedProfessional && selectedCoverage) {
      onNext({ professionalId: selectedProfessional, coverageId: selectedCoverage });
    }
  }, [selectedProfessional, selectedCoverage]);

  const filteredProfessionals = (professionals as Professional[]).filter(p => 
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.licenseNumber && p.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    p.specialties.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">2. Selecciona un profesional</h2>
          <p className="text-xs text-slate-400 font-medium">Asigná el especialista a cargo de la consulta.</p>
        </div>
        <SearchablePicker
          items={filteredProfessionals}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedId={selectedProfessional}
          onSelect={(prof) => setSelectedProfessional(prof.id)}
          searchPlaceholder="Buscar por nombre o matrícula..."
          isLoading={isLoading}
          isError={isError}
          loadingMessage="Cargando profesionales..."
          errorMessage="Error al cargar profesionales."
          emptyMessage="No se encontraron profesionales."
          emptyIcon={<Stethoscope size={24} />}
          maxHeight="220px"
          renderItem={(prof, isSelected) => (
            <>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                <Stethoscope size={14} />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-semibold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>Dr/a. {prof.firstName} {prof.lastName}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">Matrícula: {prof.licenseNumber || 'S/N'}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate">{prof.specialties.map(s => s.name).join(', ')}</p>
              </div>
            </>
          )}
        />
      </div>

      <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-slate-400" />
          <label className="block text-xs font-bold text-slate-700">Cobertura / Obra Social del paciente</label>
        </div>
        <select 
          value={selectedCoverage ?? ''}
          onChange={(e) => setSelectedCoverage(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full sm:w-52 px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
        >
          <option value="">Seleccionar cobertura...</option>
          {coverages.map(cov => (
            <option key={cov.id} value={cov.id}>{cov.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};