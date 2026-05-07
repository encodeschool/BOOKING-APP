import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useBooking } from "../../../context/BookingContext";

const Step4TimePicker = () => {
  const { booking, updateBooking, goNext, goBack } = useBooking();

  const [selectedDate, setSelectedDate] = useState(
    booking.date ? new Date(booking.date) : new Date()
  );

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const today = useMemo(() => new Date(), []);
  const currentHour = today.getHours();

  const normalize = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const isToday =
    selectedDate &&
    normalize(selectedDate) === normalize(today);

  // -----------------------------
  // TIME GENERATION LOGIC
  // -----------------------------
  const generateTimeSlots = (startHour, endHour) => {
    const slots = [];
    for (let h = startHour; h < endHour; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
    return slots;
  };

  const timeSlots = useMemo(() => {
    if (!selectedPeriod) return [];

    let slots = [];

    if (selectedPeriod === "Morning") {
      slots = generateTimeSlots(8, 12);
    }

    if (selectedPeriod === "Afternoon") {
      slots = generateTimeSlots(12, 17);
    }

    if (selectedPeriod === "Evening") {
      slots = generateTimeSlots(17, 21);
    }

    // disable past time if today
    if (isToday) {
      return slots.filter((t) => {
        const hour = parseInt(t.split(":")[0]);
        return hour > currentHour;
      });
    }

    return slots;
  }, [selectedPeriod, isToday, currentHour]);

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;

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
        <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>

        <div>
          <h2 className="text-xl font-semibold">Choose time</h2>
          <p className="text-sm text-gray-500">
            Select date and available time
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 p-5 lg:grid-cols-3 gap-6">

        {/* LEFT */}
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
              const t = new Date();
              t.setDate(t.getDate() + 1);
              setSelectedDate(t);
            }}
            className="w-full border rounded-xl p-4 text-left hover:bg-gray-50"
          >
            <p className="font-medium">Tomorrow</p>
            <p className="text-xs text-gray-500">
              {days[1].toDateString()}
            </p>
          </button>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">

          {/* CALENDAR */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {days.slice(0, 14).map((day, index) => {
              const isSelected =
                normalize(selectedDate) === normalize(day);

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
                  <div>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                  <div className="font-medium">{day.getDate()}</div>
                </button>
              );
            })}
          </div>

          {/* PERIOD SELECTION */}
          <div className="flex gap-3 flex-wrap">
            {["Morning", "Afternoon", "Evening"].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setSelectedPeriod(p);
                  setSelectedTime("");
                }}
                className={`px-4 py-2 rounded-lg border ${
                  selectedPeriod === p
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* TIME SLOTS */}
          {selectedPeriod && (
            <div>
              <p className="text-sm text-gray-500 mb-3">
                Available time slots
              </p>

              <div className="flex flex-wrap gap-3">
                {timeSlots.length > 0 ? (
                  timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`px-4 py-2 rounded-lg border text-sm ${
                        selectedTime === t
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No available slots
                  </p>
                )}
              </div>
            </div>
          )}

          {/* CONTINUE */}
          <div className="flex justify-end pt-4">
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
    </div>
  );
};

export default Step4TimePicker;