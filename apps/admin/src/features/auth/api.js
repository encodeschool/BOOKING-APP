import { request } from "../../lib/api";

export function loginApi(credentials) {
  return request("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function getProfileApi(token) {
  return request("/api/users/me", { token });
}