import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Trash2, Clock } from 'lucide-react';
import { useProfessionalSchedules, useCreateSchedule, useDeleteSchedule } from '../hooks/useSchedules';
import type { CreateScheduleDTO, DayOfWeek } from '../types';

const DIAS_TRADUCIDOS: Record<DayOfWeek, string> = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
};

export const ProfessionalSchedulesPage = () => {
    const { id } = useParams<{ id: string }>();
    const professionalId = Number(id);
    const navigate = useNavigate();

    const { data: schedules = [], isLoading } = useProfessionalSchedules(professionalId);
    const createMutation = useCreateSchedule(professionalId);
    const deleteMutation = useDeleteSchedule(professionalId);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<CreateScheduleDTO, 'professionalId'>>();

    const onSubmit = (data: Omit<CreateScheduleDTO, 'professionalId'>) => {
        createMutation.mutate(
            { ...data, professionalId, appointmentDuration: Number(data.appointmentDuration) },
            { onSuccess: () => reset() }
        );
    };

    const handleDelete = (scheduleId: number) => {
        if (window.confirm('¿Eliminar este horario?')) {
            deleteMutation.mutate(scheduleId);
        }
    };

    if (isLoading) return <div className="p-12 text-center">Cargando agenda...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Botón Volver y Título */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/professionals')}
                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Configurar Agenda</h1>
                    <p className="text-slate-500 text-sm">Define los días y horarios de atención del profesional.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Nuevo Horario</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Día de la semana</label>
                            <select
                                {...register('dayOfWeek', { required: true })}
                                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {Object.entries(DIAS_TRADUCIDOS).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Inicio</label>
                                <input
                                    type="time"
                                    {...register('startTime', { required: true })}
                                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Fin</label>
                                <input
                                    type="time"
                                    {...register('endTime', { required: true })}
                                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Duración del turno (min)</label>
                            <select
                                {...register('appointmentDuration', { required: true })}
                                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="15">15 minutos</option>
                                <option value="20">20 minutos</option>
                                <option value="30">30 minutos</option>
                                <option value="45">45 minutos</option>
                                <option value="60">1 hora</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Agregar Horario
                        </button>
                    </form>
                </div>

                <div className="md:col-span-2 space-y-3">
                    <h2 className="text-lg font-semibold mb-4">Horarios Configurados</h2>

                    {schedules.length === 0 ? (
                        <div className="text-center p-8 bg-slate-50 border rounded-xl text-slate-500">
                            No hay horarios configurados para este profesional.
                        </div>
                    ) : (
                        schedules.map((schedule) => (
                            <div key={schedule.id} className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{DIAS_TRADUCIDOS[schedule.dayOfWeek]}</p>
                                        <p className="text-sm text-slate-500">
                                            De {schedule.startTime} a {schedule.endTime} • Turnos de {schedule.appointmentDuration} min
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(schedule.id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};