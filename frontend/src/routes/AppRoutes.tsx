import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { Dashboard } from '../features/appointments/views/Dashboard';
import { Login } from '../features/auth/views/Login';
import { ProfessionalsPage } from '../features/professionals/views/ProfessionalsPage';
import { PatientsPage } from '../features/patients/views/PatientsPage';
import { ProfessionalSchedulesPage } from '../features/schedules/views/ProfessionalSchedulesPage';
import { NewAppointmentPage } from '../features/appointments/views/NewAppointmentPage';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/appointments" element={<div>Vista de Turnos</div>} />
                    <Route path="/appointments/new" element={<NewAppointmentPage />} />
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/professionals" element={<ProfessionalsPage />} />
                    <Route path="/professionals/:id/schedules" element={<ProfessionalSchedulesPage />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Route>
        </Routes>
    );
};