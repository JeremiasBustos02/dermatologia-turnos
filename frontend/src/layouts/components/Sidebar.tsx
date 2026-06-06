import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, Stethoscope, LogOut, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import type { UserRole } from '../../types/index';

interface SidebarProps {
  role?: UserRole;
  onLogout: () => void;
}

export const Sidebar = ({ role, onLogout }: SidebarProps) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
      isActive 
        ? 'bg-blue-600 text-white shadow-xs' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
      {/* Header del SaaS */}
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight">
          <Stethoscope className="text-blue-500 h-6 w-6" />
          <span>Lumera</span>
          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-sm font-semibold tracking-wide uppercase">Staff</span>
        </h2>
      </div>

      {/* Menú de Navegación Segmentado */}
      <nav className="flex-1 px-4 py-6 space-y-7 overflow-y-auto">
        
        {/* Sección: Operación Diaria */}
        <div className="space-y-1.5">
          <p className="px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Gestión Médica</p>
          
          <NavLink to="/dashboard" className={navLinkClass} end>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/appointments" className={navLinkClass}>
            <CalendarDays size={18} />
            <span>Agenda de Turnos</span>
          </NavLink>

          {(role === 'ADMIN' || role === 'RECEPTIONIST') && (
            <NavLink to="/patients" className={navLinkClass}>
              <Users size={18} />
              <span>Fichas de Pacientes</span>
            </NavLink>
          )}
        </div>

        {/* Sección: Configuración del Sistema (Solo Admins) */}
        {role === 'ADMIN' && (
          <div className="space-y-1.5">
            <p className="px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Administración</p>
            
            <NavLink to="/professionals" className={navLinkClass}>
              <Users size={18} />
              <span>Cuerpo Médico</span>
            </NavLink>
            
            <NavLink to="/management" className={navLinkClass}>
              <SlidersHorizontal size={18} />
              <span>Configuración Global</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Footer / Cierre de Sesión */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};