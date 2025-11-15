import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();
  const ctaRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  const handleStartSearching = () => {
    navigate('/listings');
  };

  const handleListPG = () => {
    navigate('/post-pg');
  };

  return (
    <div 
      ref={ctaRef}
      className={`bg-gradient-to-r from-[#5d2e0d] via-[#6f381e] to-[#603b16] rounded-3xl p-12 md:p-16 text-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
        Ready to find your perfect PG?
      </h3>
      <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
        Join thousands of satisfied students who found their ideal accommodation with PG wale Bhaiya.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-5">
        <button 
          onClick={handleStartSearching}
          className="px-8 py-4 bg-white text-amber-900 rounded-full text-lg font-bold shadow-md transition-all duration-300 hover:shadow-lg"
        >
          Start Searching
        </button>

        <button 
          onClick={handleListPG}
          className="px-8 py-4 border-2 border-white text-white bg-transparent rounded-full text-lg font-bold shadow-md transition-all duration-300 hover:bg-white hover:text-amber-900"
        >
          List Your PG
        </button>
      </div>
    </div>
  );
}
