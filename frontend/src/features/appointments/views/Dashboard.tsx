import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { AppointmentsDailyList } from '../components/AppointmentsDailyList';
import type { Appointment } from '../types';
import { DashboardStats } from '../components/DashboardStats';
import dayjs from 'dayjs';
import { DatePicker } from '../../../components/ui/data-picker';

export const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  useEffect(() => {
    if (location.state?.showSuccessToast) {
      setToast({
        show: true,
        message: location.state.toastMessage || 'Turno guardado con éxito.'
      });

      navigate(location.pathname, { replace: true, state: {} });

      const timer = setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : undefined;
  const { data: appointments = [], isLoading, isError } = useAppointments({ dateFrom: formattedDate });

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      
      {/* Toast Modal de Éxito */}
      {toast.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-300 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-sm w-full mx-4 border border-slate-100 transform transition-transform animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3 shadow-xs">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Operación Exitosa</h3>
            <p className="text-slate-500 text-xs mt-1.5 mb-5 leading-relaxed px-2">
              {toast.message}
            </p>
            <button
              onClick={() => setToast({ show: false, message: '' })}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Cerrar Ventana
            </button>
          </div>
        </div>
      )}

      {/* Control Superior */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Monitoreo Diario</h1>
            <p className="text-slate-500 text-xs">Agenda y asignaciones para el día seleccionado.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <DatePicker date={date} setDate={setDate} />
          <button
            onClick={() => navigate('/appointments/new')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus size={16} />
            Agendar Turno
          </button>
        </div>
      </div>

      {/* Módulo de Estadísticas */}
      {!isLoading && !isError && (
        <DashboardStats appointments={appointments as Appointment[]} />
      )}

      {/* Manejo de Listados */}
      {isLoading ? (
        <div className="flex justify-center py-16 bg-white border border-slate-200 rounded-xl">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600"></div>
        </div>
      ) : isError ? (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-lg border border-rose-100 text-xs text-center font-medium">
          Ocurrió un error al intentar sincronizar los turnos diarios.
        </div>
      ) : (
        <AppointmentsDailyList appointments={appointments as Appointment[]} />
      )}
    </div>
  );
};