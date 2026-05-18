import { createContext, useContext, useEffect, useState } from "react";
import { getBusinessesApi } from "@/lib/api/business.api";
import { getMyStaff, getBusinessById } from "@/lib/api";
import { useAuth } from "./AuthProvider";

const BusinessContext = createContext();

export default function BusinessProvider({ children }) {
  const { token, profile } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  const selectedBusiness =
    businesses.find(
      (business) => String(business.id) === String(selectedBusinessId)
    ) || null;

  const load = async () => {
    if (!token) return;

    try {
      const data = await getBusinessesApi(token);
      const list = data || [];

      // Fallback for staff users: if no businesses returned, try fetching staff record
      if (list.length === 0 && profile?.role === "STAFF") {
        try {
          const staff = await getMyStaff(token);
          if (staff && staff.length > 0 && staff[0].businessId) {
            const business = await getBusinessById(token, staff[0].businessId);
            if (business) {
              setBusinesses([business]);
              if (!selectedBusinessId) setSelectedBusinessId(business.id);
              return;
            }
          }
        } catch (e) {
          console.warn("Failed to load staff business fallback:", e);
        }
      }

      setBusinesses(list);

      if (list.length > 0 && !selectedBusinessId) {
        setSelectedBusinessId(list[0].id);
      }
    } catch (error) {
      console.error("Failed to load businesses:", error);
      setBusinesses([]);
      setSelectedBusinessId(null);
    }
  };

  useEffect(() => {
    load();
  }, [token, profile]);

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        setBusinesses,
        selectedBusinessId,
        setSelectedBusinessId,
        selectedBusiness,
        load,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}