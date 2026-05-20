import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-3xl bg-primary-600/10 px-4 py-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-white font-bold">
                B
              </span>
              <div>
                <p className="text-xl font-semibold text-white">BookEase</p>
                <p className="text-sm text-slate-400">A modern booking experience for beauty and wellness.</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Simplify your scheduling with an intuitive experience designed for customers and businesses on every device.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-slate-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-[0.12em] mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link to="/" className="hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white transition">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/booking" className="hover:text-white transition">
                    Book Now
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-[0.12em] mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link to="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/map" className="hover:text-white transition">
                    Map
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-[0.12em] mb-4">Contact Info</h4>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-primary-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary-400" />
                <span>info@bookease.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-primary-400" />
                <span>123 Business St, City, ST 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} BookEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
