import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, IndianRupee, Users, Search } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    area: '',
    rent: '',
    sharing: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build URL search parameters based on form data
    const searchParams = new URLSearchParams();
    
    if (formData.area.trim()) {
      // Normalize common location terms
      let locationValue = formData.area.trim();
      if (locationValue.toLowerCase().includes('law gate')) {
        locationValue = 'Law Gate';
      } else if (locationValue.toLowerCase().includes('phagwara')) {
        locationValue = 'Phagwara';
      } else if (locationValue.toLowerCase().includes('deep nagar')) {
        locationValue = 'Deep Nagar';
      }
      searchParams.set('location', locationValue);
    }
    
    if (formData.rent && formData.rent !== 'Select range') {
      // Parse rent range and set min/max prices
      switch (formData.rent) {
        case '₹0 - ₹5,000':
          searchParams.set('minPrice', '0');
          searchParams.set('maxPrice', '5000');
          break;
        case '₹5,001 - ₹8,000':
          searchParams.set('minPrice', '5001');
          searchParams.set('maxPrice', '8000');
          break;
        case '₹8,001 - ₹12,000':
          searchParams.set('minPrice', '8001');
          searchParams.set('maxPrice', '12000');
          break;
      }
    }
    
    if (formData.sharing && formData.sharing !== 'Any') {
      searchParams.set('roomType', formData.sharing);
    }
    
    // Navigate to listings page with search parameters
    navigate(`/listings?${searchParams.toString()}`);
  };
  return (
    <section className="relative flex items-center justify-center h-[680px] overflow-hidden shadow-2xl">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/src/assets/Modern_Aesthetic_Room_Video_Generated.mp4" type="video/mp4" />
      </video>

      {/* Black Overlay for text visibility */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Bottom shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

      {/* content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center text-white">
        {/* Heading with fade-in and slide-up animation */}
        <h1 
          className="font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight animate-fadeInUp"
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            letterSpacing: '-0.02em'
          }}
        >
          Find Your Perfect <br />
          <span className="text-amber-400 drop-shadow-lg">Stay With Us</span>
        </h1>

        <p 
          className="mt-6 text-xl font-medium text-amber-50 max-w-2xl mx-auto animate-fadeInUp"
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            animationDelay: '0.2s'
          }}
        >
          Discover verified PGs and rooms in Law Gate area. Quick, easy, and trusted by thousands of students.
        </p>

        {/* Search card */}
        <div 
          className="mt-10 max-w-4xl mx-auto relative animate-fadeInUp"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-gray-800 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              {/* Area */}
              <div>
                <label 
                  htmlFor="area" 
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <MapPin size={18} className="text-amber-700" />
                  Area
                </label>
                <input
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-200/50 transition-all duration-300"
                  placeholder="Law Gate, Phagwara"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                />
              </div>

              {/* Rent */}
              <div>
                <label 
                  htmlFor="rent" 
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <IndianRupee size={18} className="text-amber-700" />
                  Rent Range
                </label>
                <select
                  id="rent"
                  name="rent"
                  value={formData.rent}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-200/50 transition-all duration-300"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <option>Select range</option>
                  <option>₹0 - ₹5,000</option>
                  <option>₹5,001 - ₹8,000</option>
                  <option>₹8,001 - ₹12,000</option>
                </select>
              </div>

              {/* Sharing */}
              <div>
                <label 
                  htmlFor="sharing" 
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <Users size={18} className="text-amber-700" />
                  Sharing
                </label>
                <select
                  id="sharing"
                  name="sharing"
                  value={formData.sharing}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-200/50 transition-all duration-300"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <option>Any</option>
                  <option>Single</option>
                  <option>Double</option>
                  <option>Triple</option>
                </select>
              </div>

              {/* Search button */}
              <div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 text-white rounded-lg font-bold text-lg shadow-lg shadow-amber-700/50 hover:shadow-xl hover:shadow-amber-700/60 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <Search size={20} /> Search
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}
