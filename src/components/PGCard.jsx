// src/components/PGCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Star } from "lucide-react";
import ImageLightbox from "./ImageLightbox";
import CashbackForm from "./CashbackForm";

export default function PGCard({ item }) {
  const [open, setOpen] = useState(false);
  const [lightboxKey, setLightboxKey] = useState(0);
  const [showCashbackForm, setShowCashbackForm] = useState(false);
  
  // Handle both frontend (static) and backend data formats
  const pgData = {
    id: item.id,
    name: item.title || item.name,
    location: item.area || (typeof item.location === 'object' ? item.location.area : item.location) || item.locality || '',
    locality: item.locality || (typeof item.location === 'object' ? item.location.locality : ''),
    distance: item.distance || item.distanceFromLPU || '2.5', // Default distance if not provided
    price: item.price || item.monthlyRent,
    type: item.roomType || item.type,
    tags: item.amenities || item.tags || [],
    images: item.images || (item.img ? [item.img] : [])
  };
  
  // Filter out invalid blob URLs and provide fallback images
  const validImages = pgData.images?.filter(img => 
    img && 
    typeof img === 'string' && 
    !img.startsWith('blob:') && 
    (img.startsWith('http') || img.startsWith('/'))
  ) || [];
  
  // Default fallback images based on PG location/area
  const fallbackImages = ['/pgs/campus-1.jpg', '/pgs/campus-2.jpg', '/pgs/campus-3.jpg'];
  const pgImages = validImages.length > 0 ? validImages : fallbackImages;
  const heroImage = pgImages[0];

  const handleOpenLightbox = () => {
    setLightboxKey(prev => prev + 1); // Force new instance
    setOpen(true);
  };

  const handleCloseLightbox = () => {
    setOpen(false);
  };

  const handleBookedClick = () => {
    setShowCashbackForm(true);
  };

  const handleCloseCashbackForm = () => {
    setShowCashbackForm(false);
  };

  return (
    <>
      <div 
        className="bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] animate-fadeInUp border border-gray-200"
        style={{
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.5s ease, box-shadow 0.5s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }}
      >
        <div className="relative group">
          <button
            type="button"
            onClick={handleOpenLightbox}
            className="w-full block focus:outline-none"
            aria-label={`Open gallery for ${pgData.name}`}
          >
            <img
              src={heroImage}
              alt={pgData.name}
              className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                // Fallback to a default image if the current one fails to load
                if (e.target.src !== '/pgs/campus-1.jpg') {
                  e.target.src = '/pgs/campus-1.jpg';
                }
              }}
            />
          </button>

          <div className="absolute left-4 top-4 bg-green-600 text-white px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1 shadow-lg">
            <CheckCircle size={14} /> Verified
          </div>
        </div>

        <div className="p-5">
          <Link to={`/pg/${pgData.id}`}>
            <h3 className="font-bold text-xl hover:text-amber-700 transition-colors cursor-pointer" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {pgData.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <Star size={16} className="text-gray-300 fill-gray-300" />
            </div>
            <span className="text-sm font-semibold text-gray-700">4.0</span>
            <span className="text-sm text-slate-500">(120 reviews)</span>
          </div>

          <p className="text-sm text-slate-600 mt-2 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 bg-amber-700 rounded-full animate-pulse"></span>
            {pgData.location}
          </p>
          <p className="text-xs text-slate-500 mt-1">{pgData.distance} km from your college</p>

          <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                ₹{pgData.price?.toLocaleString()}
              </span>
              <span className="text-sm text-slate-600 font-medium">/ month</span>
            </div>
            <div className="text-sm text-slate-600 mt-1 font-medium">{pgData.type} Sharing</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {pgData.tags?.slice(0, 3).map((tag, index) => (
              <span key={`${tag}-${index}`} className="text-xs bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full font-medium border border-amber-200">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <Link 
              to={`/pg/${pgData.id}`} 
              className="flex-1 px-4 py-3 border-2 border-amber-700 text-amber-700 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-amber-50 hover:scale-105 text-center"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              View Details
            </Link>
            <button 
              onClick={handleBookedClick}
              className="flex-1 px-4 py-3 bg-amber-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-amber-800 hover:shadow-lg hover:scale-105"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox - Only render when open and with unique key */}
      {open && pgImages.length > 0 && (
        <ImageLightbox 
          key={`${pgData.id}-${lightboxKey}`}
          images={[...pgImages]} // Create a new array to prevent reference issues
          startIndex={0} 
          onClose={handleCloseLightbox} 
        />
      )}

      {/* Cashback Form */}
      <CashbackForm
        isOpen={showCashbackForm}
        onClose={handleCloseCashbackForm}
        pgId={pgData.id}
        pgName={pgData.name}
      />
    </>
  );
}
