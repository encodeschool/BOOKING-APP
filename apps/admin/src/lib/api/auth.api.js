import { request } from "./http";

export const loginApi = (body) =>
  request("/api/auth/login", {
    method: "POST",
    body,
  });

export const getProfileApi = (token) =>
  request("/api/users/me", { token });