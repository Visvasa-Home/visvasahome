import { ArrowLeft, MessageCircle, Link2, Gift } from 'lucide-react';

interface ReferAndEarnPageProps {
  onBack: () => void;
}

export function ReferAndEarnPage({ onBack }: ReferAndEarnPageProps) {
  return (
    <div className="min-h-[100dvh] bg-white flex flex-col relative pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full -ml-2 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Refer & Earn</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        {/* Banner Section */}
        <div className="bg-gradient-to-b from-[#e6f0fa] to-[#f4f7fc] px-6 pt-8 pb-10 relative overflow-hidden">
          <div className="relative z-10 w-2/3">
            <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">Refer and get FREE services</h2>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Invite your friends to try VisvasaHome services. They get instant ₹100 off. You win ₹100 once they take a service.
            </p>
          </div>
          {/* Gift Box Graphic */}
          <div className="absolute right-4 top-8 w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center opacity-80">
             <Gift className="w-12 h-12 text-blue-600" />
          </div>

          <div className="relative z-10 mt-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px bg-gray-300 flex-1 border-dashed border-t"></div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Refer via</span>
              <div className="h-px bg-gray-300 flex-1 border-dashed border-t"></div>
            </div>
            
            <div className="flex items-start justify-center gap-8">
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-7 h-7 text-blue-500 fill-green-500" />
                </div>
                <span className="text-xs font-bold text-gray-700">Whatsapp</span>
              </button>
              
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-7 h-7 text-blue-500 fill-blue-500" />
                </div>
                <span className="text-xs font-bold text-gray-700">Messenger</span>
              </button>

              <button className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Link2 className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-bold text-gray-700">Copy Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="px-6 py-8">
          <div className="bg-[#f0f4fa] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">How it works?</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
              {/* Step 1 */}
              <div className="relative flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#e1e6ec] text-gray-800 font-bold text-sm flex items-center justify-center z-10 shrink-0">
                  1
                </div>
                <p className="text-[15px] font-medium text-gray-800 pt-1">
                  Invite your friends & get rewarded
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#e1e6ec] text-gray-800 font-bold text-sm flex items-center justify-center z-10 shrink-0">
                  2
                </div>
                <p className="text-[15px] font-medium text-gray-800 pt-1">
                  They get ₹100 on their first service
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#e1e6ec] text-gray-800 font-bold text-sm flex items-center justify-center z-10 shrink-0">
                  3
                </div>
                <p className="text-[15px] font-medium text-gray-800 pt-1">
                  You get ₹100 once their service is completed
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-6 mt-6 ml-2">
            <button className="text-sm text-blue-700 font-medium hover:underline list-disc">Terms and conditions</button>
            <button className="text-sm text-blue-700 font-medium hover:underline list-disc">FAQs</button>
          </div>
        </div>

        {/* Scratch Cards */}
        <div className="px-6 pb-8">
          <h3 className="text-[17px] font-bold text-gray-900 mb-1">You are yet to earn any scratch cards</h3>
          <p className="text-sm text-gray-500 font-medium mb-6">Start referring to get surprises</p>
          
          <div className="h-px bg-gray-200 border-dashed border-b mb-6"></div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Earn ₹100 on every successful referral</p>
          </div>
        </div>

      </div>
    </div>
  );
}
