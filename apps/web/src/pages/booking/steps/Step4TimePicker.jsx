import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useBooking } from "../../../context/BookingContext";

const Step4TimePicker = () => {
  const { booking, updateBooking, goNext, goBack } = useBooking();

  const [selectedDate, setSelectedDate] = useState(
    booking.date ? new Date(booking.date) : new Date()
  );

  const [selectedTime, setSelectedTime] = useState(
    booking.time || ""
  );

  const today = useMemo(() => new Date(), []);
  const currentHour = today.getHours();

  const normalize = (d) =>
    new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    ).getTime();

  const isToday =
    selectedDate &&
    normalize(selectedDate) === normalize(today);

  const isMorningDisabled = isToday && currentHour >= 12;
  const isAfternoonDisabled = isToday && currentHour >= 17;
  const isEveningDisabled = isToday && currentHour >= 21;

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });

  const timeOptions = [
    {
      label: "Any time",
      disabled: false,
    },
    {
      label: "Morning",
      disabled: isMorningDisabled,
    },
    {
      label: "Afternoon",
      disabled: isAfternoonDisabled,
    },
    {
      label: "Evening",
      disabled: isEveningDisabled,
    },
  ];

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;

    updateBooking({
      date: selectedDate,
      time: selectedTime,
    });

    goNext();
  };

  return (
    <div className="w-full bg-white p-6">

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
            Choose time
          </h2>
        </div>

      </div>

      <div className="grid grid-cols-1 p-5 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="space-y-3">

          <button
            onClick={() => setSelectedDate(new Date())}
            className="w-full border rounded-xl p-4 text-left hover:bg-gray-50"
          >
            <p className="font-medium">Today</p>

            <p className="text-xs text-gray-500">
              {today.toDateString()}
            </p>
          </button>

          <button
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);

              setSelectedDate(tomorrow);
            }}
            className="w-full border rounded-xl p-4 text-left hover:bg-gray-50"
          >
            <p className="font-medium">Tomorrow</p>

            <p className="text-xs text-gray-500">
              {days[1].toDateString()}
            </p>
          </button>

        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2">

          {/* CALENDAR */}
          <div className="grid grid-cols-7 gap-2 text-center mb-6">

            {days.slice(0, 14).map((day, index) => {
              const isSelected =
                selectedDate &&
                normalize(selectedDate) === normalize(day);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`p-3 rounded-lg text-sm border transition ${
                    isSelected
                      ? "bg-black text-white border-black"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium">
                    {day.toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </div>

                  <div>
                    {day.getDate()}
                  </div>
                </button>
              );
            })}

          </div>

          {/* TIME SLOTS */}
          <p className="text-sm text-gray-500 mb-3">
            Select time
          </p>

          <div className="flex flex-wrap gap-3">

            {timeOptions.map((time) => (
              <button
                key={time.label}
                disabled={time.disabled}
                onClick={() => setSelectedTime(time.label)}
                className={`px-4 py-2 rounded-lg border text-sm transition ${
                  time.disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-100"
                } ${
                  selectedTime === time.label
                    ? "bg-black text-white border-black"
                    : ""
                }`}
              >
                {time.label}
              </button>
            ))}

          </div>

          {/* CONTINUE BUTTON */}
          <div className="mt-8 flex justify-end">

            <button
              onClick={handleContinue}
              disabled={!selectedTime}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                selectedTime
                  ? "bg-black text-white hover:opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Step4TimePicker;