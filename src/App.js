// App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';
import { ChatProvider } from './context/ChatContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { HealthProvider } from './context/HealthContext';
import { MedicationProvider } from './context/MedicationContext';
import { DependentProvider } from './context/DependentContext';
import { useAuth } from './hooks/useAuth';

// Import pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyAccountPage from './pages/auth/VerifyAccountPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/not-found/NotFoundPage';

// Import document pages
import DocumentsListPage from './pages/documents/DocumentsListPage';
import DocumentViewPage from './pages/documents/DocumentViewPage';
import DocumentUploadPage from './pages/documents/DocumentUploadPage';

// Import chat pages
import ChatPage from './pages/chat/ChatPage';

// Import appointment pages
import AppointmentsListPage from './pages/appointments/AppointmentsListPage';
import AppointmentCreatePage from './pages/appointments/AppointmentCreatePage';
import AppointmentViewPage from './pages/appointments/AppointmentViewPage';
import AppointmentEditPage from './pages/appointments/AppointmentEditPage';
import ProviderSearchPage from './pages/appointments/ProviderSearchPage';
import ProviderDetailPage from './pages/appointments/ProviderDetailPage';

// Import health insights pages
import HealthInsightsPage from './pages/insights/HealthInsightsPage';
import MetricDetailPage from './pages/insights/MetricDetailPage';
import MetricInputPage from './pages/insights/MetricInputPage';

// Import medication pages
import MedicationsListPage from './pages/medications/MedicationsListPage';
import MedicationDetailPage from './pages/medications/MedicationDetailPage';
import MedicationAddPage from './pages/medications/MedicationAddPage';
import MedicationEditPage from './pages/medications/MedicationEditPage';
import MedicationReminderPage from './pages/medications/MedicationReminderPage';

// Import patient management pages
import PatientsListPage from './pages/patients/PatientsListPage';
import AddPatientPage from './pages/patients/AddPatientPage';
import PatientProfilePage from './pages/patients/PatientProfilePage';

// Import settings pages
import SettingsPage from './pages/settings/SettingsPage';

// Import layout components
import BaseLayout from './components/layout/BaseLayout';

import DemoPage from './pages/demo/DemoPage';

// Import global styles
import './styles/global.css';

// Protected route component that checks authentication status
const ProtectedRoute = ({
  children,
  requireVerification = true,
  allowedRoles = [],
}) => {
  // eslint-disable-next-line no-unused-vars
  const { user, loading, isCaregiver } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking auth status
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but not verified, redirect to verification
  if (
    requireVerification &&
    !user.verified &&
    location.pathname !== '/verify-account'
  ) {
    return <Navigate to="/verify-account" replace />;
  }

  // Check if role is allowed (if specified)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// App routes component - separate from main App to access auth context
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Semi-protected route - only for authenticated but unverified users */}
      <Route
        path="/verify-account"
        element={
          !user ? <Navigate to="/login" replace /> : <VerifyAccountPage />
        }
      />

      {/* Protected routes with BaseLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <DashboardPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <ProfilePage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      {/* Document management routes */}
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <DocumentsListPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents/view/:id"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <DocumentViewPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents/upload"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <DocumentUploadPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      {/* Chat routes */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <ChatPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      {/* Appointment routes */}
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <AppointmentsListPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments/create"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <AppointmentCreatePage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments/view/:id"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <AppointmentViewPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments/edit/:id"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <AppointmentEditPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments/providers"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <ProviderSearchPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments/providers/:id"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <ProviderDetailPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      {/* Medication routes */}
      <Route
        path="/medications"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <MedicationsListPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/medications/view/:id"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <MedicationDetailPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/medications/add"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <MedicationAddPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/medications/edit/:id"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <MedicationEditPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/medications/reminders"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <MedicationReminderPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      {/* Health Insights routes */}
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <HealthInsightsPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/insights/metric/:metricType"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <MetricDetailPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/insights/input"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <MetricInputPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      {/* Patient management routes for caregivers */}
      <Route
        path="/patients"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <PatientsListPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/add"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <AddPatientPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      {/* Patient profile route */}
      <Route
        path="/patients/profile/:id"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <PatientProfilePage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      {/* Settings route */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <BaseLayout>
              <SettingsPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      {/* Patient-specific routes for caregivers */}
      <Route
        path="/patient/:patientId/dashboard"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <DashboardPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/documents"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <DocumentsListPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/documents/view/:id"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <DocumentViewPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/documents/upload"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <DocumentUploadPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/appointments"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <AppointmentsListPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/appointments/create"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <AppointmentCreatePage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/appointments/view/:id"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <AppointmentViewPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/appointments/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <AppointmentEditPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/medications"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <MedicationsListPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/medications/view/:id"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <MedicationDetailPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/medications/add"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <MedicationAddPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/medications/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <MedicationEditPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/medications/reminders"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <MedicationReminderPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/insights"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <HealthInsightsPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/insights/metric/:metricType"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <MetricDetailPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:patientId/insights/input"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BaseLayout>
              <MetricInputPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DependentProvider>
          <DocumentProvider>
            <ChatProvider>
              <AppointmentProvider>
                <HealthProvider>
                  <MedicationProvider>
                    <Router>
                      <AppRoutes />
                    </Router>
                  </MedicationProvider>
                </HealthProvider>
              </AppointmentProvider>
            </ChatProvider>
          </DocumentProvider>
        </DependentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
