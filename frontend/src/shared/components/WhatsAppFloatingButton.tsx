import { useState } from 'react';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export function WhatsAppFloatingButton({
  phoneNumber = '+919057567160',
  message = 'Hello! I need help with VisvasaHome services.',
  position = 'bottom-right',
}: WhatsAppFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:contact@visvasahome.com';
  };

  const positionClasses = position === 'bottom-right' ? 'right-4 sm:right-6' : 'left-4 sm:left-6';

  return (
    <>
      {/* Main WhatsApp Button */}
      <div className={`fixed bottom-4 sm:bottom-6 ${positionClasses} z-50`}>
        {/* Quick Action Menu */}
        {isOpen && (
          <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-4 w-64 animate-fade-in mb-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Contact Us</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* WhatsApp Option */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-all group mb-2"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 text-sm">WhatsApp Chat</p>
                <p className="text-xs text-gray-500">Instant response</p>
              </div>
            </button>

            {/* Call Option */}
            <button
              onClick={handleCallClick}
              className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-all group mb-2"
            >
              <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 text-sm">Call Now</p>
                <p className="text-xs text-gray-500">{phoneNumber}</p>
              </div>
            </button>

            {/* Email Option */}
            <button
              onClick={handleEmailClick}
              className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 text-sm">Email Us</p>
                <p className="text-xs text-gray-500">We reply in 24hrs</p>
              </div>
            </button>

            {/* Quick Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-center text-gray-600 font-medium">
                Available: Mon-Sun, 8 AM - 8 PM
              </p>
            </div>
          </div>
        )}

        {/* Main Button */}
        

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 hidden sm:block">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Need help? Chat with us!
              <div className="absolute -bottom-1 right-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </>
  );
}
