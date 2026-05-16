import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";

import {
  FaHome,
  FaBuilding,
  FaConciergeBell,
  FaUsers,
  FaUserTie,
  FaCog,
  FaCalendarAlt,
  FaChevronRight,
} from "react-icons/fa";

const baseLinks = [
  {
    to: "/",
    label: "Dashboard",
    icon: FaHome,
  },
  {
    to: "/businesses",
    label: "Businesses",
    icon: FaBuilding,
  },
  {
    to: "/services",
    label: "Services",
    icon: FaConciergeBell,
  },
  {
    to: "/staff",
    label: "Staff",
    icon: FaUserTie,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: FaCog,
  },
];

const staffLinks = [
  {
    to: "/calendar",
    label: "Calendar",
    icon: FaCalendarAlt,
  },
];

const userLinks = [
  {
    to: "/my-bookings",
    label: "My Bookings",
    icon: FaCalendarAlt,
  },
];

const superadminLinks = [
  ...baseLinks,
  ...staffLinks,
  {
    to: "/users",
    label: "Users",
    icon: FaUsers,
  },
  ...userLinks
];

export default function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  const getLinks = () => {
    if (!profile?.role) return baseLinks;

    switch (profile.role.toUpperCase()) {
      case "ADMIN":
        return superadminLinks;

      case "CLIENT":
        return userLinks;

      case "STAFF":
        return staffLinks;

      default:
        return baseLinks;
    }
  };

  const links = getLinks();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 z-50 flex flex-col">

      {/* TOP BRAND */}
      <div className="px-6 py-7 border-b border-gray-100">

        <div className="flex items-center gap-3">

          {/* LOGO */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#52b46ecc] to-[#3b8f59] flex items-center justify-center shadow-lg">

            <span className="text-white font-bold text-xl">
              B
            </span>

          </div>

          {/* BRAND */}
          <div>

            <h1 className="text-lg font-bold text-gray-900">
              Booking Admin
            </h1>

            <p className="text-sm text-gray-500">
              Management Platform
            </p>

          </div>

        </div>

      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">

        <div className="space-y-2">

          {links.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`group relative flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#52b46ecc] to-[#3b8f59] text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >

                {/* LEFT */}
                <div className="flex items-center gap-4">

                  {/* ICON */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-white/20"
                        : "bg-gray-100 group-hover:bg-white"
                    }`}
                  >
                    <Icon
                      className={`text-lg ${
                        isActive
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    />
                  </div>

                  {/* LABEL */}
                  <div>

                    <p className="font-semibold text-sm">
                      {link.label}
                    </p>

                  </div>

                </div>

                {/* RIGHT ICON */}
                <FaChevronRight
                  className={`text-xs transition-transform duration-300 ${
                    isActive
                      ? "translate-x-1 text-white"
                      : "text-gray-400 group-hover:translate-x-1"
                  }`}
                />

              </Link>
            );
          })}

        </div>

      </nav>

      {/* BOTTOM USER */}
      <div className="p-4 border-t border-gray-100">

        <div className="bg-gray-50 rounded-2xl p-4">

          <div className="flex items-center gap-3">

            {/* AVATAR */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#52b46ecc] to-[#3b8f59] flex items-center justify-center shadow">

              <span className="text-white font-bold">
                {profile?.name?.charAt(0)?.toUpperCase() ||
                  profile?.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </span>

            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">

              <p className="text-sm font-semibold text-gray-900 truncate">
                {profile?.name || "User"}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {profile?.role || "Admin"}
              </p>

            </div>

          </div>

          {/* STATUS */}
          <div className="mt-4 flex items-center gap-2">

            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

            <p className="text-xs text-gray-500">
              System online
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}