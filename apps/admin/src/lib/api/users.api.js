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

export const createUserApi = (body) =>
  request(`/api/auth/register`, {
    method: "POST",
    body,
  });

export const updateUserRoleApi = (token, userId, role) =>
  request(`/api/users/${userId}/role`, {
    method: "PUT",
    token,
    body: { role },
  });

export const updateUserApi = (token, userId, body) =>
  request(`/api/users/${userId}`, {
    method: "PUT",
    token,
    body,
  });

export const deleteUserApi = (token, userId) =>
  request(`/api/users/${userId}`, {
    method: "DELETE",
    token,
  });