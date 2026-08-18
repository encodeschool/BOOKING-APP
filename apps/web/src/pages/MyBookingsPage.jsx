import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, CalendarDays, Clock3, Loader2, PencilLine, Search } from "lucide-react";
import { useAuth } from "../app/providers/AuthProvider";
import { apiClient } from "../lib/api";

const MyBookingsPage = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("Requested by customer");

  useEffect(() => {
    if (!token) return;

    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getMyBookings(token);
        setBookings(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [token]);

  const filteredBookings = useMemo(() => {
    const now = new Date();
    return bookings
      .filter((booking) => {
        const bookingDate = new Date(`${booking.bookingDate}T${booking.startTime}`);
        if (filter === "upcoming") return bookingDate >= now && booking.status !== "CANCELLED";
        if (filter === "archived") return bookingDate < now || booking.status === "CANCELLED";
        return true;
      })
      .filter((booking) => {
        const searchValue = search.trim().toLowerCase();
        if (!searchValue) return true;
        return [
          booking.service?.name,
          booking.business?.name,
          booking.clientName,
          booking.status,
          booking.bookingDate,
          booking.startTime,
        ]
          .filter(Boolean)
          .some((field) => field.toString().toLowerCase().includes(searchValue));
      });
  }, [bookings, filter, search]);

  const handleCancel = async (bookingId) => {
    if (!token) return;
    try {
      const updated = await apiClient.cancelBooking(bookingId, token, "Requested by customer");
      setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? updated : booking)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReschedule = async (bookingId) => {
    if (!token || !rescheduleDate || !rescheduleTime) return;

    try {
      const updated = await apiClient.rescheduleBooking(bookingId, token, {
        bookingDate: rescheduleDate,
        bookingTime: rescheduleTime,
        reason: rescheduleReason || "Requested by customer",
      });

      setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? updated : booking)));
      setReschedulingId(null);
      setRescheduleDate("");
      setRescheduleTime("");
      setRescheduleReason("Requested by customer");
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / rowsPerPage));
  const paginatedBookings = filteredBookings.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">My bookings</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Upcoming reservations</h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Review and manage your scheduled services in one place.</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-[1fr_auto] items-center">
          <div className="flex flex-wrap gap-3">
            {['all','upcoming','archived'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setFilter(value);
                  setPage(1);
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === value ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search bookings"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center rounded-3xl bg-white p-10 text-slate-600">
            <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Loading your appointments...
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {paginatedBookings.map((booking) => (
                <div key={booking.id} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-primary-600">Booking #{booking.id}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{booking.service?.name || booking.serviceName || 'Service'}</h2>
                      <p className="mt-2 text-slate-600">{booking.business?.name || booking.businessName || 'Business'}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-3xl bg-slate-50 p-4 text-slate-700">
                        <p className="text-xs uppercase tracking-[0.3em]">Date</p>
                        <p className="mt-2 font-semibold text-slate-900">{booking.bookingDate}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-4 text-slate-700">
                        <p className="text-xs uppercase tracking-[0.3em]">Time</p>
                        <p className="mt-2 font-semibold text-slate-900">{booking.startTime}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-4 text-slate-700">
                        <p className="text-xs uppercase tracking-[0.3em]">Status</p>
                        <p className="mt-2 flex items-center gap-2 font-semibold text-slate-900">
                          <CheckCircle2 className="h-4 w-4 text-primary-600" /> {booking.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-3">
                      <Link to="/booking" className="btn-secondary w-full sm:w-auto text-center">
                        Book another service
                      </Link>
                      {booking.status !== 'CANCELLED' && (
                        <>
                          <button type="button" onClick={() => {
                            setReschedulingId(booking.id);
                            setRescheduleDate(booking.bookingDate || "");
                            setRescheduleTime(booking.startTime || "");
                          }} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <PencilLine className="h-4 w-4" /> Reschedule
                          </button>
                          <button type="button" onClick={() => handleCancel(booking.id)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            Cancel appointment
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays className="h-4 w-4" /> {booking.bookingDate}
                      <Clock3 className="ml-3 h-4 w-4" /> {booking.startTime}
                    </div>
                  </div>

                  {reschedulingId === booking.id && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="grid gap-3 md:grid-cols-3">
                        <label className="text-sm font-medium text-slate-700">
                          <span className="mb-1 block">Date</span>
                          <input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                          <span className="mb-1 block">Time</span>
                          <input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                          <span className="mb-1 block">Reason</span>
                          <input type="text" value={rescheduleReason} onChange={(e) => setRescheduleReason(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
                        </label>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => handleReschedule(booking.id)} className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                          Save changes
                        </button>
                        <button type="button" onClick={() => {
                          setReschedulingId(null);
                          setRescheduleDate("");
                          setRescheduleTime("");
                          setRescheduleReason("Requested by customer");
                        }} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
                <p className="text-sm text-slate-600">Showing {paginatedBookings.length} of {filteredBookings.length} bookings</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
