import { useState } from 'react';
import { Award, ShieldCheck, Clock, Users, Trash2 } from 'lucide-react';

import { useSpecialties, useCreateSpecialty, useDeleteSpecialty } from '../hooks/useEspecialties';
import { SpecialtyModal } from '../components/SpecialtyModal';

import { useCoverages, useCreateCoverage, useDeleteCoverage } from '../hooks/useCoverages';
import { CoverageModal } from '../components/CoverageModal';

type TabType = 'specialties' | 'coverages' | 'slots' | 'staff';

export const Management = () => {
  const [activeTab, setActiveTab] = useState<TabType>('specialties');
  
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const { data: specialties = [], isLoading: isLoadingSpecs } = useSpecialties();
  const createSpecialtyMutation = useCreateSpecialty();
  const deleteSpecialtyMutation = useDeleteSpecialty();

  const handleSpecSubmit = (data: { name: string; description: string }) => {
    createSpecialtyMutation.mutate(data, { onSuccess: () => setIsSpecModalOpen(false) });
  };

  const handleSpecDelete = (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar esta especialidad?')) {
      deleteSpecialtyMutation.mutate(id);
    }
  };

  const [isCovModalOpen, setIsCovModalOpen] = useState(false);
  const { data: coverages = [], isLoading: isLoadingCovs } = useCoverages();
  const createCoverageMutation = useCreateCoverage();
  const deleteCoverageMutation = useDeleteCoverage();

  const handleCovSubmit = (data: { name: string; description: string }) => {
    createCoverageMutation.mutate(data, { onSuccess: () => setIsCovModalOpen(false) });
  };

  const handleCovDelete = (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar esta cobertura?')) {
      deleteCoverageMutation.mutate(id);
    }
  };

  const specialtiesList = Array.isArray(specialties) ? specialties : [];
  const coveragesList = Array.isArray(coverages) ? coverages : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración del Sistema</h1>
        <p className="text-slate-500 text-sm">Gestiona los parámetros globales y tablas maestras de Lumera.</p>
      </div>

      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('specialties')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'specialties' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Award size={18} /> Especialidades
        </button>

        <button
          onClick={() => setActiveTab('coverages')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'coverages' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <ShieldCheck size={18} /> Coberturas / Obras Sociales
        </button>

        <button
          onClick={() => setActiveTab('slots')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'slots' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Clock size={18} /> Horarios y Turnos
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'staff' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Users size={18} /> Personal de Recepción
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        
        {activeTab === 'specialties' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-slate-900">Especialidades Médicas</h3>
                <p className="text-slate-500 text-xs">Define las ramas de atención para asociar a los profesionales.</p>
              </div>
              <button 
                onClick={() => setIsSpecModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors"
              >
                + Nueva Especialidad
              </button>
            </div>

            {isLoadingSpecs ? (
              <div className="flex justify-center p-6"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div></div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-medium">
                    <tr>
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Descripción</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600">
                    {specialtiesList.map((spec) => (
                      <tr key={spec.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-medium text-slate-900">{spec.name}</td>
                        <td className="p-3 text-slate-500 text-xs">{spec.description || 'Sin descripción'}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => handleSpecDelete(spec.id)} className="text-rose-600 hover:text-rose-800 p-1">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {specialtiesList.length === 0 && (
                      <tr><td colSpan={3} className="p-4 text-center text-slate-400 text-xs">No hay especialidades cargadas.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <SpecialtyModal isOpen={isSpecModalOpen} onClose={() => setIsSpecModalOpen(false)} onSubmit={handleSpecSubmit} />
          </div>
        )}

        {activeTab === 'coverages' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-slate-900">Coberturas Médicas y Obras Sociales</h3>
                <p className="text-slate-500 text-xs">Administra las mutuales y prepagas aceptadas en la clínica.</p>
              </div>
              <button 
                onClick={() => setIsCovModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors"
              >
                + Nueva Cobertura
              </button>
            </div>

            {isLoadingCovs ? (
              <div className="flex justify-center p-6"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div></div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-medium">
                    <tr>
                      <th className="p-3">Obra Social / Prepaga</th>
                      <th className="p-3">Observaciones</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600">
                    {coveragesList.map((cov) => (
                      <tr key={cov.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-medium text-slate-900">{cov.name}</td>
                        <td className="p-3 text-slate-500 text-xs">{cov.description || 'Sin especificaciones'}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => handleCovDelete(cov.id)} className="text-rose-600 hover:text-rose-800 p-1">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {coveragesList.length === 0 && (
                      <tr><td colSpan={3} className="p-4 text-center text-slate-400 text-xs">No hay coberturas cargadas.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <CoverageModal isOpen={isCovModalOpen} onClose={() => setIsCovModalOpen(false)} onSubmit={handleCovSubmit} />
          </div>
        )}

        {/* Parámetros de Agenda */}
        {activeTab === 'slots' && (
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Parámetros de Agenda</h3>
            <p className="text-slate-500 text-sm">Próximamente: Configuración de intervalos de tiempo por turno.</p>
          </div>
        )}

        {activeTab === 'staff' && (
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Usuarios Administrativos</h3>
            <p className="text-slate-500 text-sm">Próximamente: Tabla de secretarias y administradores.</p>
          </div>
        )}
      </div>
    </div>
  );
};