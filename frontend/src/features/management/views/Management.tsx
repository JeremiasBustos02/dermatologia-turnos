import { useState } from 'react';
import { Award, ShieldCheck, Clock, Users, Trash2, Settings, AlertTriangle } from 'lucide-react';

import { useSpecialties, useCreateSpecialty, useDeleteSpecialty } from '../hooks/useEspecialties';
import { SpecialtyModal } from '../components/SpecialtyModal';

import { useCoverages, useCreateCoverage, useDeleteCoverage } from '../hooks/useCoverages';
import { CoverageModal } from '../components/CoverageModal';

import { StaffModal } from '../components/StaffModal';

type TabType = 'specialties' | 'coverages' | 'slots' | 'staff';

export const Management = () => {
  const [activeTab, setActiveTab] = useState<TabType>('specialties');
  
  // Estados para la pestaña de Staff (Recepción)
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  
  // Mocks temporales de secretarias para ver la UI funcionando al instante
  const [staffList, setStaffList] = useState([
    { id: 101, dni: '38.442.119', firstName: 'Marta', lastName: 'Gómez', email: 'marta.gomez@lumera.com' },
    { id: 102, dni: '40.118.322', firstName: 'Ramiro', lastName: 'Sánchez', email: 'ramiro.s@lumera.com' }
  ]);
  const isLoadingStaff = false;

  const handleStaffSubmit = (newSecretary: any) => {
    setStaffList((prev) => [...prev, { id: Date.now(), ...newSecretary }]);
    setIsStaffModalOpen(false);
  };

  // 🌟 CORREGIDO: Se agregó 'staff' al tipado explícito del estado para liquidar el error 2322
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null; type: 'spec' | 'cov' | 'staff' | null }>({
    open: false,
    id: null,
    type: null,
  });

  // Especialidades
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const { data: specialties = [], isLoading: isLoadingSpecs } = useSpecialties();
  const createSpecialtyMutation = useCreateSpecialty();
  const deleteSpecialtyMutation = useDeleteSpecialty();

  const handleSpecSubmit = (data: { name: string; description: string }) => {
    createSpecialtyMutation.mutate(data, { onSuccess: () => setIsSpecModalOpen(false) });
  };

  // Coberturas
  const [isCovModalOpen, setIsCovModalOpen] = useState(false);
  const { data: coverages = [], isLoading: isLoadingCovs } = useCoverages();
  const createCoverageMutation = useCreateCoverage();
  const deleteCoverageMutation = useDeleteCoverage();

  const handleCovSubmit = (data: { name: string; description: string }) => {
    createCoverageMutation.mutate(data, { onSuccess: () => setIsCovModalOpen(false) });
  };

  // Orquestador de Confirmación de Baja
  const executeDelete = () => {
    if (!deleteModal.id || !deleteModal.type) return;

    if (deleteModal.type === 'spec') {
      deleteSpecialtyMutation.mutate(deleteModal.id, {
        onSuccess: () => setDeleteModal({ open: false, id: null, type: null }),
      });
    } else if (deleteModal.type === 'cov') {
      deleteCoverageMutation.mutate(deleteModal.id, {
        onSuccess: () => setDeleteModal({ open: false, id: null, type: null }),
      });
    } else if (deleteModal.type === 'staff') {
      // 🌟 AGREGADO: Lógica reactiva para borrar el staff del mock local
      setStaffList((prev) => prev.filter((member) => member.id !== deleteModal.id));
      setDeleteModal({ open: false, id: null, type: null });
    }
  };

  const specialtiesList = Array.isArray(specialties) ? specialties : [];
  const coveragesList = Array.isArray(coverages) ? coverages : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      
      {/* MODAL DE CONFIRMACIÓN CONTROLADO (Elimina window.confirm) */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white p-5 rounded-xl shadow-xl max-w-sm w-full mx-4 border border-slate-200 animate-in zoom-in-95 duration-155">
            <div className="flex items-center gap-3 text-rose-600 mb-2">
              <div className="p-2 bg-rose-50 rounded-lg"><AlertTriangle size={18} /></div>
              <h3 className="text-xs font-bold text-slate-900">¿Confirmas la eliminación permanente?</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
              Esta operación es irreversible. Los elementos y flujos vinculados perderán de forma inmediata el acceso a este parámetro global.
            </p>
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, id: null, type: null })}
                className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs"
              >
                Eliminar Registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Corporativo */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-3xs">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Configuración Global</h1>
          <p className="text-slate-500 text-xs font-medium">Mantenimiento de tablas maestras, nomencladores y flujos del SaaS.</p>
        </div>
      </div>

      {/* Tabs Estilo SaaS */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'specialties', label: 'Especialidades', icon: Award },
          { id: 'coverages', label: 'Obras Sociales', icon: ShieldCheck },
          { id: 'slots', label: 'Parámetros de Agenda', icon: Clock },
          { id: 'staff', label: 'Personal de Recepción', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-semibold tracking-tight transition-all whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenedor de Contenido Compacto */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        
        {/* PANEL: ESPECIALIDADES */}
        {activeTab === 'specialties' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Especialidades Médicas</h3>
                <p className="text-slate-400 text-[11px] font-medium">Ramas de la medicina activas para la asignación de profesionales.</p>
              </div>
              <button 
                onClick={() => setIsSpecModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-3xs"
              >
                + Nueva Especialidad
              </button>
            </div>

            {isLoadingSpecs ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div></div>
            ) : (
              <div className="border border-slate-150 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Descripción</th>
                      <th className="p-3 text-center w-20">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                    {specialtiesList.map((spec) => (
                      <tr key={spec.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-3 font-semibold text-slate-800 text-xs">{spec.name}</td>
                        <td className="p-3 text-slate-400 text-[11px] font-normal">{spec.description || 'Sin descripción asignada'}</td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => setDeleteModal({ open: true, id: spec.id, type: 'spec' })} 
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {specialtiesList.length === 0 && (
                      <tr><td colSpan={3} className="p-8 text-center text-slate-400 text-[11px] font-normal">No hay especialidades dadas de alta.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <SpecialtyModal isOpen={isSpecModalOpen} onClose={() => setIsSpecModalOpen(false)} onSubmit={handleSpecSubmit} />
          </div>
        )}

        {/* PANEL: COBERTURAS */}
        {activeTab === 'coverages' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Obras Sociales y Prepagas</h3>
                <p className="text-slate-400 text-[11px] font-medium">Nomenclador de coberturas autorizadas para la validación de turnos.</p>
              </div>
              <button 
                onClick={() => setIsCovModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-3xs"
              >
                + Nueva Cobertura
              </button>
            </div>

            {isLoadingCovs ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div></div>
            ) : (
              <div className="border border-slate-150 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Obra Social / Prepaga</th>
                      <th className="p-3">Observaciones Operativas</th>
                      <th className="p-3 text-center w-20">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                    {coveragesList.map((cov) => (
                      <tr key={cov.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-3 font-semibold text-slate-800 text-xs">{cov.name}</td>
                        <td className="p-3 text-slate-400 text-[11px] font-normal">{cov.description || 'Sin especificaciones reglamentarias'}</td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => setDeleteModal({ open: true, id: cov.id, type: 'cov' })} 
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {coveragesList.length === 0 && (
                      <tr><td colSpan={3} className="p-8 text-center text-slate-400 text-[11px] font-normal">No hay coberturas dadas de alta.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <CoverageModal isOpen={isCovModalOpen} onClose={() => setIsCovModalOpen(false)} onSubmit={handleCovSubmit} />
          </div>
        )}

        {/* PARÁMETROS DE AGENDA GLOBAL (SLOTS) */}
        {activeTab === 'slots' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Parámetros y Reglas de la Agenda</h3>
              <p className="text-slate-400 text-[11px] font-medium">Configurá las restricciones operativas globales para la reserva de turnos en la clínica.</p>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden text-xs">
              <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/30 transition-colors">
                <div className="space-y-0.5 max-w-[80%]">
                  <p className="font-semibold text-slate-800">Habilitar Sobrturnos Administrativos</p>
                  <p className="text-slate-400 text-[11px] font-normal">Permite al personal de recepción forzar la asignación de un turno en un bloque horario que ya se encuentra reservado.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-8 h-4 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/30 transition-colors">
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-800">Límite de Antelación para Reservas</p>
                  <p className="text-slate-400 text-[11px] font-normal">Establece el rango máximo de días a futuro en los que un paciente puede solicitar una cita médica.</p>
                </div>
                <select className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 font-semibold cursor-pointer outline-hidden focus:border-blue-500">
                  <option value="30">30 días (1 mes)</option>
                  <option value="60" selected>60 días (2 meses)</option>
                  <option value="90">90 días (3 meses)</option>
                  <option value="180">180 días (6 meses)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/30 transition-colors">
                <div className="space-y-0.5 max-w-[80%]">
                  <p className="font-semibold text-slate-800">Bloqueo de Cancelación de Último Momento</p>
                  <p className="text-slate-400 text-[11px] font-normal">Impide que los usuarios cancelen sus turnos de forma autónoma si faltan menos de 24 horas para la consulta.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-8 h-4 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => alert('Parámetros de agenda guardados de manera local en el entorno.')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-3xs"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        )}

        {/* PANEL: PERSONAL DE RECEPCIÓN (STAFF) */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Personal de Recepción y Secretarías</h3>
                <p className="text-slate-400 text-[11px] font-medium">Gestioná las cuentas de acceso para los usuarios encargados de la admisión y turnos.</p>
              </div>
              <button 
                onClick={() => setIsStaffModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-3xs"
              >
                + Nueva/o Secretaria/o
              </button>
            </div>

            {isLoadingStaff ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div></div>
            ) : (
              <div className="border border-slate-150 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">DNI</th>
                      <th className="p-3">Nombre y Apellido</th>
                      <th className="p-3">Correo Electrónico</th>
                      <th className="p-3 text-center w-20">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                    {staffList.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-3 font-mono text-slate-400 text-[11px]">{member.dni}</td>
                        <td className="p-3 font-semibold text-slate-800 text-xs">{member.firstName} {member.lastName}</td>
                        <td className="p-3 text-slate-400 text-[11px] font-normal">{member.email}</td>
                        <td className="p-3 text-center">
                          {/* 🌟 Ejecuta el modal de borrado unificado pasando el type 'staff' */}
                          <button 
                            onClick={() => setDeleteModal({ open: true, id: member.id, type: 'staff' })} 
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {staffList.length === 0 && (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-400 text-[11px] font-normal">No hay personal de recepción registrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <StaffModal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} onSubmit={handleStaffSubmit} />
          </div>
        )}
      </div>
    </div>
  );
};