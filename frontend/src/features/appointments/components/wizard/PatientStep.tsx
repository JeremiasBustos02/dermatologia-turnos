import { useState } from 'react';
import { User, UserPlus } from 'lucide-react';
import { usePatients } from '../../../patients/hooks/usePatients';
import { SearchablePicker } from '../../../../components/shared/SearchablePicker';
import type { Patient } from '../../../../types/index';
import { useAuthStore } from '../../../auth/auth.store';

interface PatientStepProps {
  onNext: (patientId: number) => void;
  defaultSelected?: number;
}

export const PatientStep = ({ onNext, defaultSelected }: PatientStepProps) => {
  const clinicId = useAuthStore((state) => state.user?.clinicId);
  const { data: patients = [], isLoading, isError } = usePatients(clinicId);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = (patients as Patient[]).filter(p => 
    p.dni.includes(searchTerm) || 
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-800">1. Selecciona un paciente</h2>
        <p className="text-sm text-slate-400 font-medium">Buscá al paciente en la base de datos de la clínica para iniciar la reserva.</p>
      </div>

      <div className="w-auto mt-4">
        <SearchablePicker
          items={filteredPatients}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedId={defaultSelected}
          onSelect={(patient) => onNext(patient.id)}
          searchPlaceholder="Buscar paciente por DNI o apellido..."
          isLoading={isLoading}
          isError={isError}
          loadingMessage="Cargando padrón de pacientes..."
          errorMessage="Error al cargar el padrón."
          emptyMessage="No se encontraron pacientes con ese criterio."
          emptyIcon={<UserPlus size={28} />}
          maxHeight="300px"
          renderItem={(patient, isSelected) => (
            <>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                <User size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>{patient.firstName} {patient.lastName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">DNI: {patient.dni}</span>
                  <span className="text-[11px] text-slate-400 truncate">{patient.email || 'Sin correo registrado'}</span>
                </div>
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
};