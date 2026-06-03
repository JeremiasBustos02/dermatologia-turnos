import { Menu, UserCircle } from 'lucide-react';

interface HeaderProps {
  userName?: string;
  onMenuToggle?: () => void;
}

export const Header = ({ userName = 'Usuario', onMenuToggle }: HeaderProps) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          className="md:hidden text-slate-500 hover:text-slate-700"
          onClick={onMenuToggle}
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Hola, {userName}</span>
        <UserCircle size={32} className="text-slate-400" />
      </div>
    </header>
  );
};