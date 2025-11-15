import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Shield,
  Heart,
  Star,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Award,
  Clock,
  Home
} from "lucide-react";

export default function About() {
  // const stats = [
  //   { icon: Home, label: "PG Properties", value: "500+", color: "text-blue-600" },
  //   { icon: Users, label: "Happy Students", value: "2000+", color: "text-green-600" },
  //   { icon: MapPin, label: "Locations Covered", value: "15+", color: "text-purple-600" },
  //   { icon: Star, label: "Average Rating", value: "4.8", color: "text-yellow-600" }
  // ];

  const features = [
    {
      icon: CheckCircle,
      title: "🔒 Verified Properties",
      description: "All our PG listings are thoroughly verified to ensure you get exactly what you see — no surprises, no compromises."
    },
    {
      icon: Award,
      title: "💸 Affordable & Reliable",
      description: "We offer the best value for your budget, without sacrificing comfort or quality."
    },
    {
      icon: Star,
      title: "🎁 Get Assured Cashback",
      description: "Book your stay through us and enjoy guaranteed cashback. It's our way of saying thank you for choosing smart."
    }
  ];

  return (
    
      
        <div className="min-h-screen pt-36 pb-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">About PG wale Bhaiya</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Your go-to companion for finding the perfect PG near LPU. We help students discover verified, comfortable, and budget-friendly stays.
              </p>
            </div>

            {/* Stats Section */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4`}>
                <stat.icon className={`${stat.color} w-8 h-8`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div> */}

            {/* Our Story Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-lg mb-16 border border-amber-200">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">Our Story</h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="text-xl leading-relaxed mb-6">
                    PG Wale Bhaiya is built for students who are tired of the same old struggle — fake listings, weird brokers, and PGs that don't match the pictures.
                  </p>
                  <p className="text-lg leading-relaxed mb-6">
                    We're here to change that.
                  </p>
                  <p className="text-lg leading-relaxed mb-8">
                    Whether you're new in the city or just shifting places, we help you find verified PGs that fit your budget, your vibe, and your lifestyle — all without the stress.
                  </p>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4">💼 What We Actually Do</h3>
                  <ul className="list-disc list-inside space-y-2 mb-8 text-lg">
                    <li>Help you find PGs that match you — no spam, no confusion</li>
                    <li>Provide clear photos, real reviews, and verified properties</li>
                    <li>Talk like a friend, not like a salesman</li>
                    <li>Offer exclusive cashback when you book through us 🤑</li>
                    <li>Support you from start to move-in</li>
                  </ul>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4">🤝 Why Trust Us?</h3>
                  <p className="text-lg leading-relaxed mb-4">
                    Because we've been through it too.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    We know what it's like to scroll endlessly, call a dozen people, and still not find the right place. That's why we built something better — by students, for students.
                  </p>
                  <p className="text-lg leading-relaxed font-semibold text-amber-700">
                    Let us handle the PG hunt, you handle college life.
                  </p>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Why Choose PG Wale Bhaiya?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                          <feature.icon className="w-6 h-6 text-amber-700" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Values Section */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-3xl p-8 md:p-12 text-white mb-16">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-8">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-amber-200" />
                    <h3 className="text-xl font-semibold mb-3">Student-First</h3>
                    <p className="text-amber-100">Every decision we make is centered around student needs and satisfaction.</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-amber-200" />
                    <h3 className="text-xl font-semibold mb-3">Trust & Safety</h3>
                    <p className="text-amber-100">We ensure all properties meet our strict safety and quality standards.</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-amber-200" />
                    <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                    <p className="text-amber-100">No hidden fees, no surprises. Complete transparency in all our dealings.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-lg text-center border border-amber-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Find Your Perfect PG?</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Your next PG might just be a scroll away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/listings"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Browse PG Listings
                  <ArrowRight size={20} />
                </Link>
                <div className="flex items-center gap-6 text-gray-700">
                  <a href="tel:+919109222131" className="flex items-center gap-2 hover:text-amber-700 transition-colors">
                    <Phone size={18} />
                    <span>+91 9109222131</span>
                  </a>
                  <a href="mailto:hello.pgwalebhaiya@gmail.com" className="flex items-center gap-2 hover:text-amber-700 transition-colors">
                    <Mail size={18} />
                    <span>hello.pgwalebhaiya@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      
  );
}
