import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, rating, category, message, url, timestamp } = req.body;

    // Validate required fields
    if (!rating || !category || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'support@visvasahome.com',
        pass: process.env.EMAIL_PASS || 'your-email-password',
      },
    });

    const categoryEmojis = {
      general: '💬',
      feature: '✨',
      improvement: '🚀',
      complaint: '⚠️',
      appreciation: '💙',
    };

    const ratingStars = '⭐'.repeat(rating);

    // Email content
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #374151; margin-bottom: 5px; }
          .value { background: white; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb; }
          .rating { font-size: 24px; }
          .footer { text-align: center; color: #6b7280; margin-top: 30px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">${categoryEmojis[category as keyof typeof categoryEmojis]} Customer Feedback Received</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">VisvasaHome Platform</p>
          </div>

          <div class="content">
            <div class="field">
              <div class="label">⭐ Rating</div>
              <div class="value">
                <span class="rating">${ratingStars}</span> (${rating}/5)
              </div>
            </div>

            <div class="field">
              <div class="label">📂 Category</div>
              <div class="value">${categoryEmojis[category as keyof typeof categoryEmojis]} ${category.charAt(0).toUpperCase() + category.slice(1)}</div>
            </div>

            <div class="field">
              <div class="label">💬 Feedback Message</div>
              <div class="value" style="white-space: pre-wrap;">${message}</div>
            </div>

            <div class="field">
              <div class="label">👤 Customer Information</div>
              <div class="value">
                <strong>Name:</strong> ${name || 'Anonymous'}<br>
                <strong>Email:</strong> ${email || 'Not provided'}
              </div>
            </div>

            <div class="field">
              <div class="label">🔗 Page URL</div>
              <div class="value"><a href="${url}" style="color: #2563eb;">${url}</a></div>
            </div>

            <div class="field">
              <div class="label">⏰ Submitted At</div>
              <div class="value">${new Date(timestamp).toLocaleString()}</div>
            </div>

            <div class="footer">
              <p>This feedback was submitted from VisvasaHome platform.</p>
              <p><a href="https://www.visvasahome.com" style="color: #2563eb;">www.visvasahome.com</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to support team
    await transporter.sendMail({
      from: '"VisvasaHome Feedback" <support@visvasahome.com>',
      to: 'support@visvasahome.com',
      subject: `${categoryEmojis[category as keyof typeof categoryEmojis]} [${rating}⭐] Feedback: ${category}`,
      html: emailHTML,
    });

    // Send thank you email if email provided
    if (email) {
      await transporter.sendMail({
        from: '"VisvasaHome Support" <support@visvasahome.com>',
        to: email,
        subject: 'Thank You for Your Feedback - VisvasaHome',
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Thank You for Your Feedback!</h2>
              <p>Hi ${name || 'there'},</p>
              <p>We've received your ${category} feedback and truly appreciate you taking the time to share your thoughts with us.</p>
              <p style="background: #f3f4f6; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb;">
                <strong>Your rating:</strong> ${ratingStars} (${rating}/5)<br>
                <strong>Your message:</strong> "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"
              </p>
              ${rating <= 3 ? `
                <p style="background: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
                  <strong>We're sorry to hear you had a less than perfect experience.</strong><br>
                  Our team will review your feedback carefully and work to address your concerns. If you'd like to discuss this further, please reply to this email.
                </p>
              ` : rating >= 4 ? `
                <p style="background: #d1fae5; padding: 15px; border-radius: 5px; border-left: 4px solid #10b981;">
                  <strong>We're thrilled you had a great experience!</strong><br>
                  Your positive feedback motivates our team to keep delivering excellent service.
                </p>
              ` : ''}
              <p>Your feedback helps us:</p>
              <ul>
                <li>Improve our services and platform</li>
                <li>Provide better customer experiences</li>
                <li>Prioritize new features and improvements</li>
              </ul>
              <p>If you have any questions or need support, feel free to reach out to us at support@visvasahome.com</p>
              <p>Best regards,<br><strong>VisvasaHome Support Team</strong></p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="text-align: center; color: #6b7280; font-size: 12px;">
                <a href="https://www.visvasahome.com" style="color: #2563eb;">www.visvasahome.com</a><br>
                Complete Home Solutions Ecosystem
              </p>
            </div>
          </body>
          </html>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({
      message: 'Failed to submit feedback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
