import { useState } from 'react';
import { Search, Stethoscope } from 'lucide-react';
import { useProfessionals } from '../../../professionals/hooks/useProfessionals';

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
  const [selectedCoverage, setSelectedCoverage] = useState<number | undefined>(defaultCoverageId ?? 1); // Por defecto OSDE (ID 1)

  const filteredProfessionals = professionals.filter(p => 
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.licenseNumber!.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.specialties.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) return <div className="p-8 text-center text-slate-500">Cargando profesionales...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error al cargar profesionales.</div>;

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800">2. Selecciona un profesional</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o matrícula..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl max-h-[250px] overflow-y-auto mb-6">
        {filteredProfessionals.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center">
            <Stethoscope size={32} className="mb-2 text-slate-300" />
            <p>No se encontraron profesionales.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredProfessionals.map(prof => (
              <li key={prof.id}>
                <label className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="professional" 
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      checked={selectedProfessional === prof.id}
                      onChange={() => setSelectedProfessional(prof.id)}
                    />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {prof.firstName} {prof.lastName}
                      </p>
                      <p className="text-sm text-slate-500">Matrícula: {prof.licenseNumber}</p>
                      <p className="text-sm text-slate-500">{prof.specialties.map(s => s.name).join(', ')}</p>
                    </div>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <label className="block text-sm font-bold text-slate-800 mb-2">
          Cobertura / Obra Social del paciente
        </label>
        <select 
          value={selectedCoverage}
          onChange={(e) => setSelectedCoverage(Number(e.target.value))}
          className="w-full sm:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          {MOCK_COVERAGES.map(cov => (
            <option key={cov.id} value={cov.id}>{cov.name}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={() => {
            if (selectedProfessional && selectedCoverage) {
              onNext({ professionalId: selectedProfessional, coverageId: selectedCoverage });
            }
          }}
          disabled={!selectedProfessional}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};