import { request } from "./http";

export const getServicesApi = (token, businessId) =>
  request(`/api/services/business/${businessId}`, { token });

export const createServiceApi = (token, body) =>
  request("/api/services", {
    method: "POST",
    token,
    body,
  });

export const updateServicesApi = (token, id, body) =>
  request(`/api/services/${id}`, {
    method: "PUT",
    token,
    body
  });


export const deleteServiceApi = (token, id) =>
  request(`/api/services/${id}`, {
    method: "DELETE",
    token
  });