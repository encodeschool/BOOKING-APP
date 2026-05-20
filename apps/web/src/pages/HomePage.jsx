import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar, Clock, Star, Users } from "lucide-react";
import { useBusinesses } from "../hooks/useApi";
import { motion } from "framer-motion";
import RollingNumber from "../components/RollingNumber";
import ImageCarousel from "../components/ImageCarousel";

const HomePage = () => {
  const [count, setCount] = useState(6972);
  const { businesses = [], loading } = useBusinesses();

  const features = useMemo(
    () => [
      {
        icon: Calendar,
        title: "Smart Booking",
        description: "Book appointments instantly with a smooth, modern experience.",
      },
      {
        icon: Clock,
        title: "Live Availability",
        description: "See real-time slots and choose the perfect time without delays.",
      },
      {
        icon: Users,
        title: "All Services",
        description: "Discover verified professionals across wellness categories.",
      },
      {
        icon: Star,
        title: "Trusted Quality",
        description: "Only top-rated businesses with real customer reviews.",
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

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 relative">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_auto] items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">
                <span className="font-semibold">New</span>
                <span>Modern booking for salons and spas</span>
              </div>
              <div className="space-y-5 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  Welcome to <span className="text-white">Enroll</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-200">
                  Discover and book local wellness, beauty, and self-care services in seconds with a seamless, responsive experience.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link to="/booking" className="btn-primary">
                  Start booking
                </Link>
                <Link to="/services" className="btn-secondary">
                  Browse services
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-xl border border-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Instant bookings</p>
                  <p className="mt-2 text-3xl font-semibold">Fast</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-xl border border-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Local professionals</p>
                  <p className="mt-2 text-3xl font-semibold">Trusted</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-xl border border-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Easy access</p>
                  <p className="mt-2 text-3xl font-semibold">Everywhere</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-200">Service search</p>
                  <p className="text-xl font-semibold">Find the best match</p>
                </div>
                <div className="rounded-3xl bg-white p-3 text-slate-900 shadow-sm">
                  <Search size={22} />
                </div>
              </div>
              <div className="grid gap-3">
                <div className="rounded-3xl bg-white/90 p-4 text-slate-900">
                  <p className="text-sm text-slate-500">Popular services</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {['Haircut', 'Massage', 'Facial', 'Manicure'].map((item) => (
                      <span key={item} className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl bg-white/90 p-4 text-slate-900">
                  <p className="text-sm text-slate-500">Top location</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm text-slate-900">
                    <MapPin size={16} />
                    Riga, Latvia
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/20 p-5">
                <p className="text-sm text-slate-200">Appointments today</p>
                <p className="mt-3 text-3xl font-semibold">
                  <RollingNumber value={count} />
                </p>
              </div>
              <div className="rounded-3xl bg-white/20 p-5">
                <p className="text-sm text-slate-200">Partner businesses</p>
                <p className="mt-3 text-3xl font-semibold">{businesses.length}</p>
              </div>
              <div className="rounded-3xl bg-white/20 p-5">
                <p className="text-sm text-slate-200">Booking confidence</p>
                <p className="mt-3 text-3xl font-semibold">99%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Why choose Enroll</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Designed for beauty and wellness customers</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">A modern booking experience that keeps services, stores, and schedules easy to browse on every device.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <feature.icon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Featured businesses</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">Discover trusted partners near you</h2>
            </div>
            <Link to="/services" className="btn-secondary w-fit">
              View all services
            </Link>
          </div>

          {loading ? (
            <div className="mt-12 flex flex-col items-center justify-center py-16 text-slate-500">
              <div className="h-10 w-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
              <p className="mt-4">Loading network...</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {businesses.slice(0, 6).map((business) => (
                <motion.div
                  key={business.id}
                  className="card overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ImageCarousel
                    images={business.images || []}
                    title={business.name}
                    autoPlay={true}
                    interval={5000}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900">{business.name}</h3>
                    <p className="mt-2 text-slate-600 text-sm line-clamp-2">{business.description}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {business.category || "Services"}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {business.address ? business.address.substring(0, 20) + "..." : "Location"}
                      </span>
                      <Link
                        to={`/services?business=${business.id}`}
                        className="text-primary-600 font-semibold hover:text-primary-700"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Start booking with Enroll today</h2>
          <p className="mt-4 text-slate-200">Join thousands of users discovering better ways to book services with powerful mobile-friendly tools.</p>
          <Link to="/booking" className="btn-secondary mt-8 inline-flex text-slate-900">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
