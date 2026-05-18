// layouts/Sidebar.jsx

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
  FaBars,
  FaTimes,
  FaAngleLeft,
  FaAngleRight,
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

const userLinks = [
  {
    to: "/my-bookings",
    label: "My Bookings",
    icon: FaCalendarAlt,
  },
];

const staffLinks = [
  {
    to: "/calendar",
    label: "Calendar",
    icon: FaCalendarAlt,
  },
  ...userLinks
];


const superadminLinks = [
  ...baseLinks,
  ...staffLinks,
  {
    to: "/users",
    label: "Users",
    icon: FaUsers,
  },
];

export default function Sidebar({
  open,
  setOpen,
  collapsed,
  setCollapsed,
}) {
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
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col
        ${
          collapsed ? "w-24" : "w-72"
        }
        ${
          open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* TOP */}
        <div className="h-20 border-b border-gray-100 px-4 flex items-center justify-between">
          <div
            className={`flex items-center gap-3 overflow-hidden ${
              collapsed ? "justify-center w-full" : ""
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#52b46ecc] to-[#3b8f59] flex items-center justify-center shadow-lg shrink-0">
              <span className="text-white font-bold text-xl">
                B
              </span>
            </div>

            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">
                  Booking Admin
                </h1>

                <p className="text-sm text-gray-500 whitespace-nowrap">
                  Management Platform
                </p>
              </div>
            )}
          </div>

          {/* MOBILE CLOSE */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-2">
            {links.map((link) => {
              const isActive =
                location.pathname === link.to;

              const Icon = link.icon;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center ${
                    collapsed
                      ? "justify-center"
                      : "justify-between"
                  } px-3 py-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#52b46ecc] to-[#3b8f59] text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
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

                    {!collapsed && (
                      <p className="font-semibold text-sm whitespace-nowrap">
                        {link.label}
                      </p>
                    )}
                  </div>

                  {!collapsed && (
                    <FaChevronRight
                      className={`text-xs transition-transform duration-300 ${
                        isActive
                          ? "translate-x-1 text-white"
                          : "text-gray-400 group-hover:translate-x-1"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM */}
        <div className="border-t border-gray-100 p-4">
          <div
            className={`bg-gray-50 rounded-2xl p-4 ${
              collapsed ? "flex justify-center" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#52b46ecc] to-[#3b8f59] flex items-center justify-center shadow shrink-0">
                <span className="text-white font-bold">
                  {profile?.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    profile?.email
                      ?.charAt(0)
                      ?.toUpperCase() ||
                    "U"}
                </span>
              </div>

              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {profile?.name || "User"}
                  </p>

                  <p className="text-xs text-gray-500 truncate">
                    {profile?.role || "Admin"}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

                    <p className="text-xs text-gray-500">
                      System online
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLLAPSE BUTTON */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-4 top-24 w-8 h-8 rounded-full bg-white border border-gray-200 shadow items-center justify-center hover:bg-gray-50"
        >
          {collapsed ? (
            <FaAngleRight className="text-sm text-gray-600" />
          ) : (
            <FaAngleLeft className="text-sm text-gray-600" />
          )}
        </button>
      </aside>
    </>
  );
}