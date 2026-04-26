import { request } from "@/lib/api/http";

export const getBusinesses = (token) =>
  request("/api/businesses", { token });

export const createBusiness = (token, body) =>
  request("/api/businesses", {
    method: "POST",
    token,
    body,
  });