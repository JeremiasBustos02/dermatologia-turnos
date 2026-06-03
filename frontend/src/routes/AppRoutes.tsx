import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { Dashboard } from '../features/appointments/views/Dashboard';
import { Login } from '../features/auth/views/Login';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<div>Vista de Turnos</div>} />
          <Route path="/patients" element={<div>Vista de Pacientes</div>} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};