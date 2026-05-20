import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { useAuth } from "../../app/providers/AuthProvider";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/booking", label: "Book Now" },
  { to: "/map", label: "Map" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, profile, logout } = useAuth();

  const userName = profile?.fullName || profile?.name || profile?.email || "Guest";
  const userInitial = userName?.charAt(0).toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200"
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-3xl bg-gradient-to-br from-primary-600 to-violet-600 shadow-lg shadow-primary-500/20 flex items-center justify-center text-white text-lg font-bold">
              B
            </div>
            <div className="hidden sm:block">
              <p className="text-lg font-semibold text-slate-900">BookEase</p>
              <p className="text-sm text-slate-500">Beauty booking platform</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/booking" className="btn-primary whitespace-nowrap">
              Book now
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/my-bookings"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  My bookings
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
                >
                  {userInitial}
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Sign in
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 transition"
            aria-label="Open navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="hidden lg:block border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Seamless booking for salons, spas, and wellness businesses with a clean, responsive interface.
          </p>
          <Link to="/services" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Discover services
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded-3xl px-4 py-4 text-base font-medium transition ${
                      isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6 space-y-4">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/my-bookings"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-3xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 transition"
                  >
                    My bookings
                  </NavLink>
                  <NavLink
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-3xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 transition"
                  >
                    Profile
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-3xl bg-rose-500 px-4 py-3 text-base font-medium text-white hover:bg-rose-600 transition"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-3xl bg-slate-900 px-4 py-3 text-center text-base font-medium text-white hover:bg-slate-800 transition"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
