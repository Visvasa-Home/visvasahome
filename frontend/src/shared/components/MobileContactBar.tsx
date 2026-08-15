import { Phone, Mail, MessageCircle } from 'lucide-react';

interface MobileContactBarProps {
  phoneNumber?: string;
  email?: string;
  whatsappNumber?: string;
}

export function MobileContactBar({
  phoneNumber = '+919057567160',
  email = 'contact@visvasahome.com',
  whatsappNumber = '919057567160',
}: MobileContactBarProps) {
  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hello! I need help with VisvasaHome services.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg py-4 px-4">
      <div className="max-w-lg mx-auto">
        <p className="text-center text-sm font-semibold text-gray-700 mb-3">
          Need Help? Contact Us
        </p>
        <div className="grid grid-cols-3 gap-3">
          {/* Phone */}
          <button
            onClick={handleCall}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all active:scale-95 border border-blue-200"
          >
            <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-900">Call</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all active:scale-95 border border-blue-200"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-900">WhatsApp</span>
          </button>

          {/* Email */}
          <button
            onClick={handleEmail}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all active:scale-95 border border-blue-200"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-900">Email</span>
          </button>
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">Available 24/7 for your convenience</p>
        </div>
      </div>
    </div>
  );
}
