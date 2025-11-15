          <Route path="/terms-of-service" element={<TermsOfService />} />
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import ResetPassword from "@/pages/ResetPassword";
import Hero from "@/components/Hero";
import FeaturedGrid from "@/components/FeaturedGrid";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Listings from "@/pages/Listings";
import PGDetails from "@/pages/PGDetails";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import PostPG from "@/pages/PostPG";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import LandlordDashboard from "@/pages/LandlordDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin";
import StudentLogin from "@/pages/StudentLogin";
import StudentDashboard from "@/pages/StudentDashboard";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import ProtectedLandlordRoute from "@/components/ProtectedLandlordRoute";
import ProtectedStudentRoute from "@/components/ProtectedStudentRoute";

// Component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Home page component
function HomePage() {
  return (
    <main>
      <Hero />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <FeaturedGrid />
      </section>

      {/* Full width carousel section */}
      <Features />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <CTA />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <Testimonials />
      </section>
    </main>
  );
}

// Component to conditionally render navbar and footer
function Layout({ children }) {
  const location = useLocation();
  // Detect admin and student dashboard routes (hide navbar and footer)
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStudentDashboard = location.pathname.startsWith('/student/dashboard');

  return (
    <div className="font-sans text-slate-900">
      <ScrollToTop />
      {!isAdminRoute && !isStudentDashboard && <Navbar />}
      {children}
      {!isAdminRoute && !isStudentDashboard && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/post-pg" element={<ProtectedLandlordRoute><PostPG /></ProtectedLandlordRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedLandlordRoute><LandlordDashboard /></ProtectedLandlordRoute>} />
          <Route path="/landlord-dashboard" element={<ProtectedLandlordRoute><LandlordDashboard /></ProtectedLandlordRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/pgs" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/cashback" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<ProtectedStudentRoute><StudentDashboard /></ProtectedStudentRoute>} />
          <Route path="/pg/:id" element={<PGDetails />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </Layout>
    </Router>
  );
}
