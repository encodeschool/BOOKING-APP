import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RollingNumber from "../components/RollingNumber";
import { Search, MapPin, Calendar, Clock, Star, Users } from "lucide-react";
import { useBusinesses } from "../hooks/useApi";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const [count, setCount] = useState(6972);
  const [hoverQR, setHoverQR] = useState(false);
  const { businesses = [], loading } = useBusinesses();

  const features = useMemo(
    () => [
      {
        icon: Calendar,
        title: "Smart Booking",
        description:
          "Book appointments instantly with a seamless, modern experience.",
      },
      {
        icon: Clock,
        title: "Live Availability",
        description:
          "See real-time slots and choose the perfect time without delays.",
      },
      {
        icon: Users,
        title: "All Services",
        description:
          "Discover verified professionals across all wellness categories.",
      },
      {
        icon: Star,
        title: "Trusted Quality",
        description:
          "Only top-rated businesses with real customer reviews.",
      },
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 4));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_60%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto px-4 py-24 text-center relative"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Welcome to <span className="text-white/90">Enroll</span>
          </h1>

          <p className="mt-5 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Discover and book local wellness, beauty, and self-care services in
            seconds with a smooth modern experience.
          </p>

          {/* SEARCH */}
          <div className="mt-10 max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 flex items-center shadow-xl">
            <div className="flex items-center gap-2 px-4 text-white/80">
              <Search size={18} />
              <span className="text-sm">Search services</span>
            </div>

            <div className="h-6 w-px bg-white/20" />

            <div className="flex items-center gap-2 px-4 text-white/80">
              <MapPin size={18} />
              <span className="text-sm">Location</span>
            </div>

            <button className="ml-auto bg-white text-indigo-700 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition">
              Explore
            </button>
          </div>

          {/* STATS */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-3 text-white/80">
            <RollingNumber value={count} />
            <span>appointments booked today on Enroll</span>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/map"
              className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:scale-105 transition"
            >
              Book Now
            </Link>
            <Link
              to="/services"
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              View Services
            </Link>
          </div>

          {/* QR */}
          <div
            className="mt-10 relative inline-block"
            onMouseEnter={() => setHoverQR(true)}
            onMouseLeave={() => setHoverQR(false)}
          >
            <button className="text-sm px-5 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition">
              Get Enroll App
            </button>

            <AnimatePresence>
              {hoverQR && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-1/2 -translate-x-1/2 top-14 bg-white p-3 rounded-xl shadow-xl w-40"
                >
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://enroll.app"
                    className="w-full"
                    alt="qr"
                  />
                  <p className="text-xs text-center mt-2 text-gray-600">
                    Scan to download
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Why Choose Enroll
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition"
            >
              <f.icon className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BUSINESSES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Businesses
          </h2>

          {loading ? (
            <div className="flex flex-col items-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-500">Loading Enroll network...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.slice(0, 6).map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-5 border hover:shadow-xl transition"
                >
                  <h3 className="font-semibold text-lg">{b.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {b.description}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400">
                      {b.category}
                    </span>
                    <Link
                      to={`/services?business=${b.id}`}
                      className="text-indigo-600 text-sm font-medium"
                    >
                      View →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-3xl mx-auto px-4"
        >
          <h2 className="text-3xl font-bold mb-4">
            Start booking with Enroll today
          </h2>
          <p className="text-white/80 mb-8">
            Join thousands of users discovering better ways to book services.
          </p>

          <Link
            to="/booking"
            className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-semibold hover:scale-105 transition"
          >
            Get Started
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;