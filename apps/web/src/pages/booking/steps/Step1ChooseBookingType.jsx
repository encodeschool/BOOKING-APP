import {
  X,
  Users,
  Calendar,
  Gift,
  CreditCard,
  Info
} from "lucide-react";

import { useBooking } from "../../../context/BookingContext";

const Step1ChooseBookingType = () => {
  const {
    closeBooking,
    updateBooking,
    goNext,
  } = useBooking();

  const selectType = (type) => {
    updateBooking({ type });
    goNext();
  };

  return (
    <div className="w-full h-full bg-white flex flex-col rounded-3xl overflow-hidden">

      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <button
          className="p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <Info size={20} />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Choose an option
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Order for yourself or others, or buy memberships and gift cards
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 border-b border-gray-100 flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

        {/* BOOK */}
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-3">
            Book
          </p>

          <div className="space-y-3">

            {/* INDIVIDUAL */}
            <div
              onClick={() => selectType("individual")}
              className="p-4 border rounded-xl hover:bg-gray-100 cursor-pointer flex gap-3"
            >
              <Calendar />

              <div>
                <p className="font-medium">
                  Book an appointment
                </p>

                <p className="text-sm text-gray-500">
                  Schedule services for yourself
                </p>
              </div>
            </div>

            {/* GROUP */}
            <div
              onClick={() => selectType("group")}
              className="p-4 border rounded-xl hover:bg-gray-100 cursor-pointer flex gap-3"
            >
              <Users />

              <div>
                <p className="font-medium">
                  Group appointment
                </p>

                <p className="text-sm text-gray-500">
                  For yourself and others
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* BUY */}
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-3">
            Buy
          </p>

          <div className="space-y-3">

            <div className="p-4 border rounded-xl flex gap-3 opacity-60">
              <CreditCard />

              <div>
                <p className="font-medium">
                  Membership
                </p>

                <p className="text-sm text-gray-500">
                  Coming soon
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-xl flex gap-3 opacity-60">
              <Gift />

              <div>
                <p className="font-medium">
                  Gift Cards
                </p>

                <p className="text-sm text-gray-500">
                  Coming soon
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Step1ChooseBookingType;