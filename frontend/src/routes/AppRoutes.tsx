import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from '../features/auth/views/Login';
import { Dashboard } from '../features/appointments/views/Dashboard';
import { DashboardLayout } from '../layouts/DashboardLayout';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* <Route path="/patients" element={<PatientsList />} /> */}
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};