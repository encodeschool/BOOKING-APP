import { useEffect, useState } from "react";
import { useAuth } from "../app/providers/AuthProvider";

export default function MyBookingsPage() {
  const { token, role } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !role) return;
    fetchBookings();
  }, [token, role]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    const endpoint =
      role === "STAFF"
        ? "/api/bookings/staff/me"
        : "/api/bookings/me";

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Failed to fetch bookings");
      }

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
      <div className="bg-white p-6 rounded shadow">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : bookings.length === 0 ? (
          <div>No bookings found.</div>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="border p-4 rounded">
                <div className="mb-2">
                  <span className="font-semibold">Service:</span>{" "}
                  {booking.service?.name || booking.serviceId || "Unknown"}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Date:</span>{" "}
                  {booking.bookingDate} {booking.startTime || ""}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Status:</span>{" "}
                  {booking.status}
                </div>
                <div className="text-sm text-gray-600">
                  {booking.staff?.name && (
                    <span>
                      <span className="font-semibold">Staff:</span>{" "}
                      {booking.staff.name}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
