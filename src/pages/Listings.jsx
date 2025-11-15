import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAllPGs } from "../utils/api";
import { getPGs } from "../data/pgs";
import PGCard from "@/components/PGCard";
import { Search, Filter, MapPin, Home, IndianRupee, Loader2 } from "lucide-react";

export default function Listings() {
  const location = useLocation();
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Helper function to get initial filters from URL params
  const getInitialFilters = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      search: searchParams.get('search') || '',
      location: searchParams.get('location') || 'All Cities',
      roomType: searchParams.get('roomType') || 'All Types',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || ''
    };
  };

  const [filters, setFilters] = useState(getInitialFilters);
  const [appliedFilters, setAppliedFilters] = useState(getInitialFilters);

  // Fetch PGs data from backend API with fallback
  useEffect(() => {
    const fetchPGs = async () => {
      try {
        setLoading(true);
        
        let allPGs = [];
        
        // Try fetching from backend API first
        try {
          const response = await getAllPGs({ status: 'approved' });
          
          if (response.data?.success && response.data?.data) {
            allPGs = response.data.data;
            console.log('✅ PGs loaded from backend API:', allPGs.length);
          } else {
            throw new Error('Invalid API response');
          }
        } catch (apiError) {
          // Fallback to static data if API fails
          console.warn('⚠️ Backend API unavailable, using static data:', apiError.message);
          allPGs = await getPGs({ status: 'approved' });
        }
        
        // Apply client-side filtering
        let filtered = [...allPGs];
        
        // Search filter
        if (appliedFilters.search && appliedFilters.search.trim()) {
          const searchTerm = appliedFilters.search.trim().toLowerCase();
          filtered = filtered.filter(pg => 
            pg.name?.toLowerCase().includes(searchTerm) ||
            pg.description?.toLowerCase().includes(searchTerm) ||
            pg.location?.toLowerCase().includes(searchTerm)
          );
        }
        
        // Location filter
        if (appliedFilters.location && appliedFilters.location !== 'All Cities') {
          filtered = filtered.filter(pg => 
            pg.location?.includes(appliedFilters.location) ||
            pg.area?.includes(appliedFilters.location)
          );
        }
        
        // Room type filter (gender preference)
        if (appliedFilters.roomType && appliedFilters.roomType !== 'All Types') {
          const roomType = appliedFilters.roomType.toLowerCase();
          filtered = filtered.filter(pg => 
            pg.genderPreference?.toLowerCase() === roomType ||
            pg.genderPreference === 'any'
          );
        }
        
        // Price filters
        if (appliedFilters.minPrice) {
          const minPrice = parseInt(appliedFilters.minPrice);
          filtered = filtered.filter(pg => (pg.price || pg.monthlyRent) >= minPrice);
        }
        
        if (appliedFilters.maxPrice) {
          const maxPrice = parseInt(appliedFilters.maxPrice);
          filtered = filtered.filter(pg => (pg.price || pg.monthlyRent) <= maxPrice);
        }
        
        setPGs(filtered);
        
      } catch (err) {
        console.error('Error fetching PGs:', err);
        setError('Failed to load PG listings. Please try again.');
        setPGs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPGs();
  }, [appliedFilters]);

  // Update filters when URL changes
  useEffect(() => {
    const initialFilters = getInitialFilters();
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }, [location.search]);

  const locations = ['All Cities', 'Law Gate', 'Phagwara', 'Deep Nagar', 'Green Avenue', 'Model Town', 'Urban Estate', 'Civil Lines', 'Banga Road'];
  const roomTypes = ['All Types', 'Single', 'Double', 'Triple', '1 BHK', '2 BHK', '3 BHK'];

  // Apply filters (client-side since we're using static data)
  const applyFiltersToAPI = async () => {
    // Just update applied filters - the useEffect will handle fetching
    setAppliedFilters(filters);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    applyFiltersToAPI();
  };

  const clearFilters = () => {
    const resetFilters = {
      search: '',
      location: 'All Cities',
      roomType: 'All Types',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    // Also refresh the PGs list
    getAllPGs({ status: 'approved' })
      .then(response => {
        setPGs(response.data.data || []);
      })
      .catch(err => {
        console.error('Error clearing filters:', err);
        setError('Failed to clear filters. Please try again.');
      });
  };

  return (
    <div className="min-h-screen pt-36 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900">All PG Listings</h1>
          <p className="mt-4 text-lg text-gray-600">
            Browse through all available PG accommodations near LPU
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 text-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="text-amber-700" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Filter Your Search</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="flex-1 min-w-16 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full placeholder-gray-500 bg-amber-50 pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none"
              />
            </div>

            {/* Location Dropdown */}
            <div className="relative min-w-40">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full bg-amber-50 pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none appearance-none"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Room Type Dropdown */}
            <div className="relative min-w-36">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <select
                value={filters.roomType}
                onChange={(e) => handleFilterChange('roomType', e.target.value)}
                className="w-full bg-amber-50 pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none appearance-none"
              >
                {roomTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Price Range */}
            <div className="flex gap-2">
              <div className="relative w-28">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full placeholder-gray-500 bg-amber-50 pl-8 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none"
                />
              </div>
              <div className="relative w-28">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full placeholder-gray-500 bg-amber-50 pl-8 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={applyFilters}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap text-white bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 disabled:opacity-60"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button
                onClick={clearFilters}
                disabled={loading}
                className="flex items-center gap-2 disabled:opacity-60 bg-amber-50 text-amber-700 border border-amber-200 px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Loading PG listings...
              </span>
            ) : (
              <>
                Showing <span className="font-semibold">{pgs.length}</span> PG listings
              </>
            )}
          </p>
          
          {/* Active Filters Display */}
          {(appliedFilters.location !== 'All Cities' || appliedFilters.roomType !== 'All Types' || 
            appliedFilters.minPrice || appliedFilters.maxPrice || appliedFilters.search) && (
            <div className="flex flex-wrap gap-2">
              {appliedFilters.search && (
                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                  Search: {appliedFilters.search}
                </span>
              )}
              {appliedFilters.location !== 'All Cities' && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Location: {appliedFilters.location}
                </span>
              )}
              {appliedFilters.roomType !== 'All Types' && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Room: {appliedFilters.roomType}
                </span>
              )}
              {(appliedFilters.minPrice || appliedFilters.maxPrice) && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  Price: ₹{appliedFilters.minPrice || '0'} - ₹{appliedFilters.maxPrice || '∞'}
                </span>
              )}
            </div>
          )}
        </div>

        {/* PG Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : pgs.length > 0 ? (
            pgs.map((pg) => (
              <PGCard key={pg.id} item={pg} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {error ? 'Error loading PG listings.' : 'No PGs found matching your criteria.'}
              </p>
              <p className="text-gray-400 mt-2">
                {error ? 'Please try refreshing the page.' : 'Try adjusting your filters to see more results.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
