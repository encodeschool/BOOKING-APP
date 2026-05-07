import { ArrowLeft, Star, User } from "lucide-react";
import { useBooking } from "../../../context/BookingContext";

const mockStaff = [
  {
    id: 1,
    name: "Anna Smith",
    role: "Senior Hair Stylist",
    rating: 4.9,
    reviews: 124,
    specialties: ["Haircut", "Coloring"],
  },
  {
    id: 2,
    name: "John Davis",
    role: "Barber",
    rating: 4.7,
    reviews: 98,
    specialties: ["Beard", "Fade"],
  },
  {
    id: 3,
    name: "Maria Petrova",
    role: "Beautician",
    rating: 5.0,
    reviews: 201,
    specialties: ["Facial", "Skin care"],
  },
];

const Step3StaffSelection = () => {
  const {
    booking,
    updateBooking,
    goNext,
    goBack,
  } = useBooking();

  // SELECT STAFF
  const handleSelectStaff = (staff) => {
    updateBooking({
      staff,
    });

    goNext();
  };

  return (
    <div className="w-full min-h-[700px] bg-white flex flex-col rounded-2xl overflow-hidden">

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
              name: "Any available staff",
            })
          }
          className={`w-full border rounded-2xl p-5 flex items-center gap-4 text-left transition ${
            booking?.staff?.id === null &&
            booking?.staff?.name === "Any available staff"
              ? "border-black bg-gray-50"
              : "hover:bg-gray-50"
          }`}
        >

          {/* ICON */}
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={24} />
          </div>

          {/* INFO */}
          <div>
            <p className="font-semibold text-lg">
              Any available staff
            </p>

            <p className="text-sm text-gray-500 mt-1">
              We’ll automatically assign the best available specialist
            </p>
          </div>

        </button>

        {/* STAFF LIST */}
        {mockStaff.map((staff) => {
          const isSelected =
            booking?.staff?.id === staff.id;

          return (
            <button
              key={staff.id}
              onClick={() => handleSelectStaff(staff)}
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
                    {staff.name.charAt(0)}
                  </div>

                  {/* INFO */}
                  <div>

                    <h3 className="font-semibold text-lg">
                      {staff.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {staff.role}
                    </p>

                  </div>

                </div>

                {/* RATING */}
                <div className="flex items-center gap-1 text-sm font-semibold">

                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  {staff.rating}

                </div>

              </div>

              {/* FOOTER */}
              <div className="mt-4 flex flex-wrap gap-2">

                {staff.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    {specialty}
                  </span>
                ))}

              </div>

              {/* REVIEWS */}
              <p className="mt-3 text-xs text-gray-500">
                {staff.reviews} verified reviews
              </p>

            </button>
          );
        })}

      </div>

    </div>
  );
};

export default Step3StaffSelection;