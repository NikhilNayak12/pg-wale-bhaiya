import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllPGs } from "../utils/api";
import { getPGs } from "../data/pgs";
import PGCard from "./PGCard";

export default function FeaturedGrid() {
  const [featuredPGs, setFeaturedPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedPGs = async () => {
      try {
        setLoading(true);
        
        // Try fetching from backend API first
        try {
          const response = await getAllPGs({ 
            status: 'approved', 
            featured: true,
            limit: 3 
          });
          
          if (response.data?.success && response.data?.data) {
            setFeaturedPGs(response.data.data);
            console.log('✅ Featured PGs loaded from backend API');
          } else {
            throw new Error('Invalid API response');
          }
        } catch (apiError) {
          // Fallback to static data if API fails
          console.warn('⚠️ Backend API unavailable, using static data:', apiError.message);
          const pgs = await getPGs({ status: 'approved', limit: 3, featured: true });
          setFeaturedPGs(pgs);
        }
      } catch (err) {
        console.error('Error fetching featured PGs:', err);
        setError(err.message);
        setFeaturedPGs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPGs();
  }, []);

  return (
    <section className="mt-32 px-1">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-black">Featured PGs Near Your College</h2>
        <p className="mt-6 text-xl text-amber-400 font-semibold">Hand-picked accommodations with verified amenities and quality service</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-10 h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
          <span className="ml-4 text-gray-600">Loading featured PGs...</span>
        </div>
      ) : error ? (
        <div className="text-center mt-10 p-8">
          <div className="text-red-600 mb-4">⚠️ Unable to load featured PGs</div>
          <p className="text-gray-600">{error}</p>
          <Link to="/listings" className="inline-block mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            View All Listings
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {featuredPGs.length > 0 ? (
              featuredPGs.map((pg) => (
                <PGCard 
                  key={pg.id} 
                  item={pg} // Pass the raw API data, let PGCard handle the mapping
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg">No featured PGs available at the moment</div>
                <Link to="/listings" className="inline-block mt-4 px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800">
                  View All Listings
                </Link>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link to="/listings">
              <button className="px-6 py-2 rounded-lg bg-amber-600 text-white font-semibold shadow-lg hover:bg-amber-700 transition-colors">
                View All PGs
              </button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
