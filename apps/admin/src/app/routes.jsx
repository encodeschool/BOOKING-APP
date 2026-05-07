import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import BusinessPage from "../pages/Business/BusinessPage";
import ServicesPage from "../pages/Services/ServicesPage";
import StaffPage from "../pages/Staff/StaffPage";
import BookingsPage from "../pages/Bookings/BookingsPage";
import StaffBookingsDashboard from "../pages/Bookings/StaffBookingsDashboard";
import SettingsPage from "../pages/Settings/WorkingHoursPage";
import UsersPage from "../pages/Users/UsersPage";
import CalendarPage from "../pages/Calendar/CalendarPage";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("admin-token");
  return token ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/businesses"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BusinessPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ServicesPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <StaffPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BookingsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <StaffBookingsDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <UsersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <CalendarPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SettingsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;