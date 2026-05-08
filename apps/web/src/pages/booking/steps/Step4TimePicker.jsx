import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useBooking } from "../../../context/BookingContext";
import { useStaffWorkingHours } from "../../../hooks/useApi";

const Step4TimePicker = () => {
  const { booking, updateBooking, goNext, goBack } = useBooking();

  const [selectedDate, setSelectedDate] = useState(
    booking.date ? new Date(booking.date) : new Date()
  );

  const [selectedTime, setSelectedTime] = useState("");

  const { hours } = useStaffWorkingHours(booking?.staff?.id ?? null);

  const today = new Date();

  // -----------------------------------
  // HELPERS
  // -----------------------------------

  const normalize = (d) =>
    new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    ).getTime();

  const isToday =
    normalize(selectedDate) === normalize(today);

  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();

  const dayName = selectedDate
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toUpperCase();

  // -----------------------------------
  // FIND STAFF WORKING DAY
  // -----------------------------------

  const workingDay = hours.find(
    (h) => h.dayOfWeek === dayName
  );

  // -----------------------------------
  // GENERATE REAL SLOTS
  // -----------------------------------

  const timeSlots = useMemo(() => {
    if (!workingDay) return [];

    if (workingDay.isOff) return [];

    const slots = [];

    if (!workingDay.startTime || !workingDay.endTime) return [];

    const start = workingDay.startTime.slice(0, 5);
    const end = workingDay.endTime.slice(0, 5);

    let [startHour, startMinute] =
      start.split(":").map(Number);

    let [endHour, endMinute] =
      end.split(":").map(Number);

    let current = new Date();
    current.setHours(startHour, startMinute, 0);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0);

    while (current < endDate) {
      const hour = current
        .getHours()
        .toString()
        .padStart(2, "0");

      const minute = current
        .getMinutes()
        .toString()
        .padStart(2, "0");

      const formatted = `${hour}:${minute}`;

      // HIDE PAST TIME TODAY
      if (isToday) {
        const slotHour = current.getHours();
        const slotMinute = current.getMinutes();

        const isPast =
          slotHour < currentHour ||
          (slotHour === currentHour &&
            slotMinute <= currentMinute);

        if (!isPast) {
          slots.push(formatted);
        }
      } else {
        slots.push(formatted);
      }

      // NEXT 30 MIN
      current.setMinutes(
        current.getMinutes() + 30
      );
    }

    return slots;
  }, [workingDay, isToday]);

  // -----------------------------------
  // DAYS
  // -----------------------------------

  const days = Array.from(
    { length: 30 },
    (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() + i);
      return d;
    }
  );

  // -----------------------------------
  // CONTINUE
  // -----------------------------------

  const handleContinue = () => {
    if (!selectedTime) return;

    updateBooking({
      date: selectedDate,
      time: selectedTime,
    });

    goNext();
  };

  return (
    <div className="w-full max-h-full bg-white flex flex-col rounded-2xl overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center gap-3 p-5 border-b">
        <button
          onClick={goBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h2 className="text-xl font-semibold">
            Choose time
          </h2>

          <p className="text-sm text-gray-500">
            Select date and available time
          </p>
        </div>
      </div>

      <div className="p-5 space-y-6">

        {/* CALENDAR */}
        <div className="grid grid-cols-7 gap-2">
          {days.slice(0, 14).map((day, index) => {
            const isSelected =
              normalize(selectedDate) ===
              normalize(day);

            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDate(day);
                  setSelectedTime("");
                }}
                className={`p-3 rounded-lg border text-sm ${
                  isSelected
                    ? "bg-black text-white border-black"
                    : "hover:bg-gray-100"
                }`}
              >
                <div>
                  {day.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                    }
                  )}
                </div>

                <div className="font-medium">
                  {day.getDate()}
                </div>
              </button>
            );
          })}
        </div>

        {/* SLOTS */}
        <div>

          <p className="text-sm text-gray-500 mb-4">
            Available slots
          </p>

          {workingDay?.isOff ? (
            <div className="text-red-500 text-sm">
              Staff is not working this day
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {timeSlots.length > 0 ? (
                timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() =>
                      setSelectedTime(slot)
                    }
                    className={`px-4 py-2 rounded-lg border ${
                      selectedTime === slot
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No available slots
                </p>
              )}
            </div>
          )}
        </div>

        {/* CONTINUE */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedTime}
            className={`px-6 py-3 rounded-xl ${
              selectedTime
                ? "bg-black text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
};

export default Step4TimePicker;