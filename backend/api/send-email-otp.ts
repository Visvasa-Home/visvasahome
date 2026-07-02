// Email OTP API - Serverless Function
// Deploy to Vercel with environment variables:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL

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
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Email service credentials from environment variables
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.SMTP_FROM_EMAIL || smtpUser;

    if (!smtpUser || !smtpPass) {
      return res.status(500).json({ message: 'Email credentials not configured' });
    }

    // Import nodemailer dynamically
    const nodemailer = (await import('nodemailer')).default;

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Email HTML template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VisvasaHome - OTP Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🏠 VisvasaHome</h1>
              <p style="color: #e0e7ff; margin: 5px 0 0 0; font-size: 14px;">Verification Code</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">Your Verification Code</h2>
              <p style="color: #4b5563; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">
                Use the following code to verify your account:
              </p>

              <!-- OTP Box -->
              <div style="background-color: #f3f4f6; border: 2px dashed #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 30px 0;">
                <div style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>

              <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 14px; line-height: 1.5;">
                This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.
              </p>

              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 0 0 20px 0; border-radius: 4px;">
                <p style="color: #92400e; margin: 0; font-size: 13px;">
                  <strong>Security Notice:</strong> VisvasaHome will never ask you to share your OTP via call, SMS, or email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 13px;">
                Need help? Contact us at <a href="mailto:contact@visvasahome.com" style="color: #2563eb; text-decoration: none;">contact@visvasahome.com</a>
              </p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                © 2025 VisvasaHome (Visvasa Pvt. Ltd.) • Jaipur, India
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"VisvasaHome" <${fromEmail}>`,
      to: to,
      subject: `${otp} is your VisvasaHome verification code`,
      html: htmlContent,
      text: `Your VisvasaHome verification code is: ${otp}\n\nThis code is valid for 5 minutes.\n\n— Team VisvasaHome`,
    });

    console.log(`Email OTP sent successfully to ${to}. Message ID: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Error sending Email OTP:', error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email OTP',
    });
  }
}
