import { useEffect, useState } from "react";
import { useAuth } from "../app/providers/AuthProvider";

export default function MyBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/bookings/client/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data || []);
    } catch (err) {
      console.error(err);
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
        ) : bookings.length === 0 ? (
          <div>No bookings found.</div>
        ) : (
          <ul className="space-y-4">
            {bookings.map((b) => (
              <li key={b.id} className="border p-4 rounded">
                <div><strong>Service:</strong> {b.serviceName}</div>
                <div><strong>Date:</strong> {b.date}</div>
                <div><strong>Status:</strong> {b.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
