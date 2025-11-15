import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Instagram, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();

  // Popular areas data
  const popularAreas = [
    { name: "Law Gate", value: "Law Gate" },
    { name: "Phagwara", value: "Phagwara" },
    { name: "Deep Nagar", value: "Deep Nagar" }
  ];

  // Function to handle area click and navigate with filters
  const handleAreaClick = (areaValue) => {
    // Create URL params for the listings page with location filter
    const searchParams = new URLSearchParams();
    searchParams.set('location', areaValue);
    
    // Navigate to listings page with the area filter applied
    navigate(`/listings?${searchParams.toString()}`);
  };
  // Check landlord login status
  const [landlordLoggedIn, setLandlordLoggedIn] = useState(false);
  useEffect(() => {
    const updateLogin = () => setLandlordLoggedIn(!!localStorage.getItem('landlordData'));
    updateLogin();
    window.addEventListener('landlord-login', updateLogin);
    return () => window.removeEventListener('landlord-login', updateLogin);
  }, []);

  return (
    <footer className="relative text-slate-200" style={{ backgroundImage: "url('/src/assets/360_F_433772331_iPo5eqvn3bqhKB3vBpRPyGVKvUaDs9CQ.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-gradient-to-br"></div>
      <div className="relative max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-start">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/image.png" alt="PG wale Bhaiya" className="w-12 h-12 rounded-md" />
            <div className="text-white font-semibold text-2xl" style={{ fontFamily: 'Mileast, sans-serif' }}>PG wale Bhaiya</div>
          </div>
          <p className="text-base text-slate-300 leading-relaxed">
            Your trusted partner in finding the perfect accommodation near your college. Making student life easier, one room at a time.
          </p>

          {/* Social icons */}
          <div className="mt-6 flex items-center gap-3">
            <a href="#" className="w-12 h-12 rounded-md bg-amber-900 flex items-center justify-center text-slate-300 hover:bg-amber-800">
              <Instagram size={22} />
            </a>
            <a href="tel:+919109222131" className="w-12 h-12 rounded-md bg-amber-900 flex items-center justify-center text-slate-300 hover:bg-amber-800">
              <Phone size={22} />
            </a>
            <a href="mailto:hello.pgwalebhaiya@gmail.com" className="w-12 h-12 rounded-md bg-amber-900 flex items-center justify-center text-slate-300 hover:bg-amber-800">
              <Mail size={22} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3 text-slate-300 text-base">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/listings" className="hover:text-white">Browse PGs</Link></li>
            <li>
              <Link
                to={landlordLoggedIn ? "/post-pg" : "/login"}
                className="hover:text-white"
              >
                List Your PG
              </Link>
            </li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            {/* Removed [Temp] Direct Post PG quick link */}
            {/* Removed [Temp] Landlord Dashboard quick link */}
          </ul>
        </div>

        {/* Popular Areas */}
        <div>
          <h4 className="text-white font-semibold mb-4">Popular Areas</h4>
          <ul className="space-y-3 text-slate-300 text-base">
            {popularAreas.map((area) => (
              <li key={area.value}>
                <button
                  onClick={() => handleAreaClick(area.value)}
                  className="hover:text-white transition-colors duration-200 text-left hover:underline focus:outline-none focus:underline cursor-pointer group flex items-center gap-2"
                >
                  <span>{area.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
          <ul className="text-slate-300 text-base space-y-4">

            <li className="flex items-center gap-3">
              <Phone size={18} className="text-amber-400" />
              <a href="tel:+919109222131" className="text-slate-300 hover:text-white">+91 91092 22131</a>
            </li>

            <li className="flex items-center gap-3">
              <Mail size={18} className="text-amber-400" />
              <a href="mailto:hello.pgwalebhaiya@gmail.com" className="text-slate-300 hover:text-white">hello.pgwalebhaiya@gmail.com</a>
            </li>

            <li className="flex items-start gap-3">
              <span className="mt-1 text-amber-400"><Clock size={18} /></span>
              <div>
                <div className="font-medium text-slate-200">24/7 Support Available</div>
                <div className="text-sm text-slate-400">Always here to help</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom row */}
      <div className="relative border-t border-amber-900">
        <div className="relative max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-slate-400 text-base">
          <div>© {new Date().getFullYear()} PG wale Bhaiya. All rights reserved.</div>
          <div className="text-sm text-slate-500">Designed & Developed by Nikhil Nayak</div>
          <div className="mt-3 md:mt-0 flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link>
            <Link to="/faq" className="hover:text-white">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
