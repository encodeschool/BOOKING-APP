import { createContext, useContext, useEffect, useState } from "react";
import { getBusinessesApi } from "@/lib/api/business.api";
import { useAuth } from "./AuthProvider";

const BusinessContext = createContext();

export default function BusinessProvider({ children }) {
  const { token } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  const load = async () => {
    if (!token) return;
    const data = await getBusinessesApi(token);
    setBusinesses(data);
    if (data.length > 0 && !selectedBusinessId) {
      setSelectedBusinessId(data[0].id);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  return (
    <BusinessContext.Provider value={{ businesses, selectedBusinessId, setSelectedBusinessId, load }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}