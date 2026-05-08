const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const payload = await response.json();
      if (payload?.message) {
        message = payload.message;
      } else if (payload?.error) {
        message = payload.error;
      }
    } catch {
      // ignore parse failure
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function login(credentials) {
  return request("/api/auth/login", { method: "POST", body: credentials });
}

export async function getProfile(token) {
  return request("/api/users/me", { token });
}

export async function getBusinesses(token) {
  return request("/api/businesses", { token });
}

export async function createBusiness(token, body) {
  return request("/api/businesses", { method: "POST", token, body });
}

export async function getServices(token, businessId) {
  return request(`/api/services/business/${businessId}`, { token });
}

export async function createService(token, body) {
  return request("/api/services", { method: "POST", token, body });
}

export async function getStaff(token, businessId) {
  return request(`/api/staff/business/${businessId}`, { token });
}

export async function createStaff(token, body) {
  return request("/api/staff", { method: "POST", token, body });
}

export async function getWorkingHours(token, businessId) {
  return request(`/api/working-hours/${businessId}`, { token });
}

export async function saveWorkingHours(token, body) {
  return request("/api/working-hours", { method: "POST", token, body });
}

export async function getBusinessBookings(token, businessId) {
  return request(`/api/bookings/business/${businessId}`, { token });
}

export async function updateBookingStatus(token, bookingId, body) {
  return request(`/api/bookings/${bookingId}/status`, {
    method: "PATCH",
    token,
    body,
  });
}

export async function getStaffWorkingHours(
  token,
  staffId
) {
  const res = await fetch(
    `${API_BASE_URL}/api/staff/working-hours/staff/${staffId}/owner`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load working hours");
  }

  return res.json();
}

export async function saveStaffWorkingHours(
  token,
  data
) {
  const res = await fetch(
    `${API_BASE_URL}/api/staff/working-hours`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to save working hours");
  }

  return res.json();
}

export { API_BASE_URL };
