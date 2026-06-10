import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserCircle, Save } from 'lucide-react';
import { apiClient } from '../../../api/apiClient';
import { useAuthStore } from '../../auth/auth.store';
import { Toast } from '../../../components/shared/Toast';
import { useSpecialties } from '../../management/hooks/useEspecialties';
import type { MyProfile, UpdateMyProfileDTO, Specialty } from '../../../types';

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string;
}

export const ProfilePage = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([]);
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; title: string; message: string }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const { data: specialties = [], isLoading: isLoadingSpecs } = useSpecialties();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await apiClient.get<MyProfile>('/users/me');
        setProfile(data);
        reset({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || '',
          licenseNumber: data.professionalProfile?.licenseNumber || '',
        });
        if (data.professionalProfile?.specialties) {
          setSelectedSpecialties(data.professionalProfile.specialties.map((s) => s.id));
        }
      } catch {
        setToast({
          show: true,
          type: 'error',
          title: 'Error',
          message: 'No se pudo cargar tu perfil. Intenta nuevamente.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const handleSpecToggle = (id: number) => {
    setSelectedSpecialties((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const onSubmit = async (formValues: ProfileFormValues) => {
    setSaving(true);
    setToast({ show: false, type: 'success', title: '', message: '' });

    try {
      const payload: UpdateMyProfileDTO = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email || undefined,
      };

      if (profile?.role === 'PROFESSIONAL') {
        payload.licenseNumber = formValues.licenseNumber || undefined;
        payload.specialtyIds = selectedSpecialties;
      }

      const { data } = await apiClient.patch<MyProfile>('/users/me', payload);
      setProfile(data);

      if (accessToken) {
        setSession(accessToken, {
          userId: data.userId,
          dni: data.dni,
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
          clinicId: data.clinicId ?? 0,
        });
      }

      setToast({
        show: true,
        type: 'success',
        title: 'Perfil actualizado',
        message: 'Tus datos se guardaron correctamente.',
      });
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Ocurrió un error al guardar los cambios.';
      setToast({
        show: true,
        type: 'error',
        title: 'Error al guardar',
        message: Array.isArray(message) ? message.join(', ') : message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          No se pudo cargar la información del perfil.
        </div>
      </div>
    );
  }

  const isProfessional = profile.role === 'PROFESSIONAL';
  const isAdmin = profile.role === 'ADMIN';
  const specialtiesList = Array.isArray(specialties) ? (specialties as Specialty[]) : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Toast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-3xs">
          <UserCircle size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Mi Perfil</h1>
          <p className="text-slate-500 text-xs font-medium">Gestiona tus datos personales y profesionales.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
        {/* DNI (read-only) */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">DNI</label>
          <input
            value={profile.dni}
            readOnly
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
          />
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
              pattern: { value: /^\S+@\S+$/i, message: 'El formato del email no es válido' },
            })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-sm"
            placeholder="tu@correo.com"
          />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>

        {/* Role-specific fields */}

        {isProfessional && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Matrícula (MN/MP)</label>
              <input
                {...register('licenseNumber')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-sm"
                placeholder="Ej. MN12345"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Especialidades Médicas</label>
              {isLoadingSpecs ? (
                <p className="text-xs text-slate-400">Cargando catálogo...</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-28 overflow-y-auto border border-slate-200 p-2.5 rounded-lg bg-slate-50/50">
                  {specialtiesList.map((spec) => (
                    <label key={spec.id} className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-slate-900 select-none text-xs">
                      <input
                        type="checkbox"
                        checked={selectedSpecialties.includes(spec.id)}
                        onChange={() => handleSpecToggle(spec.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                      />
                      {spec.name}
                    </label>
                  ))}
                  {specialtiesList.length === 0 && (
                    <p className="text-xs text-slate-400 col-span-2 text-center py-1">No hay especialidades cargadas.</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {isAdmin && profile.clinic && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Clínica / Centro</label>
            <input
              value={profile.clinic.name}
              readOnly
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
            />
          </div>
        )}

        {profile.role === 'PATIENT' && profile.coverage && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Obra Social / Cobertura</label>
            <input
              value={profile.coverage.name}
              readOnly
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
            />
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Save size={16} />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};
