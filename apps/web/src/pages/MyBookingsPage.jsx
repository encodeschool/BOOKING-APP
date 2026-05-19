import { useEffect, useState } from "react";
import { useAuth } from "../app/providers/AuthProvider";

export default function MyBookingsPage() {
  const { token, role, profile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!token || !role) return;
    fetchBookings();
  }, [token, role, profile?.email]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      let allBookings = [];

      if (role === "STAFF") {
        // Staff: fetch staff bookings
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/bookings/staff/me`,
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
        allBookings = Array.isArray(data) ? data : [];
      } else {
        // CLIENT: fetch both authenticated bookings and email-based bookings
        const [authRes, emailRes] = await Promise.all([
          fetch(
            `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/bookings/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          // Fetch email-based bookings if profile email exists
          profile?.email
            ? fetch(
                `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/bookings/by-email?email=${encodeURIComponent(profile.email)}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
            : Promise.resolve(null),
        ]);

        if (!authRes.ok) {
          const body = await authRes.json().catch(() => ({}));
          throw new Error(body?.message || "Failed to fetch bookings");
        }

        const authData = await authRes.json();
        const authBookings = Array.isArray(authData) ? authData : [];

        let emailBookings = [];
        if (emailRes && emailRes.ok) {
          const emailData = await emailRes.json();
          emailBookings = Array.isArray(emailData) ? emailData : [];
        } else if (emailRes && !emailRes.ok && emailRes.status !== 404) {
          // Log the error but don't fail the entire fetch
          console.warn("Failed to fetch email-based bookings");
        }

        // Merge and deduplicate: combine authenticated and email bookings
        const bookingMap = new Map();
        
        authBookings.forEach(booking => {
          bookingMap.set(booking.id, { ...booking, source: 'authenticated' });
        });

        emailBookings.forEach(booking => {
          if (!bookingMap.has(booking.id)) {
            bookingMap.set(booking.id, { ...booking, source: 'email' });
          }
        });

        allBookings = Array.from(bookingMap.values()).sort((a, b) => 
          new Date(`${b.bookingDate}T${b.startTime || '00:00'}`) - 
          new Date(`${a.bookingDate}T${a.startTime || '00:00'}`)
        );
      }

      setBookings(allBookings);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    switch (filter) {
      case "pending":
        return bookings.filter(b => b.status === "PENDING");
      case "approved":
        return bookings.filter(b => b.status === "CONFIRMED");
      case "rejected":
        return bookings.filter(b => b.status === "REJECTED");
      default:
        return bookings;
    }
  };

  const getCountFor = (status) => {
    if (!bookings) return 0;
    switch (status) {
      case "pending":
        return bookings.filter(b => b.status === "PENDING").length;
      case "approved":
        return bookings.filter(b => b.status === "CONFIRMED").length;
      case "rejected":
        return bookings.filter(b => b.status === "REJECTED").length;
      default:
        return bookings.length;
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-semibold border-b-2 transition-all ${
              filter === status
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-sm">
              ({getCountFor(status)})
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading bookings...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No {filter !== "all" ? filter : ""} bookings found.</p>
            {role !== "STAFF" && (
              <p className="text-sm mt-2">
                Bookings made with your email will appear here once you sign in.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    {/* Service & Date */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {booking.service?.name || booking.serviceId || "Unknown Service"}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      📅 {booking.bookingDate} at {booking.startTime || "TBD"}
                    </p>

                    {/* Staff Name */}
                    {booking.staff?.name && (
                      <p className="text-gray-600 mb-3">
                        👤 with {booking.staff.name}
                      </p>
                    )}

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                      {booking.source === 'email' && (
                        <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded">
                          Claimed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="text-sm bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                    <p className="font-semibold text-gray-700 mb-1">Notes:</p>
                    <p className="text-gray-600">{booking.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
