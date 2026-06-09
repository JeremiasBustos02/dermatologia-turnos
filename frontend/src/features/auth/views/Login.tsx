import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth.store';
import { apiClient } from '../../../api/apiClient';

export const Login = () => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');

  // Traemos setToken y también setSession
  const { setToken, setSession } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await apiClient.post('/auth/login', {
        dni,
        password,
      });

      localStorage.setItem('refreshToken', data.refreshToken);
      setToken(data.accessToken); 

      const userResponse = await apiClient.get('/auth/me');

      setSession(data.accessToken, userResponse.data);

      navigate('/dashboard');
    } catch (error) {
      alert('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-8 rounded-xl shadow-sm border border-slate-200 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          Bienvenido a Lumera
        </h2>

        <input
          type="text"
          placeholder="DNI"
          className="w-full p-3 mb-4 border rounded-md"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 mb-6 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-primary-600 text-white p-3 rounded-lg hover:bg-blue-700">
          Ingresar
        </button>
      </form>
    </div>
  );
};