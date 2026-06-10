import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PatientPortalLayout } from '../layouts/PatientPortalLayout';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { Dashboard } from '../features/appointments/views/Dashboard';
import { Login } from '../features/auth/views/Login';
import { SetupPasswordPage } from '../features/auth/views/SetupPasswordPage';
import { ProfessionalsPage } from '../features/professionals/views/ProfessionalsPage';
import { PatientsPage } from '../features/patients/views/PatientsPage';
import { ProfessionalSchedulesPage } from '../features/schedules/views/ProfessionalSchedulesPage';
import { NewAppointmentPage } from '../features/appointments/views/NewAppointmentPage';
import { AppointmentsHistoryPage } from '../features/appointments/views/AppointmentsHistoryPage';
import { Management } from '../features/management/views/Management';
import { SysAdminDashboard } from '../features/clinics/views/SysAdminDashboard';
import { PatientPortalDashboard } from '../features/patients/views/PatientsPortalDashboard';
import { PatientNewAppointment } from '../features/patients/views/PatientNewAppointment';
import { useAuthStore } from '../features/auth/auth.store';
import { RoleSwitcherDevTool } from '../components/dev/RoleSwitcherDevTool';

export const AppRoutes = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/setup-password" element={<SetupPasswordPage />} />

      {/* =========================================================
          MÓDULO CLÍNICO / BACKOFFICE
          Accesible solo por ADMIN, RECEPTIONIST o PROFESSIONAL
         ========================================================= */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']} />}>
        <Route element={<DashboardLayout />}>
          {/* Rutas compartidas por el staff */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<AppointmentsHistoryPage />} />
          <Route path="/appointments/new" element={<NewAppointmentPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          
          {/* Rutas exclusivas del Administrador */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/professionals" element={<ProfessionalsPage />} />
            <Route path="/professionals/:id/schedules" element={<ProfessionalSchedulesPage />} />
            <Route path="/management" element={<Management />} />
          </Route>
        </Route>
      </Route>

      {/* =========================================================
          MÓDULO SÚPER ADMINISTRADOR
          Panel independiente para el dueño del SaaS
         ========================================================= */}
      <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN']} />}>
        <Route path="/sysadmin" element={<SysAdminDashboard />} />
      </Route>

      {/* =========================================================
          MÓDULO PORTAL DEL PACIENTE
          Totalmente aislado del backoffice
         ========================================================= */}
      <Route element={<ProtectedRoute allowOnlyPatients={true} />}>
        <Route element={<PatientPortalLayout />}>
          <Route path="/portal">
            <Route path="dashboard" element={<PatientPortalDashboard />} />
            <Route path="appointments/new" element={<PatientNewAppointment />} />
          </Route>
        </Route>
      </Route>

      {/* =========================================================
          REDIRECCIÓN DE LA RAÍZ (/) BASADA EN ROLES
         ========================================================= */}
      <Route 
        path="/" 
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : user?.role === 'SUPERADMIN' ? (
            <Navigate to="/sysadmin" replace />
          ) : user?.role === 'PATIENT' ? (
            <Navigate to="/portal/dashboard" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } 
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>

      <RoleSwitcherDevTool />
    </>
  );
};