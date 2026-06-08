import type { AppointmentStatus } from '../../features/appointments/types';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/appointments';

interface StatusBadgeProps {
  status: AppointmentStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
};
