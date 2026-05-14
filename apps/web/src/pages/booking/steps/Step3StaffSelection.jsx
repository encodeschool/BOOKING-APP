import {
  ArrowLeft,
  User,
  Star
} from "lucide-react";

import { useBooking } from "../../../context/BookingContext";
import { useStaff } from "../../../hooks/useApi";

const Step3StaffSelection = () => {
  const {
    booking,
    updateBooking,
    goNext,
    goBack,
  } = useBooking();

  const businessId = booking?.business?.id;

  const {
    staff,
    loading,
    error,
  } = useStaff(businessId);

  // SELECT STAFF
  const handleSelectStaff = (staffMember) => {
    updateBooking({
      staff: staffMember,
    });

    goNext();
  };

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
          <h2 className="text-2xl font-bold text-gray-900">
            Choose a staff member
          </h2>

          <p className="text-sm text-gray-500">
            Select your preferred specialist
          </p>
        </div>

      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* ANY STAFF */}
        <button
          onClick={() =>
            handleSelectStaff({
              id: null,
              fullName: "Any available staff",
            })
          }
          className={`w-full border rounded-2xl p-5 flex items-center gap-4 text-left transition ${
            booking?.staff?.id === null
              ? "border-black bg-gray-50"
              : "hover:bg-gray-50"
          }`}
        >

          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={24} />
          </div>

          <div>
            <p className="font-semibold text-lg">
              Any available staff
            </p>

            <p className="text-sm text-gray-500 mt-1">
              We’ll automatically assign
              the best available specialist
            </p>
          </div>

        </button>

        {/* LOADING */}
        {loading && (
          <div className="py-10 text-center text-gray-500">
            Loading staff...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="py-10 text-center text-red-500">
            {error}
          </div>
        )}

        {/* STAFF LIST */}
        {!loading &&
          staff.map((member) => {
            const isSelected =
              booking?.staff?.id === member.id;

            return (
              <button
                key={member.id}
                onClick={() =>
                  handleSelectStaff(member)
                }
                className={`w-full border rounded-2xl p-5 text-left transition ${
                  isSelected
                    ? "border-black bg-gray-50"
                    : "hover:bg-gray-50"
                }`}
              >

                {/* TOP */}
                <div className="flex items-center justify-between">

                  {/* LEFT */}
                  <div className="flex items-center gap-4">

                    {/* AVATAR */}
                    <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold">
                      {(member.name || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    {/* INFO */}
                    <div>

                      <h3 className="font-semibold text-lg">
                        {member.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {member.role || "Staff"}
                      </p>

                    </div>
                  </div>

                  {/* RATING */}
                  {/* <div className="flex items-center gap-1 text-sm font-semibold">

                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    {member.rating}
                  </div>                   */}
                </div>

                {/* FOOTER */}
                {/* <div className="mt-4 flex flex-wrap gap-2">

                  {member.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      {specialty}
                    </span>
                  ))}

                </div> */}

                {/* REVIEWS */}
                {/* <p className="mt-3 text-xs text-gray-500">
                  {member.reviews} verified reviews
                </p> */}

                {/* CONTACT */}
                <div className="mt-4 space-y-1">

                  {member.email && (
                    <p className="text-sm text-gray-500">
                      {member.email}
                    </p>
                  )}

                  {member.phone && (
                    <p className="text-sm text-gray-500">
                      {member.phone}
                    </p>
                  )}

                </div>

              </button>
            );
          })}

        {/* EMPTY */}
        {!loading &&
          !error &&
          staff.length === 0 && (
            <div className="text-center py-20">

              <p className="text-gray-500">
                No staff found
              </p>

            </div>
          )}

      </div>

    </div>
  );
};

export default Step3StaffSelection;