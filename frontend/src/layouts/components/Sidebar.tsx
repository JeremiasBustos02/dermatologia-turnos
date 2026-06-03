import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, Stethoscope, LogOut } from 'lucide-react';
import type { UserRole } from '../../types/index';

interface SidebarProps {
  role?: UserRole;
  onLogout: () => void;
}

export const Sidebar = ({ role, onLogout }: SidebarProps) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Stethoscope className="text-blue-500" />
          <span>MediApp</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <NavLink to="/dashboard" className={navLinkClass} end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/appointments" className={navLinkClass}>
          <CalendarDays size={20} />
          <span>Turnos</span>
        </NavLink>

        {(role === 'ADMIN' || role === 'RECEPTIONIST') && (
          <NavLink to="/patients" className={navLinkClass}>
            <Users size={20} />
            <span>Pacientes</span>
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};