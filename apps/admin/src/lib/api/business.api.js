import { request } from "./http";

export const getBusinessesApi = (token) =>
  request("/api/businesses", { token });

export const createBusinessApi = (token, body) =>
  request("/api/businesses", {
    method: "POST",
    token,
    body,
  });