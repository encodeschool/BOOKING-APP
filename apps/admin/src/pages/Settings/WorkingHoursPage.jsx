import { useEffect, useState } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { useBusiness } from "../../app/providers/BusinessProvider";
import { getWorkingHours, saveWorkingHours } from "../../lib/api";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function WorkingHoursPage() {
  const { token } = useAuth();
  const { selectedBusinessId } = useBusiness();

  const [hours, setHours] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && selectedBusinessId) {
      load();
    }
  }, [token, selectedBusinessId]);

  async function load() {
    try {
      setLoading(true);
      const data = await getWorkingHours(token, selectedBusinessId);

      const mapped = {};
      DAYS.forEach((d) => {
        const found = data?.find((h) => h.dayOfWeek === d);
        mapped[d] = found || {
          dayOfWeek: d,
          startTime: "09:00",
          endTime: "18:00",
          isClosed: false,
        };
      });

      setHours(mapped);
    } catch (error) {
      console.error("Failed to load working hours:", error);
      const mapped = {};
      DAYS.forEach((d) => {
        mapped[d] = {
          dayOfWeek: d,
          startTime: "09:00",
          endTime: "18:00",
          isClosed: false,
        };
      });
      setHours(mapped);
    } finally {
      setLoading(false);
    }
  }

  async function save(day) {
    try {
      await saveWorkingHours(token, {
        businessId: Number(selectedBusinessId),
        ...hours[day],
      });
    } catch (error) {
      console.error("Failed to save working hours:", error);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Working Hours</h1>
        <button
          onClick={() => alert("Add custom setting not implemented")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span> Add Setting
        </button>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading working hours...</p>
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Closed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {DAYS.map((day) => (
              <tr key={day} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {day}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="time"
                    value={hours[day]?.startTime || ""}
                    onChange={(e) =>
                      setHours({
                        ...hours,
                        [day]: {
                          ...hours[day],
                          startTime: e.target.value,
                        },
                      })
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="time"
                    value={hours[day]?.endTime || ""}
                    onChange={(e) =>
                      setHours({
                        ...hours,
                        [day]: {
                          ...hours[day],
                          endTime: e.target.value,
                        },
                      })
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="checkbox"
                    checked={hours[day]?.isClosed || false}
                    onChange={(e) =>
                      setHours({
                        ...hours,
                        [day]: {
                          ...hours[day],
                          isClosed: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => save(day)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}