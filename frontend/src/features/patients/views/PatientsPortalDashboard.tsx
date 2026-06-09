import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock, MapPin, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMyAppointments, useUpdateAppointmentStatus } from '../../appointments/hooks/useAppointments';
import { useAuthStore } from '../../auth/auth.store';
import type { Appointment } from '../../appointments/types';

export const PatientPortalDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  useEffect(() => {
    if (location.state?.showSuccessToast) {
      setToast({ show: true, message: location.state.toastMessage || 'Turno creado con éxito.' });
      navigate(location.pathname, { replace: true, state: {} });
      const timer = setTimeout(() => setToast({ show: false, message: '' }), 6000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);
  
  const { data: appointments = [], isLoading } = useMyAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const typedAppointments = appointments as Appointment[];
  const upcomingAppointments = typedAppointments.filter(app => app.status === 'PENDING' || app.status === 'CONFIRMED');

  const handleCancelAppointment = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar este turno?')) {
      updateStatusMutation.mutate({ id, status: 'CANCELLED' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4 sm:p-6 min-h-screen">
      
      {/* Toast de Éxito */}
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

      {/* Saludo y Acción Principal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-600 text-white p-6 rounded-2xl shadow-md">
        <div>
          <h1 className="text-2xl font-bold">Hola, {user?.firstName}</h1>
          <p className="text-blue-100 text-sm mt-1">Bienvenido a tu portal de salud Lumera.</p>
        </div>
        <button 
          onClick={() => navigate('/portal/appointments/new')}
          className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-xs w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Sacar Turno Nuevo
        </button>
      </div>

      {/* Próximos Turnos */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CalendarDays className="text-blue-500" size={20} />
          Mis Próximos Turnos
        </h2>
        
        {isLoading ? (
          <div className="animate-pulse flex space-x-4 bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : upcomingAppointments.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center">
            <p className="text-slate-500 text-sm">No tenés turnos programados en este momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map(app => (
              <div key={app.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl text-center min-w-[70px] border border-blue-100">
                    <span className="block text-xs font-semibold uppercase">{dayjs(app.dateTime).format('MMM')}</span>
                    <span className="block text-xl font-bold">{dayjs(app.dateTime).format('DD')}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Dr/a. {app.professional.lastName}</h3>
                    <p className="text-xs font-medium text-blue-600 mb-2">Consulta Especializada</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {dayjs(app.dateTime).format('HH:mm')} hs</span>
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> Consultorios Centrales</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleCancelAppointment(app.id)}
                  disabled={updateStatusMutation.isPending}
                  className="w-full sm:w-auto text-rose-600 bg-white hover:bg-rose-50 px-4 py-2 rounded-lg text-xs font-semibold transition-colors border border-rose-200 disabled:opacity-50"
                >
                  Cancelar Turno
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};