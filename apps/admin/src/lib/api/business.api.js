import { request } from "./http";

export const getBusinessesApi = (token) =>
  request("/api/businesses", { token });

export const createBusinessApi = (token, body) =>
  request("/api/businesses", {
    method: "POST",
    token,
    body,
  });

export const updateBusinessApi = (token, id, body) =>
  request(`/api/businesses/${id}`, {
    method: "PUT",
    token,
    body,
  });

export const deleteBusinessApi = (token, id) =>
  request(`/api/businesses/${id}`, {
    method: "DELETE",
    token,
  });

export const addBusinessImagesApi = (token, id, body) =>
  request(`/api/businesses/${id}/images`, {
    method: "POST",
    token,
    body,
  });

export const deleteBusinessImageApi = (token, imageId) =>
  request(`/api/businesses/images/${imageId}`, {
    method: "DELETE",
    token,
  });