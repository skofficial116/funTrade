import crypto from 'crypto';
import nodemailer from 'nodemailer';

import sgMail from '@sendgrid/mail';

// Initialize SendGrid
console.log('Initializing SendGrid email service...');
const sendgridApiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@funtrade.com';
const appName = process.env.APP_NAME || 'FunTrade';

// Configure SendGrid
if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
  console.log('✅ SendGrid initialized');
} else {
  console.warn('⚠️ SENDGRID_API_KEY not set. Emails will not be sent.');
}

// Wrapper for SendGrid to maintain compatibility with existing code
export const transporter = {
  async sendMail(mailOptions) {
    if (!sendgridApiKey) {
      throw new Error('SendGrid API key not configured');
    }

    const msg = {
      to: mailOptions.to,
      from: mailOptions.from || `"${appName}" <${fromEmail}>`,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text || mailOptions.subject, // Fallback text content
    };

    try {
      const response = await sgMail.send(msg);
      console.log(`Email sent to ${mailOptions.to}`, response[0].statusCode);
      return {
        messageId: response[0].headers['x-message-id'],
        response: response[0].statusCode
      };
    } catch (error) {
      console.error('SendGrid error:', error.response?.body || error.message);
      throw error;
    }
  }
};

// Verify SendGrid connection
const verifyEmailConnection = async () => {
  if (!sendgridApiKey) {
    console.warn('⚠️ SendGrid API key not configured. Emails will not be sent.');
    console.warn('Please set SENDGRID_API_KEY environment variable.');
    return false;
  }

  try {
    // Test the connection by sending a test email to the from address
    await sgMail.send({
      to: fromEmail,
      from: fromEmail,
      subject: `${appName} - Email Service Test`,
      text: 'This is a test email to verify SendGrid configuration.',
      html: '<p>This is a test email to verify SendGrid configuration.</p>'
    });
    
    console.log('✅ SendGrid is ready to send messages');
    console.log(`From: ${fromEmail}`);
    return true;
  } catch (error) {
    console.error('❌ SendGrid connection test failed:', error.response?.body?.errors || error.message);
    console.warn('Emails may not be sent. The application will continue to run without email functionality.');
    return false;
  }
};

// Verify connection in non-blocking way
verifyEmailConnection().catch(() => {});

// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email with OTP
export const sendVerificationEmail = async (email, otp) => {
  console.log(`\n📧 Preparing to send verification email to: ${email}`);
  
  if (!email || !otp) {
    console.error('❌ Cannot send verification email: Missing email or OTP');
    throw new Error('Missing required parameters for sending verification email');
  }

  const mailOptions = {
    to: email,
    from: `"${appName}" <${fromEmail}>`,
    subject: 'Verify Your Email Address',
    text: `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
        <div style="background: #f4f4f4; padding: 15px; font-size: 24px; letter-spacing: 5px; text-align: center; margin: 20px 0; border-radius: 5px; font-weight: bold;">
          ${otp}
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    if (!sendgridApiKey) {
      throw new Error('Email service not configured');
    }
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
    // In production, you might want to log this to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.error('Email sending error details:', {
        to: email,
        error: error.response?.body || error.message,
        stack: error.stack
      });
    }
    throw new Error('Failed to send verification email. Please try again later.');
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token) => {
  console.log(`\n📧 Preparing to send password reset email to: ${email}`);
  
  if (!email || !token) {
    console.error('❌ Cannot send password reset email: Missing email or token');
    throw new Error('Missing required parameters for sending password reset email');
  }

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  console.log(`Reset URL: ${resetUrl}`);
  
  const mailOptions = {
    to: email,
    from: `"${appName}" <${fromEmail}>`,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Please use the following link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <div style="margin: 25px 0; text-align: center;">
          <a href="${resetUrl}" 
             style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; 
                    border-radius: 4px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    if (!sendgridApiKey) {
      throw new Error('Email service not configured');
    }
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
    // In production, you might want to log this to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.error('Password reset email error details:', {
        to: email,
        error: error.response?.body || error.message,
        stack: error.stack
      });
    }
    throw new Error('Failed to send password reset email. Please try again later.');
  }
};

// Generate a random token for password reset
export const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
