/**
 * Backend API Example for WhatsApp OTP using Twilio
 *
 * This file shows how to set up a backend API endpoint to send WhatsApp OTP
 *
 * Setup Steps:
 * 1. Install Twilio SDK: npm install twilio
 * 2. Create Twilio account and get credentials from https://console.twilio.com
 * 3. Enable WhatsApp Sandbox or approved WhatsApp number
 * 4. Set environment variables:
 *    - TWILIO_ACCOUNT_SID=your_account_sid
 *    - TWILIO_AUTH_TOKEN=your_auth_token
 *    - TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886 (sandbox) or your approved number
 *
 * Deploy this as a serverless function or API route in your backend
 */

// Example using Node.js/Express
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

const client = twilio(accountSid, authToken);

interface SendOTPRequest {
  to: string; // Phone number in E.164 format (e.g., +919876543210)
  otp: string;
}

/**
 * API Endpoint: POST /api/send-whatsapp-otp
 */
export async function sendWhatsAppOTPHandler(req: any, res: any) {
  try {
    const { to, otp }: SendOTPRequest = req.body;

    if (!to || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required',
      });
    }

    // WhatsApp message template
    const message = `🏠 VisvasaHome Verification

Your OTP for VisvasaHome login is: *${otp}*

This OTP is valid for 5 minutes.

Do not share this OTP with anyone.

Need help? WhatsApp us at +91 905 7567 160

— Team VisvasaHome`;

    // Send WhatsApp message via Twilio
    const twilioMessage = await client.messages.create({
      from: twilioWhatsAppNumber,
      to: `whatsapp:${to}`,
      body: message,
    });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      sid: twilioMessage.sid,
    });
  } catch (error) {
    console.error('Error sending WhatsApp OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Alternative: Using Firebase Cloud Functions
 */
/*
import * as functions from 'firebase-functions';
import twilio from 'twilio';

export const sendWhatsAppOTP = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  // Same handler logic as above
  await sendWhatsAppOTPHandler(req, res);
});
*/

/**
 * Alternative: Using Vercel Serverless Functions
 */
/*
// File: api/send-whatsapp-otp.ts
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await sendWhatsAppOTPHandler(req, res);
}
*/

/**
 * Alternative WhatsApp API Providers:
 *
 * 1. Twilio (Recommended)
 *    - Pricing: $0.005 per message
 *    - Easy integration
 *    - Reliable delivery
 *
 * 2. MSG91
 *    - India-focused
 *    - Competitive pricing
 *    - Good for Indian numbers
 *
 * 3. Gupshup
 *    - Popular in India
 *    - WhatsApp Business API
 *
 * 4. Kaleyra (formerly Ubiquity)
 *    - Enterprise solution
 *    - Good for large volumes
 */

// Export handler
export default sendWhatsAppOTPHandler;
