import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Login/RegisterPage";
import ForgotPasswordPage from "../pages/Login/ForgotPasswordPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import BusinessPage from "../pages/Business/BusinessPage";
import ServicesPage from "../pages/Services/ServicesPage";
import StaffPage from "../pages/Staff/StaffPage";
import BookingsPage from "../pages/Bookings/BookingsPage";
import StaffBookingsDashboard from "../pages/Bookings/StaffBookingsDashboard";
import SettingsPage from "../pages/Settings/WorkingHoursPage";
import UsersPage from "../pages/Users/UsersPage";
import CalendarPage from "../pages/Calendar/CalendarPage";

// Role-based route protection
function ProtectedRoute({ children, requiredRoles = [] }) {
  const token = localStorage.getItem("admin-token");
  const userRole = localStorage.getItem("user-role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected - STAFF role */}
      <Route
        path="/"
        element={
          <AdminLayout>
            <DashboardPage />
          </AdminLayout>
        }
      />
      <Route
        path="/businesses"
        element={
          <ProtectedRoute requiredRoles={["STAFF", "ADMIN"]}>
            <AdminLayout>
              <BusinessPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute requiredRoles={["STAFF", "ADMIN"]}>
            <AdminLayout>
              <ServicesPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute requiredRoles={["STAFF", "ADMIN"]}>
            <AdminLayout>
              <StaffPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute requiredRoles={["STAFF", "ADMIN"]}>
            <AdminLayout>
              <BookingsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute requiredRoles={["STAFF", "ADMIN"]}>
            <AdminLayout>
              <StaffBookingsDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      {/* ADMIN-only routes */}
      <Route
        path="/users"
        element={
          <ProtectedRoute requiredRoles={["ADMIN"]}>
            <AdminLayout>
              <UsersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute requiredRoles={["ADMIN", "STAFF"]}>
            <AdminLayout>
              <CalendarPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute requiredRoles={["ADMIN"]}>
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