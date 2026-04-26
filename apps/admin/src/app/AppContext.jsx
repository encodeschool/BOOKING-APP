import { createContext, useContext, useEffect, useState } from "react";
import {
  getBusinesses,
  getProfile,
  getServices,
  getStaff,
  getBusinessBookings,
  getWorkingHours,
} from "../lib/api";

const AppContext = createContext();

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const EMPTY_HOURS = DAYS.reduce((acc, day) => {
  acc[day] = {
    dayOfWeek: day,
    startTime: "09:00",
    endTime: "18:00",
    isClosed: false,
  };
  return acc;
}, {});

export function AppProvider({ children, token }) {
  const [profile, setProfile] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [workingHours, setWorkingHours] = useState(EMPTY_HOURS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedBusiness = businesses.find(
    (item) => String(item.id) === String(selectedBusinessId)
  ) || null;

  // Load initial data
  useEffect(() => {
    if (token) {
      bootstrap(token);
    }
  }, [token]);

  // Reload data when business changes
  useEffect(() => {
    if (selectedBusinessId && token) {
      loadBusinessData(token, selectedBusinessId);
    }
  }, [selectedBusinessId, token]);

  async function bootstrap(activeToken) {
    try {
      setLoading(true);
      setError("");

      const [profileData, businessesData] = await Promise.all([
        getProfile(activeToken),
        getBusinesses(activeToken),
      ]);

      setProfile(profileData);
      setBusinesses(businessesData);

      // Auto-select first business if available
      if (businessesData.length > 0 && !selectedBusinessId) {
        setSelectedBusinessId(String(businessesData[0].id));
      }
    } catch (err) {
      setError(err.message || "Failed to load application data");
    } finally {
      setLoading(false);
    }
  }

  async function loadBusinessData(activeToken, businessId) {
    try {
      const [servicesData, staffData, bookingsData, hoursData] = await Promise.all([
        getServices(activeToken, businessId),
        getStaff(activeToken, businessId),
        getBusinessBookings(activeToken, businessId),
        getWorkingHours(activeToken, businessId),
      ]);

      setServices(servicesData);
      setStaff(staffData);
      setBookings(bookingsData);
      setWorkingHours(hoursData || EMPTY_HOURS);
    } catch (err) {
      console.error("Failed to load business data:", err);
    }
  }

  // Helper functions
  const serviceName = (id) => {
    const match = services.find((item) => item.id === id);
    return match?.name || `Service #${id}`;
  };

  const staffName = (id) => {
    const match = staff.find((item) => item.id === id);
    return match?.name || `Staff #${id}`;
  };

  const statValue = (status) => {
    return bookings.filter((item) => item.status === status).length;
  };

  const refreshData = () => {
    if (token && selectedBusinessId) {
      loadBusinessData(token, selectedBusinessId);
    }
  };

  const value = {
    // State
    profile,
    businesses,
    selectedBusinessId,
    selectedBusiness,
    services,
    staff,
    bookings,
    workingHours,
    loading,
    error,

    // Actions
    setSelectedBusinessId,
    setBusinesses,
    setServices,
    setStaff,
    setBookings,
    setWorkingHours,
    setError,
    refreshData,

    // Helpers
    serviceName,
    staffName,
    statValue,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}