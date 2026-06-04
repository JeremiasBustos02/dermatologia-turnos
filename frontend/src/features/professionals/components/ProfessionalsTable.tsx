import { CalendarDays, Edit, Trash2 } from 'lucide-react';
import type { Professional } from '../../../types/index';
import { useNavigate } from 'react-router-dom';

interface ProfessionalsTableProps {
    professionals: Professional[];
    onDelete: (id: number) => void;
    onEdit: (professional: Professional) => void;
}

export const ProfessionalsTable = ({ professionals, onDelete, onEdit }: ProfessionalsTableProps) => {
    const navigate = useNavigate();
    if (professionals.length === 0) {
        return (
            <div className="p-8 text-center bg-white rounded-lg border border-slate-200">
                <p className="text-slate-500">No hay profesionales registrados aún.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
                    <tr>
                        <th className="px-6 py-4 font-medium">Nombre Completo</th>
                        <th className="px-6 py-4 font-medium">Matrícula</th>
                        <th className="px-6 py-4 font-medium text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {professionals.map((prof) => (
                        <tr key={prof.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">
                                {prof.firstName} {prof.lastName}
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                    {prof.licenseNumber}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => navigate(`/professionals/${prof.id}/schedules`)}
                                        className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                                        title="Gestionar Agenda"
                                    >
                                        <CalendarDays size={18} />
                                    </button>

                                    <button
                                        onClick={() => onEdit(prof)}
                                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                                        title="Editar"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(prof.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                        title="Eliminar"
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