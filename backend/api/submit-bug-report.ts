import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      title,
      description,
      email,
      priority,
      category,
      url,
      userAgent,
      screenshot,
      timestamp,
      viewport,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !priority) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create email transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'support@visvasahome.com',
        pass: process.env.EMAIL_PASS || 'your-email-password',
      },
    });

    const priorityEmoji = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢';
    const categoryEmoji = {
      bug: '🐛',
      ui: '🎨',
      performance: '⚡',
      security: '🔒',
      other: '📝',
    }[category] || '📝';

    // Email content
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #374151; margin-bottom: 5px; }
          .value { background: white; padding: 10px; border-radius: 5px; border: 1px solid #e5e7eb; }
          .badge { display: inline-block; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; }
          .high { background: #fee2e2; color: #991b1b; }
          .medium { background: #fef3c7; color: #92400e; }
          .low { background: #dbeafe; color: #1e40af; }
          .screenshot { max-width: 100%; border-radius: 5px; margin-top: 10px; }
          .footer { text-align: center; color: #6b7280; margin-top: 30px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🐛 Bug Report Received</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">VisvasaHome Platform</p>
          </div>

          <div class="content">
            <div class="field">
              <div class="label">${categoryEmoji} Category & ${priorityEmoji} Priority</div>
              <div class="value">
                <span class="badge ${priority}">${category.toUpperCase()} - ${priority.toUpperCase()}</span>
              </div>
            </div>

            <div class="field">
              <div class="label">📝 Bug Title</div>
              <div class="value">${title}</div>
            </div>

            <div class="field">
              <div class="label">📄 Description</div>
              <div class="value" style="white-space: pre-wrap;">${description}</div>
            </div>

            <div class="field">
              <div class="label">👤 Reporter Email</div>
              <div class="value">${email || 'Anonymous'}</div>
            </div>

            <div class="field">
              <div class="label">🔗 Page URL</div>
              <div class="value"><a href="${url}" style="color: #2563eb;">${url}</a></div>
            </div>

            <div class="field">
              <div class="label">⏰ Timestamp</div>
              <div class="value">${new Date(timestamp).toLocaleString()}</div>
            </div>

            <div class="field">
              <div class="label">🖥️ System Information</div>
              <div class="value">
                <strong>Browser:</strong> ${userAgent}<br>
                <strong>Viewport:</strong> ${viewport?.width}x${viewport?.height}
              </div>
            </div>

            ${screenshot ? `
            <div class="field">
              <div class="label">📸 Screenshot</div>
              <div class="value">
                <img src="${screenshot}" alt="Bug Screenshot" class="screenshot" />
              </div>
            </div>
            ` : ''}

            <div class="footer">
              <p>This bug report was automatically submitted from VisvasaHome platform.</p>
              <p><a href="https://www.visvasahome.com" style="color: #2563eb;">www.visvasahome.com</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to support team
    await transporter.sendMail({
      from: '"VisvasaHome Bug Reports" <support@visvasahome.com>',
      to: 'support@visvasahome.com',
      subject: `${priorityEmoji} [${priority.toUpperCase()}] ${categoryEmoji} Bug Report: ${title}`,
      html: emailHTML,
    });

    // Send confirmation email to user if email provided
    if (email) {
      await transporter.sendMail({
        from: '"VisvasaHome Support" <support@visvasahome.com>',
        to: email,
        subject: 'Bug Report Received - VisvasaHome',
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #dc2626;">Thank You for Your Bug Report!</h2>
              <p>Hi there,</p>
              <p>We've received your bug report titled: <strong>"${title}"</strong></p>
              <p>Our development team will investigate this issue and work on a fix. We appreciate your help in making VisvasaHome better!</p>
              <p style="background: #f3f4f6; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626;">
                <strong>What happens next?</strong><br>
                • Our team will review the issue<br>
                • We'll prioritize based on severity<br>
                • You'll be notified once it's resolved
              </p>
              <p>If you have any questions, reply to this email or contact us at support@visvasahome.com</p>
              <p>Best regards,<br><strong>VisvasaHome Support Team</strong></p>
            </div>
          </body>
          </html>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Bug report submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting bug report:', error);
    return res.status(500).json({
      message: 'Failed to submit bug report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
