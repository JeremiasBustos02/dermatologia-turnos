import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { Clock, AlertCircle, Sunrise, Sun, Sunset } from 'lucide-react';
import { useAvailableSlots, useProfessionalSchedules } from '../../hooks/useAppointments';
import { CustomCalendar } from './CustomCalendar';
import { useAuthStore } from '../../../auth/auth.store';

interface DateTimeStepProps {
    professionalId: number;
    onNext: (data: { date: string; time: string; dateTime: string }) => void;
    defaultDate?: string;
    defaultTime?: string;
}

export const DateTimeStep = ({ professionalId, onNext, defaultDate, defaultTime }: DateTimeStepProps) => {
    const clinicId = useAuthStore((state) => state.user?.clinicId);
    const [selectedDate, setSelectedDate] = useState<string>(defaultDate || dayjs().format('YYYY-MM-DD'));
    const [selectedTime, setSelectedTime] = useState<string | undefined>(defaultTime);

    const { data: slots = [], isLoading, isError, isFetching } = useAvailableSlots(professionalId, selectedDate, clinicId);
    const { data: schedules = [] } = useProfessionalSchedules(professionalId, clinicId);

    const dayMap: Record<string, number> = {
        SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
    };

    const availableDaysOfWeek = useMemo(() => Array.from(
        new Set(schedules.map((schedule: any) => dayMap[schedule.dayOfWeek]))
    ) as number[], [schedules]);

    useEffect(() => {
        if (selectedDate && selectedTime) {
            const dateTimeISO = dayjs(`${selectedDate}T${selectedTime}:00-03:00`).toISOString();
            onNext({ date: selectedDate, time: selectedTime, dateTime: dateTimeISO });
        }
    }, [selectedDate, selectedTime]);

    // 🌟 UX SaaS: Filtramos y Agrupamos los turnos disponibles por franja horaria
    const groupedSlots = useMemo(() => {
        const isToday = selectedDate === dayjs().format('YYYY-MM-DD');

        const filtered = slots.filter((slot) => {
            if (!isToday) return true;
            const [hours, minutes] = slot.split(':').map(Number);
            const slotDateTime = dayjs().hour(hours).minute(minutes).second(0);
            return slotDateTime.isAfter(dayjs());
        });

        const groups = {
            morning: [] as string[],   // 00:00 - 11:59
            midday: [] as string[],    // 12:00 - 13:59
            afternoon: [] as string[], // 14:00 - 23:59
        };

        filtered.forEach((slot) => {
            const [hour] = slot.split(':').map(Number);
            if (hour < 12) groups.morning.push(slot);
            else if (hour >= 12 && hour < 14) groups.midday.push(slot);
            else groups.afternoon.push(slot);
        });

        return groups;
    }, [slots, selectedDate]);

    const hasSlots = slots.length > 0;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">3. Asignación de Fecha y Hora</h2>
                <p className="text-xs text-slate-400 font-medium">Seleccioná un día del calendario y luego una franja de turno libre.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* COLUMNA IZQUIERDA: CALENDARIO */}
                <div className="lg:col-span-5 space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Día del turno</label>

                    <div className="flex justify-center lg:justify-start">
                        <CustomCalendar
                            selectedDate={selectedDate}
                            onChange={(newDate) => setSelectedDate(newDate)}
                            availableDaysOfWeek={availableDaysOfWeek}
                        />
                    </div>

                    <div className="flex items-center gap-2 px-1.5 pt-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-[11px] text-slate-400 font-medium">Días con disponibilidad de agenda habitual</p>
                    </div>
                </div>

                {/* COLUMNA DERECHA: GRILLA DE HORARIOS AGRUPADOS */}
                <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Horarios disponibles</label>
                        {hasSlots && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wide border border-blue-100">
                                {slots.length} Disponibles
                            </span>
                        )}
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 min-h-[310px] flex flex-col relative shadow-2xs">

                        {/* Loading Animado Sutil */}
                        {isFetching && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex justify-center items-center rounded-xl z-20 transition-all">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        {isError ? (
                            <div className="text-center text-rose-600 m-auto flex flex-col items-center gap-1.5">
                                <AlertCircle size={24} />
                                <p className="text-xs font-semibold">Error al interconectar con los horarios del servidor.</p>
                            </div>
                        ) : !hasSlots && !isLoading ? (
                            <div className="text-center text-slate-400 m-auto flex flex-col items-center gap-2 max-w-xs">
                                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 shadow-3xs"><Clock size={20} className="text-slate-300" /></div>
                                <p className="text-xs font-bold text-slate-700">Agenda Completa / Sin Atención</p>
                                <p className="text-[11px] text-slate-400 leading-relaxed">El profesional médico no posee bloques de atención o todos los cupos ya fueron reservados para esta fecha.</p>
                            </div>
                        ) : (
                            <div className="space-y-5 overflow-y-auto max-h-[290px] pr-1">

                                {/* BLOQUE: MAÑANA */}
                                {groupedSlots.morning.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Sunrise size={13} className="text-amber-500" /> Mañana
                                        </h4>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {groupedSlots.morning.map((slot) => (
                                                <SlotButton key={slot} slot={slot} isSelected={selectedTime === slot} onClick={setSelectedTime} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* BLOQUE: MEDIODÍA */}
                                {groupedSlots.midday.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Sun size={13} className="text-orange-400" /> Mediodía
                                        </h4>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {groupedSlots.midday.map((slot) => (
                                                <SlotButton key={slot} slot={slot} isSelected={selectedTime === slot} onClick={setSelectedTime} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* BLOQUE: TARDE */}
                                {groupedSlots.afternoon.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Sunset size={13} className="text-indigo-400" /> Tarde
                                        </h4>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {groupedSlots.afternoon.map((slot) => (
                                                <SlotButton key={slot} slot={slot} isSelected={selectedTime === slot} onClick={setSelectedTime} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

// Subcomponente Atómico para los Botones de Turnos (Evita código duplicado)
interface SlotButtonProps {
    slot: string;
    isSelected: boolean;
    onClick: (slot: string) => void;
}

const SlotButton = ({ slot, isSelected, onClick }: SlotButtonProps) => (
    <button
        type="button"
        onClick={() => onClick(slot)}
        className={`py-1.5 px-2.5 rounded-lg font-semibold text-xs transition-all border text-center focus:outline-hidden ${isSelected
            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold scale-102 z-10'
            : 'bg-slate-50/50 text-slate-700 border-slate-200/80 hover:border-blue-400 hover:text-blue-600 hover:bg-white shadow-3xs'
            }`}
    >
        {slot} hs
    </button>
);