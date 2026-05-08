import { useAuth } from "../../app/providers/AuthProvider";
import { useBusiness } from "../../app/providers/BusinessProvider";

import {
  FaBell,
  FaChevronDown,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Topbar() {
  const { profile, logout } = useAuth();

  const {
    businesses,
    selectedBusinessId,
    setSelectedBusinessId,
  } = useBusiness();

  const firstName =
    profile?.name?.split(" ")[0] || "Admin";

  return (
    <header className="ml-72 sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200">

      <div className="h-20 px-8 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-6">

          {/* GREETING */}
          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Good morning, {firstName} 👋
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Welcome back to your dashboard
            </p>

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-2xl px-4 h-12 min-w-[260px]">

            <FaSearch className="text-gray-400 text-sm" />

            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none px-3 text-sm w-full text-gray-700 placeholder:text-gray-400"
            />

          </div>

          {/* BUSINESS SELECTOR */}
          <div className="relative">

            <select
              value={selectedBusinessId || ""}
              onChange={(e) =>
                setSelectedBusinessId(Number(e.target.value))
              }
              className="appearance-none bg-white border border-gray-200 rounded-2xl h-12 pl-4 pr-10 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#52b46ecc]"
            >

              <option value="" disabled>
                Select Business
              </option>

              {businesses.map((business) => (
                <option
                  key={business.id}
                  value={business.id}
                >
                  {business.name}
                </option>
              ))}

            </select>

            <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none">

              <FaChevronDown className="text-xs text-gray-400" />

            </div>

          </div>

          {/* NOTIFICATION */}
          <button className="relative w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center">

            <FaBell className="text-gray-600 text-sm" />

            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500"></span>

          </button>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="w-12 h-12 rounded-2xl bg-red-50 hover:bg-red-100 text-red-500 transition flex items-center justify-center"
            title="Logout"
          >

            <FaSignOutAlt className="text-sm" />

          </button>

        </div>

      </div>

    </header>
  );
}