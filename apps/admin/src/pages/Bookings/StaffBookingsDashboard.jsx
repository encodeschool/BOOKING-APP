import { useEffect, useState } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { CheckCircle, XCircle, Clock, Calendar, User, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function StaffBookingsDashboard() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected, all

  useEffect(() => {
    fetchStaffBookings();
  }, [token]);

  const fetchStaffBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/bookings/staff/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      toast.error(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "CONFIRMED",
          reason: "Approved by staff",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve booking");
      }

      toast.success("Booking approved!");
      setSelectedBooking(null);
      fetchStaffBookings();
    } catch (error) {
      toast.error(error.message || "Failed to approve booking");
    }
  };

  const handleReject = async (bookingId) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "REJECTED",
          reason: rejectionReason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject booking");
      }

      toast.success("Booking rejected");
      setSelectedBooking(null);
      setRejectionReason("");
      fetchStaffBookings();
    } catch (error) {
      toast.error(error.message || "Failed to reject booking");
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold flex items-center gap-1"><Clock size={14} /> Pending</span>;
      case "CONFIRMED":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-1"><CheckCircle size={14} /> Approved</span>;
      case "REJECTED":
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold flex items-center gap-1"><XCircle size={14} /> Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and approve your appointments</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {["pending", "approved", "rejected", "all"].map((status) => (
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
                ({filteredBookings.length})
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No bookings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Customer: {booking.customerName || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Calendar size={14} className="inline mr-1" />
                          {formatDate(booking.bookingDate)} at {booking.startTime}
                        </p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                          <Mail size={14} />
                          {booking.customerEmail || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                          <Phone size={14} />
                          {booking.customerPhone || "-"}
                        </p>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">
                          <strong>Notes:</strong> {booking.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 ml-4">
                    {getStatusBadge(booking.status)}

                    {booking.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => setSelectedBooking(booking.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejection Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Booking</h3>
              <p className="text-gray-600 mb-4">Please provide a reason for rejection:</p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="4"
                placeholder="Enter reason for rejection..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setSelectedBooking(null);
                    setRejectionReason("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedBooking)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Reject Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
