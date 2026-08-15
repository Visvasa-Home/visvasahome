import React from "react";
import { Target, Lightbulb, Heart } from "lucide-react";

interface CTASectionProps {
  onGetStarted: () => void;
  onRegisterContractor: () => void;
}

export function CTASection({
  onGetStarted,
  onRegisterContractor,
}: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-12 md:p-16 text-white shadow-2xl" style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 60%, #1E40AF 100%)" }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-4 text-3xl md:text-4xl font-bold">
              Why Choose VisvasaHome
            </h2>
            <p className="text-center text-blue-100 mb-14 text-lg">
              India's most trusted platform for local services and verified professionals
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-14">
              <div className="text-center bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Complete Services</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Everything your home needs in one trusted platform. From repairs to renovations, we have you covered.
                </p>
              </div>

              <div className="text-center bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Local Accountability</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Verified professionals from your community. Real relationships, real trust, real accountability.
                </p>
              </div>

              <div className="text-center bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-4">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Fair for Everyone</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Quality service at fair prices. Supporting professionals who take pride in their work.
                </p>
              </div>
            </div>

            <div className="text-center border-t border-white/20 pt-10">
              <p className="text-xl md:text-2xl mb-8 font-semibold">
                Join thousands building better communities together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-white rounded-xl hover:bg-blue-50 transition-all font-semibold shadow-lg hover:shadow-xl" style={{ color: "#2563EB" }}
                >Get Started as Customer</button>
                <button
                  onClick={onRegisterContractor}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white transition-all font-semibold" style={{ '--hover-color': '#2563EB' } as React.CSSProperties}
                >
                  Join as Professional
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}