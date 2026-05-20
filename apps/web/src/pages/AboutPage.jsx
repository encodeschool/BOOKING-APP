import { Link } from "react-router-dom";
import { ShieldCheck, HeartHandshake, Sparkles, Globe } from "lucide-react";

const stats = [
  { label: "Businesses", value: "1.2k" },
  { label: "Bookings", value: "75k+" },
  { label: "Reviews", value: "18k" },
  { label: "Locations", value: "230" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Trusted partners",
    description: "Only verified salons and wellness providers join our platform.",
  },
  {
    icon: HeartHandshake,
    title: "Customer-first",
    description: "Designed to make every booking feel effortless and reliable.",
  },
  {
    icon: Sparkles,
    title: "Modern design",
    description: "A polished, responsive experience on mobile and desktop.",
  },
  {
    icon: Globe,
    title: "Global reach",
    description: "Supporting bookings across multiple cities and regions.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center mb-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">About Enroll</p>
            <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">A smarter way to discover beauty and wellness.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">Our platform helps customers find the right service, provider, and schedule with a clean interface built for modern browsing and booking.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link to="/booking" className="btn-primary text-center">
                Book Now
              </Link>
              <Link to="/contact" className="btn-secondary text-center">
                Contact support
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl bg-slate-50 p-6 text-center">
                  <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mb-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="card">
                <value.icon className="h-10 w-10 text-primary-600 mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">{value.title}</h2>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-gradient-to-r from-indigo-600 to-violet-600 p-10 text-white shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary-200">Our mission</p>
              <h2 className="mt-4 text-3xl font-bold">Create a booking experience people love.</h2>
              <p className="mt-4 text-slate-100 leading-7">We focus on accessibility, speed, and continuing to evolve the product for both customers and business partners alike.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.slice(0, 4).map((stat) => (
                <div key={stat.label} className="rounded-3xl bg-white/10 p-6">
                  <p className="text-3xl font-semibold">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
