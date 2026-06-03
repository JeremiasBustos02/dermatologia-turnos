import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ProfessionalsTable } from '../components/ProfessionalsTable';
import { ProfessionalModal } from '../components/ProfessionalModal';
import { useProfessionals, useDeleteProfessional, useCreateProfessional } from '../hooks/useProfessionals';
import type { Professional, CreateProfessionalDTO } from '../../../types/index';

export const ProfessionalsPage = () => {
  const { data: professionals = [], isLoading, isError } = useProfessionals();
  const deleteMutation = useDeleteProfessional();
  const createMutation = useCreateProfessional(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [professionalToEdit, setProfessionalToEdit] = useState<Professional | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este profesional?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (professional: Professional) => {
    setProfessionalToEdit(professional);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setProfessionalToEdit(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: CreateProfessionalDTO) => {
    if (professionalToEdit) {
      console.log('Actualizando profesional...', professionalToEdit.id, data);
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false); 
        }
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profesionales</h1>
          <p className="text-slate-500 text-sm">Gestiona el staff médico y sus matrículas.</p>
        </div>
        
        <button 
          onClick={handleCreateClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Nuevo Profesional
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Ocurrió un error al cargar los profesionales.
        </div>
      ) : (
        <ProfessionalsTable 
          professionals={professionals} 
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      <ProfessionalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        professionalToEdit={professionalToEdit}
      />
    </div>
  );
};