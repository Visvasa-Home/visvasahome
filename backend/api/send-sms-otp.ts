// Twilio SMS OTP API - Serverless Function
// Deploy to Vercel with environment variables:
// TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { to, otp } = req.body;

    // Validate input
    if (!to || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    // Validate phone number format (E.164)
    if (!to.startsWith('+')) {
      return res.status(400).json({ message: 'Phone number must be in E.164 format (+91XXXXXXXXXX)' });
    }

    // Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      return res.status(500).json({ message: 'Twilio credentials not configured' });
    }

    // Import Twilio SDK dynamically (to reduce cold start time)
    const twilio = (await import('twilio')).default;
    const client = twilio(accountSid, authToken);

    // SMS message template
    const message = `🏠 VisvasaHome Verification

Your OTP: ${otp}

Valid for 5 minutes.

— Team VisvasaHome`;

    // Send SMS via Twilio
    const twilioMessage = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });

    console.log(`SMS OTP sent successfully to ${to}. SID: ${twilioMessage.sid}`);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      sid: twilioMessage.sid,
    });
  } catch (error) {
    console.error('Error sending SMS OTP:', error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send SMS OTP',
    });
  }
}
