import React, { useState } from "react";
import { ChevronDown, MessageCircle, Phone, Mail, Sparkles, HelpCircle, Gift } from "lucide-react";

export default function FAQ() {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const faqData = [
    {
      category: "Frequently Asked Questions",
      icon: HelpCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      questions: [
        {
          question: "What is PG wale Bhaiya?",
          answer: "PG Wale Bhaiya is for students who've had enough of the usual PG hassles — false promises, unreliable middlemen, and rooms that don't match the pictures. Whether you're new to the city, moving from one PG to another, or finally done with the hostel life, we keep it real. We help you find verified PGs that match your budget, vibe, and lifestyle — minus the stress."
        },
        {
          question: "Is PG Wale Bhaiya free to use for students?",
          answer: "Yep, totally free for students. Browse as much as you want, talk to PG owners, get our help — all without spending a rupee. We only charge PG owners if they want premium features, not you."
        },
        {
          question: "How do I search for PGs on your platform?",
          answer: "Easy — head to our Listings page, use filters for budget, location, and facilities, or just ping us and we'll handpick options for you. You can be as choosy as you want, we won't judge."
        },
        {
          question: "Are all the PGs listed verified?",
          answer: "100%. No shady stuff here. We personally check every PG before it goes live — photos, amenities, cleanliness, safety — so you know what you see is what you'll actually get."
        },
        {
          question: "Can I visit the PG before booking?",
          answer: "Of course, and you totally should. We can help arrange visits, and if needed, even tag along. Our golden rule: never book a PG you haven't seen in person."
        },
        {
          question: "How do I book a PG through your platform?",
          answer: "Found a PG you like? Just call, WhatsApp, or email the owner directly — their contact info is right there in the listing. No middlemen, no extra steps. Talk to them, visit the place, and if it feels right, lock it in."
        },
        {
          question: "Are there any hidden charges?",
          answer: "No hidden stuff here. The rent you see is only for the room — things like electricity, water, or maintenance (if any) are extra, and the owner will tell you upfront. No last-minute shocks."
        },
        {
          question: "Will I get a cashback?",
          answer: "Yes! We offer cashback rewards on successful bookings. The cashback amount varies based on the PG and booking value. Check our Cashback section below for detailed information on how to claim your rewards."
        }
      ]
    },
    {
      category: "Cashback & Rewards",
      icon: Gift,
      color: "text-green-600",
      bgColor: "bg-green-50",
      questions: [
        {
          question: "How much cashback can I get?",
          answer: "You can get a nice cashback of around ₹300 to ₹500, depending on the PG and the current offers."
        },
        {
          question: "How do I claim my cashback?",
          answer: "When you chat with the landlord to book your PG, just let them know you found the PG on our website — PG Wale Bhaiya. They'll give you a special code. After you pay the first month's rent (or whatever amount the landlord asks for), go to the book option of the PG listed on the website, fill out the form, upload a screenshot of your payment, and enter the code. Submit it, and we'll handle your cashback!"
        },
        {
          question: "When will I receive the cashback?",
          answer: "As soon as you claim your cashback, we'll confirm with the landlord within 3 to 5 days. After that, your cashback will be credited to you — quick and hassle-free!"
        },
        {
          question: "Are there any conditions for cashback?",
          answer: "Just a heads-up — make sure you tell the landlord you found the PG through our website, PG Wale Bhaiya, and don't forget to grab that special code from them. If you miss this, it could make claiming your cashback tricky. Also, keep an eye on any other offer details so nothing surprises you!"
        },
        {
          question: "Who do I contact if I don't receive my cashback?",
          answer: "No worries if your cashback doesn't show up on time — just ping our support team via chat or email. We're here to help and will get it sorted for you as quickly as possible!"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/50">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-400/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-amber-400/10 rounded-full blur-lg"></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-200 to-orange-300 text-white pt-28 pb-12 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-800/30 to-orange-300/30 rounded-full blur-xl animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-r from-amber-600/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-amber-500/20 shadow-2xl">
                <Sparkles size={42} className="text-white animate-bounce" style={{animationDuration: '3s'}} />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-black leading-tight">
            Frequently Asked
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium mb-8 text-gray-800">
            Questions & Answers �
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about finding your perfect PG through PG wale Bhaiya — the real, hassle-free way.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            {/* Category Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full border border-amber-200/50 backdrop-blur-sm">
                <category.icon size={28} className="text-amber-700" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {category.category}
                </h2>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {category.questions.map((faq, questionIndex) => {
                const globalIndex = `${categoryIndex}-${questionIndex}`;
                const isOpen = openAccordion === globalIndex;

                return (
                  <div
                    key={questionIndex}
                    className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 ${
                      isOpen ? 'shadow-xl shadow-amber-500/20 ring-2 ring-amber-500/20' : 'shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(globalIndex)}
                      className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-amber-50/50 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          isOpen ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 group-hover:bg-amber-200'
                        }`}>
                          {questionIndex + 1}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 pr-4 leading-relaxed group-hover:text-amber-700 transition-colors duration-200">
                          {faq.question}
                        </h3>
                      </div>
                      <div className={`flex-shrink-0 transition-all duration-300 ${
                        isOpen ? 'rotate-180 text-amber-700' : 'text-gray-400 group-hover:text-amber-600'
                      }`}>
                        <ChevronDown size={24} className="drop-shadow-sm" />
                      </div>
                    </button>
                    
                    <div className={`transition-all duration-500 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                      <div className="px-8 pb-8">
                        <div className="pl-12">
                          <div className="h-px bg-gradient-to-r from-amber-200 to-transparent mb-6"></div>
                          <p className="text-lg text-gray-700 leading-relaxed font-medium">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA Section */}
      <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white py-12 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-400/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-full mb-6">
              <MessageCircle size={32} className="text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
              Still Have Questions?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Can't find what you're looking for? We're here to help! Reach out and we'll get back to you faster than you can say "PG hunting" 🏠
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/919109222131"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30"
            >
              <svg 
                width={20} 
                height={20} 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="group-hover:animate-pulse"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
              </svg>
              WhatsApp Us
            </a>
            <a
              href="tel:+919109222131"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/15 backdrop-blur-sm hover:bg-white hover:text-blue-600 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Phone size={20} className="group-hover:animate-pulse" />
              Call Us Now
            </a>
            <a
              href="mailto:hello.pgwalebhaiya@gmail.com"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
            >
              <Mail size={20} className="group-hover:animate-pulse" />
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
