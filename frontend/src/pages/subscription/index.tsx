import React, { useState } from "react";
import PeekCarousel from "../azugh/components/PeekCarousel";
import { Check, X } from "lucide-react";
import PageLayout from "@/layout/PageLayout";

const subscriptionPlans = [
  {
    name: "Basic",
    price: "$7.95",
    period: "/month",
    image: "/assets/sub-1.png",
    features: [
      "Everyday AI outfit recommendations(10 curated search/month)",
      "Pinterest outfits curation",
      "Travel outfit curation (3 curated searches per month)",
      "Style evolution tracking",
      "AI-Personalized lookbook",
    ],
  },
  {
    name: "Plus",
    price: "$15.95",
    period: "/month",
    image: "/assets/sub-2.png",
    features: [
      "Unlimited everyday AI outfit recommendations",
      "Pinterest outfits curation",
      "Travel outfit curation (15 curated searches 1 trip/Month)",
      "Style evolution tracking",
      "AI-Personalized lookbook",
    ],
  },
  {
    name: "Premium",
    price: "$29.95",
    period: "/month",
    image: "/assets/sub-3.png",
    features: [
      "Unlimited AI outfit recommendations",
      "Pinterest outfits curation",
      "Unlimited travel outfit curation",
      "Style evolution tracking",
      "AI-Personalized lookbook",
      "Unlimited occasion-based styling",
    ],
  },
  {
    name: "ONE-TIME TRAVEL STYLING",
    price: "$5.95",
    period: "/trip",
    image: "/assets/sub-4.png",
    features: [
      "Pinterest outfits curation",
      "Travel outfit curation (6 curated searches)",
      "Shopping assistance (brand links)",
      "Style evolution tracking",
      "Multi-destination travel wardrobe curation (only for the trip purchased)",
    ],
  },
];

const SubscriptionPage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    typeof subscriptionPlans[0] | null
  >(null);

  const handleSubscribe = (plan: typeof subscriptionPlans[0]) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  return (
    <PageLayout className="bg-white">
      {/* Main Container - Centered and Fixed Height */}
      <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto">
        {/* Carousel Container */}
        <div className="flex items-center justify-center w-full">
          <PeekCarousel
            items={subscriptionPlans}
            current={current}
            setCurrent={setCurrent}
            cardWidth={
              window.innerWidth < 640
                ? Math.min(280, window.innerWidth * 0.85)
                : 280
            }
            height={
              window.innerHeight < 700
                ? window.innerHeight * 0.65
                : 500
            }
            renderItem={(plan, idx, isActive) => (
              <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm font-manrope flex flex-col w-full h-full max-w-[280px] mx-auto">
                {/* Top Image Section - Responsive Height */}
                <div className="h-16 sm:h-20 bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <img
                    src={plan.image}
                    alt={`${plan.name} Plan`}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content Section - Flexible */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 min-h-0">
                  {/* Plan Name - Fixed Height */}
                  <div className="h-10 sm:h-12 flex items-start mb-2">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900 font-manrope leading-tight line-clamp-2">
                      {plan.name}
                    </h2>
                  </div>

                  {/* Price - Fixed Height */}
                  <div className="h-6 sm:h-7 flex items-baseline mb-3">
                    <span className="text-base sm:text-lg font-bold text-gray-900 font-manrope">
                      {plan.price}
                    </span>
                    <span className="text-xs text-gray-600 font-manrope ml-1">
                      {plan.period}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 mb-3"></div>

                  {/* Features List - Flexible Height with Scroll */}
                  <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <ul className="space-y-1.5 flex-1 overflow-y-auto">
                      {plan.features.map((feature, featureIdx) => (
                        <li
                          key={featureIdx}
                          className="flex items-start gap-2"
                        >
                          <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-700 font-manrope leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subscribe Button - Fixed Height */}
                  <div className="mt-3 pt-2 flex-shrink-0">
                    <button
                      disabled
                      onClick={() => handleSubscribe(plan)}
                      className="w-full bg-[#303A2FB2] text-white py-2 px-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors font-manrope"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        {/* Indicators - Fixed at Bottom */}
        <div className="flex justify-center items-center w-full mt-4 mb-2">
          <div className="flex space-x-2.5 items-center">
            {subscriptionPlans.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className="focus:outline-none"
                onClick={() => setCurrent(idx)}
                aria-label={`Go to plan ${idx + 1}`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${current === idx ? "bg-black" : "bg-gray-300"
                    } inline-block`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto flex flex-col items-center py-6 px-4">
          <div className="w-full max-w-xs mx-auto">
            {/* Header with Close */}
            <div className="flex justify-end mb-4">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Apple Pay button */}
            <button className="w-full bg-black text-white rounded-lg py-3 text-center text-base font-semibold font-manrope mb-4">
              Pay
            </button>

            {/* OR divider */}
            <div className="flex items-center justify-between mb-4">
              <div className="border-t border-gray-300 w-full"></div>
              <span className="px-3 text-sm text-gray-500 font-manrope">
                Or pay using
              </span>
              <div className="border-t border-gray-300 w-full"></div>
            </div>

            {/* Payment method tabs */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button className="border border-gray-400 text-xs rounded-md py-2 font-manrope">
                Card
              </button>
              <button className="border border-gray-300 text-xs rounded-md py-2 font-manrope">
                iDEAL
              </button>
              <button className="border border-gray-300 text-xs rounded-md py-2 font-manrope">
                SEPA Debit
              </button>
              <button className="border border-gray-300 text-xs rounded-md py-2 font-manrope">
                Bank
              </button>
            </div>

            {/* Card input section */}
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-sm"
                  placeholder="Card number"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className="px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-sm"
                  placeholder="MM / YY"
                />
                <input
                  type="text"
                  className="px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-sm"
                  placeholder="CVC"
                />
              </div>

              <div>
                <select className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm text-gray-700">
                  <option>United States</option>
                  <option>Germany</option>
                  <option>France</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="ZIP"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="accent-black" />
                <label>Save this card for future powdur payments</label>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                className="w-full bg-[#6366F1] text-white py-3 rounded-lg font-semibold text-sm opacity-70 cursor-not-allowed"
                disabled
              >
                Pay €90.00
              </button>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default SubscriptionPage;
