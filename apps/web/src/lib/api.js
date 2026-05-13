const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

class ApiClient {
  async request(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      let message = `Request failed: ${response.status}`;

      try {
        const data = await response.json();
        message = data?.message || data?.error || message;
      } catch {}

      throw new Error(message);
    }

    if (response.status === 204) return null;

    return response.json();
  }

  // Public endpoints
  async getBusinesses() {
    return this.request("/api/businesses/public");
  }

  async getServices(businessId) {
    return this.request(`/api/services/public/business/${businessId}`);
  }

  async getStaff(businessId) {
    return this.request(`/api/staff/public/business/${businessId}`);
  }

  async createBooking(bookingData) {
    return this.request("/api/bookings/public", {
      method: "POST",
      body: bookingData,
    });
  }

  async getAvailableSlots(businessId, serviceId, date) {
    return this.request(`/api/bookings/available-slots?businessId=${businessId}&serviceId=${serviceId}&date=${date}`);
  }

  async getAvailableDates(businessId, serviceId, staffId) {
    const params = new URLSearchParams({
      businessId,
      serviceId,
      ...(staffId && { staffId }),
    });
    return this.request(`/api/bookings/available-dates?${params}`);
  }

  async getStaffBookings(token) {
    return this.request("/api/bookings/staff/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  }

  async approveBooking(bookingId, token) {
    return this.request(`/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: {
        status: "CONFIRMED",
        reason: "Approved by staff",
      },
    });
  }

  async rejectBooking(bookingId, reason, token) {
    return this.request(`/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: {
        status: "REJECTED",
        reason: reason || "Rejected by staff",
      },
    });
  }
  async getStaffWorkingHours(staffId) {
    return this.request(`/api/staff/public/${staffId}`);
  }

  // Auth endpoints
  async register(email, password) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: { email, password },
    });
  }

  async login(email, password) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
  }

  async forgotPassword(email) {
    return this.request("/api/auth/forgot-password", {
      method: "POST",
      body: { email },
    });
  }

  async resetPassword(token, newPassword) {
    return this.request("/api/auth/reset-password", {
      method: "POST",
      body: { token, newPassword },
    });
  }

  // Notification endpoints (for triggering notifications)
  async sendBookingReminder(bookingId, token) {
    return this.request(`/api/notifications/booking/${bookingId}/reminder`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  }

  async sendCustomNotification(notificationData, token) {
    return this.request("/api/notifications/email", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: notificationData,
    });
  }
}

export const apiClient = new ApiClient();