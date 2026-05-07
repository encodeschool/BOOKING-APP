import { useAuth } from "../../../app/providers/AuthProvider";
import { useBusiness } from "../../../app/providers/BusinessProvider";

import {
  FaBuilding,
  FaChevronDown,
  FaPlus,
} from "react-icons/fa";

export default function DashboardHeader() {
  const { profile } = useAuth();

  const {
    businesses,
    selectedBusinessId,
    setSelectedBusinessId,
  } = useBusiness();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#52b46ecc] via-[#3f9f5f] to-[#2f7d49] p-8 text-white shadow-2xl">

      {/* BACKGROUND CIRCLES */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* LEFT */}
        <div>

          <p className="text-white/80 text-sm mb-2">
            Welcome back
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            {profile?.name || "Dashboard"}
          </h1>

          <p className="text-white/80 mt-3 max-w-2xl">
            Manage your businesses, appointments,
            services, staff, and analytics in one place.
          </p>

        </div>

        {/* RIGHT */}
        <div className="flex flex-col sm:flex-row gap-4">

          {/* BUSINESS SELECT */}
          <div className="relative">

            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
              <FaBuilding />
            </div>

            <select
              value={selectedBusinessId || ""}
              onChange={(e) =>
                setSelectedBusinessId(
                  Number(e.target.value)
                )
              }
              className="appearance-none bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl h-14 pl-12 pr-12 min-w-[260px] outline-none focus:ring-2 focus:ring-white/40"
            >

              <option
                value=""
                disabled
                className="text-black"
              >
                Select Business
              </option>

              {businesses.map((business) => (
                <option
                  key={business.id}
                  value={business.id}
                  className="text-black"
                >
                  {business.name}
                </option>
              ))}

            </select>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none">
              <FaChevronDown />
            </div>

          </div>

          {/* ACTION BUTTON */}
          <button className="h-14 px-6 rounded-2xl bg-white text-[#2f7d49] font-semibold flex items-center gap-3 hover:scale-[1.02] transition-all shadow-lg">

            <FaPlus />

            New Booking

          </button>

        </div>

      </div>

    </div>
  );
}