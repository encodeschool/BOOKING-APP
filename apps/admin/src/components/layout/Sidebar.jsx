import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/businesses", label: "Businesses", icon: "🏢" },
  { to: "/services", label: "Services", icon: "🛠️" },
  { to: "/staff", label: "Staff", icon: "👥" },
  { to: "/bookings", label: "Bookings", icon: "📅" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-6 text-center">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === link.to
                ? "bg-blue-700 text-white"
                : "hover:bg-blue-500"
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}