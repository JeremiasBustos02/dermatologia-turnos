import { X, Activity, Calendar as CalendarIcon, Stethoscope, Pill, FileText, User } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useMedicalRecordsByPatient } from '../hooks/useMedicalRecords';

interface PatientHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: { id: number; firstName: string; lastName: string; dni: string } | null;
}

export const PatientHistoryDrawer = ({ isOpen, onClose, patient }: PatientHistoryDrawerProps) => {
  const { data: records = [], isLoading, isError } = useMedicalRecordsByPatient(patient?.id);

  if (!isOpen || !patient) return null;

  return (
    <>
      {/* Backdrop (Fondo oscuro borroso) */}
      <div 
        className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel Lateral que desliza desde la derecha */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 sm:max-w-lg border-l border-slate-200">
        
        {/* Header del Panel */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 shadow-sm">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">DNI: {patient.dni}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo / Línea de Tiempo */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 custom-scrollbar">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={18} className="text-slate-400" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Historial Clínico</h3>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="w-4 h-4 bg-slate-200 rounded-full mt-1"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-16 bg-slate-100 rounded w-full border border-slate-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center p-6 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 text-xs font-medium">
              Ocurrió un error al cargar el historial del paciente.
            </div>
          ) : records.length === 0 ? (
            <div className="text-center p-10 bg-white border border-dashed border-slate-300 rounded-xl">
              <FileText size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">Sin historial previo</p>
              <p className="text-xs text-slate-500 mt-1">Este paciente no tiene evoluciones médicas registradas en el sistema.</p>
            </div>
          ) : (
            // Componente de Timeline
            <div className="relative border-l-2 border-slate-200 ml-2 space-y-8 pb-4">
              {records.map((record: any) => (
                <div key={record.id} className="relative pl-6">
                  {/* Punto en la línea de tiempo */}
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-2 border-blue-500 shadow-xs" />
                  
                  {/* Tarjeta de la Evolución */}
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow">
                    
                    {/* Fecha y Médico */}
                    <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-3">
                      <div className="flex items-center gap-2 text-blue-600">
                        <CalendarIcon size={14} />
                        <span className="text-xs font-bold">{dayjs(record.createdAt).format('DD/MM/YYYY - HH:mm')}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Dr. {record.professional.lastName}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {record.reason && (
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Motivo de Consulta</span>
                          <p className="text-xs text-slate-700 font-medium">{record.reason}</p>
                        </div>
                      )}
                      
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          <Stethoscope size={12} /> Evolución
                        </span>
                        <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {record.evolution}
                        </p>
                      </div>

                      {record.prescription && (
                        <div>
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            <Pill size={12} /> Receta / Indicaciones
                          </span>
                          <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/50">
                            {record.prescription}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};