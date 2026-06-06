import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface CoverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}

export const CoverageModal = ({ isOpen, onClose, onSubmit }: CoverageModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError('El nombre comercial de la entidad prestadora es requerido.');
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-800">Alta de Cobertura Médica</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:bg-slate-200 p-1 rounded-md transition-all">
            <X size={14} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-medium text-slate-700">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-2.5 rounded-lg text-[11px] font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Nombre de la Obra Social / Prepaga *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: OSDE 210, Swiss Medical"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white text-slate-800 font-medium text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold">Observaciones Reglamentarias (Opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Requiring token digital o validación de credencial física en mesón de entrada..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white text-slate-800 font-medium text-xs h-20 resize-none"
            />
          </div>

          {/* Footer Acciones */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Save size={13} />
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};