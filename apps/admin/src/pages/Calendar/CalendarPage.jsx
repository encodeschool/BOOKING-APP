import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaCalendarAlt,
  FaClock,
  FaUser,
} from "react-icons/fa";

import { useAuth } from "../../app/providers/AuthProvider";
import { useBusiness } from "../../app/providers/BusinessProvider";

export default function CalendarPage() {
  const { token } = useAuth();
  const { selectedBusinessId, bookings } = useBusiness();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarBookings, setCalendarBookings] = useState([]);

  useEffect(() => {
    if (bookings) {
      setCalendarBookings(bookings);
    }
  }, [bookings]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);

    const days = [];

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const getBookingsForDate = (date) => {
    return calendarBookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  const days = getDaysInMonth(currentDate);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const bookingColors = [
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-green-100 text-green-700 border-green-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-orange-100 text-orange-700 border-orange-200",
    "bg-indigo-100 text-indigo-700 border-indigo-200",
  ];

  const getBookingColor = (index) => {
    return bookingColors[index % bookingColors.length];
  };

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div>
          <p className="text-sm font-medium text-emerald-600 mb-2">
            Booking Management
          </p>

          <h1 className="text-4xl font-bold text-gray-900">
            Calendar Overview
          </h1>

          <p className="text-gray-500 mt-2">
            Manage appointments, bookings and schedules.
          </p>
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
              <p className="text-gray-500 text-sm font-medium">
                Total Bookings
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {calendarBookings.length}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FaCalendarAlt size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Today's Bookings
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {
                  calendarBookings.filter(
                    (b) =>
                      new Date(b.date).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
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
              <p className="text-gray-500 text-sm font-medium">
                Active Business
              </p>

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

      {/* CALENDAR */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]}{" "}
              {currentDate.getFullYear()}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Manage your appointments calendar
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateMonth(-1)}
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
              onClick={() => navigateMonth(1)}
              className="w-11 h-11 rounded-2xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all"
            >
              <FaChevronRight className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* WEEK DAYS */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-4 text-center text-sm font-semibold text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayBookings = getBookingsForDate(day);

            const isCurrentMonth =
              day.getMonth() === currentDate.getMonth();

            const isToday =
              day.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`min-h-[150px] border-b border-r border-gray-100 p-3 transition-all hover:bg-gray-50 ${
                  isCurrentMonth ? "bg-white" : "bg-gray-50/60"
                }`}
              >
                {/* DAY NUMBER */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-semibold ${
                      isToday
                        ? "bg-emerald-500 text-white"
                        : isCurrentMonth
                        ? "text-gray-900"
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

                {/* BOOKINGS */}
                <div className="space-y-2">
                  {dayBookings.slice(0, 3).map((booking, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        alert(
                          `Booking: ${
                            booking.serviceName || "Service"
                          }\nCustomer: ${
                            booking.customerName || "Customer"
                          }\nTime: ${booking.time}`
                        )
                      }
                      className={`rounded-2xl border p-2 cursor-pointer hover:scale-[1.02] transition-all ${getBookingColor(
                        idx
                      )}`}
                    >
                      <p className="text-[11px] font-semibold">
                        {booking.time}
                      </p>

                      <p className="text-xs font-medium truncate">
                        {booking.serviceName || "Service"}
                      </p>

                      <p className="text-[11px] opacity-70 truncate">
                        {booking.customerName || "Customer"}
                      </p>
                    </div>
                  ))}

                  {dayBookings.length > 3 && (
                    <div className="text-xs text-gray-500 px-2 py-1">
                      +{dayBookings.length - 3} more bookings
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EMPTY STATE */}
      {!calendarBookings.length && (
        <div className="mt-8 bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-5">
            <FaCalendarAlt className="text-3xl text-gray-400" />
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No bookings yet
          </h3>

          <p className="text-gray-500 max-w-md mx-auto">
            Your appointment calendar is empty. Start by creating a new
            booking.
          </p>

          <button className="mt-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-2xl font-medium shadow-lg shadow-emerald-200">
            Create Booking
          </button>
        </div>
      )}
    </div>
  );
}