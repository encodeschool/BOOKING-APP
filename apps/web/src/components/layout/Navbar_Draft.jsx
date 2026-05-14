import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, MapPin } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [treatmentsOpen, setTreatmentsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("Any time");
  const [location, setLocation] = useState("Current location");
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

  // close dropdowns on outside click
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // disable logic (ONLY for TODAY)
  const isToday =
    selectedDate &&
    normalizeDate(selectedDate) === todayNormalized;

  const isMorningDisabled = isToday && currentHour >= 12;
  const isAfternoonDisabled = isToday && currentHour >= 17;
  const isEveningDisabled = isToday && currentHour >= 21;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300
      ${scrolled
        ? "bg-white/60 backdrop-blur-xl border-b border-gray-200 shadow-sm"
        : "bg-white border-b"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">

        {/* TOP BAR */}
        <div className="flex items-center justify-between h-16 gap-4">

          {/* LOGO */}
          <Link to="/" className="text-xl font-bold">
            BookEase
          </Link>

          {/* SEARCH BAR */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-2 py-1 w-full max-w-xl">

            {/* TREATMENTS */}
            <div className="relative w-1/3" ref={treatmentsRef}>

              <input
                readOnly
                value={treatment}
                onClick={() => setTreatmentsOpen(!treatmentsOpen)}
                className="bg-transparent px-3 py-1 w-full cursor-pointer outline-none"
              />

              {treatmentsOpen && (
                <div className="absolute top-12 left-0 w-[420px] bg-white border rounded-xl shadow-xl z-50 overflow-hidden">

                  {/* FILTER HEADER */}
                  <div className="p-3 border-b">
                    <p className="text-sm font-semibold">Filter results</p>

                    <div className="flex gap-2 mt-2 text-xs">
                      <button className="px-2 py-1 border rounded-full bg-black text-white">
                        All
                      </button>
                      <button className="px-2 py-1 border rounded-full">
                        Treatments
                      </button>
                      <button className="px-2 py-1 border rounded-full">
                        Venues
                      </button>
                      <button className="px-2 py-1 border rounded-full">
                        Professionals
                      </button>
                    </div>
                  </div>

                  {/* RECENTS */}
                  <div className="p-3 border-b">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">Recents</p>
                      <button
                        onClick={() => setTreatment("All treatments")}
                        className="text-xs text-blue-600"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="mt-2 space-y-2">

                      <div
                        onClick={() => {
                          setTreatment("All treatments");
                          setTreatmentsOpen(false);
                        }}
                        className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        All treatments
                      </div>

                      <div
                        onClick={() => {
                          setTreatment("Massage");
                          setTreatmentsOpen(false);
                        }}
                        className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        Massage
                      </div>

                    </div>
                  </div>

                  {/* RESULTS */}
                  <div className="p-3">

                    <p className="text-xs text-gray-500 mb-2">
                      Suggestions
                    </p>

                    <div className="space-y-2">

                      <div
                        onClick={() => {
                          setTreatment("Haircut");
                          setTreatmentsOpen(false);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full" />
                        <div>
                          <p className="text-sm font-medium">Haircut</p>
                          <p className="text-xs text-gray-500">
                            Hair services
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => {
                          setTreatment("Facial");
                          setTreatmentsOpen(false);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full" />
                        <div>
                          <p className="text-sm font-medium">Facial</p>
                          <p className="text-xs text-gray-500">
                            Skincare
                          </p>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}
            </div>

            <div className="h-5 w-px bg-gray-300"></div>

            {/* LOCATION DROPDOWN */}
            <div className="relative w-1/3" ref={locationRef}>

              <div
                onClick={() => setLocationOpen(!locationOpen)}
                className="flex items-center gap-2 px-3 py-1 cursor-pointer"
              >
                <MapPin size={14} className="text-gray-500" />
                <span className="text-sm truncate">
                  {location}
                </span>
              </div>

              {locationOpen && (
                <div className="absolute top-12 left-0 w-[320px] bg-white border rounded-xl shadow-xl z-50 overflow-hidden">

                  <div className="p-2">

                    {/* CURRENT LOCATION */}
                    <div
                      onClick={() => {
                        setLocation("Current location");
                        setLocationOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg"
                    >
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Current location
                        </p>
                        <p className="text-xs text-gray-500">
                          Use GPS location
                        </p>
                      </div>
                    </div>

                    {/* SUGGESTION 1 */}
                    <div
                      onClick={() => {
                        setLocation("Riga, Latvia");
                        setLocationOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg"
                    >
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                        <MapPin size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Riga
                        </p>
                        <p className="text-xs text-gray-500">
                          Latvia
                        </p>
                      </div>
                    </div>

                    {/* SUGGESTION 2 */}
                    <div
                      onClick={() => {
                        setLocation("Old Town Riga");
                        setLocationOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg"
                    >
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                        <MapPin size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Old Town
                        </p>
                        <p className="text-xs text-gray-500">
                          Riga center
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            <div className="h-5 w-px bg-gray-300"></div>

            {/* TIME DROPDOWN */}
            <div className="relative w-1/3" ref={timeRef}>

              <input
                readOnly
                value={
                  selectedDate
                    ? `${selectedDate.toDateString()} • ${selectedTime}`
                    : "Any time"
                }
                onClick={() => setTimeOpen(!timeOpen)}
                className="bg-transparent px-3 py-1 w-full cursor-pointer outline-none"
              />

              {timeOpen && (
                <div className="absolute top-12 left-0 w-[520px] bg-white border rounded-xl shadow-xl z-50 p-4 flex gap-4">

                  {/* LEFT SIDE */}
                  <div className="w-1/3 flex flex-col gap-3">

                    <button
                      onClick={() => setSelectedDate(new Date())}
                      className="p-4 border rounded-xl text-left hover:bg-gray-100"
                    >
                      <p className="font-semibold">Today</p>
                      <p className="text-xs text-gray-500">
                        {today.toDateString()}
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setSelectedDate(
                          new Date(today.getTime() + 86400000)
                        )
                      }
                      className="p-4 border rounded-xl text-left hover:bg-gray-100"
                    >
                      <p className="font-semibold">Tomorrow</p>
                      <p className="text-xs text-gray-500">
                        {new Date(
                          today.getTime() + 86400000
                        ).toDateString()}
                      </p>
                    </button>

                  </div>

                  {/* RIGHT SIDE */}
                  <div className="w-2/3">

                    {/* CALENDAR */}
                    <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
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
                            onClick={() => setSelectedDate(date)}
                            className={`p-2 rounded-md hover:bg-gray-100 ${
                              isSelected
                                ? "bg-black text-white"
                                : ""
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>

                    {/* TIME */}
                    <p className="text-xs text-gray-500 mb-2">
                      Select time
                    </p>

                    <div className="flex gap-2 flex-wrap">

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
                          onClick={() => setSelectedTime(t.label)}
                          className={`px-3 py-2 border rounded-lg text-sm
                            ${
                              t.disabled
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:bg-gray-100"
                            }
                            ${
                              selectedTime === t.label
                                ? "bg-black text-white"
                                : ""
                            }
                          `}
                        >
                          {t.label}
                        </button>
                      ))}

                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* SEARCH BUTTON */}
            <button className="ml-2 bg-black text-white p-2 rounded-full">
              <Search size={16} />
            </button>

          </div>

          {/* RIGHT MENU */}
          <div className="flex items-center gap-4">

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 border px-3 py-1 rounded-full"
              >
                <Menu size={18} />
                <span className="hidden sm:block text-sm">
                  Menu
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">

                  {/* HEADER */}
                  {/* <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="text-sm font-semibold">Menu</span>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="text-gray-500 hover:text-black"
                    >
                      ✕
                    </button>
                  </div> */}

                  {/* CONTENT */}
                  <div className="py-2">

                    {/* SECTION: CUSTOMERS */}
                    <div className="px-4 py-2 text-xs text-gray-400 uppercase">
                      For customers
                    </div>

                    <Link
                      to="/login"
                      className="block px-4 py-3 hover:bg-gray-100 text-sm font-medium text-blue-600"
                    >
                      Log in or sign up
                    </Link>

                    <Link
                      to="/map"
                      className="block px-4 py-3 hover:bg-gray-100 text-sm font-medium text-blue-600"
                    >
                      Map of service
                    </Link>

                    <Link
                      to="/services"
                      className="block px-4 py-3 hover:bg-gray-100 text-sm font-medium text-blue-600"
                    >
                      All Services
                    </Link>

                    <Link
                      to="/booking"
                      className="block px-4 py-3 hover:bg-gray-100 text-sm font-medium text-blue-600"
                    >
                      Book right now
                    </Link>

                    <Link
                      to="/download"
                      className="block px-4 py-3 hover:bg-gray-100 text-sm"
                    >
                      Download the app
                    </Link>

                    <a
                      href="https://www.fresha.com/help-center/get-support"
                      target="_blank"
                      rel="noreferrer"
                      className="block px-4 py-3 hover:bg-gray-100 text-sm"
                    >
                      Help and support
                    </a>

                    <button
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                    >
                      🌍 English (US)
                    </button>

                    {/* DIVIDER */}
                    <div className="border-t my-2"></div>

                    {/* SECTION: BUSINESS */}
                    <div className="px-4 py-2 text-xs text-gray-400 uppercase">
                      For business
                    </div>

                    <a
                      href="https://www.fresha.com/for-business"
                      target="_blank"
                      rel="noreferrer"
                      className="block px-4 py-3 hover:bg-gray-100 text-sm font-medium"
                    >
                      For businesses →
                    </a>

                    <div className="px-4 py-2 text-xs text-gray-400 uppercase">
                      For customers
                    </div>

                    <Link
                      to="/contact"
                      className="block px-4 py-3 hover:bg-gray-100 text-sm font-medium text-blue-600"
                    >
                      Our contacts
                    </Link>

                    <Link
                      to="/about"
                      className="block px-4 py-3 hover:bg-gray-100 text-sm font-medium text-blue-600"
                    >
                      About us
                    </Link>

                  </div>
                </div>
              )}
            </div>

            <button
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;