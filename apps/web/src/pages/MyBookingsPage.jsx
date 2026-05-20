import { Link } from "react-router-dom";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";

const bookings = [
  {
    id: 1,
    service: "Luxury facial treatment",
    business: "Glow Beauty Studio",
    date: "March 12, 2025",
    time: "2:30 PM",
    status: "Confirmed",
  },
  {
    id: 2,
    service: "Signature haircut",
    business: "Clip & Style Salon",
    date: "March 25, 2025",
    time: "11:00 AM",
    status: "Pending",
  },
];

const MyBookingsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">My bookings</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Upcoming reservations</h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Review and manage your scheduled services in one place.</p>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-primary-600">Booking #{booking.id}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{booking.service}</h2>
                  <p className="mt-2 text-slate-600">{booking.business}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-slate-50 p-4 text-slate-700">
                    <p className="text-xs uppercase tracking-[0.3em]">Date</p>
                    <p className="mt-2 font-semibold text-slate-900">{booking.date}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 text-slate-700">
                    <p className="text-xs uppercase tracking-[0.3em]">Time</p>
                    <p className="mt-2 font-semibold text-slate-900">{booking.time}</p>
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
                <Link to="/booking" className="btn-secondary w-full sm:w-auto text-center">
                  Book another service
                </Link>
                <Link to="/contact" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Need help with this booking?
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
