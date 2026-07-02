/**
 * Vercel Serverless Function for WhatsApp OTP
 *
 * Deploy Instructions:
 * 1. Install Vercel CLI: npm install -g vercel
 * 2. Run: vercel
 * 3. Add environment variables in Vercel dashboard:
 *    - TWILIO_ACCOUNT_SID
 *    - TWILIO_AUTH_TOKEN
 *    - TWILIO_WHATSAPP_NUMBER
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  const { to, otp } = req.body;

  // Validate input
  if (!to || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Phone number and OTP are required',
    });
  }

  try {
    // Dynamic import of Twilio (only loads when function is called)
    const twilio = (await import('twilio')).default;

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

    // WhatsApp message template
    const message = `🏠 *VisvasaHome Verification*

Your OTP for VisvasaHome login is: *${otp}*

This OTP is valid for 5 minutes.

⚠️ Do not share this OTP with anyone.

Need help? WhatsApp us at +91 905 7567 160

— Team VisvasaHome`;

    // Send WhatsApp message via Twilio
    const twilioMessage = await client.messages.create({
      from: whatsappNumber,
      to: `whatsapp:${to}`,
      body: message,
    });

    console.log('WhatsApp OTP sent:', {
      to,
      sid: twilioMessage.sid,
      status: twilioMessage.status,
    });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully to WhatsApp',
      sid: twilioMessage.sid,
    });
  } catch (error: any) {
    console.error('Error sending WhatsApp OTP:', error);

    // Handle specific Twilio errors
    if (error.code === 21211) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format',
      });
    }

    if (error.code === 21408) {
      return res.status(400).json({
        success: false,
        message: 'User has not joined WhatsApp sandbox. Please send "join <code>" to the sandbox number first.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP via WhatsApp',
      error: error.message,
    });
  }
}
