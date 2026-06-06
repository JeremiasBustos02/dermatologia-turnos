import { useState } from 'react';
import { Search, UserPlus, User } from 'lucide-react';
import { usePatients } from '../../../patients/hooks/usePatients';
import type { Patient } from '../../../../types/index';

interface PatientStepProps {
  onNext: (patientId: number) => void;
  defaultSelected?: number;
}

export const PatientStep = ({ onNext, defaultSelected }: PatientStepProps) => {
  const { data: patients = [], isLoading, isError } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = (patients as Patient[]).filter(p => 
    p.dni.includes(searchTerm) || 
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPatient = (id: number) => {
    onNext(id); // 🌟 Actualiza el estado de NewAppointmentPage al instante
  };

  if (isLoading) return <div className="p-8 text-center text-xs text-slate-400">Cargando pacientes...</div>;
  if (isError) return <div className="p-8 text-center text-xs text-rose-500">Error al cargar el padrón.</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">1. Selecciona un paciente</h2>
          <p className="text-xs text-slate-400 font-medium">Buscá al paciente en la base de datos de la clínica.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Buscar por DNI o apellido..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl max-h-[280px] overflow-y-auto bg-white shadow-3xs">
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
            <UserPlus size={28} className="mb-2 text-slate-300" />
            <p className="text-xs font-medium">No se encontraron pacientes.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPatients.map(patient => {
              const isSelected = defaultSelected === patient.id;
              return (
                <div 
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient.id)}
                  className={`flex items-center justify-between p-3 cursor-pointer transition-all ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/60'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                      <User size={14} />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>{patient.firstName} {patient.lastName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">DNI: {patient.dni} • {patient.email || 'Sin correo registrado'}</p>
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
    </div>
  );
};