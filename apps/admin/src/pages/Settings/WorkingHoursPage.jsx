import { useEffect, useState } from "react";
import {
  FaClock,
  FaSave,
  FaSpinner,
  FaPlus,
  FaCheckCircle,
} from "react-icons/fa";
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
  const [savingDay, setSavingDay] = useState(null);

  useEffect(() => {
    if (token && selectedBusinessId) {
      load();
    }
  }, [token, selectedBusinessId]);

  async function load() {
    try {
      setLoading(true);

      const data = await getWorkingHours(
        token,
        selectedBusinessId
      );

      const mapped = {};

      DAYS.forEach((d) => {
        const found = data?.find(
          (h) => h.dayOfWeek === d
        );

        mapped[d] = found || {
          dayOfWeek: d,
          startTime: "09:00",
          endTime: "18:00",
          isClosed: false,
        };
      });

      setHours(mapped);
    } catch (error) {
      console.error(
        "Failed to load working hours:",
        error
      );

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
      setSavingDay(day);

      await saveWorkingHours(token, {
        businessId: Number(selectedBusinessId),
        ...hours[day],
      });

      setTimeout(() => {
        setSavingDay(null);
      }, 600);
    } catch (error) {
      console.error(
        "Failed to save working hours:",
        error
      );
      setSavingDay(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-8 text-white shadow-2xl">
        {/* Background circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <FaClock className="text-2xl" />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Working Hours
                </h1>

                <p className="text-green-100 mt-1">
                  Configure your business schedule
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              alert(
                "Custom settings coming soon"
              )
            }
            className="flex items-center gap-2 bg-white text-green-700 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition-all shadow-lg"
          >
            <FaPlus />
            Add Setting
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center justify-center py-10">
            <FaSpinner className="animate-spin text-4xl text-green-600 mb-4" />

            <p className="text-gray-500 text-lg">
              Loading working hours...
            </p>
          </div>
        </div>
      )}

      {/* CONTENT */}
      {!loading && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* TABLE HEADER */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Weekly Schedule
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage opening and closing hours
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <FaCheckCircle className="text-green-500" />
                Auto-save enabled
              </div>
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Day
                  </th>

                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Opening
                  </th>

                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Closing
                  </th>

                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-8 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {DAYS.map((day) => {
                  const item = hours[day];

                  return (
                    <tr
                      key={day}
                      className="hover:bg-gray-50/70 transition"
                    >
                      {/* DAY */}
                      <td className="px-8 py-5">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {day.charAt(0) +
                              day
                                .slice(1)
                                .toLowerCase()}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            Business schedule
                          </p>
                        </div>
                      </td>

                      {/* START */}
                      <td className="px-8 py-5">
                        <input
                          type="time"
                          disabled={item?.isClosed}
                          value={
                            item?.startTime || ""
                          }
                          onChange={(e) =>
                            setHours({
                              ...hours,
                              [day]: {
                                ...item,
                                startTime:
                                  e.target.value,
                              },
                            })
                          }
                          className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        />
                      </td>

                      {/* END */}
                      <td className="px-8 py-5">
                        <input
                          type="time"
                          disabled={item?.isClosed}
                          value={
                            item?.endTime || ""
                          }
                          onChange={(e) =>
                            setHours({
                              ...hours,
                              [day]: {
                                ...item,
                                endTime:
                                  e.target.value,
                              },
                            })
                          }
                          className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        />
                      </td>

                      {/* STATUS */}
                      <td className="px-8 py-5">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={
                                item?.isClosed ||
                                false
                              }
                              onChange={(e) =>
                                setHours({
                                  ...hours,
                                  [day]: {
                                    ...item,
                                    isClosed:
                                      e.target
                                        .checked,
                                  },
                                })
                              }
                              className="sr-only"
                            />

                            <div
                              className={`w-12 h-6 rounded-full transition ${
                                item?.isClosed
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition ${
                                  item?.isClosed
                                    ? "left-6"
                                    : "left-0.5"
                                }`}
                              ></div>
                            </div>
                          </div>

                          <span
                            className={`text-sm font-medium ${
                              item?.isClosed
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {item?.isClosed
                              ? "Closed"
                              : "Open"}
                          </span>
                        </label>
                      </td>

                      {/* ACTION */}
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => save(day)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
                        >
                          {savingDay === day ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <FaSave />
                              Save
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="lg:hidden p-5 space-y-4">
            {DAYS.map((day) => {
              const item = hours[day];

              return (
                <div
                  key={day}
                  className="border border-gray-100 rounded-2xl p-5"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">
                      {day.charAt(0) +
                        day.slice(1).toLowerCase()}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        item?.isClosed
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item?.isClosed
                        ? "Closed"
                        : "Open"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <input
                      type="time"
                      disabled={item?.isClosed}
                      value={item?.startTime || ""}
                      onChange={(e) =>
                        setHours({
                          ...hours,
                          [day]: {
                            ...item,
                            startTime:
                              e.target.value,
                          },
                        })
                      }
                      className="border border-gray-200 rounded-xl px-4 py-3"
                    />

                    <input
                      type="time"
                      disabled={item?.isClosed}
                      value={item?.endTime || ""}
                      onChange={(e) =>
                        setHours({
                          ...hours,
                          [day]: {
                            ...item,
                            endTime:
                              e.target.value,
                          },
                        })
                      }
                      className="border border-gray-200 rounded-xl px-4 py-3"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          item?.isClosed || false
                        }
                        onChange={(e) =>
                          setHours({
                            ...hours,
                            [day]: {
                              ...item,
                              isClosed:
                                e.target.checked,
                            },
                          })
                        }
                      />

                      <span className="text-sm text-gray-600">
                        Closed
                      </span>
                    </label>

                    <button
                      onClick={() => save(day)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Save
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}