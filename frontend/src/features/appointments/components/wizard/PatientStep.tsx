import { useState } from 'react';
import { User, UserPlus } from 'lucide-react';
import { usePatients } from '../../../patients/hooks/usePatients';
import { SearchablePicker } from '../../../../components/shared/SearchablePicker';
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">1. Selecciona un paciente</h2>
          <p className="text-xs text-slate-400 font-medium">Buscá al paciente en la base de datos de la clínica.</p>
        </div>
        <SearchablePicker
          items={filteredPatients}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedId={defaultSelected}
          onSelect={(patient) => onNext(patient.id)}
          searchPlaceholder="Buscar por DNI o apellido..."
          isLoading={isLoading}
          isError={isError}
          loadingMessage="Cargando pacientes..."
          errorMessage="Error al cargar el padrón."
          emptyMessage="No se encontraron pacientes."
          emptyIcon={<UserPlus size={28} />}
          renderItem={(patient, isSelected) => (
            <>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                <User size={14} />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-semibold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>{patient.firstName} {patient.lastName}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">DNI: {patient.dni} • {patient.email || 'Sin correo registrado'}</p>
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
};