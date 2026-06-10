import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ProfessionalsTable } from '../components/ProfessionalsTable';
import { ProfessionalModal } from '../components/ProfessionalModal';
import { useProfessionals, useDeleteProfessional, useCreateProfessional, useUpdateProfessional } from '../hooks/useProfessionals';
import type { Professional, CreateProfessionalDTO } from '../../../types/index';
import type { CreateProfessionalResult } from '../services/professionals.api';

export const ProfessionalsPage = () => {
  const { data: professionals = [], isLoading, isError } = useProfessionals();
  const deleteMutation = useDeleteProfessional();
  const createMutation = useCreateProfessional(); 
  const updateMutation = useUpdateProfessional();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [professionalToEdit, setProfessionalToEdit] = useState<Professional | null>(null);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este profesional?')) {
      deleteMutation.mutate({ id });
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
    const sanitizedData = {
      dni: data.dni,
      firstName: data.firstName,
      lastName: data.lastName,
      licenseNumber: data.licenseNumber || undefined,
      specialtyIds: Array.isArray(data.specialtyIds) ? data.specialtyIds.map(Number) : [],
      coverageIds: Array.isArray(data.coverageIds) ? data.coverageIds.map(Number) : [],
    };

    if (professionalToEdit) {
      updateMutation.mutate(
        { id: professionalToEdit.id, data: sanitizedData as any },
        { 
          onSuccess: () => {
            setIsModalOpen(false);
            setProfessionalToEdit(null);
          } 
        }
      );
    } else {
      createMutation.mutate(sanitizedData as any, {
        onSuccess: (result: CreateProfessionalResult) => {
          const link = `${window.location.origin}/auth/setup-password?token=${result.invitationToken}`;
          setInvitationLink(link);
        }
      });
    }
  };

  const handleCloseInvitation = () => {
    setInvitationLink(null);
    setIsModalOpen(false);
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
        isOpen={isModalOpen && !invitationLink}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        professionalToEdit={professionalToEdit}
      />

      {invitationLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-800">Profesional Registrado</h2>
            <p className="text-xs text-slate-600">
              El profesional ha sido creado. Comparta este enlace para que establezca su contraseña:
            </p>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <input
                readOnly
                value={invitationLink}
                className="flex-1 text-xs text-slate-700 bg-transparent outline-hidden break-all"
              />
              <button
                onClick={() => navigator.clipboard.writeText(invitationLink)}
                className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Copiar
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseInvitation}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};