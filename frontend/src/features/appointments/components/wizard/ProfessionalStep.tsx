import { useState, useEffect } from 'react';
import { Search, Stethoscope, Shield } from 'lucide-react';
import { useProfessionals } from '../../../professionals/hooks/useProfessionals';
import type { Professional } from '../../../../types/index';

interface ProfessionalStepProps {
  onNext: (data: { professionalId: number; coverageId: number }) => void;
  defaultProfessionalId?: number;
  defaultCoverageId?: number;
}

const MOCK_COVERAGES = [
  { id: 1, name: 'Particular / Sin Cobertura' },
  { id: 2, name: 'Swiss Medical' },
  { id: 3, name: 'OSDE' }
];

export const ProfessionalStep = ({ onNext, defaultProfessionalId, defaultCoverageId }: ProfessionalStepProps) => {
  const { data: professionals = [], isLoading, isError } = useProfessionals();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedProfessional, setSelectedProfessional] = useState<number | undefined>(defaultProfessionalId);
  const [selectedCoverage, setSelectedCoverage] = useState<number | undefined>(defaultCoverageId ?? 1);

  // 🌟 Cada vez que cambie el médico o la cobertura, notificamos al padre de inmediato
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

  if (isLoading) return <div className="p-8 text-center text-xs text-slate-400">Cargando profesionales...</div>;
  if (isError) return <div className="p-8 text-center text-xs text-rose-500">Error al cargar profesionales.</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">2. Selecciona un profesional</h2>
          <p className="text-xs text-slate-400 font-medium">Asigná el especialista a cargo de la consulta.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o matrícula..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto bg-white shadow-3xs">
        {filteredProfessionals.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
            <Stethoscope size={24} className="mb-2 text-slate-300" />
            <p className="text-xs font-medium">No se encontraron profesionales.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredProfessionals.map(prof => {
              const isSelected = selectedProfessional === prof.id;
              return (
                <div 
                  key={prof.id}
                  onClick={() => setSelectedProfessional(prof.id)}
                  className={`flex items-center justify-between p-3 cursor-pointer transition-all ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/60'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Stethoscope size={14} />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>Dr/a. {prof.firstName} {prof.lastName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Matrícula: {prof.licenseNumber || 'S/N'}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{prof.specialties.map(s => s.name).join(', ')}</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                    {isSelected && <span className="text-[9px] font-bold">✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-slate-400" />
          <label className="block text-xs font-bold text-slate-700">Cobertura / Obra Social del paciente</label>
        </div>
        <select 
          value={selectedCoverage}
          onChange={(e) => setSelectedCoverage(Number(e.target.value))}
          className="w-full sm:w-52 px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
        >
          {MOCK_COVERAGES.map(cov => (
            <option key={cov.id} value={cov.id}>{cov.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};