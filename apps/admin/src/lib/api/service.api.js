import { request } from "./http";

export const getServicesApi = (token, businessId) =>
  request(`/api/services/business/${businessId}`, { token });

export const createServiceApi = (token, body) =>
  request("/api/services", {
    method: "POST",
    token,
    body,
  });