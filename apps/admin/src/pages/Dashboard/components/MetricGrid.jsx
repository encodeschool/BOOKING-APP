import { useEffect, useState } from "react";

import { useBusiness } from "../../../app/providers/BusinessProvider";

import {
  FaMoneyBillWave,
  FaCalendarCheck,
  FaClock,
  FaArrowTrendUp,
} from "react-icons/fa6";

import {
  FaCheckCircle
} from "react-icons/fa";

export default function MetricGrid() {
  const { selectedBusinessId } = useBusiness();

  const [metrics, setMetrics] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedBusinessId) {
      setLoading(true);

      setTimeout(() => {
        setMetrics([
          {
            label: "Revenue",
            value: "$12,450",
            growth: "+18%",
            icon: FaMoneyBillWave,
          },
          {
            label: "Bookings",
            value: "248",
            growth: "+12%",
            icon: FaCalendarCheck,
          },
          {
            label: "Pending",
            value: "16",
            growth: "+4%",
            icon: FaClock,
          },
          {
            label: "Completed",
            value: "189",
            growth: "+22%",
            icon: FaCheckCircle,
          },
        ]);

        setLoading(false);
      }, 1000);
    } else {
      setMetrics([]);
      setLoading(false);
    }
  }, [selectedBusinessId]);

  // LOADING
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse"
          >

            <div className="w-14 h-14 bg-gray-200 rounded-2xl mb-6"></div>

            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>

            <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>

            <div className="h-3 bg-gray-200 rounded w-16"></div>

          </div>
        ))}

      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="group relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >

            {/* BG GRADIENT */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#52b46ecc]/10 rounded-full blur-3xl"></div>

            {/* CONTENT */}
            <div className="relative z-10">

              {/* ICON */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#52b46ecc] to-[#2f7d49] flex items-center justify-center text-white shadow-lg mb-6">

                <Icon className="text-xl" />

              </div>

              {/* LABEL */}
              <p className="text-sm font-medium text-gray-500 mb-2">
                {metric.label}
              </p>

              {/* VALUE */}
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                {metric.value}
              </h2>

              {/* GROWTH */}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-semibold">

                <FaArrowTrendUp className="text-xs" />

                {metric.growth}

              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
}