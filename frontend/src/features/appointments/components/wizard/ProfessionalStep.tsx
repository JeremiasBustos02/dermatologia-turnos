import { useState, useEffect } from 'react';
import { Stethoscope, Shield, CheckCircle2 } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-800">2. Detalles de la Consulta</h2>
        <p className="text-sm text-slate-400 font-medium">Asigná el especialista a cargo y selecciona la cobertura médica del paciente.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* COLUMNA IZQUIERDA: Búsqueda del Profesional */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Stethoscope size={14} /> Seleccionar Profesional
          </label>
          <SearchablePicker
            items={filteredProfessionals}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedId={selectedProfessional}
            onSelect={(prof) => setSelectedProfessional(prof.id)}
            searchPlaceholder="Buscar por nombre, especialidad o matrícula..."
            isLoading={isLoading}
            isError={isError}
            loadingMessage="Cargando profesionales..."
            errorMessage="Error al cargar profesionales."
            emptyMessage="No se encontraron profesionales."
            emptyIcon={<Stethoscope size={24} />}
            maxHeight="250px"
            renderItem={(prof, isSelected) => (
              <>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Stethoscope size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>Dr/a. {prof.firstName} {prof.lastName}</p>
                  <p className="text-[11px] text-blue-600/80 font-bold tracking-wide mt-0.5 truncate uppercase">{prof.specialties.map(s => s.name).join(', ')}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">Matrícula: {prof.licenseNumber || 'S/N'}</p>
                </div>
              </>
            )}
          />
        </div>

        {/* COLUMNA DERECHA: Selección de Cobertura */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Shield size={14} /> Cobertura / Obra Social
          </label>
          
          <div className={`bg-slate-50 border rounded-xl p-5 transition-colors duration-300 ${selectedProfessional ? 'border-blue-200 shadow-xs' : 'border-slate-200 opacity-60 pointer-events-none'}`}>
            {!selectedProfessional ? (
              <div className="text-center py-6">
                <p className="text-sm font-medium text-slate-400">Selecciona primero un profesional para ver las coberturas que acepta.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">Selecciona la obra social con la que se atenderá el paciente en este turno:</p>
                <select 
                  value={selectedCoverage ?? ''}
                  onChange={(e) => setSelectedCoverage(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-hidden bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="" disabled>Elegir cobertura médica...</option>
                  {coverages.map(cov => (
                    <option key={cov.id} value={cov.id}>{cov.name}</option>
                  ))}
                </select>

                {selectedCoverage && (
                   <div className="flex items-center gap-2 mt-4 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                     <CheckCircle2 size={16} />
                     <span className="text-xs font-semibold">Cobertura asignada correctamente.</span>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};