import DashboardHeader from "./components/DashboardHeader";
import MetricGrid from "./components/MetricGrid";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <DashboardHeader />

      {/* METRICS */}
      <MetricGrid />

    </div>
  );
}