import { useState } from 'react';
import { Award, ShieldCheck, Clock, Users, Settings } from 'lucide-react';
import { useDeleteSpecialty } from '../hooks/useEspecialties';
import { useDeleteCoverage } from '../hooks/useCoverages';
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog';
import { SpecialtiesTab } from '../components/tabs/SpecialtiesTab';
import { CoveragesTab } from '../components/tabs/CoveragesTab';
import { SlotsTab } from '../components/tabs/SlotsTab';
import { StaffTab } from '../components/tabs/StaffTab';
import { useAuthStore } from '../../auth/auth.store';

type TabType = 'specialties' | 'coverages' | 'slots' | 'staff';

export const Management = () => {
  const clinicId = useAuthStore((state) => state.user?.clinicId);
  const [activeTab, setActiveTab] = useState<TabType>('specialties');

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const [staffList, setStaffList] = useState([
    { id: 101, dni: '38.442.119', firstName: 'Marta', lastName: 'Gómez', email: 'marta.gomez@lumera.com' },
    { id: 102, dni: '40.118.322', firstName: 'Ramiro', lastName: 'Sánchez', email: 'ramiro.s@lumera.com' }
  ]);

  const handleStaffSubmit = (newSecretary: any) => {
    setStaffList((prev) => [...prev, { id: Date.now(), ...newSecretary }]);
    setIsStaffModalOpen(false);
  };

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null; type: 'spec' | 'cov' | 'staff' | null }>({
    open: false,
    id: null,
    type: null,
  });

  const deleteSpecialtyMutation = useDeleteSpecialty();
  const deleteCoverageMutation = useDeleteCoverage();

  const executeDelete = () => {
    if (!deleteModal.id || !deleteModal.type) return;

    if (deleteModal.type === 'spec') {
      deleteSpecialtyMutation.mutate({ id: deleteModal.id, clinicId }, {
        onSuccess: () => setDeleteModal({ open: false, id: null, type: null }),
      });
    } else if (deleteModal.type === 'cov') {
      deleteCoverageMutation.mutate({ id: deleteModal.id, clinicId }, {
        onSuccess: () => setDeleteModal({ open: false, id: null, type: null }),
      });
    } else if (deleteModal.type === 'staff') {
      setStaffList((prev) => prev.filter((member) => member.id !== deleteModal.id));
      setDeleteModal({ open: false, id: null, type: null });
    }
  };

  const onDeleteRequest = (id: number, type: 'spec' | 'cov' | 'staff') => {
    setDeleteModal({ open: true, id, type });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">

      <ConfirmDialog
        isOpen={deleteModal.open}
        title="¿Confirmas la eliminación permanente?"
        description="Esta operación es irreversible. Los elementos y flujos vinculados perderán de forma inmediata el acceso a este parámetro global."
        confirmLabel="Eliminar Registro"
        cancelLabel="Cancelar"
        onConfirm={executeDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, type: null })}
      />

      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-3xs">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Configuración Global</h1>
          <p className="text-slate-500 text-xs font-medium">Mantenimiento de tablas maestras, nomencladores y flujos del SaaS.</p>
        </div>
      </div>

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

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        {activeTab === 'specialties' && <SpecialtiesTab clinicId={clinicId} onDeleteRequest={onDeleteRequest} />}
        {activeTab === 'coverages' && <CoveragesTab clinicId={clinicId} onDeleteRequest={onDeleteRequest} />}
        {activeTab === 'slots' && <SlotsTab />}
        {activeTab === 'staff' && (
          <StaffTab
            staffList={staffList}
            isLoadingStaff={false}
            isStaffModalOpen={isStaffModalOpen}
            onDeleteRequest={onDeleteRequest}
            onStaffSubmit={handleStaffSubmit}
            onStaffModalOpenChange={setIsStaffModalOpen}
          />
        )}
      </div>
    </div>
  );
};