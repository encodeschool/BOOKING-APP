import { useState } from "react";
import { getBookingsApi, updateBookingStatusApi } from "./api";
import { useAuth } from "../auth/useAuth";
import { useBusiness } from "../business/businessContext";

export function useBookings() {
  const { token } = useAuth();
  const { selectedBusinessId } = useBusiness();
  const [bookings, setBookings] = useState([]);

  async function loadBookings() {
    if (!selectedBusinessId) return;
    const data = await getBookingsApi(token, selectedBusinessId);
    setBookings(data);
  }

  async function updateStatus(id, body) {
    const updated = await updateBookingStatusApi(token, id, body);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? updated : b))
    );
  }

  return { bookings, loadBookings, updateStatus };
}