import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";

const baseLinks = [
  { to: "/", label: "Dashboard", icon: "􀎟" }, // SF Symbol for chart.bar.fill
  { to: "/businesses", label: "Businesses", icon: "􀤨" }, // SF Symbol for building.2.fill
  { to: "/services", label: "Services", icon: "􀈎" }, // SF Symbol for wrench.and.screwdriver.fill
  { to: "/staff", label: "Staff", icon: "􀉩" }, // SF Symbol for person.2.fill
  { to: "/settings", label: "Settings", icon: "􀣋" }, // SF Symbol for gear
];

const superadminLinks = [
  ...baseLinks,
  { to: "/users", label: "Users", icon: "􀉩" }, // SF Symbol for person.fill
];

const userLinks = [
  ...baseLinks,
  { to: "/users", label: "Users", icon: "􀉩" },
];

const staffLinks = [
  { to: "/", label: "Dashboard", icon: "􀎟" },
  { to: "/calendar", label: "Calendar", icon: "􀉉" }, // SF Symbol for calendar
  { to: "/settings", label: "Settings", icon: "􀣋" },
];

export default function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  const getLinks = () => {
    if (!profile?.role) return baseLinks;
    switch (profile.role.toUpperCase()) {
      case "SUPERADMIN":
        return superadminLinks;
      case "USER":
        return userLinks;
      case "STAFF":
        return staffLinks;
      default:
        return baseLinks;
    }
  };

  const links = getLinks();

  return (
    <aside className="fixed left-0 top-0 h-full w-72 glass shadow-soft z-40">
      <div className="flex flex-col h-full p-6">
        {/* Logo/Brand */}
        <div className="mb-12">
          <h1 className="text-xl font-semibold text-gray-900">Booking Admin</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === link.to
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span
                className={`text-lg mr-3 transition-colors ${
                  location.pathname === link.to ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                }`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display"' }}
              >
                {link.icon}
              </span>
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {profile?.name?.charAt(0)?.toUpperCase() || profile?.email?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {profile?.role || "Admin"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}