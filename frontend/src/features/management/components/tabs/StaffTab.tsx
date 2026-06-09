import { Trash2 } from 'lucide-react';
import { StaffModal } from '../StaffModal';

interface StaffTabProps {
  staffList: Array<{ id: number; dni: string; firstName: string; lastName: string; email: string }>;
  isLoadingStaff: boolean;
  onDeleteRequest: (id: number, type: 'staff') => void;
  onStaffSubmit: (data: any) => void;
  onStaffModalOpenChange: (open: boolean) => void;
  isStaffModalOpen: boolean;
}

export const StaffTab = ({ staffList, isLoadingStaff, onDeleteRequest, onStaffSubmit, onStaffModalOpenChange, isStaffModalOpen }: StaffTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Personal de Recepción y Secretarías</h3>
          <p className="text-slate-400 text-[11px] font-medium">Gestioná las cuentas de acceso para los usuarios encargados de la admisión y turnos.</p>
        </div>
        <button
          onClick={() => onStaffModalOpenChange(true)}
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
                    <button
                      onClick={() => onDeleteRequest(member.id, 'staff')}
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
      <StaffModal isOpen={isStaffModalOpen} onClose={() => onStaffModalOpenChange(false)} onSubmit={onStaffSubmit} />
    </div>
  );
};
