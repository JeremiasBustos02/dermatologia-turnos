import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Calendar, Save, CheckSquare, Square, Clock } from 'lucide-react';
import { useProfessionalSchedules, useSaveProfessionalSchedules, type DayOfWeek, type ScheduleItem } from '../hooks/useProfessionalSchedules';

const DAYS_TRANSLATION: Record<DayOfWeek, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

const DAY_OPTIONS = Object.keys(DAYS_TRANSLATION) as DayOfWeek[];

interface LocalScheduleRow {
  localId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  appointmentDuration: number;
}

// Interfaz para controlar los múltiples turnos/cortes en el formulario masivo
interface BulkShift {
  id: string;
  startTime: string;
  endTime: string;
}

export const ProfessionalSchedulesPage = () => {
  const { id } = useParams<{ id: string }>();
  const professionalId = Number(id);
  const navigate = useNavigate();

  const { data: serverSchedules, isLoading, isError } = useProfessionalSchedules(professionalId);
  const saveMutation = useSaveProfessionalSchedules(professionalId);

  // Estado de la grilla final
  const [rows, setRows] = useState<LocalScheduleRow[]>([]);

  // Estados para el Panel de Asignación Masiva
  const [bulkDays, setBulkDays] = useState<DayOfWeek[]>([]);
  const [bulkDuration, setBulkDuration] = useState(30);
  
  // Lista dinámica de franjas horarias (Inicia con un turno estándar)
  const [bulkShifts, setBulkShifts] = useState<BulkShift[]>([
    { id: crypto.randomUUID(), startTime: '08:00', endTime: '12:00' }
  ]);

  useEffect(() => {
    if (serverSchedules) {
      const initialRows = serverSchedules.map((s) => ({
        localId: crypto.randomUUID(),
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        appointmentDuration: s.appointmentDuration,
      }));
      setRows(initialRows);
    }
  }, [serverSchedules]);

  const toggleBulkDay = (day: DayOfWeek) => {
    setBulkDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Agregar una nueva franja horaria de corte en el generador masivo
  const handleAddBulkShift = () => {
    // Tomamos el fin del último turno para setear por defecto un inicio coherente
    const lastShift = bulkShifts[bulkShifts.length - 1];
    const defaultStart = lastShift ? lastShift.endTime : '14:00';
    
    // Calculamos una hora de fin por defecto (ej: 4 horas después)
    const [hours, minutes] = defaultStart.split(':').map(Number);
    const endHour = Math.min(hours + 4, 23);
    const defaultEnd = `${String(endHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    setBulkShifts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), startTime: defaultStart, endTime: defaultEnd }
    ]);
  };

  const handleRemoveBulkShift = (id: string) => {
    if (bulkShifts.length === 1) return; // Obligatorio tener al menos una franja
    setBulkShifts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleBulkShiftChange = (id: string, field: 'startTime' | 'endTime', value: string) => {
    setBulkShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Procesar y aplicar la configuración masiva multiturno a la grilla
  const handleApplyBulk = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkDays.length === 0) {
      alert('Por favor, seleccioná al menos un día de la semana.');
      return;
    }

    // VALIDACIÓN LOCAL DE SUPERPOSICIÓN ENTRE LAS MISMAS FRANJAS GENERADAS
    for (let i = 0; i < bulkShifts.length; i++) {
      const current = bulkShifts[i];
      if (current.startTime >= current.endTime) {
        alert(`Error en el Turno ${i + 1}: La hora de inicio (${current.startTime}) debe ser menor a la hora de fin (${current.endTime}).`);
        return;
      }

      // Comparamos contra las otras franjas del lote para evitar que se pisen entre sí
      for (let j = i + 1; j < bulkShifts.length; j++) {
        const next = bulkShifts[j];
        const hasOverlap = current.startTime < next.endTime && current.endTime > next.startTime;
        if (hasOverlap) {
          alert(`Error de superposición: El Turno ${i + 1} (${current.startTime} a ${current.endTime}) se pisa con el Turno ${j + 1} (${next.startTime} a ${next.endTime}).`);
          return;
        }
      }
    }

    // Si pasó los filtros, creamos el set plano de filas (Días x Turnos)
    const generatedRows: LocalScheduleRow[] = [];
    bulkDays.forEach((day) => {
      bulkShifts.forEach((shift) => {
        generatedRows.push({
          localId: crypto.randomUUID(),
          dayOfWeek: day,
          startTime: shift.startTime,
          endTime: shift.endTime,
          appointmentDuration: Number(bulkDuration),
        });
      });
    });

    // Impactamos en la vista general y reseteamos el estado de días seleccionados
    setRows((prev) => [...prev, ...generatedRows]);
    setBulkDays([]);
  };

  const handleAddRow = () => {
    const newRow: LocalScheduleRow = {
      localId: crypto.randomUUID(),
      dayOfWeek: 'MONDAY',
      startTime: '14:00',
      endTime: '18:00',
      appointmentDuration: 30,
    };
    setRows((prev) => [...prev, newRow]);
  };

  const handleRemoveRow = (localId: string) => {
    setRows((prev) => prev.filter((r) => r.localId !== localId));
  };

  const handleRowChange = (localId: string, field: keyof LocalScheduleRow, value: any) => {
    setRows((prev) =>
      prev.map((row) => (row.localId === localId ? { ...row, [field]: value } : row))
    );
  };

  const sortedRows = [...rows].sort((a, b) => {
    const order = DAY_OPTIONS.indexOf(a.dayOfWeek) - DAY_OPTIONS.indexOf(b.dayOfWeek);
    if (order !== 0) return order;
    return a.startTime.localeCompare(b.startTime);
  });

  const handleSave = () => {
    const payload = sortedRows.map((r) => ({
      professionalId,
      dayOfWeek: r.dayOfWeek,
      startTime: r.startTime,
      endTime: r.endTime,
      appointmentDuration: Number(r.appointmentDuration),
    }));

    saveMutation.mutate(payload, {
      onSuccess: () => {
        alert('Agenda guardada con éxito.');
        navigate('/professionals');
      },
      onError: (error: any) => {
        const backendMessage = error?.response?.data?.message;
        alert(backendMessage || 'Ocurrió un error al guardar.');
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/professionals')}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configuración de Agenda</h1>
          <p className="text-slate-500 text-sm">Definí los bloques y franjas de atención del profesional.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white border border-slate-200 rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-slate-400 text-xs">Cargando grilla horaria...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm text-center">
          Error al conectar con el servidor.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUMNA IZQUIERDA: Generador Masivo Avanzado con Multi-Turnos */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs sticky top-20">
              <h3 className="font-semibold text-slate-900 text-sm mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <CheckSquare size={18} className="text-blue-500" />
                Asignación por Lote (Días y Cortes)
              </h3>
              
              <form onSubmit={handleApplyBulk} className="space-y-5">
                {/* 1. Selección de días */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">1. Seleccionar Días</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5">
                    {DAY_OPTIONS.map((day) => {
                      const isSelected = bulkDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleBulkDay(day)}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                            isSelected
                              ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? <CheckSquare size={13} className="text-blue-600" /> : <Square size={13} className="text-slate-400" />}
                          {DAYS_TRANSLATION[day]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Franjas Horarias Dinámicas (Cortes de Horario) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">2. Horarios de Atención</label>
                    <button
                      type="button"
                      onClick={handleAddBulkShift}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
                    >
                      <Plus size={12} /> Añadir Corte / Turno
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {bulkShifts.map((shift, index) => (
                      <div key={shift.id} className="flex items-center gap-2 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-400 w-14">Turno {index + 1}</span>
                        <div className="grid grid-cols-2 gap-2 flex-1">
                          <input
                            type="time"
                            value={shift.startTime}
                            onChange={(e) => handleBulkShiftChange(shift.id, 'startTime', e.target.value)}
                            className="w-full border border-slate-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                          <input
                            type="time"
                            value={shift.endTime}
                            onChange={(e) => handleBulkShiftChange(shift.id, 'endTime', e.target.value)}
                            className="w-full border border-slate-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </div>
                        {bulkShifts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBulkShift(shift.id)}
                            className="p-1 text-rose-500 hover:bg-white rounded-md border border-transparent hover:border-slate-200 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Duración */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">3. Duración del Turno</label>
                  <select
                    value={bulkDuration}
                    onChange={(e) => setBulkDuration(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 minutos</option>
                    <option value={20}>20 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs font-semibold py-2.5 rounded-lg text-white transition-colors shadow-xs"
                >
                  Cargar a la Vista Previa
                </button>
              </form>
            </div>
          </div>

          {/* COLUMNA DERECHA: Vista Previa y Ajustes Finos Quirúrgicos */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Grilla Semanal Consolidada</h3>
                  <p className="text-xs text-slate-400">Revisá el cronograma final. Podés retocar celdas sueltas o borrar elementos.</p>
                </div>
                <button
                  onClick={handleAddRow}
                  className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={14} /> Fila Manual
                </button>
              </div>

              <div className="overflow-x-auto max-h-[460px] overflow-y-auto border border-slate-100 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase bg-slate-50/60 sticky top-0 z-10">
                      <th className="py-2.5 px-3 bg-slate-50">Día</th>
                      <th className="py-2.5 px-3 bg-slate-50">Entrada</th>
                      <th className="py-2.5 px-3 bg-slate-50://">Salida</th>
                      <th className="py-2.5 px-3 text-center bg-slate-50">Duración</th>
                      <th className="py-2.5 px-3 text-center bg-slate-50">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {sortedRows.map((row) => (
                      <tr key={row.localId} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-2 px-2 w-1/4">
                          <select
                            value={row.dayOfWeek}
                            onChange={(e) => handleRowChange(row.localId, 'dayOfWeek', e.target.value as DayOfWeek)}
                            className="bg-transparent font-medium text-slate-700 border-0 text-xs w-full cursor-pointer rounded-md p-1 hover:bg-slate-100 focus:ring-0"
                          >
                            {DAY_OPTIONS.map((day) => (
                              <option key={day} value={day}>
                                {DAYS_TRANSLATION[day]}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-2 px-2">
                          <input
                            type="time"
                            value={row.startTime}
                            onChange={(e) => handleRowChange(row.localId, 'startTime', e.target.value)}
                            className="border border-slate-200 rounded-md px-1.5 py-1 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </td>

                        <td className="py-2 px-2">
                          <input
                            type="time"
                            value={row.endTime}
                            onChange={(e) => handleRowChange(row.localId, 'endTime', e.target.value)}
                            className="border border-slate-200 rounded-md px-1.5 py-1 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </td>

                        <td className="py-2 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min={5}
                              value={row.appointmentDuration}
                              onChange={(e) => handleRowChange(row.localId, 'appointmentDuration', Number(e.target.value))}
                              className="border border-slate-200 rounded-md w-12 py-1 text-center text-xs focus:outline-hidden bg-white"
                            />
                            <span className="text-[10px] text-slate-400">m</span>
                          </div>
                        </td>

                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={() => handleRemoveRow(row.localId)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {sortedRows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 text-xs bg-white">
                          <Calendar className="mx-auto text-slate-300 mb-2" size={28} />
                          Sin horarios cargados. Seleccioná días y añadí las franjas deseadas en el panel izquierdo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Guardado Final */}
              <div className="flex justify-end pt-4 mt-4 border-t border-slate-100 gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/professionals')}
                  className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveMutation.isPending || rows.length === 0}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
                >
                  {saveMutation.isPending ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <Save size={14} />
                  )}
                  {saveMutation.isPending ? 'Guardando...' : 'Confirmar Agenda Completa'}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};