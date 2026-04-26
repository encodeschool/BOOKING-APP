import { useState } from "react";
import { getStaffApi, createStaffApi } from "./api";
import { useAuth } from "../auth/useAuth";
import { useBusiness } from "../business/businessContext";

export function useStaff() {
  const { token } = useAuth();
  const { selectedBusinessId } = useBusiness();
  const [staff, setStaff] = useState([]);

  async function loadStaff() {
    if (!selectedBusinessId) return;
    const data = await getStaffApi(token, selectedBusinessId);
    setStaff(data);
  }

  async function createStaff(body) {
    const created = await createStaffApi(token, {
      ...body,
      businessId: Number(selectedBusinessId),
    });
    setStaff((prev) => [...prev, created]);
  }

  return { staff, loadStaff, createStaff };
}