import { useState } from "react";
import { useBooking } from "../../../context/BookingContext";

const Step6PaymentConfirmation = ({
  service,
  staff,
  date,
  time,
  customer,
  price = 50,
  onBack,
  onConfirm,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);

    // simulate API call
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
      onConfirm?.();
    }, 1500);
  };

  const { updateBooking, goNext } = useBooking();

  const selectType = (type) => {
    updateBooking({ payment });
    goNext();
  };

  if (confirmed) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow text-center">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-semibold mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600">
          Your appointment has been successfully booked.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">

      {/* HEADER */}
      <h2 className="text-xl font-semibold mb-6">
        Confirm & Pay
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT: SUMMARY */}
        <div className="space-y-4">

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Service</p>
            <p className="font-medium">{service || "Massage"}</p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Staff</p>
            <p className="font-medium">{staff || "Any available"}</p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium">
              {date?.toDateString()} • {time}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-medium">{customer?.name}</p>
            <p className="text-sm text-gray-500">
              {customer?.email}
            </p>
          </div>

        </div>

        {/* RIGHT: PAYMENT */}
        <div className="space-y-4">

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-2">
              Payment method
            </p>

            <div className="space-y-2">

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Credit / Debit Card
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                Pay on arrival
              </label>

            </div>
          </div>

          {/* PRICE */}
          <div className="border rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <span>Service price</span>
              <span>€{price}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Fee</span>
              <span>€0</span>
            </div>

            <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>€{price}</span>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">

            <button
              onClick={onBack}
              className="flex-1 border rounded-lg py-2 hover:bg-gray-100"
            >
              Back
            </button>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 bg-black text-white rounded-lg py-2 hover:opacity-90"
            >
              {loading ? "Processing..." : "Confirm booking"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Step6PaymentConfirmation;