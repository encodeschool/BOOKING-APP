import { useState } from "react";
import { getServicesApi, createServiceApi } from "./api";
import { useAuth } from "../auth/useAuth";
import { useBusiness } from "../business/businessContext";

export function useServices() {
  const { token } = useAuth();
  const { selectedBusinessId } = useBusiness();
  const [services, setServices] = useState([]);

  async function loadServices() {
    if (!selectedBusinessId) return;
    const data = await getServicesApi(token, selectedBusinessId);
    setServices(data);
  }

  async function createService(body) {
    const created = await createServiceApi(token, {
      ...body,
      businessId: Number(selectedBusinessId),
    });
    setServices((prev) => [...prev, created]);
  }

  return { services, loadServices, createService };
}