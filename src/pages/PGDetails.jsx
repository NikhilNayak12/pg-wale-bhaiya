import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { demoAllPGs } from "../data/pgs";
import { mockGetAll } from "../services/mockDB";
import { 
  MapPin, 
  Users, 
  Wifi, 
  Car, 
  Utensils, 
  Shield, 
  Zap, 
  Dumbbell, 
  Shirt,
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Navigation,
  Clock
} from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";

export default function PGDetails() {
  const { id } = useParams();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch PG data from static demo data + localStorage
  useEffect(() => {
    const fetchPGDetails = async () => {
      try {
        setLoading(true);
        
        // Combine static demo PGs + landlord PGs from localStorage
        const landlordPGs = mockGetAll('landlordPGs') || [];
        const allPGs = [...demoAllPGs, ...landlordPGs];
        
        // Find PG by ID
        const foundPG = allPGs.find(p => p.id === id);
        
        if (foundPG) {
          setPg(foundPG);
        } else {
          setError('PG not found');
        }
      } catch (err) {
        console.error('Error fetching PG details:', err);
        setError('Failed to load PG details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPGDetails();
    }
  }, [id]);

  // Contact handlers
  const handleCallNow = () => {
    const phoneNumber = pg?.contact?.phone || pg?.phone || '+919109222131';
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsApp = () => {
    const whatsappNumber = pg?.contact?.whatsapp || pg?.whatsapp || pg?.contact?.phone || pg?.phone || '919109222131';
    const message = encodeURIComponent(`Hi! I'm interested in ${pg?.name || 'your PG'}. Can you please share more details about availability and pricing?`);
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    const email = pg?.contact?.email || 'contact@pgwalebhaiya.com';
    const subject = encodeURIComponent(`Inquiry about ${pg?.name || 'PG'}`);
    const body = encodeURIComponent(`Hi,\n\nI'm interested in ${pg?.name || 'your PG'} and would like to know more about:\n- Availability\n- Pricing\n- Amenities\n- Visit schedule\n\nThank you!`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  };

  const getTagIcon = (tag) => {
    switch (tag.toLowerCase()) {
      case 'wifi': return <Wifi size={16} />;
      case 'parking': return <Car size={16} />;
      case 'meals': return <Utensils size={16} />;
      case 'security': return <Shield size={16} />;
      case 'ac': return <Zap size={16} />;
      case 'gym': return <Dumbbell size={16} />;
      case 'laundry': return <Shirt size={16} />;
      default: return <Shield size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading PG details...</h2>
        </div>
      </div>
    );
  }

  if (error || !pg) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">PG not found</h1>
          <p className="mt-2 text-gray-600">{error || "The accommodation you're looking for doesn't exist."}</p>
          <Link to="/listings" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  // Normalize the API data format
  const pgData = {
    id: pg.id,
    name: pg.title || pg.name,
    description: pg.description || '',
    location: pg.area || (typeof pg.location === 'object' ? pg.location.area : pg.location) || pg.locality || '',
    locality: pg.locality || (typeof pg.location === 'object' ? pg.location.locality : ''),
    latitude: typeof pg.location === 'object' ? pg.location.latitude : '',
    longitude: typeof pg.location === 'object' ? pg.location.longitude : '',
    distance: pg.distance || pg.distanceFromLPU || '2.5', // Default distance if not provided
    price: pg.price || pg.monthlyRent,
    type: pg.roomType || pg.type,
    tags: pg.amenities || pg.tags || [],
    images: pg.images || [],
    contact: pg.contact || {}
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
  const finalImages = validImages.length > 0 ? validImages : fallbackImages;

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // WhatsApp Icon Component
  const WhatsAppIcon = ({ size = 18, className = "" }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
    </svg>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/listings" 
            className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-200 transform transition-all duration-300 hover:shadow-md hover:scale-105 hover:bg-blue-50 group"
          >
            <ArrowLeft size={20} className="group-hover:animate-bounce" />
            Back to Listings
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          {/* Image Gallery */}
          <div className="p-4">
            <div className="grid grid-cols-4 gap-3 h-64">
              {/* Main Image - Takes up 2x2 space */}
              <div 
                className="col-span-2 row-span-2 relative overflow-hidden rounded-xl cursor-pointer group shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                onClick={() => openLightbox(0)}
              >
                <img
                  src={finalImages[0]}
                  alt={`${pgData.name} - Main`}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback to a default image if the current one fails to load
                    if (e.target.src !== '/pgs/campus-1.jpg') {
                      e.target.src = '/pgs/campus-1.jpg';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    View Gallery
                  </span>
                </div>
              </div>

              {/* Secondary Images */}
              {finalImages.slice(1, 5).map((image, index) => (
                <div
                  key={index + 1}
                  className="relative overflow-hidden rounded-lg cursor-pointer group shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-105"
                  onClick={() => openLightbox(index + 1)}
                >
                  <img
                    src={image}
                    alt={`${pgData.name} - ${index + 2}`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to a default image if the current one fails to load
                      if (e.target.src !== '/pgs/campus-1.jpg') {
                        e.target.src = '/pgs/campus-1.jpg';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">View</span>
                  </div>
                  {/* Show "+more" overlay on last image if there are more images */}
                  {index === 3 && finalImages.length > 5 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">+{finalImages.length - 5} more</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Header Info */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-2 animate-fade-in">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-1 transform transition-all duration-300 hover:text-blue-600">{pgData.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-2 transform transition-all duration-300 hover:text-gray-800">
                  <MapPin size={18} className="text-green-600" />
                  <span>{pgData.distance}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-4 transform transition-all duration-300 hover:text-gray-800">
                  <MapPin size={16} className="text-blue-600" />
                  <span className="text-sm font-medium">{pgData.location}</span>
                </div>
                
                {/* Location on Map Button */}
                <div className="mb-4">
                  <button
                    onClick={() => {
                      if (pgData.latitude && pgData.longitude) {
                        // Open Google Maps at the coordinates
                        window.open(`https://www.google.com/maps?q=${pgData.latitude},${pgData.longitude}`, '_blank');
                      } else {
                        // Fallback to search query
                        const query = encodeURIComponent(`${pgData.name} ${pgData.location} near LPU`);
                        window.open(`https://www.google.com/maps/search/${query}`, '_blank');
                      }
                    }}
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
                  >
                    <svg 
                      width={18} 
                      height={18} 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                      className="group-hover:animate-pulse"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>View on Google Maps</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-2 py-2">
                  <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 transform transition-all duration-300 hover:shadow-md hover:scale-105">
                    <Users size={18} className="text-blue-500" />
                    <span>{pgData.type}</span>
                  </div>
                </div>
              </div>
              <div className="text-right transform transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">₹{pgData.price?.toLocaleString()}</div>
                <div className="text-gray-500">per month</div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2 animate-fade-in">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pgData.tags?.map((tag, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 transform transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-blue-300 hover:from-blue-50 hover:to-blue-100 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="group-hover:animate-bounce transition-all duration-300 text-blue-600">{getTagIcon(tag)}</span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-300">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2 animate-fade-in">About This PG</h2>
              <div className="text-gray-600 leading-relaxed bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 transform transition-all duration-300 hover:shadow-md hover:border-gray-300">
                {pgData.description ? (
                  <p className="mb-2 transform transition-all duration-300 hover:text-gray-800 whitespace-pre-line">{pgData.description}</p>
                ) : (
                  <>
                    <p className="mb-2 transform transition-all duration-300 hover:text-gray-800">
                      {pgData.name} is a well-maintained accommodation located just {pgData.distance} km from LPU Gate in {pgData.location}. 
                      We provide comfortable living spaces with all essential amenities for students and working professionals.
                    </p>
                    <p className="mb-2 transform transition-all duration-300 hover:text-gray-800">
                      Our {pgData.type?.toLowerCase()} rooms are designed to provide privacy and comfort while maintaining 
                      an affordable price point. The property features modern facilities and is situated in a safe, 
                      convenient location with easy access to LPU campus.
                    </p>
                    <p className="transform transition-all duration-300 hover:text-gray-800">
                      We provide quality service and a homely atmosphere for all our guests.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Nearby Places Section */}
            {pg.nearbyPlaces && pg.nearbyPlaces.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-3 animate-fade-in">Nearby Places</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pg.nearbyPlaces.map((place, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-amber-300 hover:from-amber-100 hover:to-orange-100 group"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Navigation size={18} className="text-white group-hover:animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-amber-800 transition-colors duration-300">
                          {place.name}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-amber-600" />
                            <span className="font-medium">{place.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={12} className="text-amber-600" />
                            <span>{place.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="border-t pt-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2 animate-fade-in">Contact & Book</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 py-4 gap-4">
                <button 
                  onClick={handleCallNow}
                  className="group relative flex items-center justify-center gap-2 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 active:scale-95 shadow-2xl shadow-blue-500/25 hover:shadow-blue-600/40 border border-blue-400/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Phone size={18} className="relative z-10 group-hover:animate-pulse drop-shadow-sm" />
                  <span className="relative z-10 drop-shadow-sm">Call Now</span>
                  <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150"></div>
                </button>
                <button 
                  onClick={handleWhatsApp}
                  className="group relative flex items-center justify-center gap-2 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 active:scale-95 shadow-2xl shadow-green-500/25 hover:shadow-emerald-600/40 border border-green-400/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <MessageCircle size={18} className="relative z-10 group-hover:animate-bounce drop-shadow-sm" />
                  <span className="relative z-10 drop-shadow-sm">WhatsApp</span>
                  <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150"></div>
                </button>
                <button 
                  onClick={handleEmail}
                  className="group relative flex items-center justify-center gap-2 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-gray-900 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 active:scale-95 shadow-2xl shadow-slate-500/25 hover:shadow-slate-700/40 border border-slate-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-500/30 to-gray-600/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Mail size={18} className="relative z-10 group-hover:animate-pulse drop-shadow-sm" />
                  <span className="relative z-10 drop-shadow-sm">Email</span>
                  <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150"></div>
                </button>
              </div>
              <div className="mt-3 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200/50 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse shadow-sm"></div>
                    <p className="text-blue-800 font-semibold">Ready to book?</p>
                  </div>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Contact us to schedule a visit or reserve your room today. No advance payment required for viewing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && finalImages.length > 0 && (
        <ImageLightbox
          images={finalImages}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setCurrentImageIndex((prev) => (prev + 1) % finalImages.length)}
          onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + finalImages.length) % finalImages.length)}
        />
      )}
    </div>
  );
}