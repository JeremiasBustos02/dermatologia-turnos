import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PatientsTable } from '../components/PatientsTable';
import { PatientModal } from '../components/PatientModal';
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient } from '../hooks/usePatients';
import type { Patient, CreatePatientDTO } from '../../../types/index';

export const PatientsPage = () => {
  const { data: patients = [], isLoading, isError } = usePatients();
  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setPatientToEdit(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: CreatePatientDTO) => {
    if (patientToEdit) {
      updateMutation.mutate(
        { id: patientToEdit.id, data },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      const completeData = {
        ...data,
        role: 'PATIENT' as const
      };

      createMutation.mutate(completeData, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
          <p className="text-slate-500 text-sm">Gestiona la base de datos de pacientes de la clínica.</p>
        </div>
        
        <button 
          onClick={handleCreateClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <Plus size={20} />
          Nuevo Paciente
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Ocurrió un error al cargar los pacientes.
        </div>
      ) : (
        <PatientsTable 
          patients={patients} 
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      <PatientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        patientToEdit={patientToEdit}
      />
    </div>
  );
};