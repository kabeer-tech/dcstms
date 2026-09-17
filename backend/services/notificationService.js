import Notification from '../models/Notification.js';
import nodemailer from 'nodemailer';

// In-app notification
export const createNotification = async ({ recipient, ticket, message }) => {
  try {
    return await Notification.create({ recipient, ticket, message });
  } catch (error) {
    console.error('Notification error:', error);
  }
};

// Email notification
let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 465, // Force 465 (Secure) to bypass Render IPv6 timeouts on 587
      secure: true, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false // Prevents certificate chain issues on cloud hosts
      }
    });
    console.log('✅ Email service configured (Port 465 Secure)');
  } catch (error) {
    console.error('Email configuration error:', error.message);
  }
} else {
  console.log('⚠️ Email service disabled - no credentials provided');
}

export const sendEmail = async ({ to, subject, text }) => {
  if (!transporter) {
    console.log('⚠️ Email skipped - no transporter');
    return null;
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@complaintsystem.com',
      to,
      subject,
      text
    });
    console.log(`📧 Email sent to ${to}`);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    return null;
  }
};

// Combined notification: in-app + email
export const notifyUser = async ({ recipient, ticket, message, emailSubject }) => {
  // In-app notification (always)
  const notification = await createNotification({ recipient, ticket, message });

  // Email notification (if configured)
  if (recipient.email && transporter) {
    await sendEmail({
      to: recipient.email,
      subject: emailSubject || 'Ticket Update',
      text: message
    });
  }

  return notification;
};
