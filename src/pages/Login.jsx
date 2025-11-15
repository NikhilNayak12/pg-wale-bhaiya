import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Home,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { mockLogin, DEMO_CREDENTIALS } from "@/services/mockAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || '/landlord-dashboard';
  const message = location.state?.message;
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.email.trim() || !formData.password.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Mock login (no Firebase)
      const userData = await mockLogin(formData.email, formData.password);
      
      window.dispatchEvent(new Event('landlord-login'));
      setIsSubmitting(false);
      alert("✅ Login successful! Redirecting to your dashboard...");
      navigate(returnUrl);
    } catch (error) {
      setIsSubmitting(false);
      let errorMessage = "Login failed";
      
      if (error.message === 'EMAIL_NOT_FOUND') {
        errorMessage = "No account found with this email";
      } else if (error.message === 'INVALID_PASSWORD') {
        errorMessage = "Incorrect password";
      } else {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        {/* Back to Home */}
        <div className="mt-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Welcome Message */}
          <div className="text-left space-y-6 lg:pr-12">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Welcome, Landlord 👋
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Manage your PG listings, update details, and track verifications from one dashboard.
              </p>
            </div>
            
            {/* Illustration or additional content */}
            <div className="hidden lg:block">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle size={24} className="text-white" />
                    </div>
                    <p className="text-gray-700 font-medium">List Your PG for Free</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium">Manage Bookings Easily</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium">Connect with Verified Tenants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                <Home size={28} className="text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Landlord Login</h2>
              <p className="text-amber-100 text-xs">Welcome back!</p>
              
              {/* Message from redirect */}
              {message && (
                <div className="mt-4 p-3 bg-amber-900/30 border border-amber-500/50 rounded-lg">
                  <p className="text-amber-100 text-sm">{message}</p>
                </div>
              )}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/reset-password" className="font-medium text-amber-600 hover:text-amber-700">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transform hover:scale-[1.02] transition-all duration-300'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to PG Wale Bhaiya?</span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6">
            <Link
              to="/signup"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              <User size={16} />
              Create New Account
            </Link>
          </div>

          {/* Footer */}
          <div className="my-6 text-center">
            <p className="text-sm text-gray-600">
              By signing in, you agree to our{" "}
              <Link to="/terms-of-service" className="text-amber-600 hover:text-amber-700" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy-policy" className="text-amber-600 hover:text-amber-700" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
