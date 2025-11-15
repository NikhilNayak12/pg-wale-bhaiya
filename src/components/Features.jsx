import React, { useEffect, useRef, useState } from "react";
import { ShieldCheck, Search, Zap, Heart, Gift, Tag } from "lucide-react";

const items = [
  { title: "Verified Listings", text: "All PGs are personally verified by our team.", Icon: ShieldCheck, bgColor: "bg-emerald-50", iconColor: "text-emerald-600", iconBg: "bg-emerald-100" },
  { title: "Smart Search", text: "Find exactly what you need with filters.", Icon: Search, bgColor: "bg-blue-50", iconColor: "text-blue-600", iconBg: "bg-blue-100" },
  { title: "Quick Booking", text: "Book your ideal PG in minutes.", Icon: Zap, bgColor: "bg-amber-50", iconColor: "text-amber-600", iconBg: "bg-amber-100" },
  { title: "Student-Friendly", text: "Flexible terms and support for students.", Icon: Heart, bgColor: "bg-pink-50", iconColor: "text-pink-600", iconBg: "bg-pink-100" },
  { title: "Cashback Rewards", text: "Get guaranteed cashback on successful bookings.", Icon: Gift, bgColor: "bg-purple-50", iconColor: "text-purple-600", iconBg: "bg-purple-100" },
  { title: "Best Prices", text: "Transparent pricing and no hidden charges.", Icon: Tag, bgColor: "bg-green-50", iconColor: "text-green-600", iconBg: "bg-green-100" },
];

export default function Features() {
  const scrollRef = useRef(null);
  const [flippedCards, setFlippedCards] = useState({});

  const handleCardFlip = (index, isFlipped) => {
    setFlippedCards(prev => ({ ...prev, [index]: isFlipped }));
  };
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame (slower for smoother motion)
    const cardWidth = 366; // card width + gap (360 + 6)
    const totalWidth = cardWidth * items.length;
    let isPaused = false;

    const scroll = () => {
      if (!isPaused) {
        scrollPosition += scrollSpeed;
        
        // Reset position for seamless loop when we've scrolled one set
        if (scrollPosition >= totalWidth) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Start animation
    animationFrameId = requestAnimationFrame(scroll);

    // Pause on hover
    const handleMouseEnter = () => {
      isPaused = true;
    };
    
    const handleMouseLeave = () => {
      isPaused = false;
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <section className="mt-24 w-full mb-16">
      <div className="text-center mb-12 px-4">
        <h3 
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" 
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Why Choose PG wale Bhaiya?
        </h3>
        <p 
          className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed" 
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          We're your trusted partner in finding the perfect home away from home near your college.
        </p>
      </div>

      <div className="relative w-full overflow-hidden py-6">
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-hidden px-6"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollBehavior: 'auto',
            willChange: 'scroll-position'
          }}
        >
          {duplicatedItems.map(({ title, text, Icon, bgColor, iconColor, iconBg }, index) => (
            <div
              key={`${title}-${index}`}
              className="flip-card-container flex-shrink-0 w-[340px] md:w-[360px] h-[320px]"
              style={{ perspective: '1000px' }}
              onMouseEnter={() => handleCardFlip(index, true)}
              onMouseLeave={() => handleCardFlip(index, false)}
            >
              <div
                className={`flip-card-inner relative w-full h-full transition-transform duration-700 ease-in-out ${
                  flippedCards[index] ? 'rotate-y-180' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flippedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front of card - Image */}
                <div
                  className="flip-card-front absolute w-full h-full rounded-3xl overflow-hidden shadow-lg"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <img
                    src="/src/assets/old-plank-wood-texture.jpg"
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-amber-950/40"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <Icon size={72} className="text-amber-950 mb-4 drop-shadow-2xl" strokeWidth={2} />
                    <h4 className="text-2xl font-bold text-white text-center drop-shadow-lg">{title}</h4>
                  </div>
                </div>

                {/* Back of card - Content */}
                <div
                  className={`flip-card-back absolute w-full h-full ${bgColor} rounded-3xl p-10 border border-gray-100 shadow-xl`}
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${iconBg} mb-6 transition-transform duration-300`}>
                    <Icon size={36} className={iconColor} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-2xl font-bold mb-3 text-gray-900">{title}</h4>
                  <p className="text-base text-slate-600 leading-relaxed">{text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
