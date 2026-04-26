import { useEffect, useState } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { useBusiness } from "../../app/providers/BusinessProvider";
import { getBusinessBookings, updateBookingStatus } from "../../lib/api";

export default function BookingsPage() {
  const { token } = useAuth();
  const { selectedBusinessId } = useBusiness();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && selectedBusinessId) {
      load();
    }
  }, [token, selectedBusinessId]);

  async function load() {
    try {
      setLoading(true);
      const data = await getBusinessBookings(token, selectedBusinessId);
      setBookings(data || []);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id, status) {
    try {
      const updated = await updateBookingStatus(token, id, {
        status,
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? updated : b))
      );
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
        <button
          onClick={() => alert("Manual booking creation not implemented yet")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span> Add Booking
        </button>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading bookings...</p>
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{booking.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.status !== 'CONFIRMED' && (
                    <button
                      onClick={() => changeStatus(booking.id, "CONFIRMED")}
                      className="text-green-600 hover:text-green-900 mr-2"
                    >
                      Confirm
                    </button>
                  )}
                  {booking.status !== 'CANCELLED' && (
                    <button
                      onClick={() => changeStatus(booking.id, "CANCELLED")}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No bookings found.
          </div>
        )}
        </div>
      )}
    </div>
  );
}