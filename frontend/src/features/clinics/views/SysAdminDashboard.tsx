import { useState } from 'react';
import { Building2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/auth.store';
import { useCreateClinic } from '../hooks/useCreateClinic';
import { Toast } from '../../../components/shared/Toast';

interface FormState {
  clinicName: string;
  adminFirstName: string;
  adminLastName: string;
  adminDni: string;
  adminEmail: string;
  adminPassword: string;
}

const initialForm: FormState = {
  clinicName: '',
  adminFirstName: '',
  adminLastName: '',
  adminDni: '',
  adminEmail: '',
  adminPassword: '',
};

export const SysAdminDashboard = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; title: string; message: string }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { mutateAsync: createClinic, isPending } = useCreateClinic();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createClinic(form);
      setToast({
        show: true,
        type: 'success',
        title: 'Clínica creada con éxito',
        message: `La clínica "${result.clinic.name}" fue registrada junto con su administrador.`,
      });
      setForm(initialForm);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Ocurrió un error al crear la clínica.';
      setToast({
        show: true,
        type: 'error',
        title: 'Error al crear',
        message: Array.isArray(message) ? message.join(', ') : message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Toast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Panel de Administración</h1>
            <p className="text-slate-500 text-xs">Súper Administrador &mdash; {user?.firstName} {user?.lastName}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-xs font-semibold transition-colors"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </header>

      <main className="flex-1 flex items-start justify-center pt-12 px-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Registrar nueva clínica</h2>
            <p className="text-slate-500 text-xs mt-1">Completa los datos del centro y su administrador.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de la Clínica</label>
              <input
                name="clinicName"
                value={form.clinicName}
                onChange={handleChange}
                required
                placeholder="Ej: Centro Dermatológico Norte"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Admin</label>
                <input
                  name="adminFirstName"
                  value={form.adminFirstName}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Juan"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Apellido</label>
                <input
                  name="adminLastName"
                  value={form.adminLastName}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Pérez"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">DNI del Administrador</label>
              <input
                name="adminDni"
                value={form.adminDni}
                onChange={handleChange}
                required
                placeholder="Ej: 30123456"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email del Administrador</label>
              <input
                name="adminEmail"
                type="email"
                value={form.adminEmail}
                onChange={handleChange}
                required
                placeholder="Ej: juan.perez@clinica.com"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña del Admin</label>
              <input
                name="adminPassword"
                type="password"
                value={form.adminPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-xs transition-colors mt-2"
            >
              {isPending ? 'Creando...' : 'Crear Clínica'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
