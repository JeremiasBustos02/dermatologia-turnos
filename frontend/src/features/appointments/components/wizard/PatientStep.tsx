import { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { usePatients } from '../../../patients/hooks/usePatients';

interface PatientStepProps {
  onNext: (patientId: number) => void;
  defaultSelected?: number;
}

export const PatientStep = ({ onNext, defaultSelected }: PatientStepProps) => {
  const { data: patients = [], isLoading, isError } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<number | undefined>(defaultSelected);

  const filteredPatients = patients.filter(p => 
    p.dni.includes(searchTerm) || 
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-8 text-center text-slate-500">Cargando pacientes...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error al cargar pacientes.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800">1. Selecciona un paciente</h2>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por DNI o apellido..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl max-h-[300px] overflow-y-auto">
        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center">
            <UserPlus size={32} className="mb-2 text-slate-300" />
            <p>No se encontraron pacientes.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredPatients.map(patient => (
              <li key={patient.id}>
                <label className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="patient" 
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      checked={selectedId === patient.id}
                      onChange={() => setSelectedId(patient.id)}
                    />
                    <div>
                      <p className="font-semibold text-slate-800">{patient.firstName} {patient.lastName}</p>
                      <p className="text-sm text-slate-500">DNI: {patient.dni} • {patient.email}</p>
                    </div>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={() => selectedId && onNext(selectedId)}
          disabled={!selectedId}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};