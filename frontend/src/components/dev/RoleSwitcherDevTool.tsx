import { useAuthStore } from '../../features/auth/auth.store';
import type { UserRole } from '../../types';

const ROLES: { label: string; value: UserRole }[] = [
  { label: 'SuperAdmin', value: 'SUPERADMIN' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Recepcionista', value: 'RECEPTIONIST' },
  { label: 'Profesional', value: 'PROFESSIONAL' },
  { label: 'Paciente', value: 'PATIENT' },
];

export const RoleSwitcherDevTool = () => {
  const user = useAuthStore((state) => state.user);
  const setMockRole = useAuthStore((state) => state.setMockRole);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 rounded-lg border border-yellow-400/30 bg-black/80 p-3 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-yellow-400">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-400" />
        DevTools: Rol activo
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-medium text-white">
          {user?.role ?? 'SIN ROL'}
        </span>
      </div>

      <div className="flex gap-1">
        {ROLES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setMockRole(value)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              user?.role === value
                ? 'bg-yellow-400 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
