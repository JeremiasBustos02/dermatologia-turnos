import { Edit, Trash2 } from 'lucide-react';
import type { Patient } from '../../../types/index';

interface PatientsTableProps {
  patients: Patient[];
  onDelete: (id: number) => void;
  onEdit: (patient: Patient) => void;
}

export const PatientsTable = ({ patients, onDelete, onEdit }: PatientsTableProps) => {
  if (patients.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-slate-200">
        <p className="text-slate-500">No hay pacientes registrados aún.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
          <tr>
            <th className="px-6 py-4 font-medium">DNI</th>
            <th className="px-6 py-4 font-medium">Nombre Completo</th>
            <th className="px-6 py-4 font-medium">Email</th>
            <th className="px-6 py-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">{patient.dni}</td>
              <td className="px-6 py-4">{patient.firstName} {patient.lastName}</td>
              <td className="px-6 py-4">{patient.email}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onEdit(patient)}
                    className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(patient.id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};