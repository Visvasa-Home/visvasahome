// WhatsApp OTP Service using Twilio WhatsApp API
// To use this, you need to:
// 1. Create a Twilio account at https://www.twilio.com/
// 2. Enable WhatsApp in your Twilio account
// 3. Get your Account SID and Auth Token
// 4. Set up environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER

interface OTPResponse {
  success: boolean;
  message: string;
  sid?: string;
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in memory (in production, use Redis or database)
const otpStore: Map<string, { otp: string; timestamp: number }> = new Map();

// Send OTP via WhatsApp using Twilio
export async function sendWhatsAppOTP(phoneNumber: string): Promise<OTPResponse> {
  try {
    const otp = generateOTP();
    const formattedPhone = `+91${phoneNumber}`;

    // Store OTP with expiry (5 minutes)
    otpStore.set(phoneNumber, {
      otp,
      timestamp: Date.now(),
    });

    // In development mode, just log the OTP
    if (process.env.NODE_ENV === 'development' || !process.env.TWILIO_ACCOUNT_SID) {
      console.log(`[DEV MODE] WhatsApp OTP for ${formattedPhone}: ${otp}`);

      // Show OTP in alert for testing
      alert(`[DEV MODE] Your WhatsApp OTP is: ${otp}\n\nThis will be sent via WhatsApp in production.`);

      return {
        success: true,
        message: 'OTP sent successfully (dev mode)',
      };
    }

    // Production mode - Send via Twilio WhatsApp API
    // API endpoint will be /api/send-whatsapp-otp when deployed to Vercel
    const apiUrl = process.env.VITE_API_URL || '/api/send-whatsapp-otp';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formattedPhone,
        otp,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'OTP sent to your WhatsApp',
        sid: data.sid,
      };
    } else {
      throw new Error(data.message || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('Error sending WhatsApp OTP:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send OTP',
    };
  }
}

// Verify OTP
export function verifyWhatsAppOTP(phoneNumber: string, otp: string): boolean {
  const stored = otpStore.get(phoneNumber);

  if (!stored) {
    return false;
  }

  // Check if OTP expired (5 minutes)
  const fiveMinutes = 5 * 60 * 1000;
  if (Date.now() - stored.timestamp > fiveMinutes) {
    otpStore.delete(phoneNumber);
    return false;
  }

  // Verify OTP
  if (stored.otp === otp) {
    otpStore.delete(phoneNumber);
    return true;
  }

  return false;
}

// Clear expired OTPs (call this periodically)
export function clearExpiredOTPs() {
  const fiveMinutes = 5 * 60 * 1000;
  const now = Date.now();

  otpStore.forEach((value, key) => {
    if (now - value.timestamp > fiveMinutes) {
      otpStore.delete(key);
    }
  });
}

// Twilio WhatsApp message template
export const getWhatsAppOTPMessage = (otp: string): string => {
  return `🏠 VisvasaHome Verification

Your OTP for VisvasaHome login is: *${otp}*

This OTP is valid for 5 minutes.

Do not share this OTP with anyone.

Need help? WhatsApp us at +91 905 7567 160

— Team VisvasaHome`;
};
