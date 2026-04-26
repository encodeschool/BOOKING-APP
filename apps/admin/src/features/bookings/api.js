import { request } from "../../lib/api";

export const getBookingsApi = (token, businessId) =>
  request(`/api/bookings/business/${businessId}`, { token });

export const updateBookingStatusApi = (token, id, body) =>
  request(`/api/bookings/${id}/status`, {
    method: "PATCH",
    token,
    body,
  });