import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaTimes,
  FaCheck,
  FaListUl,
} from "react-icons/fa";

import { useAuth } from "../../app/providers/AuthProvider";
import { useBusiness } from "../../app/providers/BusinessProvider";

// ─── Booking Detail Modal ────────────────────────────────────────────────────
function BookingModal({ booking, onClose, onApprove }) {
  if (!booking) return null;

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    APPROVED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
    COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
        >
          <FaTimes className="text-gray-500 text-sm" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            Booking #{booking.id}
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            {booking.serviceName || `Service #${booking.serviceId}`}
          </h2>
        </div>

        {/* Status Badge */}
        <div className="mb-5">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              statusColors[booking.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {booking.status}
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 mb-6">
          <DetailRow icon={<FaCalendarAlt />} label="Date" value={booking.bookingDate} />
          <DetailRow
            icon={<FaClock />}
            label="Time"
            value={`${booking.startTime} — ${booking.endTime}`}
          />
          <DetailRow
            icon={<FaUser />}
            label="Customer"
            value={booking.customerName || booking.customerPhone || "Guest"}
          />
          {booking.customerPhone && (
            <DetailRow icon={<span>📞</span>} label="Phone" value={booking.customerPhone} />
          )}
          {booking.staffId && (
            <DetailRow icon={<span>👤</span>} label="Staff ID" value={`#${booking.staffId}`} />
          )}
          {booking.notes && (
            <DetailRow icon={<span>📝</span>} label="Notes" value={booking.notes} />
          )}
          {booking.statusReason && (
            <DetailRow icon={<span>⚠️</span>} label="Reason" value={booking.statusReason} />
          )}
          <DetailRow
            icon={<span>🕐</span>}
            label="Created"
            value={new Date(booking.createdAt).toLocaleString()}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {booking.status === "PENDING" && (
            <button
              onClick={() => onApprove(booking.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-2xl font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-emerald-100"
            >
              <FaCheck />
              Approve Booking
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50">
      <span className="text-gray-400 mt-0.5 text-sm flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-800 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Calendar Page ──────────────────────────────────────────────────────
export default function CalendarPage() {
  const { token } = useAuth();
  const { selectedBusinessId, bookings } = useBusiness();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarBookings, setCalendarBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [view, setView] = useState("month"); // "day" | "month" | "year"

  useEffect(() => {
    if (!selectedBusinessId) return;
    fetchBookings();
  }, [selectedBusinessId, currentDate]);

  const fetchBookings = async () => {
    const from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    try {
      const res = await fetch(
        `/api/bookings/calendar?businessId=${selectedBusinessId}&from=${
          from.toISOString().split("T")[0]
        }&to=${to.toISOString().split("T")[0]}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        console.error(`Calendar fetch failed: ${res.status} ${res.statusText}`);
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Expected JSON but got:", contentType);
        return;
      }

      const data = await res.json();
      setCalendarBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  useEffect(() => {
    if (bookings) setCalendarBookings(bookings);
  }, [bookings]);

  const handleApprove = async (bookingId) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCalendarBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: "APPROVED" } : b))
        );
        setSelectedBooking((prev) =>
          prev?.id === bookingId ? { ...prev, status: "APPROVED" } : prev
        );
      }
    } catch (err) {
      console.error("Failed to approve booking:", err);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getBookingsForDate = (date) =>
    calendarBookings.filter(
      (b) => new Date(b.bookingDate).toDateString() === date.toDateString()
    );

  const getDaysInMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const days = [];
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const navigate = (direction) => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === "day") d.setDate(d.getDate() + direction);
      else if (view === "month") d.setMonth(d.getMonth() + direction);
      else if (view === "year") d.setFullYear(d.getFullYear() + direction);
      return d;
    });
  };

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const bookingColors = [
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-green-100 text-green-700 border-green-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-orange-100 text-orange-700 border-orange-200",
    "bg-indigo-100 text-indigo-700 border-indigo-200",
  ];

  const getBookingColor = (index) => bookingColors[index % bookingColors.length];

  const headerTitle = () => {
    if (view === "day")
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
    if (view === "month")
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    return `${currentDate.getFullYear()}`;
  };

  // ── Day View ──────────────────────────────────────────────────────────────
  const DayView = () => {
    const dayBookings = getBookingsForDate(currentDate).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getBookingsForHour = (hour) =>
      dayBookings.filter((b) => parseInt(b.startTime?.split(":")[0], 10) === hour);

    return (
      <div className="overflow-y-auto max-h-[700px]">
        {hours.map((hour) => {
          const hourBookings = getBookingsForHour(hour);
          const label = `${String(hour).padStart(2, "0")}:00`;
          const isCurrentHour =
            new Date().getHours() === hour &&
            currentDate.toDateString() === new Date().toDateString();

          return (
            <div
              key={hour}
              className={`flex border-b border-gray-100 min-h-[64px] ${
                isCurrentHour ? "bg-emerald-50/50" : ""
              }`}
            >
              <div className="w-16 flex-shrink-0 py-3 px-3 text-right">
                <span
                  className={`text-xs font-semibold ${
                    isCurrentHour ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>

              <div className="flex-1 py-2 px-3 space-y-2">
                {hourBookings.map((booking, idx) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className={`flex items-center gap-3 rounded-2xl border p-3 cursor-pointer hover:scale-[1.01] transition-all ${getBookingColor(idx)}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold">
                          {booking.startTime} — {booking.endTime}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            booking.status === "PENDING"
                              ? "bg-yellow-200 text-yellow-800"
                              : booking.status === "APPROVED"
                              ? "bg-green-200 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold truncate mt-0.5">
                        {booking.serviceName || `Service #${booking.serviceId}`}
                      </p>
                      <p className="text-xs opacity-70 truncate">
                        {booking.customerName || booking.customerPhone || "Guest"}
                      </p>
                    </div>
                    <FaListUl className="flex-shrink-0 opacity-40 text-xs" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ── Month View ────────────────────────────────────────────────────────────
  const MonthView = () => {
    const days = getDaysInMonth(currentDate);
    return (
      <>
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="py-4 text-center text-sm font-semibold text-gray-500">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayBookings = getBookingsForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`min-h-[150px] border-b border-r border-gray-100 p-3 transition-all hover:bg-gray-50 ${
                  isCurrentMonth ? "bg-white" : "bg-gray-50/60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    onClick={() => { setCurrentDate(day); setView("day"); }}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-semibold cursor-pointer transition-all hover:scale-110 ${
                      isToday
                        ? "bg-emerald-500 text-white"
                        : isCurrentMonth
                        ? "text-gray-900 hover:bg-gray-100"
                        : "text-gray-400"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                  {dayBookings.length > 0 && (
                    <span className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                      {dayBookings.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {dayBookings.slice(0, 3).map((booking, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedBooking(booking)}
                      className={`rounded-xl border px-2 py-1.5 cursor-pointer hover:scale-[1.02] transition-all ${getBookingColor(idx)}`}
                    >
                      <p className="text-[11px] font-bold">{booking.startTime}</p>
                      <p className="text-xs font-medium truncate">
                        {booking.serviceName || `Service #${booking.serviceId}`}
                      </p>
                      <p className="text-[11px] opacity-70 truncate">
                        {booking.customerName || booking.customerPhone || "Guest"}
                      </p>
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <button
                      onClick={() => { setCurrentDate(day); setView("day"); }}
                      className="text-xs text-emerald-600 font-semibold px-2 py-0.5 hover:underline"
                    >
                      +{dayBookings.length - 3} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  // ── Year View ─────────────────────────────────────────────────────────────
  const YearView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {monthNames.map((month, mIdx) => {
        const monthBookings = calendarBookings.filter(
          (b) => new Date(b.bookingDate).getMonth() === mIdx
        );
        const isCurrentMonth =
          mIdx === new Date().getMonth() &&
          currentDate.getFullYear() === new Date().getFullYear();

        return (
          <div
            key={month}
            onClick={() => {
              setCurrentDate(new Date(currentDate.getFullYear(), mIdx, 1));
              setView("month");
            }}
            className={`rounded-2xl p-4 cursor-pointer border transition-all hover:scale-[1.02] hover:shadow-md ${
              isCurrentMonth
                ? "border-emerald-200 bg-emerald-50"
                : "border-gray-100 bg-white hover:border-gray-200"
            }`}
          >
            <p className={`text-sm font-bold mb-3 ${isCurrentMonth ? "text-emerald-700" : "text-gray-700"}`}>
              {month}
            </p>

            {/* Mini calendar */}
            <div className="grid grid-cols-7 gap-0.5 mb-3">
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <div key={i} className="text-[9px] text-center text-gray-400 font-semibold">
                  {d}
                </div>
              ))}
              {getDaysInMonth(new Date(currentDate.getFullYear(), mIdx, 1)).map((day, i) => {
                const hasBooking = calendarBookings.some(
                  (b) => new Date(b.bookingDate).toDateString() === day.toDateString()
                );
                const inMonth = day.getMonth() === mIdx;
                const isToday = day.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={i}
                    className={`w-4 h-4 mx-auto rounded-full flex items-center justify-center text-[9px] font-medium ${
                      !inMonth
                        ? "opacity-0"
                        : isToday
                        ? "bg-emerald-500 text-white"
                        : hasBooking
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-500"
                    }`}
                  >
                    {inMonth ? day.getDate() : ""}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {monthBookings.length} booking{monthBookings.length !== 1 ? "s" : ""}
              </span>
              {monthBookings.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* MODAL */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onApprove={handleApprove}
        />
      )}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div>
          <p className="text-sm font-medium text-emerald-600 mb-2">Booking Management</p>
          <h1 className="text-4xl font-bold text-gray-900">Calendar Overview</h1>
          <p className="text-gray-500 mt-2">Manage appointments, bookings and schedules.</p>
        </div>
        <button className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:scale-[1.02] transition-all text-white px-6 py-3 rounded-2xl shadow-lg shadow-emerald-200 font-medium">
          <FaPlus />
          Add Booking
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">{calendarBookings.length}</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FaCalendarAlt size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Today's Bookings</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {calendarBookings.filter(
                  (b) => new Date(b.bookingDate).toDateString() === new Date().toDateString()
                ).length}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <FaClock size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Business</p>
              <h2 className="text-xl font-bold text-gray-900 mt-2">
                {selectedBusinessId || "Not Selected"}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <FaUser size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* CALENDAR CARD */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{headerTitle()}</h2>
            <p className="text-gray-500 text-sm mt-1">Manage your appointments calendar</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View Switcher */}
            <div className="flex items-center bg-gray-100 rounded-2xl p-1">
              {["day", "month", "year"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                    view === v
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-2xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all"
            >
              <FaChevronLeft className="text-gray-700" />
            </button>

            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-5 h-11 rounded-2xl bg-gray-900 text-white font-medium hover:bg-black transition-all"
            >
              Today
            </button>

            <button
              onClick={() => navigate(1)}
              className="w-11 h-11 rounded-2xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all"
            >
              <FaChevronRight className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* VIEW CONTENT */}
        {view === "month" && <MonthView />}
        {view === "day" && <DayView />}
        {view === "year" && <YearView />}
      </div>

      {/* EMPTY STATE */}
      {!calendarBookings.length && (
        <div className="mt-8 bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-5">
            <FaCalendarAlt className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No bookings yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Your appointment calendar is empty. Start by creating a new booking.
          </p>
          <button className="mt-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-2xl font-medium shadow-lg shadow-emerald-200">
            Create Booking
          </button>
        </div>
      )}
    </div>
  );
}