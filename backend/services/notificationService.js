import Notification from '../models/Notification.js';
import nodemailer from 'nodemailer';
import dns from 'dns';

// CRITICAL FIX: Force Node.js to prefer IPv4 for DNS resolution.
// This bypasses the Render IPv6 ENETUNREACH block for external SMTP servers.
dns.setDefaultResultOrder('ipv4first');

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
      port: 465,
      secure: true, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log('✅ Email service configured (IPv4 forced / Port 465)');
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
  const notification = await createNotification({ recipient, ticket, message });

  if (recipient.email && transporter) {
    await sendEmail({
      to: recipient.email,
      subject: emailSubject || 'Ticket Update',
      text: message
    });
  }

  return notification;
};
