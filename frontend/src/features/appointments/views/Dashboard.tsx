import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Calendar as CalendarIcon, CheckCircle, X } from 'lucide-react';
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
                message: location.state.toastMessage || 'Operación realizada con éxito.'
            });

            navigate(location.pathname, { replace: true, state: {} });

            const timer = setTimeout(() => {
                setToast({ show: false, message: '' });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [location, navigate]);

    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : undefined;

    const { data: appointments = [], isLoading, isError } =
        useAppointments({ dateFrom: formattedDate });

    return (
        <div className="max-w-6xl mx-auto space-y-6 relative">

            {toast.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm transition-opacity">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full mx-4 animate-in zoom-in-90 fade-in duration-300">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 shadow-inner">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 text-center">¡Turno Confirmado!</h3>
                        <p className="text-slate-500 text-center mb-4 leading-relaxed">
                            {toast.message}
                        </p>
                        <button
                            onClick={() => setToast({ show: false, message: '' })}
                            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Agenda del Día</h1>
                        <p className="text-slate-500 text-sm">Visualiza y gestiona los turnos diarios.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <DatePicker date={date} setDate={setDate} />

                    <button
                        onClick={() => navigate('/appointments/new')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                    >
                        <Plus size={20} />
                        Nuevo Turno
                    </button>
                </div>
            </div>

            {!isLoading && !isError && (
                <DashboardStats appointments={appointments as Appointment[]} />
            )}

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : isError ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-center">
                    Ocurrió un error al cargar la agenda.
                </div>
            ) : (
                <AppointmentsDailyList appointments={appointments as Appointment[]} />
            )}
        </div>
    );
};