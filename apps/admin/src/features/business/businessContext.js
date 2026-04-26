import { createContext, useContext, useState } from "react";
import { getBusinessesApi } from "./api";
import { useAuth } from "../auth/useAuth";

const BusinessContext = createContext();

export function BusinessProvider({ children }) {
  const { token } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");

  async function loadBusinesses() {
    const data = await getBusinessesApi(token);
    setBusinesses(data);

    if (data.length && !selectedBusinessId) {
      setSelectedBusinessId(data[0].id);
    }
  }

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        selectedBusinessId,
        setSelectedBusinessId,
        loadBusinesses,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}