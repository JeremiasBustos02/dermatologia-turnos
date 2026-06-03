import { Outlet, Link } from 'react-router-dom';
import { Calendar, Users, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/AuthStore';

export const DashboardLayout = () => {
  const { logout } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-surface border-r border-slate-200 p-6 flex flex-col">
        <h1 className="text-xl font-bold text-primary-600 mb-8">Lumera</h1>
        
        <nav className="flex-1 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100">
            <Calendar size={20} /> Agenda
          </Link>
          <Link to="/patients" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100">
            <Users size={20} /> Pacientes
          </Link>
          <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100">
            <Settings size={20} /> Ajustes
          </Link>
        </nav>

        <button 
          onClick={logout} 
          className="flex items-center gap-3 p-3 text-danger-600 hover:bg-rose-50 rounded-lg"
        >
          <LogOut size={20} /> Salir
        </button>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};