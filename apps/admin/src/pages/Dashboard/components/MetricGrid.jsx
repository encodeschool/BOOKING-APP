import { useEffect, useState } from "react";
import { useBusiness } from "../../../app/providers/BusinessProvider";

export default function MetricGrid() {
  const { selectedBusinessId } = useBusiness();
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedBusinessId) {
      // Simulate fetching metrics
      setLoading(true);
      setTimeout(() => {
        setMetrics([
          { label: "Revenue", value: "$0.00", icon: "💰" },
          { label: "Bookings", value: "0", icon: "📅" },
          { label: "Pending", value: "0", icon: "⏳" },
          { label: "Completed", value: "0", icon: "✅" },
        ]);
        setLoading(false);
      }, 1000);
    } else {
      setMetrics([]);
      setLoading(false);
    }
  }, [selectedBusinessId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{m.icon}</span>
            <p className="text-gray-500 text-sm font-medium">{m.label}</p>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{m.value}</h2>
        </div>
      ))}
    </div>
  );
}