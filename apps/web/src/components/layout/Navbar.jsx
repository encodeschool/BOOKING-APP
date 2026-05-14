import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  MapPin,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [treatmentsOpen, setTreatmentsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("Any time");
  const [location, setLocation] = useState("Riga, Latvia");
  const [treatment, setTreatment] = useState("All treatments");

  const menuRef = useRef();
  const timeRef = useRef();
  const locationRef = useRef();
  const treatmentsRef = useRef();

  const today = new Date();
  const currentHour = today.getHours();

  const normalizeDate = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const todayNormalized = normalizeDate(today);

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }

      if (timeRef.current && !timeRef.current.contains(e.target)) {
        setTimeOpen(false);
      }

      if (
        locationRef.current &&
        !locationRef.current.contains(e.target)
      ) {
        setLocationOpen(false);
      }

      if (
        treatmentsRef.current &&
        !treatmentsRef.current.contains(e.target)
      ) {
        setTreatmentsOpen(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isToday =
    selectedDate &&
    normalizeDate(selectedDate) === todayNormalized;

  const isMorningDisabled = isToday && currentHour >= 12;
  const isAfternoonDisabled = isToday && currentHour >= 17;
  const isEveningDisabled = isToday && currentHour >= 21;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-2xl border-b border-gray-200 shadow-sm"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="h-16 flex items-center justify-between gap-4">

            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0"
            >
              <div className="w-9 h-9 rounded-md bg-black text-white flex items-center justify-center font-bold">
                EN
              </div>

              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-lg font-bold text-gray-900">
                  enroll
                </span>
                <span className="text-[11px] text-gray-500">
                  beauty booking
                </span>
              </div>
            </Link>

            {/* DESKTOP SEARCH */}
            <div className="hidden xl:flex items-center bg-white border border-gray-200 shadow-sm rounded-full h-14 px-2 w-full max-w-3xl">

              {/* TREATMENTS */}
              <div
                className="relative flex-1"
                ref={treatmentsRef}
              >
                <button
                  onClick={() =>
                    setTreatmentsOpen(!treatmentsOpen)
                  }
                  className="w-full px-5 py-2 text-left rounded-full hover:bg-gray-100 transition"
                >
                  <p className="text-xs text-gray-500">
                    Treatment
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {treatment}
                    </span>

                    <ChevronDown size={16} />
                  </div>
                </button>

                {treatmentsOpen && (
                  <div className="absolute top-16 left-0 w-[360px] bg-white border border-gray-200 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-sm font-semibold mb-4">
                      Popular treatments
                    </p>

                    <div className="space-y-2">
                      {[
                        "Haircut",
                        "Massage",
                        "Facial",
                        "Manicure",
                        "Spa",
                        "Barber",
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setTreatment(item);
                            setTreatmentsOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-2xl hover:bg-gray-100 transition text-sm font-medium"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-gray-200" />

              {/* LOCATION */}
              <div
                className="relative flex-1"
                ref={locationRef}
              >
                <button
                  onClick={() =>
                    setLocationOpen(!locationOpen)
                  }
                  className="w-full px-5 py-2 text-left rounded-full hover:bg-gray-100 transition"
                >
                  <p className="text-xs text-gray-500">
                    Location
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {location}
                    </span>

                    <ChevronDown size={16} />
                  </div>
                </button>

                {locationOpen && (
                  <div className="absolute top-16 left-0 w-[320px] bg-white border border-gray-200 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-sm font-semibold mb-4">
                      Choose location
                    </p>

                    <div className="space-y-2">
                      {[
                        "Current location",
                        "Riga, Latvia",
                        "Old Town Riga",
                        "Jurmala",
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setLocation(item);
                            setLocationOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 transition"
                        >
                          <MapPin
                            size={16}
                            className="text-gray-500"
                          />

                          <span className="text-sm font-medium">
                            {item}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-gray-200" />

              {/* TIME */}
              <div className="relative flex-1" ref={timeRef}>
                <button
                  onClick={() => setTimeOpen(!timeOpen)}
                  className="w-full px-5 py-2 text-left rounded-full hover:bg-gray-100 transition"
                >
                  <p className="text-xs text-gray-500">
                    Date & time
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {selectedDate
                        ? `${selectedDate.toDateString()} • ${selectedTime}`
                        : "Any time"}
                    </span>

                    <ChevronDown size={16} />
                  </div>
                </button>

                {timeOpen && (
                  <div className="absolute top-16 right-0 w-[500px] bg-white border border-gray-200 rounded-3xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-sm font-semibold mb-4">
                      Select date
                    </p>

                    <div className="grid grid-cols-7 gap-2 mb-6">
                      {days.map((d) => {
                        const date = new Date(
                          today.getFullYear(),
                          today.getMonth(),
                          d
                        );

                        const isSelected =
                          selectedDate &&
                          normalizeDate(selectedDate) ===
                            normalizeDate(date);

                        return (
                          <button
                            key={d}
                            onClick={() =>
                              setSelectedDate(date)
                            }
                            className={`h-10 rounded-xl text-sm transition ${
                              isSelected
                                ? "bg-black text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-sm font-semibold mb-3">
                      Time
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {[
                        {
                          label: "Any time",
                          disabled: false,
                        },
                        {
                          label: "Morning",
                          disabled: isMorningDisabled,
                        },
                        {
                          label: "Afternoon",
                          disabled: isAfternoonDisabled,
                        },
                        {
                          label: "Evening",
                          disabled: isEveningDisabled,
                        },
                      ].map((t) => (
                        <button
                          key={t.label}
                          disabled={t.disabled}
                          onClick={() =>
                            setSelectedTime(t.label)
                          }
                          className={`px-4 py-2 rounded-xl border text-sm transition ${
                            selectedTime === t.label
                              ? "bg-black text-white border-black"
                              : "hover:bg-gray-100"
                          } ${
                            t.disabled
                              ? "opacity-40 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SEARCH BUTTON */}
              <button className="ml-2 w-11 h-11 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition">
                <Search size={18} />
              </button>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              {/* DESKTOP LINKS */}
              <div className="hidden lg:flex items-center gap-6">
                <Link
                  to="/services"
                  className="text-sm font-medium text-gray-700 hover:text-black transition"
                >
                  Services
                </Link>

                <Link
                  to="/map"
                  className="text-sm font-medium text-gray-700 hover:text-black transition"
                >
                  Map
                </Link>

                <Link
                  to="/login"
                  className="px-5 h-11 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium hover:opacity-90 transition"
                >
                  Sign in
                </Link>
              </div>

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="xl:hidden w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* PROFILE MENU */}
              <div className="hidden xl:block relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <Menu size={18} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-14 w-72 bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                      {[
                        {
                          label: "All Services",
                          to: "/services",
                        },
                        {
                          label: "Book Now",
                          to: "/booking",
                        },
                        {
                          label: "Map",
                          to: "/map",
                        },
                        {
                          label: "About",
                          to: "/about",
                        },
                        {
                          label: "Contact",
                          to: "/contact",
                        },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="block px-4 py-3 rounded-2xl hover:bg-gray-100 transition text-sm font-medium"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MOBILE SEARCH */}
          <div className="xl:hidden pb-4">
            <button className="w-full bg-white border border-gray-200 rounded-2xl h-14 px-4 flex items-center gap-3 shadow-sm">
              <Search size={18} className="text-gray-500" />

              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  Search treatments
                </p>

                <p className="text-xs text-gray-500">
                  Nearby • Any time
                </p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 xl:hidden transition-all duration-300 ${
          isOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      >
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${
            isOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          <div className="h-16 px-5 border-b flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">
                enroll
              </h2>

              <p className="text-xs text-gray-500">
                beauty booking
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5 space-y-2">
            {[
              {
                label: "Home",
                to: "/",
              },
              {
                label: "Services",
                to: "/services",
              },
              {
                label: "Map",
                to: "/map",
              },
              {
                label: "Booking",
                to: "/booking",
              },
              {
                label: "About",
                to: "/about",
              },
              {
                label: "Contact",
                to: "/contact",
              },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-4 rounded-2xl hover:bg-gray-100 transition text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-6">
              <Link
                to="/login"
                className="w-full h-12 rounded-2xl bg-black text-white flex items-center justify-center font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;