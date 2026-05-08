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
  FaPhone,
  FaEnvelope,
  FaCut,
  FaUserTie,
  FaBan,
} from "react-icons/fa";

import { useAuth } from "../../app/providers/AuthProvider";
import { useBusiness } from "../../app/providers/BusinessProvider";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  PENDING:   { pill: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-400" },
  CONFIRMED: { pill: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  COMPLETED: { pill: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-400" },
  CANCELLED: { pill: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" },
  REJECTED:  { pill: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-400" },
};

// ─── Booking Detail Modal ─────────────────────────────────────────────────────
function BookingModal({ booking, onClose, onApprove, onReject }) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [loading, setLoading] = useState(null); // "approve" | "reject"

  if (!booking) return null;

  const status = STATUS[booking.status] || STATUS.PENDING;
  const service = booking.service;
  const staff = booking.staff;

  const handleApprove = async () => {
    setLoading("approve");
    await onApprove(booking.id);
    setLoading(null);
  };

  const handleReject = async () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    setLoading("reject");
    await onReject(booking.id, rejectReason || "Rejected by business owner");
    setLoading(null);
    setShowRejectInput(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Colored top bar based on status ── */}
        <div
          className={`h-1.5 w-full ${
            booking.status === "CONFIRMED"
              ? "bg-gradient-to-r from-emerald-400 to-green-400"
              : booking.status === "REJECTED" || booking.status === "CANCELLED"
              ? "bg-gradient-to-r from-red-400 to-rose-400"
              : booking.status === "COMPLETED"
              ? "bg-gradient-to-r from-blue-400 to-indigo-400"
              : "bg-gradient-to-r from-yellow-400 to-amber-400"
          }`}
        />

        <div className="p-6">
          {/* ── Header ── */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${status.pill}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {booking.status}
                </span>
                <span className="text-xs text-gray-400 font-medium">#{booking.id}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {service?.name || `Service #${booking.serviceId}`}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {service?.durationMinutes} min session
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all flex-shrink-0 ml-4"
            >
              <FaTimes className="text-gray-500 text-sm" />
            </button>
          </div>

          {/* ── Main info grid ── */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Date & Time */}
            <div className="col-span-2 bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <FaCalendarAlt className="text-emerald-500" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Date & Time
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.startTime} — {booking.endTime}
                  <span className="ml-2 text-xs text-gray-400">
                    ({service?.durationMinutes} min)
                  </span>
                </p>
              </div>
            </div>

            {/* Customer */}
            <div className="col-span-2 bg-gray-50 rounded-2xl p-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Customer
              </p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {booking.customerName || "Guest"}
                  </p>
                  <p className="text-xs text-gray-500">Client</p>
                </div>
              </div>
              <div className="space-y-2 pl-1">
                {booking.customerPhone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaPhone className="text-gray-400 text-xs flex-shrink-0" />
                    <a
                      href={`tel:${booking.customerPhone}`}
                      className="hover:text-emerald-600 transition-colors font-medium"
                    >
                      {booking.customerPhone}
                    </a>
                  </div>
                )}
                {booking.customerEmail && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaEnvelope className="text-gray-400 text-xs flex-shrink-0" />
                    <a
                      href={`mailto:${booking.customerEmail}`}
                      className="hover:text-emerald-600 transition-colors font-medium truncate"
                    >
                      {booking.customerEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Service */}
            {service && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Service
                </p>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <FaCut className="text-purple-500 text-xs" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">{service.name}</p>
                </div>
                <p className="text-xs text-gray-500 pl-10">
                  {service.durationMinutes} min
                  {service.active ? (
                    <span className="ml-2 text-emerald-600 font-medium">● Active</span>
                  ) : (
                    <span className="ml-2 text-gray-400">● Inactive</span>
                  )}
                </p>
              </div>
            )}

            {/* Staff */}
            {staff && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Staff
                </p>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FaUserTie className="text-blue-500 text-xs" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">{staff.name}</p>
                </div>
                <p className="text-xs text-gray-500 pl-10">
                  Max {staff.maxBookingsPerDay}/day
                  {staff.active ? (
                    <span className="ml-2 text-emerald-600 font-medium">● Active</span>
                  ) : (
                    <span className="ml-2 text-gray-400">● Inactive</span>
                  )}
                </p>
              </div>
            )}

            {/* Notes */}
            {booking.notes && (
              <div className="col-span-2 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-1">
                  📝 Notes
                </p>
                <p className="text-sm text-gray-700">{booking.notes}</p>
              </div>
            )}

            {/* Status Reason */}
            {booking.statusReason && (
              <div className="col-span-2 bg-red-50 border border-red-100 rounded-2xl p-4">
                <p className="text-[11px] font-semibold text-red-500 uppercase tracking-wider mb-1">
                  ⚠️ Reason
                </p>
                <p className="text-sm text-gray-700">{booking.statusReason}</p>
              </div>
            )}
          </div>

          {/* ── Timestamps ── */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-5 px-1">
            <span>Created {new Date(booking.createdAt).toLocaleString()}</span>
            {booking.updatedAt !== booking.createdAt && (
              <span>Updated {new Date(booking.updatedAt).toLocaleString()}</span>
            )}
          </div>

          {/* ── Reject reason input ── */}
          {showRejectInput && (
            <div className="mb-4">
              <input
                autoFocus
                type="text"
                placeholder="Reason for rejection (optional)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-red-200 bg-red-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex gap-3">
            {booking.status === "PENDING" && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={loading === "approve"}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-2xl font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-emerald-100 disabled:opacity-60 disabled:scale-100"
                >
                  {loading === "approve" ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FaCheck />
                  )}
                  Confirm
                </button>

                <button
                  onClick={handleReject}
                  disabled={loading === "reject"}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white py-3 rounded-2xl font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-red-100 disabled:opacity-60 disabled:scale-100"
                >
                  {loading === "reject" ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FaBan />
                  )}
                  {showRejectInput ? "Confirm Reject" : "Reject"}
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className={`${booking.status === "PENDING" ? "" : "flex-1"} px-6 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Calendar Page ───────────────────────────────────────────────────────
export default function CalendarPage() {
  const { token } = useAuth();
  const { selectedBusinessId, bookings } = useBusiness();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarBookings, setCalendarBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [view, setView] = useState("month");

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
      if (!res.ok) { console.error(`Fetch failed: ${res.status}`); return; }
      const ct = res.headers.get("content-type");
      if (!ct?.includes("application/json")) { console.error("Not JSON:", ct); return; }
      setCalendarBookings(await res.json());
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  useEffect(() => { if (bookings) setCalendarBookings(bookings); }, [bookings]);

  const handleApprove = async (bookingId) => {
    const res = await fetch(`/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CONFIRMED", reason: null }),
    });
    if (res.ok) {
      setCalendarBookings((p) => p.map((b) => b.id === bookingId ? { ...b, status: "CONFIRMED" } : b));
      setSelectedBooking((p) => p?.id === bookingId ? { ...p, status: "CONFIRMED" } : p);
    }
  };

  const handleReject = async (bookingId, reason) => {
    const res = await fetch(`/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED", reason }),
    });
    if (res.ok) {
      setCalendarBookings((p) => p.map((b) => b.id === bookingId ? { ...b, status: "REJECTED", statusReason: reason } : b));
      setSelectedBooking((p) => p?.id === bookingId ? { ...p, status: "REJECTED", statusReason: reason } : p);
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
    const start = new Date(firstDay);
    start.setDate(start.getDate() - firstDay.getDay());
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const navigate = (dir) => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === "day") d.setDate(d.getDate() + dir);
      else if (view === "month") d.setMonth(d.getMonth() + dir);
      else d.setFullYear(d.getFullYear() + dir);
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

  const getBookingColor = (idx) => bookingColors[idx % bookingColors.length];

  const statusBookingColor = (status) => {
    if (status === "CONFIRMED") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "REJECTED" || status === "CANCELLED") return "bg-red-100 text-red-700 border-red-200";
    if (status === "COMPLETED") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  const headerTitle = () => {
    if (view === "day") return currentDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    if (view === "month") return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    return `${currentDate.getFullYear()}`;
  };

  // ── Day View ──────────────────────────────────────────────────────────────
  const DayView = () => {
    const dayBookings = getBookingsForDate(currentDate).sort((a, b) => a.startTime.localeCompare(b.startTime));
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const getForHour = (h) => dayBookings.filter((b) => parseInt(b.startTime?.split(":")[0], 10) === h);

    return (
      <div className="overflow-y-auto max-h-[700px]">
        {hours.map((hour) => {
          const hBookings = getForHour(hour);
          const label = `${String(hour).padStart(2, "0")}:00`;
          const isCurrent = new Date().getHours() === hour && currentDate.toDateString() === new Date().toDateString();

          return (
            <div key={hour} className={`flex border-b border-gray-100 min-h-[64px] ${isCurrent ? "bg-emerald-50/40" : ""}`}>
              <div className="w-16 flex-shrink-0 py-3 px-3 text-right">
                <span className={`text-xs font-semibold ${isCurrent ? "text-emerald-600" : "text-gray-400"}`}>{label}</span>
                {isCurrent && <div className="w-2 h-2 rounded-full bg-emerald-500 ml-auto mt-1" />}
              </div>
              <div className="flex-1 py-2 px-3 space-y-2">
                {hBookings.map((booking, idx) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className={`flex items-center gap-3 rounded-2xl border p-3 cursor-pointer hover:scale-[1.01] transition-all ${statusBookingColor(booking.status)}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold">{booking.startTime} — {booking.endTime}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${STATUS[booking.status]?.pill || ""}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold truncate mt-0.5">
                        {booking.service?.name || `Service #${booking.serviceId}`}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-xs opacity-70 truncate">{booking.customerName || "Guest"}</p>
                        {booking.staff && (
                          <p className="text-xs opacity-50 truncate">· {booking.staff.name}</p>
                        )}
                      </div>
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
            <div key={d} className="py-4 text-center text-sm font-semibold text-gray-500">{d}</div>
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
                className={`min-h-[150px] border-b border-r border-gray-100 p-3 transition-all hover:bg-gray-50 ${isCurrentMonth ? "bg-white" : "bg-gray-50/60"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    onClick={() => { setCurrentDate(day); setView("day"); }}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-semibold cursor-pointer transition-all hover:scale-110 ${
                      isToday ? "bg-emerald-500 text-white" : isCurrentMonth ? "text-gray-900 hover:bg-gray-100" : "text-gray-400"
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
                      className={`rounded-xl border px-2 py-1.5 cursor-pointer hover:scale-[1.02] transition-all ${statusBookingColor(booking.status)}`}
                    >
                      <p className="text-[11px] font-bold">{booking.startTime}</p>
                      <p className="text-xs font-medium truncate">
                        {booking.service?.name || `Service #${booking.serviceId}`}
                      </p>
                      <p className="text-[11px] opacity-70 truncate">{booking.customerName || "Guest"}</p>
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
        const monthBookings = calendarBookings.filter((b) => new Date(b.bookingDate).getMonth() === mIdx);
        const isCurrentMonth = mIdx === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

        return (
          <div
            key={month}
            onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), mIdx, 1)); setView("month"); }}
            className={`rounded-2xl p-4 cursor-pointer border transition-all hover:scale-[1.02] hover:shadow-md ${
              isCurrentMonth ? "border-emerald-200 bg-emerald-50" : "border-gray-100 bg-white hover:border-gray-200"
            }`}
          >
            <p className={`text-sm font-bold mb-3 ${isCurrentMonth ? "text-emerald-700" : "text-gray-700"}`}>{month}</p>
            <div className="grid grid-cols-7 gap-0.5 mb-3">
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <div key={i} className="text-[9px] text-center text-gray-400 font-semibold">{d}</div>
              ))}
              {getDaysInMonth(new Date(currentDate.getFullYear(), mIdx, 1)).map((day, i) => {
                const hasBooking = calendarBookings.some((b) => new Date(b.bookingDate).toDateString() === day.toDateString());
                const inMonth = day.getMonth() === mIdx;
                const isToday = day.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={i}
                    className={`w-4 h-4 mx-auto rounded-full flex items-center justify-center text-[9px] font-medium ${
                      !inMonth ? "opacity-0" : isToday ? "bg-emerald-500 text-white" : hasBooking ? "bg-blue-100 text-blue-700" : "text-gray-500"
                    }`}
                  >
                    {inMonth ? day.getDate() : ""}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{monthBookings.length} booking{monthBookings.length !== 1 ? "s" : ""}</span>
              {monthBookings.length > 0 && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onApprove={handleApprove}
          onReject={handleReject}
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
          <FaPlus /> Add Booking
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
                {calendarBookings.filter((b) => new Date(b.bookingDate).toDateString() === new Date().toDateString()).length}
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
              <h2 className="text-xl font-bold text-gray-900 mt-2">{selectedBusinessId || "Not Selected"}</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <FaUser size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* CALENDAR CARD */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{headerTitle()}</h2>
            <p className="text-gray-500 text-sm mt-1">Manage your appointments calendar</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center bg-gray-100 rounded-2xl p-1">
              {["day","month","year"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                    view === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button onClick={() => navigate(-1)} className="w-11 h-11 rounded-2xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all">
              <FaChevronLeft className="text-gray-700" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-5 h-11 rounded-2xl bg-gray-900 text-white font-medium hover:bg-black transition-all">
              Today
            </button>
            <button onClick={() => navigate(1)} className="w-11 h-11 rounded-2xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all">
              <FaChevronRight className="text-gray-700" />
            </button>
          </div>
        </div>

        {view === "month" && <MonthView />}
        {view === "day" && <DayView />}
        {view === "year" && <YearView />}
      </div>

      {!calendarBookings.length && (
        <div className="mt-8 bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-5">
            <FaCalendarAlt className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No bookings yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">Your appointment calendar is empty. Start by creating a new booking.</p>
          <button className="mt-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-2xl font-medium shadow-lg shadow-emerald-200">
            Create Booking
          </button>
        </div>
      )}
    </div>
  );
}