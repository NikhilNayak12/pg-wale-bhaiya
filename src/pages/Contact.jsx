import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Send,
  User,
  MessageSquare,
  Clock,
  Users,
  ArrowRight
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert("Please fill in all required fields (Name, Email, and Message)");
      return;
    }

    setIsSubmitting(true);

    // Create formatted WhatsApp message
    const whatsappMessage = `🏠 *PG Wale Bhaiya - Contact Form Submission*

👤 *Name:* ${formData.name}
📧 *Email:* ${formData.email}
${formData.phone ? `📱 *Phone:* ${formData.phone}` : ''}

💬 *Message:*
${formData.message}

---
*Sent via PG Wale Bhaiya Contact Form*`;

    // WhatsApp business number
    const phoneNumber = "919109222131";
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Small delay for better UX
    setTimeout(() => {
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      // Clear form after submission
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: ""
      });
      
      setIsSubmitting(false);
      
      // Show success message
      alert("Redirecting to WhatsApp! Your message has been prepared and will be sent automatically.");
    }, 1000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us 📞",
      subtitle: "Speak to a human! We're pretty cool.",
      detail: "+91 91092 22131",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-700",
      borderColor: "border-amber-200",
      action: () => window.location.href = "tel:+919109222131"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp 💬",
      subtitle: "Slide into our DMs (respectfully!)",
      detail: "WhatsApp Us",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-700",
      borderColor: "border-amber-200",
      action: () => window.open("https://wa.me/919109222131", "_blank"),
      customIcon: (
        <svg className="w-6 h-6 text-amber-700" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
        </svg>
      )
    },
    {
      icon: Mail,
      title: "Email 📧",
      subtitle: "Old school but gold school",
      detail: "hello.pgwalebhaiya@gmail.com",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-700",
      borderColor: "border-amber-200",
      action: () => window.location.href = "mailto:hello.pgwalebhaiya@gmail.com"
    }
  ];

  return (
    <div className="min-h-screen pt-36 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageSquare size={16} />
            Let's Chat!
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Got Questions?
            <br />
            <span className="text-amber-700">We've Got Answers!</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Need help finding your perfect PG? Want to list yours? Or just wanna say hi? We're all ears!
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Clock size={16} />
            <span>We usually reply within 2 hours (unless we're getting coffee ☕)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <MessageSquare size={16} className="text-amber-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Fill this out and we'll get back to you with all the good stuff! 🚀
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="What do we call you?"
                      className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your digits!"
                      className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

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
                    placeholder="your.awesome@email.com"
                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Spill the tea! What's on your mind? 💭"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700'} text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${!isSubmitting ? 'transform hover:scale-[1.02]' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Preparing WhatsApp Message...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send via WhatsApp
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-3">
                <MessageCircle size={16} className="text-green-600" />
                <span>Your message will be formatted and sent directly via WhatsApp</span>
              </div>
            </form>
          </div>

          {/* Contact Methods */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Phone size={16} className="text-amber-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Fighter 🥊</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Pick your favorite way to reach us. We're everywhere! 🌐
            </p>

            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className={`${method.bgColor} ${method.borderColor} border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
                  onClick={method.action}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 ${method.bgColor} rounded-xl border-2 ${method.borderColor} flex items-center justify-center`}>
                        {method.customIcon ? method.customIcon : <method.icon className={`${method.iconColor} w-6 h-6`} />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {method.subtitle}
                      </p>
                      <p className={`${method.iconColor} font-medium`}>
                        {method.detail}
                      </p>
                    </div>
                    <ArrowRight className="text-gray-400" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
