import { request } from "./http";

export const getUsersApi = (
  token
) =>
  request("/api/users", {
    token,
  });

export const getMeApi = (
  token
) =>
  request("/api/users/me", {
    token,
  });

export const updateMeApi = (
  token,
  body
) =>
  request("/api/users/me", {
    method: "PUT",
    token,
    body,
  });