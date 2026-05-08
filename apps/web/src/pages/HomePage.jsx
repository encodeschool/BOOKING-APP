import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RollingNumber from "../components/RollingNumber";
import { Search, MapPin } from "lucide-react";
import { Calendar, Clock, Star, Users } from "lucide-react";
import { useBusinesses } from "../hooks/useApi";

const HomePage = () => {
  const [count, setCount] = useState(6972);
  const [hoverQR, setHoverQR] = useState(false);
  const { businesses = [], loading } = useBusinesses();
  
  const features = [
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Book appointments with just a few clicks. No more phone calls or waiting in lines.",
    },
    {
      icon: Clock,
      title: "Real-time Availability",
      description: "See available time slots instantly and book at your convenience.",
    },
    {
      icon: Users,
      title: "Multiple Services",
      description: "Choose from a wide range of services offered by various businesses.",
    },
    {
      icon: Star,
      title: "Quality Assurance",
      description: "All our partner businesses are verified and rated by customers.",
    },
  ];

  // simulate realtime bookings
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 relative overflow-hidden">

      <div className="max-w-6xl mx-auto px-4 text-center">

        {/* TITLE */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Book local self-care services
        </h1>

        <p className="text-lg md:text-xl text-primary-100 mb-10">
          Discover top-rated salons, barbers, medspas, wellness studios and beauty experts trusted by millions worldwide
        </p>

        {/* SEARCH BAR */}
        {/* <div className="bg-white rounded-full p-2 flex items-center max-w-4xl mx-auto shadow-lg">

          <input
            readOnly
            value="All treatments"
            className="flex-1 px-4 py-2 text-black outline-none"
          />

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex items-center gap-2 px-4 text-black">
            <MapPin size={16} />
            <span>Current location</span>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <input
            readOnly
            value="Any time"
            className="flex-1 px-4 py-2 text-black outline-none"
          />

          <button className="bg-black text-white p-3 rounded-full ml-2">
            <Search size={18} />
          </button>
        </div> */}

        {/* STATS */}
        <div className="mt-10 flex flex-row justify-center items-center gap-4">

          <RollingNumber value={count} />

          <p className="text-primary-200">
            appointments booked today
          </p>

        </div>

        {/* APP DOWNLOAD */}
        <div
          className="mt-8 relative inline-block"
          onMouseEnter={() => setHoverQR(true)}
          onMouseLeave={() => setHoverQR(false)}
        >
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold">
            Get the app
          </button>

          {/* QR POPUP */}
          {hoverQR && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white text-black p-4 rounded-xl shadow-xl w-40 animate-fadeIn">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://yourapp.com"
                alt="QR Code"
                className="w-full"
              />
              <p className="text-xs mt-2 text-center">
                Scan to download
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/map" className="btn-secondary"> 
            Book Now
          </Link>
          <Link to="/services" className="btn-secondary">
            View Services
          </Link>
        </div>

      </div>
    </section>
    {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BookEase?
            </h2>
            <p className="text-lg text-gray-600">
              We make booking appointments simple and convenient for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Businesses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Businesses
            </h2>
            <p className="text-lg text-gray-600">
              Discover amazing businesses ready to serve you.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading businesses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businesses.slice(0, 6).map((business) => (
                <div key={business.id} className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {business.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{business.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {business.category}
                    </span>
                    <Link
                      to={`/services?business=${business.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Services →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/services" className="btn-primary">
              View All Businesses
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Book Your Next Appointment?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied customers who trust BookEase for their booking needs.
          </p>
          <Link to="/booking" className="btn-secondary bg-white text-primary-600 hover:bg-gray-50">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;