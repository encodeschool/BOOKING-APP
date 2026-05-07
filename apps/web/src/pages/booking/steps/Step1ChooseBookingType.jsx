import {
  X,
  Users,
  Calendar,
  Gift,
  CreditCard,
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
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl">

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">
          Choose an option
        </h2>

        {/* <button onClick={closeBooking}>
          <X />
        </button> */}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-6">

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