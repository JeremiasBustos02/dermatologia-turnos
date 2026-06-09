import { User, Stethoscope, Calendar as CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';
import type { NewAppointmentState } from '../../hooks/useWizard';

interface WizardSidebarProps {
  appointmentData: NewAppointmentState;
}

export const WizardSidebar = ({ appointmentData }: WizardSidebarProps) => (
  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4">
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resumen de Cita</h3>
    <div className="space-y-3 text-xs">
      <div className={`p-3 rounded-lg border bg-white flex items-center gap-3 ${appointmentData.patientId ? 'border-slate-200' : 'border-dashed border-slate-300'}`}>
        <User size={16} className={appointmentData.patientId ? 'text-blue-500' : 'text-slate-300'} />
        <div>
          <p className="font-semibold text-slate-700">Paciente</p>
          <p className="text-slate-400 text-[11px]">{appointmentData.patientId ? 'Seleccionado' : 'Pendiente'}</p>
        </div>
      </div>

      <div className={`p-3 rounded-lg border bg-white flex items-center gap-3 ${appointmentData.professionalId ? 'border-slate-200' : 'border-dashed border-slate-300'}`}>
        <Stethoscope size={16} className={appointmentData.professionalId ? 'text-blue-500' : 'text-slate-300'} />
        <div>
          <p className="font-semibold text-slate-700">Médico Especialista</p>
          <p className="text-slate-400 text-[11px]">{appointmentData.professionalId ? 'Asignado' : 'Pendiente'}</p>
        </div>
      </div>

      <div className={`p-3 rounded-lg border bg-white flex items-center gap-3 ${appointmentData.dateTime ? 'border-slate-200' : 'border-dashed border-slate-300'}`}>
        <CalendarIcon size={16} className={appointmentData.dateTime ? 'text-blue-500' : 'text-slate-300'} />
        <div>
          <p className="font-semibold text-slate-700">Horario de Reserva</p>
          <p className="text-slate-500 font-medium text-[11px]">
            {appointmentData.date && appointmentData.time ? `${dayjs(appointmentData.date).format('DD/MM/YYYY')} - ${appointmentData.time} hs` : 'Pendiente'}
          </p>
        </div>
      </div>
    </div>
  </div>
);
