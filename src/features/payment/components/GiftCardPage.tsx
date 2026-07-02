import { useState } from 'react';
import { Gift, Check, Star, ArrowLeft, Share2, Download } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface GiftCardPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const denominations = [500, 1000, 1500, 2000, 3000, 5000];

const occasions = [
  { label: 'Birthday', emoji: '🎂' },
  { label: 'Anniversary', emoji: '💍' },
  { label: 'Housewarming', emoji: '🏡' },
  { label: 'Thank You', emoji: '🙏' },
  { label: 'Congratulations', emoji: '🎉' },
  { label: 'Festival', emoji: '✨' },
];

const howItWorks = [
  { step: '01', title: 'Choose an amount', desc: 'Select a gift card value from ₹500 to ₹5,000, or enter a custom amount.' },
  { step: '02', title: 'Personalize it', desc: 'Add the recipient\'s name, a personal message, and choose an occasion design.' },
  { step: '03', title: 'Send it instantly', desc: 'Deliver via email or WhatsApp. The recipient gets a unique redemption code.' },
  { step: '04', title: 'Redeem for any service', desc: 'Gift cards can be used for any service booking on VisvasaHome — plumbing, cleaning, beauty, AMC, and more.' },
];

export function GiftCardPage({ onBack, onNavigate }: GiftCardPageProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('Birthday');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;

  return (
    <div className="min-h-screen bg-white">
      <Header
        onRegisterContractor={() => onNavigate('register-contractor')}
        onBookService={() => onNavigate('get-started-customer')}
        selectedLocation={null}
        onLocationSelect={() => {}}
        onAMCOffice={() => onNavigate('amc-office')}
        onAMCHome={() => onNavigate('amc-home')}
        onAMCCommercial={() => onNavigate('amc-commercial')}
        onAMCIndustrial={() => onNavigate('amc-industrial')}
        onAMCHealthcare={() => onNavigate('amc-healthcare')}
        onAMCEducational={() => onNavigate('amc-educational')}
        onAMCHospitality={() => onNavigate('amc-hospitality')}
        onAMCSociety={() => onNavigate('amc-society')}
        onHome={onBack}
        onNavigate={onNavigate}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2563EB] to-[#E85A1A] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl mb-4" style={{ fontWeight: 700 }}>Gift a Home Service</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Give the gift of a clean home, a fixed leak, or a relaxing wellness session. VisvasaHome gift cards — thoughtful, practical, and always appreciated.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Form */}
            <div>
              <h2 className="text-xl text-gray-900 mb-6" style={{ fontWeight: 700 }}>Customize Your Gift Card</h2>

              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-3" style={{ fontWeight: 600 }}>Select Amount</label>
                <div className="grid grid-cols-3 gap-2">
                  {denominations.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                      className={`py-2.5 rounded-lg border-2 text-sm transition-all ${selectedAmount === amt && !customAmount ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' : 'border-gray-200 text-gray-700 hover:border-[#2563EB]'}`}
                      style={{ fontWeight: 600 }}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <input
                    type="number"
                    placeholder="Or enter custom amount (₹500 – ₹10,000)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Occasion */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-3" style={{ fontWeight: 600 }}>Occasion</label>
                <div className="grid grid-cols-3 gap-2">
                  {occasions.map((occ) => (
                    <button
                      key={occ.label}
                      onClick={() => setSelectedOccasion(occ.label)}
                      className={`py-2 px-3 rounded-lg border-2 text-sm flex items-center gap-1.5 justify-center transition-all ${selectedOccasion === occ.label ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      <span>{occ.emoji}</span>
                      <span>{occ.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Recipient's Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Recipient's Email or WhatsApp</label>
                  <input
                    type="text"
                    placeholder="email@example.com or +91 XXXXX XXXXX"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Personal Message (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Write a heartfelt message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] resize-none"
                  />
                </div>
              </div>

              {sent ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-800" style={{ fontWeight: 600 }}>Gift Card Sent!</p>
                    <p className="text-green-700 text-sm">Your gift card of ₹{finalAmount.toLocaleString()} has been sent to {recipientName || 'the recipient'}.</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSent(true)}
                  disabled={!finalAmount || finalAmount < 500 || !recipientName || !recipientEmail}
                  className="w-full py-3.5 bg-[#2563EB] hover:bg-[#E85A1A] text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  <Gift className="w-5 h-5" />
                  Send Gift Card · ₹{finalAmount.toLocaleString()}
                </button>
              )}
            </div>

            {/* Right: Preview */}
            <div>
              <h2 className="text-xl text-gray-900 mb-6" style={{ fontWeight: 700 }}>Preview</h2>
              <div className="bg-gradient-to-br from-[#2563EB] to-[#E85A1A] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-10 -translate-x-10" />
                <div className="relative z-10">
                  <Gift className="w-10 h-10 mb-4 opacity-90" />
                  <p className="text-white/80 text-sm mb-1">VisvasaHome Gift Card</p>
                  <p className="text-4xl mb-2" style={{ fontWeight: 700 }}>₹{finalAmount.toLocaleString()}</p>
                  <div className="bg-white/20 rounded-lg px-3 py-1.5 inline-block mb-6">
                    <span className="text-sm">{selectedOccasion} {occasions.find(o => o.label === selectedOccasion)?.emoji}</span>
                  </div>
                  {recipientName && <p className="text-sm text-white/80 mb-1">To: <span className="text-white" style={{ fontWeight: 600 }}>{recipientName}</span></p>}
                  {message && <p className="text-sm text-white/70 italic mt-2">"{message}"</p>}
                  <div className="mt-6 pt-4 border-t border-white/30">
                    <p className="text-xs text-white/60">Valid for all VisvasaHome services</p>
                    <p className="text-xs text-white/60">Expires 12 months from purchase</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" /> Share Preview
                </button>
                <button className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 space-y-2">
                {['Valid for all service categories', 'No expiry within 12 months', 'Transferable — gift to anyone', 'Instant digital delivery'].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-10 text-center" style={{ fontWeight: 700 }}>How Gift Cards Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 bg-[#2563EB] text-white rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ fontWeight: 700 }}>
                  {step.step}
                </div>
                <h3 className="text-gray-900 mb-2 text-sm" style={{ fontWeight: 600 }}>{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} onRegisterContractor={() => onNavigate('register-contractor')} />
    </div>
  );
}
