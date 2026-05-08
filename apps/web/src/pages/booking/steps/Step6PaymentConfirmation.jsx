import { useState } from "react";
import { Link } from "react-router-dom";
import { useBooking } from "../../../context/BookingContext";
import { ArrowLeft, Star, User } from "lucide-react";
import { apiClient } from '../../../lib/api';

const Step6PaymentConfirmation = () => {
  const {
    booking,
    goBack,
    closeBooking,
  } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const service = booking?.service;
  const staff = booking?.staff;
  const date = booking?.date;
  const time = booking?.time;
  const customer = booking?.customer;

  const price = Number(service?.price || 0);

  // CONFIRM BOOKING
  const handleConfirm = async () => {
    try {
      setLoading(true);

      const payload = {
        businessId: booking.business.id,
        serviceId: booking.service.id,

        staffId:
          booking.staff?.id || null,

        bookingDate: new Date(date)
          .toISOString()
          .split("T")[0],

        startTime: time,

        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,

        notes: booking.notes || "",
      };

      await apiClient.createBooking(payload);

      setConfirmed(true);

    } catch (err) {
      console.error(err);

      alert(
        err.message ||
        "Failed to create booking"
      );
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (confirmed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">

        <div className="text-center max-w-md mx-auto p-8">

          <div className="text-green-600 text-6xl mb-6">
            ✓
          </div>

          <h2 className="text-3xl font-semibold mb-3">
            Booking Confirmed!
          </h2>

          <p className="text-gray-600 mb-8">
            Your appointment has been successfully booked.
          </p>

          <Link
            to="/"
            onClick={closeBooking}
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl hover:opacity-90 transition"
          >
            Go Back Home
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="w-full max-h-full bg-white flex flex-col rounded-2xl overflow-hidden">

      {/* HEADER */}
        <div className="flex items-center gap-3 p-5 border-b">

          <button
            onClick={goBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h2 className="text-xl font-semibold">
              Confirm & Pay
            </h2>

            <p className="text-sm text-gray-500">
              Review your booking details before confirming
            </p>
          </div>

        </div>

      <div className="w-full bg-white p-8">

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT SIDE */}
          <div className="space-y-4">

            <div className="border rounded-2xl p-5">
              <p className="text-sm text-gray-500 mb-1">
                Service
              </p>

              <p className="font-semibold text-lg">
                {service?.name || "Massage"}
              </p>
            </div>

            <div className="border rounded-2xl p-5">
              <p className="text-sm text-gray-500 mb-1">
                Staff
              </p>

              <p className="font-semibold text-lg">
                {staff?.name || "Any available"}
              </p>
            </div>

            <div className="border rounded-2xl p-5">
              <p className="text-sm text-gray-500 mb-1">
                Date & Time
              </p>

              <p className="font-semibold text-lg">
                {date
                  ? new Date(date).toDateString()
                  : "No date selected"}{" "}
                • {time || "No time selected"}
              </p>
            </div>

            <div className="border rounded-2xl p-5">
              <p className="text-sm text-gray-500 mb-1">
                Customer
              </p>

              <p className="font-semibold">
                {customer?.name}
              </p>

              <p className="text-sm text-gray-500">
                {customer?.email}
              </p>

              <p className="text-sm text-gray-500">
                {customer?.phone}
              </p>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* PAYMENT */}
            <div className="border rounded-2xl p-5">

              <p className="font-medium mb-4">
                Payment method
              </p>

              <div className="space-y-3">

                <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50">

                  <input
                    type="radio"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />

                  <span>Credit / Debit Card</span>

                </label>

                <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50">

                  <input
                    type="radio"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                  />

                  <span>Pay on arrival</span>

                </label>

              </div>

            </div>

            {/* PRICE */}
            <div className="border rounded-2xl p-5">

              <div className="flex justify-between mb-3">
                <span>Service price</span>
                <span>€{price}</span>
              </div>

              <div className="flex justify-between text-gray-500 text-sm">
                <span>Booking fee</span>
                <span>€0</span>
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between text-lg font-semibold">

                <span>Total</span>

                <span>€{price}</span>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 pt-2">

              <button
                onClick={goBack}
                className="flex-1 border rounded-2xl py-4 hover:bg-gray-100 transition font-medium"
              >
                Back
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-black text-white rounded-2xl py-4 hover:opacity-90 transition font-medium disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : "Confirm Booking"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Step6PaymentConfirmation;