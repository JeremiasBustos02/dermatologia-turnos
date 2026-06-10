import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../api/apiClient';

interface RegisterFormValues {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError('');
    setLoading(true);

    try {
      await apiClient.post('/auth/register', data);
      setSuccess(true);
    } catch (err: any) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 409) {
        setApiError(message || 'El DNI o el email ya se encuentran registrados');
      } else {
        setApiError(message || 'Error al crear la cuenta. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 w-96 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Cuenta creada con éxito</h2>
          <p className="text-sm text-slate-500">Será redirigido a la página de inicio de sesión.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface p-8 rounded-xl shadow-sm border border-slate-200 w-96 space-y-5"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900">Crear cuenta</h2>
          <p className="text-sm text-slate-500 mt-1">Complete sus datos para registrarse como paciente.</p>
        </div>

        {apiError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-xs">
            {apiError}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">DNI</label>
          <input
            {...register('dni', { required: 'El DNI es requerido' })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-sm"
            placeholder="Ej. 45123456"
          />
          {errors.dni && <span className="text-xs text-red-500">{errors.dni.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Nombre</label>
            <input
              {...register('firstName', { required: 'El nombre es requerido' })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-sm"
            />
            {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Apellido</label>
            <input
              {...register('lastName', { required: 'El apellido es requerido' })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-sm"
            />
            {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'El email es requerido',
              pattern: { value: /^\S+@\S+$/i, message: 'El formato del email no es válido' },
            })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-sm"
            placeholder="paciente@correo.com"
          />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Contraseña</label>
          <input
            type="password"
            {...register('password', {
              required: 'La contraseña es requerida',
              minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
            })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-sm"
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="text-xs text-center text-slate-500">
          ¿Ya tiene cuenta?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline font-medium"
          >
            Iniciar sesión
          </button>
        </p>
      </form>
    </div>
  );
};
