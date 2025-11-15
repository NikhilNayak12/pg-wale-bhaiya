import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const location = useLocation();
  const [landlordLoggedIn, setLandlordLoggedIn] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [landlordData, setLandlordData] = useState(null);
  
  // Check login status on component mount and location change
  useEffect(() => {
    const checkLoginStatus = () => {
      const landlordDataStr = localStorage.getItem('landlordData');
      const adminData = localStorage.getItem('adminAuthenticated');
      setLandlordLoggedIn(!!landlordDataStr);
      setAdminLoggedIn(!!adminData);
      if (landlordDataStr) {
        setLandlordData(JSON.parse(landlordDataStr));
      } else {
        setLandlordData(null);
      }
    };
    checkLoginStatus();
    window.addEventListener('landlord-login', checkLoginStatus);
    return () => window.removeEventListener('landlord-login', checkLoginStatus);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginDropdownOpen && !event.target.closest('.login-dropdown-container')) {
        setLoginDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [loginDropdownOpen]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('landlordData');
      localStorage.removeItem('landlordLoggedIn');
      localStorage.removeItem('landlordEmail');
      setLandlordLoggedIn(false);
      setLandlordData(null);
      window.location.href = '/';
    }
  };
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Listings", path: "/listings" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" }
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl rounded-full z-50 transition-all duration-500 ease-out border border-white/20 ${
        scrolled 
          ? 'bg-white/60 backdrop-blur-2xl shadow-2xl py-1' 
          : 'bg-white/40 backdrop-blur-xl shadow-lg py-2'
      }`}
      style={{ 
        fontFamily: 'Poppins, sans-serif',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)'
      }}
    >
      <div className="px-5 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/image.png" 
              alt="PG wale Bhaiya" 
              className="h-12 w-auto object-cover object-center"
            />
            <div className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Mileast, sans-serif' }}>PG wale Bhaiya</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return item.path.startsWith('#') ? (
                <a
                  key={item.name}
                  className={`relative px-3 py-1.5 rounded-lg transition-all duration-300 group ${
                    active 
                      ? 'text-amber-700 font-semibold' 
                      : 'text-gray-700 hover:text-amber-700'
                  }`}
                  href={item.path}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-amber-700 transition-all duration-300 ${
                    active ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                  }`}></span>
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-3 py-1.5 rounded-lg transition-all duration-300 group ${
                    active 
                      ? 'text-amber-700 font-semibold' 
                      : 'text-gray-700 hover:text-amber-700'
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-amber-700 transition-all duration-300 ${
                    active ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                  }`}></span>
                </Link>
              )
            })}
            {/* Dashboard Button for logged-in landlord */}
            {landlordLoggedIn && landlordData && (
              <Link
                to="/landlord-dashboard"
                className="ml-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 px-5 py-2 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                Dashboard
              </Link>
            )}
            {/* Login Dropdown Button */}
            <div 
              className="relative ml-3 login-dropdown-container"
            >
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-5 py-2 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Login
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${loginDropdownOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {loginDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl overflow-hidden border border-amber-100 animate-slideDown">
                  <Link
                    to="/student/login"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-all duration-200 border-b border-gray-100"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                    <span className="font-medium">Student Login</span>
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-all duration-200"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span className="font-medium">Landlord Login</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex items-center justify-center p-3 rounded-full hover:bg-amber-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-700"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-gray-700">
              {mobileMenuOpen ? (
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
          <nav className="flex flex-col py-4 space-y-1 text-base font-medium">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return item.path.startsWith('#') ? (
                <a
                  key={item.name}
                  className={`px-6 py-3 transition-all duration-300 ${
                    active 
                      ? 'bg-amber-50 text-amber-700 font-semibold border-l-4 border-amber-700' 
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700 hover:border-l-4 hover:border-amber-500'
                  }`}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-6 py-3 transition-all duration-300 ${
                    active 
                      ? 'bg-amber-50 text-amber-700 font-semibold border-l-4 border-amber-700' 
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700 hover:border-l-4 hover:border-amber-500'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            })}
            {landlordLoggedIn && landlordData && (
              <Link
                to="/landlord-dashboard"
                className="mx-4 mt-2 px-6 py-3 text-center bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 rounded-xl font-semibold shadow-lg transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {/* Login Options - Mobile */}
            <div className="mx-4 mt-2 space-y-2">
              <Link
                to="/student/login"
                className="block px-6 py-3 text-center bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-semibold shadow-lg transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                  Student Login
                </div>
              </Link>
              <Link
                to="/login"
                className="block px-6 py-3 text-center bg-white border-2 border-amber-600 text-amber-700 hover:bg-amber-50 rounded-xl font-semibold shadow-lg transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Landlord Login
                </div>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
