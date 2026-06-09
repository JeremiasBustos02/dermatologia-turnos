export const SlotsTab = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-sm font-bold text-slate-800">Parámetros y Reglas de la Agenda</h3>
        <p className="text-slate-400 text-[11px] font-medium">Configurá las restricciones operativas globales para la reserva de turnos en la clínica.</p>
      </div>

      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden text-xs">
        <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/30 transition-colors">
          <div className="space-y-0.5 max-w-[80%]">
            <p className="font-semibold text-slate-800">Habilitar Sobrturnos Administrativos</p>
            <p className="text-slate-400 text-[11px] font-normal">Permite al personal de recepción forzar la asignación de un turno en un bloque horario que ya se encuentra reservado.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/30 transition-colors">
          <div className="space-y-0.5">
            <p className="font-semibold text-slate-800">Límite de Antelación para Reservas</p>
            <p className="text-slate-400 text-[11px] font-normal">Establece el rango máximo de días a futuro en los que un paciente puede solicitar una cita médica.</p>
          </div>
          <select className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 font-semibold cursor-pointer outline-hidden focus:border-blue-500">
            <option value="30">30 días (1 mes)</option>
            <option value="60" selected>60 días (2 meses)</option>
            <option value="90">90 días (3 meses)</option>
            <option value="180">180 días (6 meses)</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/30 transition-colors">
          <div className="space-y-0.5 max-w-[80%]">
            <p className="font-semibold text-slate-800">Bloqueo de Cancelación de Último Momento</p>
            <p className="text-slate-400 text-[11px] font-normal">Impide que los usuarios cancelen sus turnos de forma autónoma si faltan menos de 24 horas para la consulta.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => alert('Parámetros de agenda guardados de manera local en el entorno.')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-3xs"
        >
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};
