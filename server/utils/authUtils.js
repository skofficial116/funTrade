import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Email configuration with better error handling and timeouts
console.log('Initializing email service...');
const emailService = process.env.EMAIL_SERVICE || 'gmail';
const emailUser = process.env.EMAIL_USER;

// Only log password status, not the actual password
console.log('Email Service:', emailService);
console.log('Email User:', emailUser ? 'Configured' : 'NOT CONFIGURED');
console.log('Email Password:', process.env.EMAIL_PASSWORD ? '******' : 'NOT CONFIGURED');

// Create a test email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: emailUser,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  },
  // Connection timeout (in ms)
  connectionTimeout: 10000, // 10 seconds
  // Socket timeout (in ms)
  socketTimeout: 30000, // 30 seconds
  // Logging
  logger: process.env.NODE_ENV !== 'production',
  // Disable STARTTLS if needed
  ignoreTLS: process.env.EMAIL_IGNORE_TLS === 'true',
  // Disable SSL if needed
  disableFileAccess: true,
  disableUrlAccess: true
};

export const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration with timeout
const verifyEmailConnection = async () => {
  if (!emailUser || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️ Email service not fully configured. Emails will not be sent.');
    console.warn('Please set EMAIL_USER and EMAIL_PASSWORD environment variables.');
    if (emailService === 'gmail') {
      console.warn('For Gmail, you need to:');
      console.warn('1. Enable 2-factor authentication');
      console.warn('2. Generate an App Password: https://myaccount.google.com/apppasswords');
      console.warn('3. Use the App Password instead of your regular password');
    }
    return false;
  }

  try {
    await new Promise((resolve, reject) => {
      // Set a timeout for the verification
      const timeout = setTimeout(() => {
        reject(new Error('Email verification timed out after 10 seconds'));
      }, 10000);

      transporter.verify((error, success) => {
        clearTimeout(timeout);
        if (error) {
          console.error('❌ Email service connection failed:', error.message);
          console.error('Please check your email configuration and internet connection.');
          reject(error);
        } else {
          console.log('✅ Email service is ready to send messages');
          console.log(`Service: ${emailService}`);
          console.log(`From: ${emailUser}`);
          resolve(success);
        }
      });
    });
    return true;
  } catch (error) {
    console.error('❌ Email service verification failed:', error.message);
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
    from: `"${process.env.APP_NAME || 'Your App'}" <${process.env.EMAIL_USER || 'noreply@example.com'}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
        <div style="background: #f4f4f4; padding: 10px; font-size: 24px; letter-spacing: 5px; text-align: center; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  };

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email service not configured');
    }
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
    // In production, you might want to log this to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Log to your error tracking service here
      console.error('Email sending error details:', {
        to: email,
        error: error.message,
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
    from: `"${process.env.APP_NAME || 'Your App'}" <${process.env.EMAIL_USER || 'noreply@example.com'}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <div style="margin: 20px 0;">
          <a href="${resetUrl}" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      </div>
    `,
  };

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email service not configured');
    }
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
    // In production, you might want to log this to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Log to your error tracking service here
      console.error('Password reset email error details:', {
        to: email,
        error: error.message,
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
