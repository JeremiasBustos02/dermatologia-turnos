import { useState } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import dayjs from 'dayjs';

export const Dashboard = () => {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

  const { data: appointments = [], isLoading } = useAppointments({
    dateFrom: date,
  });

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-secondary-500 text-white',
    COMPLETED: 'bg-slate-200 text-slate-600',
    CANCELLED: 'bg-danger-600 text-white',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agenda del día</h2>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded-lg"
        />
      </div>

      {isLoading ? (
        <p>Cargando turnos...</p>
      ) : (
        <div className="bg-surface rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-left">Paciente</th>
                <th className="p-4 text-left">Hora</th>
                <th className="p-4 text-left">Estado</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((app: any) => (
                <tr
                  key={app.id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="p-4">
                    {app.patient.firstName} {app.patient.lastName}
                  </td>

                  <td className="p-4">
                    {dayjs(app.dateTime).format('HH:mm')}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[app.status]
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};