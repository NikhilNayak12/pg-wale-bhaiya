import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MapPin,
  DollarSign,
  User,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle
} from "lucide-react";
import { getCurrentUser } from "@/services/mockAuth";
import { addLandlordPG } from "@/services/mockLandlordData";

export default function PostPG() {
  const navigate = useNavigate();
  const [landlordData, setLandlordData] = useState(null);
  
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    roomType: "",
    
    // Location Details
    area: "",
    locality: "",
    // fullAddress removed
    
    // Pricing & Availability
    monthlyRent: "",
    totalRooms: "",
    availableRooms: "",
    genderPreference: "",
    
    // Contact Information - always blank initially
    contactPerson: "",
    phoneNumber: "",
    email: "",
    whatsappNumber: "",
    
    // Amenities
    amenities: [],
    otherAmenities: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  // Load landlord data when component mounts
  // No prefill: landlord will manually fill contact details; fields always blank on load

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = [
      'title', 'roomType', 'area', 'locality',
      'monthlyRent', 'availableRooms', 'genderPreference',
      'contactPerson', 'phoneNumber', 'email'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Mock PG submission (no backend)
      console.log('Submitting PG to mock database...');
      
      const pgData = {
        name: formData.title,
        title: formData.title,
        description: `${formData.roomType} available in ${formData.area}, ${formData.locality}. Contact ${formData.contactPerson} for more details.`,
        type: formData.roomType,
        roomType: formData.roomType,
        location: `${formData.locality}, ${formData.area}`,
        area: formData.area,
        locality: formData.locality,
        price: parseInt(formData.monthlyRent),
        monthlyRent: parseInt(formData.monthlyRent),
        totalRooms: parseInt(formData.totalRooms) || parseInt(formData.availableRooms),
        availableRooms: parseInt(formData.availableRooms),
        occupied: 0,
        genderPreference: formData.genderPreference.toLowerCase(),
        amenities: formData.amenities,
        otherAmenities: formData.otherAmenities,
        contact: {
          name: formData.contactPerson,
          phone: formData.phoneNumber,
          email: formData.email,
          whatsapp: formData.whatsappNumber || formData.phoneNumber
        },
        images: ['/pgs/green-1.jpg'], // Default image
        featured: false,
        views: 0
      };

      // Save to mock database (localStorage)
      const savedPG = addLandlordPG(pgData);
      
      if (savedPG) {
        setSubmitStatus('success');
        
        // Store form data before reset for success message
        const submittedTitle = formData.title;
        
        // Reset form
        setFormData({
          title: "",
          roomType: "",
          area: "",
          locality: "",
          monthlyRent: "",
          totalRooms: "",
          availableRooms: "",
          genderPreference: "",
          contactPerson: "",
          phoneNumber: "",
          email: "",
          whatsappNumber: "",
          amenities: [],
          otherAmenities: ""
        });
        
        // Show success message with dashboard link
        setTimeout(() => {
          const continueToDashboard = confirm(`🎉 Success! 

✅ Your PG "${submittedTitle}" has been submitted successfully!

📋 **What happens next?**
• Your submission is now in the admin review queue
• Admin will approve/reject within 24-48 hours  
• You'll receive updates on your dashboard
• Once approved, your PG will be visible to students

📱 **Would you like to:**
• Click OK to view your Landlord Dashboard
• Click Cancel to submit another PG

Thank you for choosing PG Wale Bhaiya! 🏠`);
          
          if (continueToDashboard) {
            navigate('/landlord-dashboard');
          }
        }, 500);
        
      } else {
        throw new Error(response.data.message || 'PG submission failed');
      }
      
    } catch (error) {
      console.error('PG submission error:', error);
      setSubmitStatus('error');
      
      // Show error message
      alert("⚠️ Submission failed. Please try again or contact support at admin@pgwalebhaiya.com");
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const roomTypes = [
    "1 BHK", "2 BHK", "3 BHK"
  ];

  const areaOptions = [
    "Law Gate",
    "Phagwara",
    "Deep Nagar"
  ];

  const genderOptions = [
    "Boys Only", "Girls Only", "Both"
  ];

  const amenitiesList = [
    "WiFi", "AC", "TV", "Mess", "Parking", 
    "Washing Machine", "Power Backup", 
    "Refrigerator", "Security", "Geyser"
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/landlord-dashboard')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Home size={16} />
            List Your PG
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Post Your PG 🏠
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to welcome awesome tenants? Let's get your PG listed in just a few clicks! ✨
          </p>
          {landlordData && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
              <p className="text-green-800 text-sm">
                👋 Welcome back, <strong>{landlordData.name}</strong>! Your contact details have been pre-filled.
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <h2 className="text-2xl font-bold">PG Details</h2>
            <p className="text-blue-100 mt-2">Fill in the details to create your listing. Don't worry, you can edit it later! 😊</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Home size={18} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Surya Apartments"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select room type</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin size={18} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Location Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area *
                  </label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select area</option>
                    {areaOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locality *
                  </label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    placeholder="Near ..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Availability */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign size={18} className="text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Pricing & Availability</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent *
                  </label>
                  <input
                    type="number"
                    name="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={handleInputChange}
                    placeholder="15000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Rooms
                  </label>
                  <input
                    type="number"
                    name="totalRooms"
                    value={formData.totalRooms}
                    onChange={handleInputChange}
                    placeholder="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Rooms *
                  </label>
                  <input
                    type="number"
                    name="availableRooms"
                    value={formData.availableRooms}
                    onChange={handleInputChange}
                    placeholder="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Preference *
                </label>
                <select
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select preference</option>
                  {genderOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">From your account profile</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">From your account profile</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">From your account profile</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Sparkles size={18} className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Amenities</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>

              {/* Others Section */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Amenities
                </label>
                <input
                  type="text"
                  name="otherAmenities"
                  value={formData.otherAmenities}
                  onChange={handleInputChange}
                  placeholder="e.g., Swimming Pool, Garden, Library, Study Room, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separate multiple amenities with commas (e.g., Swimming Pool, Garden, Library)
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${!isSubmitting ? 'transform hover:scale-[1.02] shadow-lg' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Preparing Your Listing...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    🚀 Post My PG
                  </>
                )}
              </button>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
