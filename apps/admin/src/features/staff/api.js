import { request } from "../../lib/api";

export const getStaffApi = (token, businessId) =>
  request(`/api/staff/business/${businessId}`, { token });

export const createStaffApi = (token, body) =>
  request("/api/staff", {
    method: "POST",
    token,
    body,
  });