import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

import {
  getStaffWorkingHours,
  saveStaffWorkingHours,
} from "../../../lib/api";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function StaffWorkingHoursModal({
  token,
  staff,
  onClose,
}) {
  const [hours, setHours] = useState({});

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data =
        await getStaffWorkingHours(
          token,
          staff.id
        );

      const mapped = {};

      data.forEach((item) => {
        mapped[item.dayOfWeek] = item;
      });

      setHours(mapped);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSave(day) {
    try {
      const item = hours[day];

      await saveStaffWorkingHours(token, {
        staffId: staff.id,
        dayOfWeek: day,
        startTime: item.startTime,
        endTime: item.endTime,
        isOff: item.isOff,
      });

      alert("Saved");
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  }

  function update(day, field, value) {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b">

          <div>
            <h2 className="text-2xl font-bold">
              Staff Schedule
            </h2>

            <p className="text-gray-500 mt-1">
              {staff.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center"
          >
            <FiX />
          </button>

        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

          {DAYS.map((day) => {
            const item =
              hours[day] || {
                startTime: "09:00",
                endTime: "18:00",
                isOff: false,
              };

            return (
              <div
                key={day}
                className="border rounded-2xl p-5"
              >

                <div className="flex items-center justify-between mb-4">

                  <h3 className="font-semibold text-lg">
                    {day}
                  </h3>

                  <label className="flex items-center gap-2 text-sm">

                    <input
                      type="checkbox"
                      checked={item.isOff}
                      onChange={(e) =>
                        update(
                          day,
                          "isOff",
                          e.target.checked
                        )
                      }
                    />

                    Day Off

                  </label>

                </div>

                {!item.isOff && (
                  <div className="flex items-center gap-4">

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Start
                      </label>

                      <input
                        type="time"
                        value={
                          item.startTime || ""
                        }
                        onChange={(e) =>
                          update(
                            day,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="px-4 py-3 rounded-xl border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        End
                      </label>

                      <input
                        type="time"
                        value={
                          item.endTime || ""
                        }
                        onChange={(e) =>
                          update(
                            day,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="px-4 py-3 rounded-xl border"
                      />
                    </div>

                  </div>
                )}

                <button
                  onClick={() =>
                    handleSave(day)
                  }
                  className="mt-4 px-5 py-2 bg-black text-white rounded-xl"
                >
                  Save
                </button>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}