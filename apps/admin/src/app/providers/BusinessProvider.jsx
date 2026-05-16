import { createContext, useContext, useEffect, useState } from "react";
import { getBusinessesApi } from "@/lib/api/business.api";
import { useAuth } from "./AuthProvider";

const BusinessContext = createContext();

export default function BusinessProvider({ children }) {
  const { token } = useAuth();
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
      setBusinesses(data || []);

      if (data?.length > 0 && !selectedBusinessId) {
        setSelectedBusinessId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load businesses:", error);
      setBusinesses([]);
      setSelectedBusinessId(null);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

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