import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { useAvailableSlots, useProfessionalSchedules } from '../../hooks/useAppointments';
import { CustomCalendar } from './CustomCalendar';


interface DateTimeStepProps {
    professionalId: number;
    onNext: (data: { date: string; time: string; dateTime: string }) => void;
    defaultDate?: string;
    defaultTime?: string;
}

export const DateTimeStep = ({ professionalId, onNext, defaultDate, defaultTime }: DateTimeStepProps) => {
    const [selectedDate, setSelectedDate] = useState<string>(defaultDate || dayjs().format('YYYY-MM-DD'));
    const [selectedTime, setSelectedTime] = useState<string | undefined>(defaultTime);

    const { data: slots = [], isLoading, isError, isFetching } = useAvailableSlots(professionalId, selectedDate);

    const { data: schedules = [] } = useProfessionalSchedules(professionalId);

    console.log("Horarios reales del backend:", schedules);

    const dayMap: Record<string, number> = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6,
    };

    const availableDaysOfWeek = Array.from(
        new Set(schedules.map((schedule: any) => dayMap[schedule.dayOfWeek]))
    ) as number[];

    useEffect(() => {
        if (defaultDate !== selectedDate) {
            setSelectedTime(undefined);
        }
    }, [selectedDate, defaultDate]);

    const handleContinue = () => {
        if (selectedDate && selectedTime) {
            const dateTimeISO = dayjs(`${selectedDate}T${selectedTime}:00-03:00`).toISOString();
            onNext({ date: selectedDate, time: selectedTime, dateTime: dateTimeISO });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-bold text-slate-800">3. Selecciona fecha y hora</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                <div className="md:col-span-1 space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Día del turno</label>

                    <CustomCalendar
                        selectedDate={selectedDate}
                        onChange={(newDate) => setSelectedDate(newDate)}
                        availableDaysOfWeek={availableDaysOfWeek} // <-- ¡Le pasamos el array real!
                    />

                    <div className="flex items-center gap-2 mt-2 px-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <p className="text-xs text-slate-500 font-medium">Días de atención habitual</p>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-4">Horarios disponibles</label>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[200px] flex flex-col relative">

                        {isFetching && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex justify-center items-center rounded-xl z-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        {isError ? (
                            <div className="text-center text-red-500 m-auto">
                                <p>Error al cargar la disponibilidad.</p>
                            </div>
                        ) : slots.length === 0 && !isLoading ? (
                            <div className="text-center text-slate-500 m-auto flex flex-col items-center gap-2">
                                <Clock size={32} className="text-slate-300" />
                                <p>El profesional no atiende este día o ya no hay turnos libres.</p>
                                <p className="text-xs">Por favor, selecciona otra fecha.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {slots
                                    .filter((slot) => {
                                        const isToday = selectedDate === dayjs().format('YYYY-MM-DD');
                                        if (!isToday) return true; // Si es un día futuro, mostramos todos los horarios

                                        // Si es hoy, separamos la hora y los minutos del slot (ej: "09:00")
                                        const [hours, minutes] = slot.split(':').map(Number);
                                        const slotDateTime = dayjs().hour(hours).minute(minutes).second(0);

                                        // 🌟 Solo dejamos pasar los horarios que sean posteriores a la hora actual exacta
                                        return slotDateTime.isAfter(dayjs());
                                    })
                                    .map((slot) => {
                                        const isSelected = selectedTime === slot;
                                        return (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedTime(slot)}
                                                className={`py-2 px-3 rounded-lg font-medium text-sm transition-all border ${isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600 shadow-sm'
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                    onClick={handleContinue}
                    disabled={!selectedDate || !selectedTime}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};