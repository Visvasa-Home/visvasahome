import { Star, Quote, CheckCircle2 } from "lucide-react";

const homeReviews = [
  {
    name: "Priya Sharma",
    city: "Jaipur",
    service: "Home Cleaning (Deep Clean)",
    rating: 5,
    text: "Absolutely outstanding experience. The team from VisvasaHome arrived on time, explained every step they'd take, and left my 3BHK absolutely spotless. The level of professionalism was a welcome change — no haggling, no surprises.",
    avatar: "PS",
    bgColor: "bg-[#2563EB]",
  },
  {
    name: "Rahul Mehta",
    city: "Delhi NCR",
    service: "AC Service & Gas Refill",
    rating: 5,
    text: "Called VisvasaHome for AC servicing before summer hit. The technician was knowledgeable, showed me what was wrong, and fixed two ACs in under 3 hours. Pricing was transparent — I saw the quote before any work started.",
    avatar: "RM",
    bgColor: "bg-blue-600",
  },
  {
    name: "Sunita Agarwal",
    city: "Bengaluru",
    service: "Electrical Repair & Wiring",
    rating: 5,
    text: "I was nervous about letting someone into my home for electrical work but VisvasaHome's verification system gave me confidence. The electrician was certified, wore proper identification, and the job was documented digitally.",
    avatar: "SA",
    bgColor: "bg-blue-600",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50 border-b border-gray-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-black text-[#2563EB] uppercase tracking-widest bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
            Real Customer Reviews
          </span>
          <h2 className="mt-4 mb-3 text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            What our customers say
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto font-medium">
            Over 10,000+ completed bookings with a platform average rating of 4.8★
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {homeReviews.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-gray-150 shadow-premium shadow-premium-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 ${t.bgColor} rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-gray-900 leading-none">{t.name}</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-green-50 flex-shrink-0" />
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">{t.city} · Verified Booking</p>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 text-blue-400 fill-yellow-400"
                    />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="w-7 h-7 text-blue-100/60 absolute -top-1.5 -left-1" />
                  <p className="text-gray-655 text-xs leading-relaxed pl-5 font-medium">
                    {t.text}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100">
                <span className="inline-block px-3 py-1 bg-blue-50 text-[#2563EB] rounded-lg text-[10px] font-extrabold border border-blue-200/20">
                  {t.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
